import { ActionModal } from './components/ActionModal';
import { BattleLogManager } from './components/BattleLogManager';
import { CharacterSetupModal } from './components/CharacterSetupModal';
import { useRef, useState } from 'react';
import { STORAGE_KEY, createInitialData } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { ActionLog, AppData, Character } from './types';
import { cleanupLogsForCharacters } from './utils/dataCleanup';
import { createTimestamp } from './utils/filename';
import { saveElementAsImage } from './utils/imageExport';
import { downloadJson, importJson } from './utils/jsonData';
import { sortLogsByTimeDesc } from './utils/sort';
import { formatBattleLogText } from './utils/textExport';

type ModalState =
  | { type: 'characters' }
  | { type: 'action'; log?: ActionLog }
  | null;

/**
 * アプリ全体の状態管理を担当するルートコンポーネント。
 * 表示はBattleLogManagerへ渡し、保存・取込・確認ダイアログなどの副作用をここに集約する。
 */
export default function App() {
  const [data, setData] = useLocalStorage<AppData>(STORAGE_KEY, createInitialData());
  const [modal, setModal] = useState<ModalState>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  /**
   * 行動ログは新規追加と既存編集を同じ経路で保存し、
   * 保存時にタイム降順へ整える。
   */
  const saveActionLog = (log: ActionLog) => {
    setData((current) => {
      const otherLogs = current.logs.filter((item) => item.id !== log.id);
      return {
        ...current,
        logs: sortLogsByTimeDesc([...otherLogs, log]),
      };
    });
    setModal(null);
  };

  const deleteActionLog = (log: ActionLog) => {
    if (!window.confirm(`${log.time}秒の行動ログを削除しますか？`)) return;
    deleteActionLogWithoutConfirm(log);
  };

  // 編集で全行動を未入力にした場合は、確認なしでこの経路を使う。
  const deleteActionLogWithoutConfirm = (log: ActionLog) => {
    setData((current) => ({
      ...current,
      logs: current.logs.filter((item) => item.id !== log.id),
    }));
    setModal(null);
  };

  // localStorageと画面上の状態をまとめて初期化する。
  const clearData = () => {
    if (!window.confirm('すべてのデータを削除しますか？')) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setData(createInitialData());
  };

  const handleExportJson = () => {
    if (!window.confirm('JSONを保存しますか？')) return;
    const defaultName = `battle-log-${createTimestamp()}`;
    const fileName = window.prompt('保存するJSONファイル名を入力してください。', defaultName);
    if (fileName === null) return;
    downloadJson(data, fileName);
  };

  const openJsonImport = () => {
    // ファイル選択を開く前に確認し、キャンセル時はローカルデータに触れない。
    if (!window.confirm('JSONを取り込みますか？現在のデータは読み込んだJSONで置き換わります。')) return;
    jsonInputRef.current?.click();
  };

  // JSON取込ではlocalStorageと同じ形のデータを丸ごと復元する。
  const handleImportJson = async (file: File) => {
    const text = await file.text();
    try {
      setData(importJson(text));
    } catch {
      window.alert('JSONファイルを読み込めませんでした。');
    }
  };

  const saveCharacters = (characters: Character[]) => {
    // 編成変更でログが消える可能性がある時だけ、変更前にユーザーへ確認する。
    setData((current) => {
      const { logs, removedActionCount } = cleanupLogsForCharacters(current.logs, characters);
      if (
        removedActionCount > 0 &&
        !window.confirm(`編成から外れたキャラの行動ログが${removedActionCount}件あります。削除して変更しますか？`)
      ) {
        return current;
      }

      return {
        ...current,
        characters,
        logs,
      };
    });
    setModal(null);
  };

  // 画像保存時はCSSで操作ボタンを一時的に隠し、表示内容だけを書き出す。
  const handleSaveImage = async () => {
    if (!window.confirm('画像を保存しますか？')) return;
    if (!appRef.current) return;
    await saveElementAsImage(appRef.current);
  };

  const handleCopyText = async () => {
    // 共有用テキストはファイルを作らず、コードブロックのままクリップボードへ送る。
    try {
      await navigator.clipboard.writeText(formatBattleLogText(data));
      window.alert('テキストをコピーしました。');
    } catch {
      window.alert('クリップボードへコピーできませんでした。');
    }
  };

  return (
    <>
      <BattleLogManager
        data={data}
        appRef={appRef}
        onEditCharacters={() => setModal({ type: 'characters' })}
        onAddAction={() => setModal({ type: 'action' })}
        onEditLog={(target) => setModal({ type: 'action', log: target })}
        onDeleteLog={deleteActionLog}
        onClear={clearData}
        onExportJson={handleExportJson}
        onImportJson={openJsonImport}
        onSaveImage={handleSaveImage}
        onCopyText={handleCopyText}
      />

      <input
        ref={jsonInputRef}
        className="visually-hidden-file"
        accept=".json,application/json"
        type="file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleImportJson(file);
          event.currentTarget.value = '';
        }}
      />

      {modal?.type === 'characters' && (
        <CharacterSetupModal
          characters={data.characters}
          onClose={() => setModal(null)}
          onSave={saveCharacters}
        />
      )}

      {modal?.type === 'action' && (
        <ActionModal
          characters={data.characters}
          log={modal.log}
          onClose={() => setModal(null)}
          onSave={saveActionLog}
          onDelete={deleteActionLogWithoutConfirm}
        />
      )}
    </>
  );
}

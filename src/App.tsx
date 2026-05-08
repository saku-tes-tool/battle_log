import { ActionModal } from './components/ActionModal';
import { BattleLogManager } from './components/BattleLogManager';
import { CharacterSetupModal } from './components/CharacterSetupModal';
import { LogListView } from './components/LogListView';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { LEGACY_STORAGE_KEY, STORAGE_KEY, createInitialBook } from './constants';
import type { ActionLog, AppData, BattleLogBook, BattleLogEntry, Character } from './types';
import { cleanupLogsForCharacters } from './utils/dataCleanup';
import {
  createActionLogExportFileBaseName,
  createActionLogImageFileName,
  createAllActionLogsExportFileBaseName,
} from './utils/filename';
import { createId } from './utils/id';
import { saveElementAsImage } from './utils/imageExport';
import { downloadJson, importJson, toEntryJson } from './utils/jsonData';
import { createDraftLogData, createEntryFromData, isBattleLogBook, isBattleLogBookJson, isBattleLogEntryJson, migrateLegacyData, touchEntry } from './utils/logBook';
import { sortLogsByTimeDesc } from './utils/sort';
import { formatBattleLogText } from './utils/textExport';

type ModalState =
  | { type: 'characters' }
  | { type: 'action'; log?: ActionLog }
  | null;

type ViewState =
  | { type: 'list' }
  | { type: 'detail'; logId: string }
  | { type: 'draft' };

const readInitialBook = (): BattleLogBook => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (isBattleLogBook(parsed)) return parsed;
    }

    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      return migrateLegacyData(JSON.parse(legacy) as AppData);
    }
  } catch {
    return createInitialBook();
  }

  return createInitialBook();
};

/**
 * アプリ全体の状態管理を担当するルートコンポーネント。
 * 複数ログの一覧と、選択中ログの編集をlocalStorageに同期する。
 */
export default function App() {
  const [book, setBook] = useState<BattleLogBook>(readInitialBook);
  const [view, setView] = useState<ViewState>({ type: 'list' });
  const [draftData, setDraftData] = useState<AppData>(createDraftLogData);
  const [modal, setModal] = useState<ModalState>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const importModeRef = useRef<'list' | 'detail'>('list');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(book));
  }, [book]);

  const activeEntry =
    view.type === 'detail' ? book.logs.find((entry) => entry.id === view.logId) ?? null : null;
  const currentData = view.type === 'draft' ? draftData : activeEntry;

  /**
   * 指定したログだけを更新し、更新日時と最後に触ったログIDも同時に更新する。
   */
  const updateEntry = (logId: string, updater: (entry: BattleLogEntry) => BattleLogEntry) => {
    setBook((current) => ({
      ...current,
      activeLogId: logId,
      logs: current.logs.map((entry) => (entry.id === logId ? touchEntry(updater(entry)) : entry)),
    }));
  };

  const updateCurrentData = (updater: (data: AppData) => AppData) => {
    if (view.type === 'draft') {
      setDraftData((current) => updater(current));
      return;
    }

    if (view.type === 'detail') {
      updateEntry(view.logId, (entry) => ({
        ...entry,
        ...updater(entry),
      }));
    }
  };

  /**
   * 新規作成中のデータを、編成が登録されたタイミングで正式なログへ昇格する。
   * タイトルだけでは一覧に保存しないようにして、空ログの増殖を防ぐ。
   */
  const createDraftEntryIfReady = (data: AppData) => {
    const hasCharacters = data.characters.some((character) => character.name.trim());
    if (!hasCharacters) {
      setDraftData(data);
      return;
    }

    const entry = createEntryFromData(data);
    setBook((current) => ({
      ...current,
      activeLogId: entry.id,
      logs: [...current.logs, entry],
    }));
    setView({ type: 'detail', logId: entry.id });
    setDraftData(createDraftLogData());
  };

  const saveActionLog = (log: ActionLog) => {
    updateCurrentData((current) => {
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

  const deleteActionLogWithoutConfirm = (log: ActionLog) => {
    updateCurrentData((current) => ({
      ...current,
      logs: current.logs.filter((item) => item.id !== log.id),
    }));
    setModal(null);
  };

  const deleteCurrentEntry = () => {
    if (view.type === 'draft') {
      setDraftData(createDraftLogData());
      setView({ type: 'list' });
      return;
    }

    if (!activeEntry) return;
    deleteEntry(activeEntry.id);
  };

  const clearActionLogs = () => {
    if (view.type === 'draft') {
      setDraftData((current) => ({ ...current, logs: [] }));
      return;
    }

    if (!activeEntry || !window.confirm('行動ログをすべて削除しますか？')) return;
    updateEntry(activeEntry.id, (entry) => ({
      ...entry,
      logs: [],
    }));
  };

  const deleteEntry = (logId: string) => {
    const target = book.logs.find((entry) => entry.id === logId);
    if (!target || !window.confirm(`${target.title || '未タイトル'}を削除しますか？`)) return;

    setBook((current) => ({
      ...current,
      activeLogId: current.activeLogId === logId ? null : current.activeLogId,
      logs: current.logs.filter((entry) => entry.id !== logId),
    }));

    if (view.type === 'detail' && view.logId === logId) {
      setView({ type: 'list' });
    }
  };

  const clearAll = () => {
    if (!window.confirm('すべてのログを削除しますか？')) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setBook(createInitialBook());
    setDraftData(createDraftLogData());
    setView({ type: 'list' });
  };

  /**
   * 一覧管理用のログIDだけを新しくしてログを複製する。
   * 行動ログ内のIDは編集時の同一行識別に使うため、そのまま引き継ぐ。
   */
  const duplicateEntry = (logId: string) => {
    const target = book.logs.find((entry) => entry.id === logId);
    if (!target || !window.confirm(`${target.title || '未タイトル'}を複製しますか？`)) return;

    const now = new Date().toISOString();
    const duplicated: BattleLogEntry = {
      ...target,
      id: createId(),
      title: `${target.title || '未タイトル'} コピー`,
      createdAt: now,
      updatedAt: now,
    };

    setBook((current) => ({
      ...current,
      activeLogId: duplicated.id,
      logs: [...current.logs, duplicated],
    }));
  };

  const handleExportCurrentJson = () => {
    if (!activeEntry || !window.confirm('JSONを保存しますか？')) return;
    const defaultName = createActionLogExportFileBaseName(activeEntry.title);
    const fileName = window.prompt('保存するJSONファイル名を入力してください。', defaultName);
    if (fileName === null) return;
    downloadJson(toEntryJson(activeEntry), fileName);
  };

  const handleExportAllJson = () => {
    if (!window.confirm('すべてのログをJSON保存しますか？')) return;
    const defaultName = createAllActionLogsExportFileBaseName();
    const fileName = window.prompt('保存するJSONファイル名を入力してください。', defaultName);
    if (fileName === null) return;
    downloadJson(book, fileName);
  };

  const openJsonImport = (mode: 'list' | 'detail') => {
    if (!window.confirm('JSONを取り込みますか？同じIDのログは上書き確認します。')) return;
    importModeRef.current = mode;
    jsonInputRef.current?.click();
  };

  const handleImportJson = async (file: File) => {
    const text = await file.text();
    try {
      const imported = importJson(text);
      const mode = importModeRef.current;

      if (mode === 'detail') {
        if (!activeEntry) return;
        if (isBattleLogBookJson(imported)) {
          window.alert('まとめJSONは一覧画面から取り込んでください。');
          return;
        }
        if (!isBattleLogEntryJson(imported)) {
          window.alert('詳細画面では同じログの個別JSONだけ取り込めます。');
          return;
        }
        if (imported.entry.id !== activeEntry.id) {
          window.alert('このログとは別のJSONです。一覧画面から取り込んでください。');
          return;
        }
        if (!window.confirm('同じログが見つかりました。現在の内容を上書きしますか？')) return;

        setBook((current) => ({
          ...current,
          activeLogId: imported.entry.id,
          logs: current.logs.map((entry) => (entry.id === imported.entry.id ? imported.entry : entry)),
        }));
        return;
      }

      setBook((current) => {
        const importedEntries = isBattleLogBookJson(imported)
          ? imported.logs
          : isBattleLogEntryJson(imported)
            ? [imported.entry]
            : [createEntryFromData(imported)];
        let nextLogs = [...current.logs];

        for (const entry of importedEntries) {
          const existingIndex = nextLogs.findIndex((log) => log.id === entry.id);
          if (existingIndex >= 0) {
            if (window.confirm(`${entry.title || '未タイトル'}は既にあります。上書きしますか？`)) {
              nextLogs[existingIndex] = entry;
            }
          } else {
            nextLogs.push(entry);
          }
        }

        return {
          version: 2,
          activeLogId: importedEntries[0]?.id ?? current.activeLogId,
          logs: nextLogs,
        };
      });
      setView({ type: 'list' });
    } catch {
      window.alert('JSONファイルを読み込めませんでした。');
    }
  };

  const saveCharacters = (characters: Character[]) => {
    if (!currentData) return;

    const { logs, removedActionCount } = cleanupLogsForCharacters(currentData.logs, characters);
    if (
      removedActionCount > 0 &&
      !window.confirm(`編成から外れたキャラの行動ログが${removedActionCount}件あります。削除して変更しますか？`)
    ) {
      return;
    }

    const nextData = {
      ...currentData,
      characters,
      logs,
    };

    if (view.type === 'draft') {
      createDraftEntryIfReady(nextData);
    } else {
      updateCurrentData(() => nextData);
    }
    setModal(null);
  };

  const saveTitle = (title: string) => {
    updateCurrentData((current) => ({
      ...current,
      title,
    }));
  };

  const handleSaveImage = async () => {
    if (!window.confirm('画像を保存しますか？')) return;
    if (!appRef.current) return;
    await saveElementAsImage(appRef.current, createActionLogImageFileName(currentData?.title));
  };

  const handleCopyText = async () => {
    if (!currentData) return;
    try {
      await navigator.clipboard.writeText(formatBattleLogText(currentData));
      window.alert('テキストをコピーしました。');
    } catch {
      window.alert('クリップボードへコピーできませんでした。');
    }
  };

  if (view.type === 'list') {
    return (
      <>
        <LogListView
          logs={book.logs}
          onCreate={() => {
            setDraftData(createDraftLogData());
            setView({ type: 'draft' });
          }}
          onOpen={(logId) => {
            setBook((current) => ({ ...current, activeLogId: logId }));
            setView({ type: 'detail', logId });
          }}
          onDuplicate={duplicateEntry}
          onDelete={deleteEntry}
          onExportAll={handleExportAllJson}
          onImportJson={() => openJsonImport('list')}
          onClearAll={clearAll}
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
      </>
    );
  }

  if (!currentData) {
    return null;
  }

  return (
    <>
      <BattleLogManager
        data={currentData}
        appRef={appRef}
        onEditCharacters={() => setModal({ type: 'characters' })}
        onBackToList={() => setView({ type: 'list' })}
        backLabel="戻る"
        backIcon={<ArrowLeft size={16} />}
        onTitleChange={saveTitle}
        onAddAction={() => setModal({ type: 'action' })}
        onEditLog={(target) => setModal({ type: 'action', log: target })}
        onDeleteLog={deleteActionLog}
        onClear={clearActionLogs}
        onExportJson={handleExportCurrentJson}
        onImportJson={() => openJsonImport('detail')}
        onSaveImage={handleSaveImage}
        onCopyText={handleCopyText}
        onDeleteCurrent={deleteCurrentEntry}
        clearLabel="ログをクリア"
        deleteLabel="ログを削除"
        deleteDisabled={!activeEntry}
        importDisabled={view.type === 'draft'}
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
          characters={currentData.characters}
          onClose={() => setModal(null)}
          onSave={saveCharacters}
        />
      )}

      {modal?.type === 'action' && (
        <ActionModal
          characters={currentData.characters}
          log={modal.log}
          onClose={() => setModal(null)}
          onSave={saveActionLog}
          onDelete={deleteActionLogWithoutConfirm}
        />
      )}
    </>
  );
}

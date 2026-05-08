import { Edit3 } from 'lucide-react';
import type { ReactNode, RefObject } from 'react';
import type { ActionLog, AppData } from '../types';
import { getCharacterColor } from '../utils/characterColor';
import { sortLogsByTimeDesc } from '../utils/sort';
import { ActionCard } from './ActionCard';
import { FloatingActionButton } from './FloatingActionButton';
import { FooterActions } from './FooterActions';

type BattleLogManagerProps = {
  data: AppData;
  appRef?: RefObject<HTMLDivElement | null>;
  onEditCharacters: () => void;
  onBackToList: () => void;
  backLabel?: string;
  backIcon?: ReactNode;
  onTitleChange: (title: string) => void;
  onAddAction: () => void;
  onEditLog: (log: ActionLog) => void;
  onDeleteLog: (log: ActionLog) => void;
  onClear: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
  onSaveImage: () => void;
  onCopyText: () => void;
  clearLabel?: string;
  importDisabled?: boolean;
};

/**
 * アプリのメイン表示コンポーネント。
 * localStorageやモーダル制御はApp側に置き、ここでは編成・ログ・フッター操作の配置に集中する。
 */
export function BattleLogManager({
  data,
  appRef,
  onEditCharacters,
  onBackToList,
  backLabel = '一覧へ',
  backIcon,
  onTitleChange,
  onAddAction,
  onEditLog,
  onDeleteLog,
  onClear,
  onExportJson,
  onImportJson,
  onSaveImage,
  onCopyText,
  clearLabel,
  importDisabled,
}: BattleLogManagerProps) {
  const activeCharacters = data.characters.filter((character) => character.name.trim());
  const sortedLogs = sortLogsByTimeDesc(data.logs);

  return (
    <>
      <div className="page-shell">
        <main className="app" ref={appRef}>
          <header className="app-header no-export">
            <div>
              <h1>バトルログ管理</h1>
              <p className="storage-note">※入力したデータはこの端末内にのみ保存され、外部へ送信されません。</p>
            </div>
            <button className="small-icon-button no-export" type="button" onClick={onBackToList}>
              {backIcon}
              <span>{backLabel}</span>
            </button>
          </header>

          <section className="log-title-panel">
            <input
              className="log-title-input"
              value={data.title ?? ''}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="タイトルを入力"
              aria-label="タイトル"
            />
            {data.title?.trim() && <h2 className="log-title-export">{data.title.trim()}</h2>}
          </section>

          <section className="formation-panel">
            <div className="panel-title-row">
              <h2>編成</h2>
              <button className="small-icon-button no-export" type="button" onClick={onEditCharacters} aria-label="編成編集">
                <Edit3 size={16} />
                <span>編集</span>
              </button>
            </div>
            {activeCharacters.length ? (
              <div className="formation-list">
                {activeCharacters.map((character) => {
                  const note = character.note?.trim();
                  const characterColor = getCharacterColor(character.id, data.characters);
                  return (
                    <div className="formation-item" key={character.id}>
                      <div className="formation-item__main">
                        <strong>
                          <span
                            className="formation-color-chip"
                            style={{ backgroundColor: characterColor }}
                            aria-hidden="true"
                          />
                          {character.name}
                        </strong>
                        {note && <small>{note}</small>}
                      </div>
                      <span>
                        {[character.equipment1, character.equipment2]
                          .filter((equipment) => equipment && equipment !== '未選択')
                          .join(' / ') || '魔道具未選択'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="empty-text">編成編集からキャラを登録してください。</p>
            )}
          </section>

          <section className="log-section">
            <div className="section-title">
              <h2>行動ログ</h2>
              <span>{data.logs.length}件</span>
            </div>
            <div className="log-list">
              {sortedLogs.length ? (
                sortedLogs.map((log) => (
                  <ActionCard
                    key={log.id}
                    log={log}
                    characters={data.characters}
                    onEdit={onEditLog}
                    onDelete={onDeleteLog}
                  />
                ))
              ) : (
                <div className="empty-card">
                  <strong>まだ行動ログがありません</strong>
                  <p>右下のログの追加から、タイムごとの行動を記録できます。</p>
                  <button className="empty-card__button no-export" type="button" onClick={onAddAction}>
                    ログの追加
                  </button>
                </div>
              )}
            </div>
          </section>

          <FooterActions
            hasLogs={sortedLogs.length > 0}
            onClear={onClear}
            onExportJson={onExportJson}
            onImportJson={onImportJson}
            onSaveImage={onSaveImage}
            onCopyText={onCopyText}
            clearLabel={clearLabel}
            importDisabled={importDisabled}
          />
        </main>
      </div>

      {sortedLogs.length > 0 && <FloatingActionButton onClick={onAddAction} />}
    </>
  );
}

import { Copy, Download, Edit3, FileUp, HelpCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { FloatingActionButton } from './FloatingActionButton';
import { UsageGuideModal } from './UsageGuideModal';
import type { BattleLogEntry } from '../types';

type LogListViewProps = {
  logs: BattleLogEntry[];
  onCreate: () => void;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onExportAll: () => void;
  onImportJson: () => void;
  onClearAll: () => void;
};

/**
 * 一覧表示用の日付文字列へ変換する。
 * localStorage由来の不正な日付は空文字にして表示崩れを避ける。
 */
const formatUpdatedAt = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (number: number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * 複数の行動ログを選択・複製・削除する一覧画面。
 * 新規作成はフローティングボタン、まとめ操作は下部に配置する。
 */
export function LogListView({
  logs,
  onCreate,
  onOpen,
  onDuplicate,
  onDelete,
  onExportAll,
  onImportJson,
  onClearAll,
}: LogListViewProps) {
  const sortedLogs = [...logs].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const [showsUsageGuide, setShowsUsageGuide] = useState(false);

  return (
    <div className="page-shell">
      <main className="app">
        <header className="app-header">
          <div className="app-header__main">
            <div className="app-header__top">
              <h1>行動ログ管理</h1>
              <button className="small-icon-button" type="button" onClick={() => setShowsUsageGuide(true)}>
                <HelpCircle size={16} />
                <span>使い方</span>
              </button>
            </div>
            <p className="storage-note">※入力したデータはこの端末内にのみ保存され、外部へ送信されません。</p>
          </div>
        </header>

        <section className="log-index-section">
          <div className="section-title">
            <h2>ログ一覧</h2>
            <span>{logs.length}件</span>
          </div>

          {sortedLogs.length ? (
            <div className="log-index-list">
              {sortedLogs.map((log) => {
                const characterNames = log.characters
                  .filter((character) => character.name.trim())
                  .map((character) => character.name.trim());
                return (
                  <article className="log-index-card" key={log.id}>
                    <button className="log-index-card__main" type="button" onClick={() => onOpen(log.id)}>
                      <strong>{log.title || '未タイトル'}</strong>
                      <span>{characterNames.length ? characterNames.join(' / ') : '編成未登録'}</span>
                      <small>{formatUpdatedAt(log.updatedAt)}</small>
                    </button>
                    <div className="log-index-card__actions">
                      <button
                        className="card-action-button"
                        type="button"
                        onClick={() => onOpen(log.id)}
                        aria-label={`${log.title || '未タイトル'}を編集`}
                      >
                        <Edit3 size={15} />
                        <span>編集</span>
                      </button>
                      <button
                        className="card-action-button"
                        type="button"
                        onClick={() => onDuplicate(log.id)}
                        aria-label={`${log.title || '未タイトル'}を複製`}
                      >
                        <Copy size={15} />
                        <span>複製</span>
                      </button>
                      <button
                        className="card-action-button danger"
                        type="button"
                        onClick={() => onDelete(log.id)}
                        aria-label={`${log.title || '未タイトル'}を削除`}
                      >
                        <Trash2 size={15} />
                        <span>削除</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-card">
              <strong>まだログがありません</strong>
              <p>新規作成から編成を登録すると、ログ一覧に追加されます。</p>
              <button className="empty-card__button" type="button" onClick={onCreate}>
                新規作成
              </button>
            </div>
          )}
        </section>

        <footer className="footer-actions">
          <button className="icon-button" type="button" onClick={onImportJson}>
            <FileUp size={18} />
            <span>JSON読込</span>
          </button>
          <button className="icon-button" type="button" onClick={onExportAll} disabled={logs.length === 0}>
            <Download size={18} />
            <span>まとめてJSON保存</span>
          </button>
          <button className="icon-button danger" type="button" onClick={onClearAll} disabled={logs.length === 0}>
            <Trash2 size={18} />
            <span>まとめて削除</span>
          </button>
        </footer>
      </main>
      {logs.length > 0 && <FloatingActionButton label="新規作成" onClick={onCreate} />}
      {showsUsageGuide && <UsageGuideModal onClose={() => setShowsUsageGuide(false)} />}
    </div>
  );
}

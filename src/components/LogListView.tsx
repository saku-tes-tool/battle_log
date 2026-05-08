import { Download, Edit3, FileUp, Trash2 } from 'lucide-react';
import { FloatingActionButton } from './FloatingActionButton';
import type { BattleLogEntry } from '../types';

type LogListViewProps = {
  logs: BattleLogEntry[];
  onCreate: () => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onExportAll: () => void;
  onImportJson: () => void;
  onClearAll: () => void;
};

const formatUpdatedAt = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (number: number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export function LogListView({
  logs,
  onCreate,
  onOpen,
  onDelete,
  onExportAll,
  onImportJson,
  onClearAll,
}: LogListViewProps) {
  const sortedLogs = [...logs].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="page-shell">
      <main className="app">
        <header className="app-header">
          <div>
            <h1>バトルログ管理</h1>
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
    </div>
  );
}

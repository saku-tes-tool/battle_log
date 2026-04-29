import { Edit3, Trash2 } from 'lucide-react';
import { OTHER_CHARACTER_ID } from '../constants';
import type { ActionLog, Character } from '../types';

type ActionCardProps = {
  log: ActionLog;
  characters: Character[];
  onEdit: (log: ActionLog) => void;
  onDelete: (log: ActionLog) => void;
};

export function ActionCard({ log, characters, onEdit, onDelete }: ActionCardProps) {
  const characterMap = new Map(characters.map((character) => [character.id, character]));
  const visibleActions = log.actions.filter(
    (item) => item.characterId && (item.action.trim() || item.note.trim()),
  );

  if (visibleActions.length === 0) return null;

  return (
    <article className="action-card">
      <div className="action-card__time">
        <span>{log.time}</span>
      </div>
      <div className="action-card__body">
        <header className="action-card__toolbar no-export">
          <div className="card-action-buttons">
            <button className="card-action-button" type="button" onClick={() => onEdit(log)} aria-label={`${log.time}秒のログを編集`}>
              <Edit3 size={15} />
              <span>編集</span>
            </button>
            <button className="card-action-button danger" type="button" onClick={() => onDelete(log)} aria-label={`${log.time}秒のログを削除`}>
              <Trash2 size={15} />
              <span>削除</span>
            </button>
          </div>
        </header>
        <div className="action-list">
          {visibleActions.map((item) => {
            const character = characterMap.get(item.characterId);
            const characterName = item.characterId === OTHER_CHARACTER_ID ? 'その他' : character?.name || '未設定';
            return (
              <div className="action-row" key={item.id}>
                <div className="action-row__head">
                  <strong>{characterName}</strong>
                </div>
                {item.action.trim() && <p>{item.action}</p>}
                {item.note.trim() && <small>{item.note}</small>}
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

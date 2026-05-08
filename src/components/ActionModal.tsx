import { Plus, Trash2 } from 'lucide-react';
import { OTHER_CHARACTER_ID } from '../constants';
import { useState } from 'react';
import type { ActionItem, ActionLog, Character } from '../types';
import { createId } from '../utils/id';

type DraftAction = Pick<ActionItem, 'id' | 'characterId' | 'action' | 'note'>;

type ActionModalProps = {
  characters: Character[];
  log?: ActionLog;
  onClose: () => void;
  onSave: (log: ActionLog) => void;
  onDelete?: (log: ActionLog) => void;
};

const createDraftAction = (): DraftAction => ({
  id: createId(),
  characterId: '',
  action: '',
  note: '',
});

/**
 * 編集対象の行動をモーダル用の一時データへ変換する。
 * 古いJSONなどでidが重複していても、行削除が崩れないように一意化する。
 */
const createDraftActions = (items?: ActionItem[]): DraftAction[] => {
  if (!items?.length) return [createDraftAction()];

  const usedIds = new Set<string>();
  return items.map((item) => {
    const id = item.id && !usedIds.has(item.id) ? item.id : createId();
    usedIds.add(id);
    return { ...item, id };
  });
};

/**
 * 行動ログの追加・編集モーダル。
 * 1つのタイムに複数キャラの行動を登録でき、行動か備考が入力された行だけ保存する。
 */
export function ActionModal({ characters, log, onClose, onSave, onDelete }: ActionModalProps) {
  const activeCharacters = characters.filter((character) => character.name.trim());
  const [time, setTime] = useState(log?.time.toString() ?? '60');
  const [actions, setActions] = useState<DraftAction[]>(() => createDraftActions(log?.actions));

  const updateAction = (id: string, patch: Partial<DraftAction>) => {
    setActions((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  /**
   * 入力済みの行だけを保存する。
   * 編集時に有効行動が0件になった場合は、そのログを削除扱いにする。
   */
  const handleSave = () => {
    const numericTime = Number(time);
    const validActions = actions
      .map((item) => ({
        ...item,
        action: item.action.trim(),
        note: item.note.trim(),
      }))
      .filter((item) => item.characterId && (item.action || item.note));

    if (!Number.isFinite(numericTime)) return;

    if (validActions.length === 0) {
      if (log && onDelete) onDelete(log);
      return;
    }

    onSave({
      id: log?.id ?? createId(),
      time: numericTime,
      actions: validActions,
    });
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="action-modal-title">
        <button className="modal-close-button" type="button" onClick={onClose} aria-label="閉じる">
          ×
        </button>
        <header className="modal__header">
          <h2 id="action-modal-title">{log ? '行動編集' : '行動追加'}</h2>
          <p>キャラを選び、行動か備考が入力された行だけ保存されます。</p>
        </header>

        <div className="modal__scroll-body form-stack">
          <label>
            <span>タイム</span>
            <input
              inputMode="numeric"
              min="0"
              max="999"
              type="number"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </label>

          {actions.map((item, index) => {
            const hasCharacter = Boolean(item.characterId);
            return (
              <fieldset className="action-fieldset" key={item.id}>
                <legend>行動{index + 1}</legend>
                <label>
                  <span>キャラ</span>
                  <select
                    value={item.characterId}
                    onChange={(event) =>
                      updateAction(item.id, {
                        characterId: event.target.value,
                        action: event.target.value ? item.action : '',
                        note: event.target.value ? item.note : '',
                      })
                    }
                  >
                    <option value="">未選択</option>
                    {activeCharacters.map((character) => (
                      <option key={character.id} value={character.id}>
                        {character.name}
                      </option>
                    ))}
                    <option value={OTHER_CHARACTER_ID}>その他</option>
                  </select>
                </label>
                <label>
                  <span>行動</span>
                  <textarea
                    disabled={!hasCharacter}
                    value={item.action}
                    onChange={(event) => updateAction(item.id, { action: event.target.value })}
                    rows={3}
                  />
                </label>
                <label>
                  <span>備考</span>
                  <textarea
                    disabled={!hasCharacter}
                    value={item.note}
                    onChange={(event) => updateAction(item.id, { note: event.target.value })}
                  />
                </label>
                {actions.length > 1 && (
                  <button
                    className="ghost-button compact"
                    type="button"
                    onClick={() => setActions((current) => current.filter((row) => row.id !== item.id))}
                  >
                    <Trash2 size={16} />
                    <span>行削除</span>
                  </button>
                )}
              </fieldset>
            );
          })}

          <button className="ghost-button" type="button" onClick={() => setActions((current) => [...current, createDraftAction()])}>
            <Plus size={18} />
            <span>行追加</span>
          </button>
        </div>

        <div className="modal__actions">
          <button className="secondary-button" type="button" onClick={onClose}>
            キャンセル
          </button>
          <button className="primary-button" type="button" onClick={handleSave}>
            {log ? '変更' : '追加'}
          </button>
        </div>
      </section>
    </div>
  );
}

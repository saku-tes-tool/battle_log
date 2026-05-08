import { useMemo, useState } from 'react';
import { EQUIPMENT_OPTIONS } from '../constants';
import type { Character } from '../types';
import { getCharacterColor } from '../utils/characterColor';

type CharacterSetupModalProps = {
  characters: Character[];
  onClose: () => void;
  onSave: (characters: Character[]) => void;
};

/**
 * 編成のキャラ名・魔道具・備考・表示色を編集するモーダル。
 * 上の枠から順番に登録する前提にして、未入力枠以降を無効化する。
 */
export function CharacterSetupModal({ characters, onClose, onSave }: CharacterSetupModalProps) {
  const [draft, setDraft] = useState(() => characters.map((character) => ({ ...character })));

  /** キャラは上から順に有効化し、前の枠が空なら後続枠を編集不可にする。 */
  const enabledIndexes = useMemo(() => {
    const indexes = new Set<number>();
    for (let i = 0; i < draft.length; i += 1) {
      if (i === 0 || draft[i - 1].name.trim()) indexes.add(i);
    }
    return indexes;
  }, [draft]);

  const updateCharacter = (index: number, patch: Partial<Character>) => {
    setDraft((current) =>
      current.map((character, currentIndex) =>
        currentIndex === index ? { ...character, ...patch } : character,
      ),
    );
  };

  /** 無効な枠と名前未入力の魔道具は保存時に未選択へ戻す。 */
  const handleSave = () => {
    onSave(
      draft.map((character, index) => {
        const enabled = enabledIndexes.has(index);
        const note = character.note ?? '';
        return {
          ...character,
          name: enabled ? character.name.trim() : '',
          note: enabled && character.name.trim() ? note.trim() : '',
          color: enabled && character.name.trim() ? character.color || undefined : undefined,
          equipment1: enabled && character.name.trim() ? character.equipment1 : '未選択',
          equipment2: enabled && character.name.trim() ? character.equipment2 : '未選択',
        };
      }),
    );
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="character-modal-title">
        <button className="modal-close-button" type="button" onClick={onClose} aria-label="閉じる">
          ×
        </button>
        <header className="modal__header">
          <h2 id="character-modal-title">編成編集</h2>
          <p>キャラは上から順に有効になります。</p>
        </header>

        <div className="modal__scroll-body form-stack">
          {draft.map((character, index) => {
            const enabled = enabledIndexes.has(index);
            const equipmentEnabled = enabled && character.name.trim();
            const characterColor = getCharacterColor(character.id, draft, '#7da5ff');
            return (
              <fieldset className="character-fieldset" key={character.id} disabled={!enabled}>
                <legend>キャラ{index + 1}</legend>
                <div className="character-name-field">
                  <span>キャラ名</span>
                  <div className="character-name-row">
                    <input
                      value={character.name}
                      onChange={(event) => updateCharacter(index, { name: event.target.value })}
                      placeholder="キャラ名を入力"
                    />
                    <input
                      className="color-input"
                      type="color"
                      value={character.color || characterColor || '#7da5ff'}
                      disabled={!equipmentEnabled}
                      onChange={(event) => updateCharacter(index, { color: event.target.value })}
                      aria-label={`キャラ${index + 1}の色`}
                    />
                  </div>
                </div>
                <div className="split-fields">
                  <label>
                    <span>魔道具1</span>
                    <select
                      value={character.equipment1}
                      disabled={!equipmentEnabled}
                      onChange={(event) => updateCharacter(index, { equipment1: event.target.value })}
                    >
                      {EQUIPMENT_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>魔道具2</span>
                    <select
                      value={character.equipment2}
                      disabled={!equipmentEnabled}
                      onChange={(event) => updateCharacter(index, { equipment2: event.target.value })}
                    >
                      {EQUIPMENT_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  <span>備考</span>
                  <input
                    value={character.note ?? ''}
                    disabled={!equipmentEnabled}
                    onChange={(event) => updateCharacter(index, { note: event.target.value })}
                  />
                </label>
              </fieldset>
            );
          })}
        </div>

        <div className="modal__actions">
          <button className="secondary-button" type="button" onClick={onClose}>
            キャンセル
          </button>
          <button className="primary-button" type="button" onClick={handleSave}>
            変更
          </button>
        </div>
      </section>
    </div>
  );
}

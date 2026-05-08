import { DEFAULT_CHARACTER_COLORS, OTHER_CHARACTER_COLOR, OTHER_CHARACTER_ID } from '../constants';
import type { Character } from '../types';

/**
 * キャラIDから表示色を取得する。
 * 未指定のキャラは枠順のデフォルト色を使い、その他は専用色で固定する。
 */
export const getCharacterColor = (
  characterId: string,
  characters: Character[],
  fallback?: string,
) => {
  if (characterId === OTHER_CHARACTER_ID) return OTHER_CHARACTER_COLOR;

  const index = characters.findIndex((character) => character.id === characterId);
  if (index < 0) return fallback;

  return characters[index].color || DEFAULT_CHARACTER_COLORS[index] || fallback;
};

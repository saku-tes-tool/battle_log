import type { ActionLog, Character } from '../types';
import { OTHER_CHARACTER_ID } from '../constants';
import { sortLogsByTimeDesc } from './sort';

/**
 * 編成変更後に参照できなくなる行動ログを除外する。
 * 「その他」は編成に依存しないため常に残す。
 */
export const cleanupLogsForCharacters = (logs: ActionLog[], characters: Character[]) => {
  const characterIds = new Set(
    characters.filter((character) => character.name.trim()).map((character) => character.id),
  );
  characterIds.add(OTHER_CHARACTER_ID);
  let removedActionCount = 0;

  // 1つの時間から全行動が消えた場合は、その時間のカード自体も削除する。
  const cleanedLogs = logs
    .map((log) => {
      const actions = log.actions.filter((action) => {
        const keep = characterIds.has(action.characterId);
        if (!keep) removedActionCount += 1;
        return keep;
      });

      return {
        ...log,
        actions,
      };
    })
    .filter((log) => log.actions.length > 0);

  return {
    logs: sortLogsByTimeDesc(cleanedLogs),
    removedActionCount,
  };
};

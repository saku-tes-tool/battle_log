import { OTHER_CHARACTER_ID, createEmptyCharacters } from '../constants';
import type { ActionItem, ActionLog, AppData, Character } from '../types';
import { createTimestamp, sanitizeFileBaseName } from './filename';
import { createId } from './id';
import { sortLogsByTimeDesc } from './sort';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const asString = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value : fallback;

/**
 * 外部JSONのキャラ配列を、アプリで扱える最大5枠のCharacter配列へ正規化する。
 * 欠けた枠や重複IDは安全な初期値へ戻す。
 */
const normalizeCharacters = (value: unknown): Character[] => {
  if (!Array.isArray(value)) throw new Error('Invalid characters');

  const emptyCharacters = createEmptyCharacters();
  const usedIds = new Set<string>();

  return emptyCharacters.map((emptyCharacter, index) => {
    const source = value[index];
    if (!isRecord(source)) return emptyCharacter;

    const rawId = asString(source.id, emptyCharacter.id);
    const id = rawId && !usedIds.has(rawId) ? rawId : emptyCharacter.id;
    usedIds.add(id);

    return {
      id,
      name: asString(source.name).trim(),
      equipment1: asString(source.equipment1, '未選択') || '未選択',
      equipment2: asString(source.equipment2, '未選択') || '未選択',
    };
  });
};

/**
 * 外部JSONのログ配列を、表示・編集できるActionLog配列へ正規化する。
 * 不正な時間、空の行動、存在しないキャラIDの行動は読み飛ばす。
 */
const normalizeLogs = (value: unknown, characters: Character[]): ActionLog[] => {
  if (!Array.isArray(value)) throw new Error('Invalid logs');

  const characterIds = new Set(characters.map((character) => character.id));
  characterIds.add(OTHER_CHARACTER_ID);
  const logs: ActionLog[] = [];
  const usedActionIds = new Set<string>();

  for (const sourceLog of value) {
    if (!isRecord(sourceLog)) continue;

    const time = Number(sourceLog.time);
    if (!Number.isFinite(time) || !Array.isArray(sourceLog.actions)) continue;

    const actions: ActionItem[] = sourceLog.actions.flatMap((sourceAction) => {
      if (!isRecord(sourceAction)) return [];

      const characterId = asString(sourceAction.characterId);
      const action = asString(sourceAction.action).trim();
      const note = asString(sourceAction.note).trim();
      if (!characterIds.has(characterId) || (!action && !note)) return [];

      const sourceActionId = asString(sourceAction.id);
      const id = sourceActionId && !usedActionIds.has(sourceActionId) ? sourceActionId : createId();
      usedActionIds.add(id);

      return {
        id,
        characterId,
        action,
        note,
      };
    });

    if (actions.length > 0) {
      logs.push({
        id: asString(sourceLog.id, createId()),
        time,
        actions,
      });
    }
  }

  return sortLogsByTimeDesc(logs);
};

export const downloadJson = (data: AppData, baseName = `battle-log-${createTimestamp()}`) => {
  // 保存時は表示順と同じタイム降順に揃え、localStorageと同じ形で書き出す。
  const normalizedData: AppData = {
    characters: data.characters,
    logs: sortLogsByTimeDesc(data.logs),
  };
  const blob = new Blob([JSON.stringify(normalizedData, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFileBaseName(baseName)}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * JSON文字列をAppDataとして読み込む。
 * トップレベル構造が違うJSONは別用途のファイルとして扱い、例外を投げる。
 */
export const importJson = (json: string): AppData => {
  const parsed: unknown = JSON.parse(json);
  if (!isRecord(parsed) || !Array.isArray(parsed.characters) || !Array.isArray(parsed.logs)) {
    throw new Error('Invalid battle log JSON');
  }

  const characters = normalizeCharacters(parsed.characters);

  return {
    characters,
    logs: normalizeLogs(parsed.logs, characters),
  };
};

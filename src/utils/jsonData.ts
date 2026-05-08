import { OTHER_CHARACTER_ID, createEmptyCharacters } from '../constants';
import type {
  ActionItem,
  ActionLog,
  AppData,
  BattleLogBook,
  BattleLogBookJson,
  BattleLogEntry,
  BattleLogEntryJson,
  BattleLogImportData,
  Character,
} from '../types';
import { createTimestamp, sanitizeFileBaseName } from './filename';
import { createId } from './id';
import { isBattleLogBook, isBattleLogBookJson, isBattleLogEntryJson } from './logBook';
import { sortLogsByTimeDesc } from './sort';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const asString = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value : fallback;

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
      note: asString(source.note).trim(),
      color: asString(source.color) || undefined,
      equipment1: asString(source.equipment1, '未選択') || '未選択',
      equipment2: asString(source.equipment2, '未選択') || '未選択',
    };
  });
};

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

const normalizeEntry = (value: unknown): BattleLogEntry => {
  if (!isRecord(value) || !Array.isArray(value.characters) || !Array.isArray(value.logs)) {
    throw new Error('Invalid battle log entry');
  }

  const characters = normalizeCharacters(value.characters);
  const now = new Date().toISOString();
  return {
    id: asString(value.id, createId()),
    title: asString(value.title).trim(),
    characters,
    logs: normalizeLogs(value.logs, characters),
    createdAt: asString(value.createdAt, now),
    updatedAt: asString(value.updatedAt, now),
  };
};

const normalizeSingleData = (data: AppData): AppData => ({
  title: data.title?.trim() || '',
  characters: data.characters,
  logs: sortLogsByTimeDesc(data.logs),
});

export const toEntryJson = (entry: BattleLogEntry): BattleLogEntryJson => ({
  version: 2,
  type: 'entry',
  entry: {
    ...entry,
    ...normalizeSingleData(entry),
  },
});

export const toBookJson = (book: BattleLogBook): BattleLogBookJson => ({
  ...book,
  type: 'book',
  logs: book.logs.map((entry) => toEntryJson(entry).entry),
});

export const downloadJson = (
  data: AppData | BattleLogEntryJson | BattleLogBook,
  baseName = `battle-log-${createTimestamp()}`,
) => {
  const normalizedData = isBattleLogBook(data)
    ? toBookJson(data)
    : isBattleLogEntryJson(data)
      ? toEntryJson(data.entry)
      : normalizeSingleData(data);
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

export const importJson = (json: string): BattleLogImportData => {
  const parsed: unknown = JSON.parse(json);

  if (isBattleLogBookJson(parsed) || isBattleLogBook(parsed)) {
    const logs = parsed.logs.flatMap((entry) => {
      try {
        return [normalizeEntry(entry)];
      } catch {
        return [];
      }
    });

    return {
      version: 2,
      type: 'book',
      activeLogId: asString(parsed.activeLogId) || logs[0]?.id || null,
      logs,
    };
  }

  if (isBattleLogEntryJson(parsed)) {
    return {
      version: 2,
      type: 'entry',
      entry: normalizeEntry(parsed.entry),
    };
  }

  if (!isRecord(parsed) || !Array.isArray(parsed.characters) || !Array.isArray(parsed.logs)) {
    throw new Error('Invalid battle log JSON');
  }

  const characters = normalizeCharacters(parsed.characters);

  return {
    title: asString(parsed.title).trim(),
    characters,
    logs: normalizeLogs(parsed.logs, characters),
  };
};

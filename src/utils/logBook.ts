import { createEmptyCharacters } from '../constants';
import type { AppData, BattleLogBook, BattleLogBookJson, BattleLogEntry, BattleLogEntryJson } from '../types';
import { createDisplayTimestamp } from './filename';
import { createId } from './id';
import { sortLogsByTimeDesc } from './sort';

export const hasActiveCharacters = (data: AppData) =>
  data.characters.some((character) => character.name.trim());

export const createDraftLogData = (): AppData => ({
  title: '',
  characters: createEmptyCharacters(),
  logs: [],
});

export const createEntryFromData = (data: AppData, now = new Date()): BattleLogEntry => {
  const iso = now.toISOString();
  return {
    id: createId(),
    title: data.title.trim() || `ログ ${createDisplayTimestamp(now)}`,
    characters: data.characters,
    logs: sortLogsByTimeDesc(data.logs),
    createdAt: iso,
    updatedAt: iso,
  };
};

export const touchEntry = (entry: BattleLogEntry): BattleLogEntry => ({
  ...entry,
  updatedAt: new Date().toISOString(),
});

export const isBattleLogBook = (value: unknown): value is BattleLogBook => {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return record.version === 2 && Array.isArray(record.logs);
};

export const isBattleLogBookJson = (value: unknown): value is BattleLogBookJson => {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return record.version === 2 && record.type === 'book' && Array.isArray(record.logs);
};

export const isBattleLogEntryJson = (value: unknown): value is BattleLogEntryJson => {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return record.version === 2 && record.type === 'entry' && typeof record.entry === 'object' && record.entry !== null;
};

export const migrateLegacyData = (data: AppData): BattleLogBook => {
  if (!hasActiveCharacters(data) && data.logs.length === 0 && !data.title?.trim()) {
    return {
      version: 2,
      activeLogId: null,
      logs: [],
    };
  }

  const entry = createEntryFromData(data);
  return {
    version: 2,
    activeLogId: entry.id,
    logs: [entry],
  };
};

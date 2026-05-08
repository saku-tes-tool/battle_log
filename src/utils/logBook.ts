import { createEmptyCharacters } from '../constants';
import type { AppData, BattleLogBook, BattleLogBookJson, BattleLogEntry, BattleLogEntryJson } from '../types';
import { createDisplayTimestamp } from './filename';
import { createId } from './id';
import { sortLogsByTimeDesc } from './sort';

/**
 * 編成に1人以上のキャラが登録されているかを判定する。
 */
export const hasActiveCharacters = (data: AppData) =>
  data.characters.some((character) => character.name.trim());

/**
 * 新規作成中に使う未保存のログデータを作成する。
 */
export const createDraftLogData = (): AppData => ({
  title: '',
  characters: createEmptyCharacters(),
  logs: [],
});

/**
 * 画面上のログデータを、一覧管理用のIDと日時を持つ保存単位へ変換する。
 */
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

/**
 * ログの更新日時を現在時刻へ進める。
 */
export const touchEntry = (entry: BattleLogEntry): BattleLogEntry => ({
  ...entry,
  updatedAt: new Date().toISOString(),
});

/**
 * localStorageに保存されるv2一覧データかどうかを判定する。
 */
export const isBattleLogBook = (value: unknown): value is BattleLogBook => {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return record.version === 2 && Array.isArray(record.logs);
};

/**
 * JSON保存されたv2一覧データかどうかを判定する。
 */
export const isBattleLogBookJson = (value: unknown): value is BattleLogBookJson => {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return record.version === 2 && record.type === 'book' && Array.isArray(record.logs);
};

/**
 * JSON保存されたv2個別ログかどうかを判定する。
 */
export const isBattleLogEntryJson = (value: unknown): value is BattleLogEntryJson => {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return record.version === 2 && record.type === 'entry' && typeof record.entry === 'object' && record.entry !== null;
};

/**
 * 旧バージョンの単体ログを、v2の一覧形式へ移行する。
 */
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

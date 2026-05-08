import type { AppData, BattleLogBook, Character } from './types';

export const LEGACY_STORAGE_KEY = 'battle_log_manager_v1';
export const STORAGE_KEY = 'battle_log_manager_v2';

export const OTHER_CHARACTER_ID = 'other';

export const EQUIPMENT_OPTIONS = [
  '未選択',
  '専用魔道具',
  '専用(LV用)魔道具',
  '+魔道具',
  'ブレスレット',
  'マント',
  '行動速度',
  'クリティカル率',
  'クリティカル攻撃倍率',
  '攻撃力',
  '被ダメージカット',
  '自由',
];

export const CHARACTER_COLOR_PALETTE = [
  '#6ee7b7',
  '#93c5fd',
  '#facc15',
  '#fb7185',
  '#c4b5fd',
  '#67e8f9',
  '#fdba74',
  '#f0abfc',
];

export const DEFAULT_CHARACTER_COLORS = [
  '#6ee7b7',
  '#93c5fd',
  '#facc15',
  '#fb7185',
  '#c4b5fd',
];

export const OTHER_CHARACTER_COLOR = '#aebfff';

/**
 * 編成編集で表示する5枠分の空キャラデータを作成する。
 */
export const createEmptyCharacters = (): Character[] =>
  Array.from({ length: 5 }, (_, index) => ({
    id: `character-${index + 1}`,
    name: '',
    note: '',
    equipment1: '未選択',
    equipment2: '未選択',
  }));

/**
 * 単体ログとして扱う初期データを作成する。
 */
export const createInitialData = (): AppData => ({
  title: '',
  characters: createEmptyCharacters(),
  logs: [],
});

/**
 * 複数ログ管理用の初期データを作成する。
 */
export const createInitialBook = (): BattleLogBook => ({
  version: 2,
  activeLogId: null,
  logs: [],
});

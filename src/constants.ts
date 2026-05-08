import type { AppData, BattleLogBook, Character } from './types';

export const LEGACY_STORAGE_KEY = 'battle_log_manager_v1';
export const STORAGE_KEY = 'battle_log_manager_v2';

export const OTHER_CHARACTER_ID = 'other';

export const EQUIPMENT_OPTIONS = [
  '未選択',
  '専用魔道具',
  '専用(LV用)魔道具',
  '+魔道具',
  '速度',
  '攻撃・クリティカル',
  '被ダメ軽減',
  '自由',
  '速度以外自由',
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

export const createEmptyCharacters = (): Character[] =>
  Array.from({ length: 5 }, (_, index) => ({
    id: `character-${index + 1}`,
    name: '',
    note: '',
    equipment1: '未選択',
    equipment2: '未選択',
  }));

export const createInitialData = (): AppData => ({
  title: '',
  characters: createEmptyCharacters(),
  logs: [],
});

export const createInitialBook = (): BattleLogBook => ({
  version: 2,
  activeLogId: null,
  logs: [],
});

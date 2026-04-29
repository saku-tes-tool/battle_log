import type { AppData, Character } from './types';

export const STORAGE_KEY = 'battle_log_manager_v1';

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

export const createEmptyCharacters = (): Character[] =>
  Array.from({ length: 5 }, (_, index) => ({
    id: `character-${index + 1}`,
    name: '',
    equipment1: '未選択',
    equipment2: '未選択',
  }));

export const createInitialData = (): AppData => ({
  characters: createEmptyCharacters(),
  logs: [],
});

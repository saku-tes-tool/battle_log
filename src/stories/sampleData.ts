import type { ActionLog, AppData } from '../types';

export const sampleCharacters = [
  {
    id: 'character-1',
    name: 'キャラ1',
    note: '役割メモ',
    color: '#62d6a4',
    equipment1: '装備A',
    equipment2: '装備C',
  },
  {
    id: 'character-2',
    name: 'キャラ2',
    note: '',
    equipment1: '装備B',
    equipment2: '未選択',
  },
  {
    id: 'character-3',
    name: 'キャラ3',
    note: '',
    equipment1: '装備D',
    equipment2: '装備E',
  },
  {
    id: 'character-4',
    name: '',
    note: '',
    equipment1: '未選択',
    equipment2: '未選択',
  },
  {
    id: 'character-5',
    name: '',
    note: '',
    equipment1: '未選択',
    equipment2: '未選択',
  },
];

export const sampleLog: ActionLog = {
  id: 'log-60',
  time: 60,
  actions: [
    {
      id: 'action-1',
      characterId: 'character-1',
      action: '通常攻撃',
      note: 'SP温存',
    },
    {
      id: 'action-2',
      characterId: 'character-2',
      action: 'バフ',
      note: '開幕使用',
    },
  ],
};

export const sampleData: AppData = {
  title: '5月行動ログ',
  characters: sampleCharacters,
  logs: [
    sampleLog,
    {
      id: 'log-55',
      time: 55,
      actions: [
        {
          id: 'action-3',
          characterId: 'character-3',
          action: 'デバフ',
          note: '防御低下',
        },
      ],
    },
  ],
};

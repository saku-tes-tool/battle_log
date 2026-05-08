export type Character = {
  id: string;
  name: string;
  note: string;
  color?: string;
  equipment1: string;
  equipment2: string;
};

export type ActionItem = {
  id: string;
  characterId: string;
  action: string;
  note: string;
};

export type ActionLog = {
  id: string;
  time: number;
  actions: ActionItem[];
};

export type AppData = {
  title: string;
  characters: Character[];
  logs: ActionLog[];
};

export type BattleLogEntry = AppData & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type BattleLogBook = {
  version: 2;
  activeLogId: string | null;
  logs: BattleLogEntry[];
};

export type BattleLogEntryJson = {
  version: 2;
  type: 'entry';
  entry: BattleLogEntry;
};

export type BattleLogBookJson = BattleLogBook & {
  type: 'book';
};

export type BattleLogImportData = AppData | BattleLogEntryJson | BattleLogBookJson;

export type Character = {
  id: string;
  name: string;
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
  characters: Character[];
  logs: ActionLog[];
};

import type { ActionLog } from '../types';

export const sortLogsByTimeDesc = (logs: ActionLog[]) =>
  [...logs].sort((a, b) => b.time - a.time);

import type { ActionLog } from '../types';

/**
 * 行動ログをタイムの大きい順に並べる。
 */
export const sortLogsByTimeDesc = (logs: ActionLog[]) =>
  [...logs].sort((a, b) => b.time - a.time);

/**
 * localStorage内で扱うログや行動用の簡易ユニークIDを生成する。
 */
export const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

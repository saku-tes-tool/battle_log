/**
 * ファイル名に使う時刻文字列を生成する。
 * 例: 20260429-153012
 */
export const createTimestamp = (date = new Date()) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    '-',
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('');
};

/**
 * ユーザー入力の保存名から、OSで使えない文字を取り除く。
 * 空になった場合は安全な既定名へ戻す。
 */
export const sanitizeFileBaseName = (name: string) => {
  const sanitized = name
    .trim()
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  return sanitized || 'battle-log';
};

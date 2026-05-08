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
 * 出力ファイル名に使う短い時刻文字列を生成する。
 * 例: 260513_212305
 */
export const createExportTimestamp = (date = new Date()) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return [
    pad(date.getFullYear() % 100),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    '_',
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('');
};

/**
 * 画面表示や自動タイトルに使う読みやすい時刻文字列を生成する。
 */
export const createDisplayTimestamp = (date = new Date()) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
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

  return sanitized || '行動ログ';
};

/**
 * ログタイトルを優先した保存用ファイル名のベースを生成する。
 * タイトルが空の場合は既定名を使い、末尾に時刻を付けて重複しにくくする。
 */
export const createBattleLogFileBaseName = (title?: string, fallback = '行動ログ') => {
  const baseName = sanitizeFileBaseName(title?.trim() || fallback);
  return `${baseName}-${createTimestamp()}`;
};

/**
 * 個別JSON出力用のファイル名ベースを生成する。
 */
export const createActionLogExportFileBaseName = (title?: string) => {
  const baseName = sanitizeFileBaseName(title?.trim() || '行動ログ');
  return `${baseName}_export_${createExportTimestamp()}`;
};

/**
 * 画像保存用のファイル名を生成する。
 */
export const createActionLogImageFileName = (title?: string) => {
  const baseName = sanitizeFileBaseName(title?.trim() || '行動ログ');
  return `${baseName}_${createExportTimestamp()}.png`;
};

/**
 * 一覧全体のJSON出力用ファイル名ベースを生成する。
 */
export const createAllActionLogsExportFileBaseName = () =>
  `全行動ログ_export_${createExportTimestamp()}`;

import { ClipboardCopy, Download, FileDown, FileUp, Trash2 } from 'lucide-react';

type FooterActionsProps = {
  hasLogs: boolean;
  onClear: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
  onSaveImage: () => void;
  onCopyText: () => void;
  onDeleteCurrent?: () => void;
  clearLabel?: string;
  deleteLabel?: string;
  deleteDisabled?: boolean;
  importDisabled?: boolean;
};

/**
 * 詳細画面下部のファイル操作と削除系操作をまとめる。
 * ログがない場合は出力・画像保存・テキストコピーを弱め、誤操作を防ぐ。
 */
export function FooterActions({
  hasLogs,
  onClear,
  onExportJson,
  onImportJson,
  onSaveImage,
  onCopyText,
  onDeleteCurrent,
  clearLabel = 'ログをクリア',
  deleteLabel = 'ログを削除',
  deleteDisabled = false,
  importDisabled = false,
}: FooterActionsProps) {
  return (
    <footer className="footer-actions footer-actions--stacked no-export">
      <button className="icon-button" type="button" onClick={onExportJson} disabled={!hasLogs} aria-label="JSON保存">
        <FileDown size={18} />
        <span>JSON保存</span>
      </button>
      <button className="icon-button" type="button" onClick={onImportJson} disabled={importDisabled} aria-label="JSON取込">
        <FileUp size={18} />
        <span>JSON取込</span>
      </button>
      <button className="icon-button" type="button" onClick={onSaveImage} disabled={!hasLogs} aria-label="画像保存">
        <Download size={18} />
        <span>画像保存</span>
      </button>
      <button className="icon-button" type="button" onClick={onCopyText} disabled={!hasLogs} aria-label="テキストでコピー">
        <ClipboardCopy size={18} />
        <span>テキストでコピー</span>
      </button>
      <button
        className="icon-button danger footer-actions__danger-button"
        type="button"
        onClick={onClear}
        disabled={!hasLogs}
        aria-label={clearLabel}
      >
        <Trash2 size={18} />
        <span>{clearLabel}</span>
      </button>
      {onDeleteCurrent && (
        <button
          className="icon-button danger footer-actions__danger-button"
          type="button"
          onClick={onDeleteCurrent}
          disabled={deleteDisabled}
          aria-label={deleteLabel}
        >
          <Trash2 size={18} />
          <span>{deleteLabel}</span>
        </button>
      )}
    </footer>
  );
}

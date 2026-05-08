import { ClipboardCopy, Download, FileDown, FileUp, Trash2 } from 'lucide-react';

type FooterActionsProps = {
  hasLogs: boolean;
  onClear: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
  onSaveImage: () => void;
  onCopyText: () => void;
  clearLabel?: string;
  importDisabled?: boolean;
};

export function FooterActions({
  hasLogs,
  onClear,
  onExportJson,
  onImportJson,
  onSaveImage,
  onCopyText,
  clearLabel = 'クリア',
  importDisabled = false,
}: FooterActionsProps) {
  return (
    <footer className="footer-actions no-export">
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
      <button className="icon-button danger" type="button" onClick={onClear} aria-label="データクリア">
        <Trash2 size={18} />
        <span>{clearLabel}</span>
      </button>
    </footer>
  );
}

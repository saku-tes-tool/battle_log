import { Plus } from 'lucide-react';

type FloatingActionButtonProps = {
  label?: string;
  onClick: () => void;
};

export function FloatingActionButton({ label = 'ログの追加', onClick }: FloatingActionButtonProps) {
  return (
    <div className="bottom-action-bar no-export">
      <button className="bottom-action-button" type="button" onClick={onClick}>
        <Plus size={18} />
        <span>{label}</span>
      </button>
    </div>
  );
}

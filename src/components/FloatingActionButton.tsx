import { Plus } from 'lucide-react';

type FloatingActionButtonProps = {
  onClick: () => void;
};

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <div className="bottom-action-bar no-export">
      <button className="bottom-action-button" type="button" onClick={onClick}>
        <Plus size={18} />
        <span>ログの追加</span>
      </button>
    </div>
  );
}

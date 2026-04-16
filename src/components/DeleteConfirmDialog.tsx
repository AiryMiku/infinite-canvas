

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        style={{
          background: '#16213e',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          border: '1px solid #2d3a5a',
          maxWidth: '320px',
          width: '90%',
        }}
      >
        <h3
          style={{
            margin: '0 0 12px 0',
            color: '#e2e8f0',
            fontSize: '18px',
          }}
        >
          确认删除
        </h3>
        <p
          style={{
            margin: '0 0 24px 0',
            color: '#94a3b8',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
        >
          确定要删除这个节点吗？此操作无法撤销。
        </p>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: '1px solid #2d3a5a',
              background: 'transparent',
              color: '#e2e8f0',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1a2744';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#ef4444',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ef4444';
            }}
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
}

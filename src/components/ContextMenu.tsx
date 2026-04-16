import React from 'react';

interface MenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
  disabled?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const eventCountRef = React.useRef<number>(0);

  React.useEffect(() => {
    eventCountRef.current = 0;
    
    const handleClick = (e: MouseEvent) => {
      eventCountRef.current++;
      if (eventCountRef.current <= 1) return;
      if (!(e.target as HTMLElement).closest('.context-menu')) {
        onClose();
      }
    };
    const handleContextMenu = (e: MouseEvent) => {
      eventCountRef.current++;
      if (eventCountRef.current <= 1) return;
      if (!(e.target as HTMLElement).closest('.context-menu')) {
        onClose();
      }
    };
    
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [onClose]);

  console.log('context menu open', x, y, items);
  return (
    <div
      className="context-menu"
      style={{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        background: '#1e293b',
        borderRadius: '8px',
        padding: '4px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
        border: '1px solid #334155',
        zIndex: 10000,
        minWidth: '160px',
      }}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            item.onClick();
          }}
          disabled={item.disabled}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '8px 12px',
            border: 'none',
            background: 'transparent',
            color: item.disabled ? '#475569' : '#e2e8f0',
            fontSize: '13px',
            textAlign: 'left',
            cursor: item.disabled ? 'not-allowed' : 'pointer',
            borderRadius: '6px',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            if (!item.disabled) {
              e.currentTarget.style.background = '#334155';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {item.icon && <span style={{ fontSize: '14px' }}>{item.icon}</span>}
          {item.label}
        </button>
      ))}
    </div>
  );
}

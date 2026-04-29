import React from 'react';
import { Theme } from '../utils/theme';

interface ScaleIndicatorProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  theme: Theme;
}

export function ScaleIndicator({ scale, onZoomIn, onZoomOut, theme }: ScaleIndicatorProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: theme.toolbar.background,
        padding: '4px 8px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        border: `1px solid ${theme.toolbar.border}`,
        color: theme.toolbar.text,
        fontSize: '12px',
        fontWeight: '500',
        userSelect: 'none',
      }}
    >
      <button
        onClick={onZoomOut}
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '6px',
          border: `1px solid ${theme.button.border}`,
          background: theme.button.background,
          color: theme.button.text,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = theme.button.backgroundHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = theme.button.background)}
      >
        -
      </button>
      
      <span style={{ minWidth: '45px', textAlign: 'center', fontFamily: 'monospace' }}>
        {Math.round(scale * 100)}%
      </span>
      
      <button
        onClick={onZoomIn}
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '6px',
          border: `1px solid ${theme.button.border}`,
          background: theme.button.background,
          color: theme.button.text,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = theme.button.backgroundHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = theme.button.background)}
      >
        +
      </button>
    </div>
  );
}

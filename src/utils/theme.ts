
export interface Theme {
  name: 'dark' | 'light';
  canvas: {
    background: string;
  };
  toolbar: {
    background: string;
    border: string;
    text: string;
    textSecondary: string;
    textMuted: string;
  };
  node: {
    background: string;
    backgroundSelected: string;
    backgroundConnecting: string;
    border: string;
    borderSelected: string;
    borderConnecting: string;
    borderPreselected: string;
    text: string;
    dragHandle: string;
    dragHandleDot: string;
    connectHandle: string;
    connectHandleBorder: string;
    connectHandleActive: string;
    connectHandleActiveBorder: string;
  };
  connection: {
    line: string;
    lineHover: string;
    gradientStart: string;
    gradientEnd: string;
  };
  button: {
    background: string;
    backgroundHover: string;
    border: string;
    text: string;
  };
  dialog: {
    background: string;
    border: string;
    text: string;
    textSecondary: string;
  };
  contextMenu: {
    background: string;
    border: string;
    text: string;
    textDisabled: string;
    itemHover: string;
  };
}

export const darkTheme: Theme = {
  name: 'dark',
  canvas: {
    background: '#0f172a',
  },
  toolbar: {
    background: '#1e293b',
    border: '#334155',
    text: '#e2e8f0',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
  },
  node: {
    background: '#1e293b',
    backgroundSelected: '#3b82f6',
    backgroundConnecting: '#2563eb',
    border: '#334155',
    borderSelected: '#60a5fa',
    borderConnecting: '#93c5fd',
    borderPreselected: '#10b981',
    text: '#e2e8f0',
    dragHandle: 'rgba(0, 0, 0, 0.2)',
    dragHandleDot: '#64748b',
    connectHandle: '#3b82f6',
    connectHandleBorder: '#0f172a',
    connectHandleActive: '#10b981',
    connectHandleActiveBorder: '#059669',
  },
  connection: {
    line: '#475569',
    lineHover: '#64748b',
    gradientStart: '#3b82f6',
    gradientEnd: '#60a5fa',
  },
  button: {
    background: 'transparent',
    backgroundHover: '#334155',
    border: '#334155',
    text: '#e2e8f0',
  },
  dialog: {
    background: '#1e293b',
    border: '#334155',
    text: '#e2e8f0',
    textSecondary: '#94a3b8',
  },
  contextMenu: {
    background: '#1e293b',
    border: '#334155',
    text: '#e2e8f0',
    textDisabled: '#475569',
    itemHover: '#334155',
  },
};

export const lightTheme: Theme = {
  name: 'light',
  canvas: {
    background: '#f8fafc',
  },
  toolbar: {
    background: '#ffffff',
    border: '#e2e8f0',
    text: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
  },
  node: {
    background: '#ffffff',
    backgroundSelected: '#3b82f6',
    backgroundConnecting: '#2563eb',
    border: '#e2e8f0',
    borderSelected: '#60a5fa',
    borderConnecting: '#93c5fd',
    borderPreselected: '#10b981',
    text: '#1e293b',
    dragHandle: 'rgba(0, 0, 0, 0.05)',
    dragHandleDot: '#94a3b8',
    connectHandle: '#3b82f6',
    connectHandleBorder: '#ffffff',
    connectHandleActive: '#10b981',
    connectHandleActiveBorder: '#059669',
  },
  connection: {
    line: '#cbd5e1',
    lineHover: '#94a3b8',
    gradientStart: '#3b82f6',
    gradientEnd: '#60a5fa',
  },
  button: {
    background: 'transparent',
    backgroundHover: '#f1f5f9',
    border: '#e2e8f0',
    text: '#1e293b',
  },
  dialog: {
    background: '#ffffff',
    border: '#e2e8f0',
    text: '#1e293b',
    textSecondary: '#64748b',
  },
  contextMenu: {
    background: '#ffffff',
    border: '#e2e8f0',
    text: '#1e293b',
    textDisabled: '#cbd5e1',
    itemHover: '#f1f5f9',
  },
};

export function getTheme(name: 'dark' | 'light'): Theme {
  return name === 'dark' ? darkTheme : lightTheme;
}

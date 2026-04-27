export type Language = 'zh' | 'en' | 'ja';

export interface Translation {
  app: {
    title: string;
    autoSave: string;
  };
  help: {
    ctrlScroll: string;
    scrollPan: string;
    mouseDrag: string;
    rightClickCanvas: string;
    rightClickNode: string;
    hoverConnection: string;
    connectModeActive: string;
    connectModeHint: string;
    collapseHelp: string;
    expandHelp: string;
  };
  buttons: {
    lightTheme: string;
    darkTheme: string;
    exportImage: string;
    clearCanvas: string;
    cancel: string;
    confirm: string;
    delete: string;
  };
  dialogs: {
    deleteTitle: string;
    deleteMessage: string;
    clearTitle: string;
    clearMessage: string;
  };
  contextMenu: {
    addNode: string;
    paste: string;
    copy: string;
    deleteNode: string;
  };
  placeholders: {
    nodeText: string;
  };
}

export const translations: Record<Language, Translation> = {
  zh: {
    app: {
      title: '🧠 无限画布思维导图',
      autoSave: '数据已自动保存 · 刷新不会丢失',
    },
    help: {
      ctrlScroll: '• Ctrl + 滚轮：缩放画布',
      scrollPan: '• 滚轮上下/左右：拖动画布',
      mouseDrag: '• 鼠标拖拽：拖动画布',
      rightClickCanvas: '• 右键空白处：添加节点/粘贴',
      rightClickNode: '• 右键节点：复制/删除',
      hoverConnection: '• 悬浮连接线：显示删除按钮',
      connectModeActive: '🔗 连接模式：点击另一个节点完成连接（点击空白处取消）',
      connectModeHint: '选中节点后点击右侧 + 按钮开始连接',
      collapseHelp: '收起帮助',
      expandHelp: '显示帮助',
    },
    buttons: {
      lightTheme: '☀️ 浅色',
      darkTheme: '🌙 深色',
      exportImage: '📷 导出图片',
      clearCanvas: '🗑️ 清空画布',
      cancel: '取消',
      confirm: '确认',
      delete: '删除',
    },
    dialogs: {
      deleteTitle: '确认删除',
      deleteMessage: '确定要删除这个节点吗？此操作无法撤销。',
      clearTitle: '清空画布',
      clearMessage: '确定要清空所有节点和连接吗？此操作无法撤销。',
    },
    contextMenu: {
      addNode: '添加节点',
      paste: '粘贴',
      copy: '复制',
      deleteNode: '删除',
    },
    placeholders: {
      nodeText: '输入文本...',
    },
  },
  en: {
    app: {
      title: '🧠 Infinite Canvas Mind Map',
      autoSave: 'Auto-saved · No data loss on refresh',
    },
    help: {
      ctrlScroll: '• Ctrl + Scroll: Zoom canvas',
      scrollPan: '• Scroll up/down/left/right: Pan canvas',
      mouseDrag: '• Mouse drag: Pan canvas',
      rightClickCanvas: '• Right-click blank area: Add node/Paste',
      rightClickNode: '• Right-click node: Copy/Delete',
      hoverConnection: '• Hover connection: Show delete button',
      connectModeActive: '🔗 Connection mode: Click another node to connect (click blank to cancel)',
      connectModeHint: 'Select a node and click the + button on the right to start connecting',
      collapseHelp: 'Collapse help',
      expandHelp: 'Show help',
    },
    buttons: {
      lightTheme: '☀️ Light',
      darkTheme: '🌙 Dark',
      exportImage: '📷 Export Image',
      clearCanvas: '🗑️ Clear Canvas',
      cancel: 'Cancel',
      confirm: 'Confirm',
      delete: 'Delete',
    },
    dialogs: {
      deleteTitle: 'Confirm Delete',
      deleteMessage: 'Are you sure you want to delete this node? This action cannot be undone.',
      clearTitle: 'Clear Canvas',
      clearMessage: 'Are you sure you want to clear all nodes and connections? This action cannot be undone.',
    },
    contextMenu: {
      addNode: 'Add Node',
      paste: 'Paste',
      copy: 'Copy',
      deleteNode: 'Delete',
    },
    placeholders: {
      nodeText: 'Enter text...',
    },
  },
  ja: {
    app: {
      title: '🧠 無限キャンバスマインドマップ',
      autoSave: '自動保存 · 更新してもデータは失われません',
    },
    help: {
      ctrlScroll: '• Ctrl + スクロール：キャンバスをズーム',
      scrollPan: '• スクロール（上下/左右）：キャンバスを移動',
      mouseDrag: '• マウスドラッグ：キャンバスを移動',
      rightClickCanvas: '• 空白を右クリック：ノード追加/貼り付け',
      rightClickNode: '• ノードを右クリック：コピー/削除',
      hoverConnection: '• 接続線をホバー：削除ボタンを表示',
      connectModeActive: '🔗 接続モード：別のノードをクリックして接続完了（空白をクリックでキャンセル）',
      connectModeHint: 'ノードを選択して右側の + ボタンをクリックして接続を開始',
      collapseHelp: 'ヘルプを折りたたむ',
      expandHelp: 'ヘルプを表示',
    },
    buttons: {
      lightTheme: '☀️ ライト',
      darkTheme: '🌙 ダーク',
      exportImage: '📷 画像を出力',
      clearCanvas: '🗑️ キャンバスをクリア',
      cancel: 'キャンセル',
      confirm: '確認',
      delete: '削除',
    },
    dialogs: {
      deleteTitle: '削除の確認',
      deleteMessage: 'このノードを削除してもよろしいですか？この操作は元に戻せません。',
      clearTitle: 'キャンバスをクリア',
      clearMessage: 'すべてのノードと接続をクリアしてもよろしいですか？この操作は元に戻せません。',
    },
    contextMenu: {
      addNode: 'ノードを追加',
      paste: '貼り付け',
      copy: 'コピー',
      deleteNode: '削除',
    },
    placeholders: {
      nodeText: 'テキストを入力...',
    },
  },
};

export function getTranslation(lang: Language): Translation {
  return translations[lang] || translations.zh;
}

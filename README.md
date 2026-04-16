# 🧠 无限画布思维导图

一个使用 React + TypeScript + Vite 构建的轻量级无限画布思维导图应用。

## ✨ 功能特性

1. **文本块创建与编辑**
   - 点击画布空白处即可创建新节点
   - 节点内文本可直接编辑
   - 支持键盘快捷键删除

2. **节点连接**
   - 自动生成贝塞尔曲线连接
   - 支持一对多连接
   - 选中节点后显示连接手柄

3. **无限画布操作**
   - 拖拽画布平移
   - 滚轮缩放（以鼠标位置为中心）
   - 缩放范围：0.1x - 3x

## 🚀 快速开始

### 安装依赖
```bash
cd infinite-canvas
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173 即可使用。

### 构建生产版本
```bash
npm run build
```

## 📁 项目结构

```
infinite-canvas/
├── src/
│   ├── components/
│   │   ├── Canvas.tsx          # 无限画布组件
│   │   ├── NodeBlock.tsx       # 文本块组件
│   │   └── ConnectionLine.tsx  # 连接线组件
│   ├── hooks/
│   │   └── useCanvasState.ts   # 画布状态管理 Hook
│   ├── types.ts                # TypeScript 类型定义
│   ├── App.tsx                 # 根组件
│   ├── main.tsx                # 入口文件
│   └── index.css               # 全局样式
├── docs/                       # 模块文档
└── package.json
```

## 📖 详细文档

每个模块都有详细的文档，包含功能说明和调用流程：

- [类型定义](./docs/types.md)
- [useCanvasState Hook](./docs/useCanvasState.md)
- [Canvas 组件](./docs/Canvas.md)
- [NodeBlock 组件](./docs/NodeBlock.md)
- [ConnectionLine 组件](./docs/ConnectionLine.md)
- [App 组件](./docs/App.md)

## 🎮 使用说明

| 操作 | 说明 |
|------|------|
| 点击空白处 | 创建新节点 |
| 拖拽节点 | 移动节点位置 |
| 点击节点文本 | 编辑节点内容 |
| 选中节点后点击 × | 删除节点 |
| 选中节点后拖拽底部 + | 连接到其他节点 |
| 拖拽画布空白处 | 平移画布 |
| 滚轮滚动 | 缩放画布 |

## 🛠️ 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **SVG** - 连接线渲染

## 📝 许可证

MIT

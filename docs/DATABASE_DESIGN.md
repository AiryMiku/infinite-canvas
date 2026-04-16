# 无限画布思维导图 - 数据库设计文档

## 1. 数据库概述

### 1.1 数据库名称
`InfiniteCanvasDB`

### 1.2 数据库版本
1

### 1.3 存储类型
IndexedDB (浏览器端本地存储)

### 1.4 设计目标
- 支持节点和连接数据的持久化存储
- 提供高效的 CRUD 操作
- 支持大数据量存储（比 localStorage 更强大）
- 提供原子性和事务支持

---

## 2. 对象仓库设计

### 2.1 节点表 (nodes)

#### 2.1.1 表结构
| 字段名 | 类型 | 主键 | 索引 | 描述 |
|--------|------|------|------|------|
| id | string | ✓ | ✓ | 节点唯一标识符 |
| x | number | ✗ | ✗ | 节点在画布上的 x 坐标 |
| y | number | ✗ | ✗ | 节点在画布上的 y 坐标 |
| width | number | ✗ | ✗ | 节点宽度（像素） |
| height | number | ✗ | ✗ | 节点高度（像素） |
| text | string | ✗ | ✗ | 节点文本内容 |

#### 2.1.2 数据示例
```typescript
{
  id: "node-1734567890123",
  x: 100,
  y: 150,
  width: 180,
  height: 80,
  text: "新节点"
}
```

#### 2.1.3 索引
- `id`: 唯一索引，主键

---

### 2.2 连接表 (connections)

#### 2.2.1 表结构
| 字段名 | 类型 | 主键 | 索引 | 描述 |
|--------|------|------|------|------|
| id | string | ✓ | ✓ | 连接唯一标识符 |
| fromId | string | ✗ | ✓ | 起始节点 ID |
| toId | string | ✗ | ✓ | 目标节点 ID |

#### 2.2.2 数据示例
```typescript
{
  id: "conn-1734567890124",
  fromId: "node-1734567890123",
  toId: "node-1734567890125"
}
```

#### 2.2.3 索引
- `id`: 唯一索引，主键
- `fromId`: 非唯一索引，用于查询从某个节点出发的所有连接
- `toId`: 非唯一索引，用于查询连接到某个节点的所有连接

---

## 3. 数据库操作 API

### 3.1 初始化
```typescript
initDB(): Promise<IDBDatabase>
```
- 功能：初始化或打开数据库
- 返回：数据库实例 Promise

### 3.2 节点操作

#### 3.2.1 获取所有节点
```typescript
getAllNodes(): Promise<Node[]>
```
- 功能：获取所有节点数据
- 返回：节点数组 Promise

#### 3.2.2 保存单个节点
```typescript
saveNode(node: Node): Promise<void>
```
- 功能：添加或更新单个节点
- 参数：Node 对象
- 返回：Promise

#### 3.2.3 批量保存节点
```typescript
saveNodes(nodes: Node[]): Promise<void>
```
- 功能：清空节点表并批量保存所有节点
- 参数：Node 对象数组
- 返回：Promise

#### 3.2.4 删除节点
```typescript
deleteNode(id: string): Promise<void>
```
- 功能：删除指定 ID 的节点
- 参数：节点 ID
- 返回：Promise

### 3.3 连接操作

#### 3.3.1 获取所有连接
```typescript
getAllConnections(): Promise<Connection[]>
```
- 功能：获取所有连接数据
- 返回：连接数组 Promise

#### 3.3.2 保存单个连接
```typescript
saveConnection(connection: Connection): Promise<void>
```
- 功能：添加或更新单个连接
- 参数：Connection 对象
- 返回：Promise

#### 3.3.3 批量保存连接
```typescript
saveConnections(connections: Connection[]): Promise<void>
```
- 功能：清空连接表并批量保存所有连接
- 参数：Connection 对象数组
- 返回：Promise

#### 3.3.4 删除连接
```typescript
deleteConnection(id: string): Promise<void>
```
- 功能：删除指定 ID 的连接
- 参数：连接 ID
- 返回：Promise

### 3.4 清空操作
```typescript
clearAll(): Promise<void>
```
- 功能：清空所有节点和连接数据
- 返回：Promise

---

## 4. 数据流程

### 4.1 初始化流程
```
应用启动
  ↓
调用 useCanvasState Hook
  ↓
加载数据 (getAllNodes + getAllConnections)
  ↓
设置状态到 React
  ↓
渲染画布
```

### 4.2 保存流程
```
用户操作（添加/修改/删除节点或连接）
  ↓
更新 React 状态
  ↓
触发 useEffect 监听器
  ↓
调用 saveNodes / saveConnections
  ↓
数据持久化到 IndexedDB
```

---

## 5. 索引设计说明

### 5.1 节点表索引
- **id (唯一索引)**:
  - 用途：主键索引，用于快速定位单个节点
  - 性能：O(1) 时间复杂度

### 5.2 连接表索引
- **id (唯一索引)**:
  - 用途：主键索引，用于快速定位单个连接
  - 性能：O(1) 时间复杂度

- **fromId (非唯一索引)**:
  - 用途：查询从某个节点出发的所有连接
  - 场景：删除节点时级联删除连接
  - 性能：O(log n) 时间复杂度

- **toId (非唯一索引)**:
  - 用途：查询连接到某个节点的所有连接
  - 场景：删除节点时级联删除连接
  - 性能：O(log n) 时间复杂度

---

## 6. 与 localStorage 对比

| 特性 | IndexedDB | localStorage |
|------|-----------|---------------|
| 存储容量 | 几百MB ~ 几GB | 约 5MB |
| 数据类型 | 结构化对象 | 字符串 |
| 事务支持 | ✓ | ✗ |
| 异步操作 | ✓ | ✗ |
| 索引支持 | ✓ | ✗ |
| 大数据性能 | 优秀 | 差 |

---

## 7. 注意事项

1. **数据安全**: IndexedDB 数据仅存储在浏览器本地，清除浏览器数据会丢失
2. **数据一致性**: 使用事务确保批量操作的原子性
3. **迁移策略**: 未来版本升级时需要考虑数据迁移
4. **错误处理**: 所有数据库操作都有错误处理和日志记录

---

## 8. 文件位置

- 数据库工具类: `src/utils/indexedDB.ts`
- Hook 集成: `src/hooks/useCanvasState.ts`

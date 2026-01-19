# 📚 开发指南

## 项目架构

### 整体架构

```
┌─────────────────┐         Socket.IO          ┌─────────────────┐
│                 │ ◄────────────────────────► │                 │
│   Vue 3 前端     │                            │  Express 后端    │
│   (localhost:3000)│                            │  (localhost:3001) │
│                 │                            │                 │
└─────────────────┘                            └─────────────────┘
         │                                              │
         │ Pinia Store                                 │ GameEngine
         │                                              │ RoomManager
         └──────────────────────────────────────────────┘
                                  Shared Types
```

### 目录结构详解

#### client/ - 前端代码

```
client/
├── src/
│   ├── components/     # 可复用组件
│   │   └── Card.vue     # 卡牌组件
│   ├── views/          # 页面组件
│   │   ├── Home.vue     # 首页
│   │   ├── Lobby.vue    # 游戏大厅
│   │   └── Game.vue     # 游戏界面
│   ├── stores/         # Pinia状态管理
│   │   └── game.ts      # 游戏状态
│   ├── router/         # Vue Router配置
│   │   └── index.ts
│   └── main.ts         # 应用入口
├── index.html
├── vite.config.ts
└── package.json
```

#### server/ - 后端代码

```
server/
├── src/
│   ├── socket/         # Socket.IO处理
│   │   └── handlers.ts # 事件处理器
│   ├── managers/       # 业务逻辑管理
│   │   ├── RoomManager.ts # 房间管理
│   │   └── GameManager.ts # 游戏管理
│   └── server.ts       # 服务器入口
├── .env
└── package.json
```

#### shared/ - 共享代码

```
shared/
├── src/
│   ├── types/          # TypeScript类型
│   │   └── game.ts
│   ├── game/           # 游戏逻辑
│   │   ├── cards.ts    # 卡牌逻辑
│   │   └── engine.ts   # 游戏引擎
│   └── index.ts
└── tsconfig.json
```

## 核心概念

### 1. 游戏状态管理

#### 前端状态 (Pinia Store)

```typescript
// client/src/stores/game.ts
interface GameState {
  socket: Socket | null;
  isConnected: boolean;
  currentRoom: string | null;
  gameState: GameState | null;
  currentPlayerId: string | null;
}
```

#### 后端游戏引擎

```typescript
// shared/src/game/engine.ts
class GameEngine {
  private state: GameState;

  startGame(): void;
  bid(playerId: string, score: number): boolean;
  playCards(playerId: string, cards: Card[]): boolean;
  pass(playerId: string): boolean;
}
```

### 2. Socket.IO 通信

#### 客户端发送

```typescript
socket.emit("join-room", { roomId, playerName });
socket.emit("play-cards", { roomId, cards });
socket.emit("bid", { roomId, score });
```

#### 服务器处理

```typescript
socket.on("join-room", (data) => {
  // 处理加入房间逻辑
  io.to(roomId).emit("room-updated", room);
});
```

#### 客户端接收

```typescript
socket.on("game-state", (state) => {
  gameState.value = state;
});
socket.on("game-event", (event) => {
  handleGameEvent(event);
});
```

### 3. 卡牌系统

#### 卡牌类型

```typescript
enum Suit {
  Spades = 0, // 黑桃
  Hearts = 1, // 红桃
  Clubs = 2, // 梅花
  Diamonds = 3, // 方块
}

enum CardValue {
  Three = 3,
  Four = 4,
  // ...
  Ace = 14,
  Two = 15,
  SmallJoker = 16,
  BigJoker = 17,
}
```

#### 牌型判断

```typescript
// shared/src/game/cards.ts
function getCardType(cards: Card[]): {
  type: CardType;
  rank: number;
  valid: boolean;
};

function canBeat(currentPlay: Card[], lastPlay: Card[]): boolean;
```

## 开发工作流

### 1. 添加新功能

1. **定义类型** (shared/src/types/game.ts)

```typescript
export interface NewFeature {
  id: string;
  name: string;
  // ...
}
```

2. **实现游戏逻辑** (shared/src/game/engine.ts)

```typescript
class GameEngine {
  newFeatureLogic(data: NewFeature): boolean {
    // 实现逻辑
    return true;
  }
}
```

3. **更新后端处理器** (server/src/socket/handlers.ts)

```typescript
socket.on("new-feature", (data) => {
  const result = game.newFeatureLogic(data);
  // 发送结果
});
```

4. **更新前端状态** (client/src/stores/game.ts)

```typescript
function newFeature(data: NewFeature) {
  socket.emit("new-feature", data);
}
```

5. **更新UI组件** (client/src/views/Game.vue)

```typescript
function handleNewFeature() {
  gameStore.newFeature(data);
}
```

### 2. 调试技巧

#### 前端调试

```typescript
// 使用 Vue DevTools
console.log("Game State:", gameState);

// 在组件中
import { watch } from "vue";
watch(
  () => gameState.value,
  (newVal) => {
    console.log("Game State Changed:", newVal);
  },
);
```

#### 后端调试

```typescript
// 服务器日志
console.log("Player joined:", socket.id);

// 使用调试器
import debug from "debug";
const gameDebug = debug("doudizhu:game");
gameDebug("Game started");
```

#### Socket.IO 调试

```typescript
// 启用调试
localStorage.debug = "*";

// 监听所有事件
socket.onAny((eventName, ...args) => {
  console.log(`Event: ${eventName}`, args);
});
```

### 3. 测试策略

#### 单元测试

```typescript
// 测试牌型判断
import { getCardType, CardType } from "@shared/game/cards";

test("should identify single card", () => {
  const cards = [{ value: 3, suit: 0 }];
  const result = getCardType(cards);
  expect(result.type).toBe(CardType.Single);
  expect(result.valid).toBe(true);
});
```

#### 集成测试

```typescript
// 测试游戏流程
test("should complete a full game", async () => {
  const game = new GameEngine("test-room", players);
  game.startGame();

  // 叫地主
  expect(game.bid(player1Id, 3)).toBe(true);

  // 出牌
  expect(game.playCards(player1Id, cards)).toBe(true);

  // 检查胜负
  expect(game.getState().phase).toBe("ended");
});
```

## 性能优化

### 前端优化

1. **虚拟列表**: 处理大量卡牌
2. **代码分割**: 按路由懒加载
3. **图片优化**: 使用 WebP 格式
4. **缓存**: 利用浏览器缓存

### 后端优化

1. **连接池**: 数据库连接池
2. **消息队列**: 处理高并发
3. **Redis缓存**: 缓存游戏状态
4. **WebSocket压缩**: 启用压缩

### 网络优化

1. **消息压缩**: 使用 gzip
2. **增量更新**: 只发送变化的数据
3. **心跳机制**: 检测断线
4. **重连策略**: 自动重连

## 安全考虑

### 前端安全

1. **XSS防护**: Vue自动转义
2. **CSRF防护**: Token验证
3. **输入验证**: 客户端验证

### 后端安全

1. **输入验证**: 服务器端验证
2. **权限控制**: 玩家只能操作自己的牌
3. **速率限制**: 防止DDOS
4. **数据加密**: WebSocket使用WSS

## 部署指南

### 开发环境

```bash
npm run dev
```

### 生产环境

```bash
# 构建
npm run build

# 启动
npm run start:server

# 使用 PM2
pm2 start server/dist/server.js --name doudizhu-server
```

### Docker部署

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:server"]
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 常见问题

### Q: 如何添加新的牌型？

A:

1. 在 `shared/src/types/game.ts` 添加牌型枚举
2. 在 `shared/src/game/cards.ts` 实现牌型判断逻辑
3. 在 `shared/src/game/engine.ts` 添加相关验证

### Q: 如何优化卡牌动画性能？

A:

1. 使用 CSS transform 而非 top/left
2. 使用 requestAnimationFrame
3. 减少重绘和回流

### Q: 如何处理断线重连？

A:

1. 监听 disconnect 事件
2. 保存玩家状态到Redis
3. 重连时恢复状态
4. 同步最新游戏状态

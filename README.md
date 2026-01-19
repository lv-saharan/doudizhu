# 🃏 斗地主网页版游戏

一个基于 Vue 3 + Node.js + Socket.IO 的多人在线斗地主游戏。

## 📋 技术栈

### 前端

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **实时通信**: Socket.IO Client
- **动画**: GSAP

### 后端

- **运行时**: Node.js
- **框架**: Express
- **实时通信**: Socket.IO
- **数据存储**: 内存存储（游戏状态）

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
# 安装所有项目依赖
npm install

# 或者分别安装
cd client && npm install
cd ../server && npm install
cd ../shared && npm install
```

### 启动开发服务器

```bash
# 同时启动前端和后端
npm run dev

# 或者分别启动
npm run dev:client  # 前端运行在 http://localhost:3000
npm run dev:server # 后端运行在 http://localhost:3001
```

### 构建生产版本

```bash
# 构建所有项目
npm run build

# 或者分别构建
npm run build:client
npm run build:server
```

## 📁 项目结构

```
doudizhu/
├── client/                 # 前端代码
│   ├── src/
│   │   ├── components/     # Vue组件
│   │   ├── views/          # 页面视图
│   │   ├── stores/         # Pinia状态管理
│   │   ├── router/         # 路由配置
│   │   └── main.ts         # 入口文件
│   ├── index.html
│   └── vite.config.ts
├── server/                 # 后端代码
│   ├── src/
│   │   ├── socket/         # Socket.IO处理
│   │   ├── managers/       # 游戏和房间管理
│   │   └── server.ts       # 服务器入口
│   └── tsconfig.json
└── shared/                 # 共享代码
    ├── src/
    │   ├── types/          # TypeScript类型定义
    │   ├── game/           # 游戏逻辑
    │   └── index.ts
    └── tsconfig.json
```

## 🎮 游戏功能

### 已实现

- ✅ 项目基础架构
- ✅ 前端Vue 3 + Vite框架
- ✅ 后端Express + Socket.IO
- ✅ 卡牌类和牌型判断
- ✅ 游戏核心逻辑引擎
- ✅ 房间管理系统
- ✅ 基础UI组件

### 开发中

- 🚧 实时游戏同步
- 🚧 完整的游戏流程
- 🚧 动画效果
- 🚧 AI对手

### 计划中

- 📋 排行榜系统
- 📋 游戏内聊天
- 📋 皮肤和主题
- 📋 数据统计

## 🎯 开发路线图

### 第一阶段：基础框架 ✅

- 项目初始化
- 前后端框架搭建
- 基础UI组件

### 第二阶段：核心游戏逻辑 🚧

- 牌型判断算法
- 游戏流程控制
- 单机版本

### 第三阶段：多人实时功能

- 房间管理
- 实时同步
- 网络优化

### 第四阶段：UI/UX完善

- 动画效果
- 音效系统
- 响应式设计

### 第五阶段：测试和部署

- 功能测试
- 性能测试
- 生产部署

## 🛠️ 开发工具

```bash
# 代码格式化
npm run format

# 代码检查
npm run lint
```

## 📝 游戏规则

### 基本规则

1. **牌数**: 54张牌（含大小王）
2. **发牌**: 每人17张，底牌3张
3. **叫地主**: 玩家轮流叫分，最高分者成为地主
4. **出牌**: 支持单张、对子、三张、顺子、炸弹等牌型
5. **胜负**: 地主先出完牌则地主胜，农民先出完则农民胜

### 牌型说明

- **单张**: 任意一张牌
- **对子**: 两张相同数值的牌
- **三张**: 三张相同数值的牌
- **三带一**: 三张相同数值 + 一张任意牌
- **三带二**: 三张相同数值 + 一对
- **顺子**: 五张及以上连续单牌（不含2和王）
- **连对**: 三对及以上连续对子
- **炸弹**: 四张相同数值的牌
- **王炸**: 大小王各一张

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

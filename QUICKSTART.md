# 🚀 快速启动指南

## 1️⃣ 环境准备

确保你已经安装了以下软件：

- **Node.js**: 版本 18 或更高 ([下载地址](https://nodejs.org/))
- **npm**: 随 Node.js 一起安装

检查版本：

```bash
node --version
npm --version
```

## 2️⃣ 安装依赖

在项目根目录下运行：

```bash
npm install
```

这将安装所有子项目的依赖（client、server、shared）。

## 3️⃣ 配置环境变量

复制环境变量模板文件：

```bash
cp .env.example .env
```

## 4️⃣ 启动项目

### 开发模式（推荐）

在项目根目录运行：

```bash
npm run dev
```

这将同时启动：

- **前端**: http://localhost:3000
- **后端**: http://localhost:3001

### 分别启动

如果需要单独启动前端或后端：

```bash
# 仅启动前端
npm run dev:client

# 仅启动后端
npm run dev:server
```

## 5️⃣ 开始游戏

1. 打开浏览器访问 http://localhost:3000
2. 创建一个房间或加入现有房间
3. 等待其他玩家加入（需要3名玩家）
4. 点击"开始游戏"
5. 叫地主、出牌，享受游戏！

## 🎮 当前功能状态

### ✅ 已完成

- 项目基础架构
- Vue 3 前端框架
- Express 后端服务器
- Socket.IO 实时通信
- 卡牌系统（发牌、排序）
- 牌型判断（单张、对子、三张、顺子等）
- 游戏引擎核心逻辑
- 房间管理系统
- 基础UI界面

### 🚧 开发中

- 完整的游戏流程（叫地主、出牌）
- 玩家操作验证
- 游戏状态同步
- 胜负判定
- AI对手

### 📋 计划中

- 动画效果
- 音效系统
- 排行榜
- 数据持久化
- 用户认证

## 🔧 常见问题

### Q: 启动失败，提示端口已被占用

A: 修改 `server/.env` 中的 `PORT` 配置

### Q: 前端无法连接后端

A:

1. 确保后端服务器正在运行
2. 检查 CORS 配置
3. 查看浏览器控制台和网络请求

### Q: 游戏卡顿或断线

A:

1. 检查网络连接
2. 查看服务器日志
3. 重启服务器

## 📝 开发命令

```bash
# 代码格式化
npm run format

# 代码检查
npm run lint

# 构建生产版本
npm run build

# 前端构建
npm run build:client

# 后端构建
npm run build:server
```

## 🛠️ 调试

### 前端调试

- 使用 Chrome DevTools (F12)
- 查看 Vue DevTools 扩展
- 查看控制台日志

### 后端调试

- 查看终端日志输出
- 使用 VS Code 调试器
- 设置断点调试

## 📖 进一步学习

- [Vue 3 文档](https://vuejs.org/)
- [Socket.IO 文档](https://socket.io/docs/)
- [Express 文档](https://expressjs.com/)
- [TypeScript 文档](https://www.typescriptlang.org/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，请创建 Issue 或联系项目维护者。

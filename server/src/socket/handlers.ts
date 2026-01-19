import { Server, Socket } from "socket.io";
import { RoomManager } from "../managers/RoomManager";
import { GameManager } from "../managers/GameManager";
import { Player } from "@shared/types/game";

const roomManager = new RoomManager();
const gameManager = new GameManager();

export function setupSocketHandlers(io: Server): void {
  io.on("connection", (socket: Socket) => {
    console.log(`玩家连接: ${socket.id}`);

    // 加入房间
    socket.on("join-room", (data: { roomId: string; playerName: string }) => {
      try {
        const { roomId, playerName } = data;
        const player: Player = {
          id: socket.id,
          name: playerName,
          cards: [],
          score: 0,
          isLandlord: false,
        };

        const room = roomManager.addPlayerToRoom(roomId, player);

        // 加入Socket.IO房间
        socket.join(roomId);

        // 发送房间信息
        io.to(roomId).emit("room-updated", room);

        // 发送游戏状态（如果有）
        if (room.gameState) {
          socket.emit("game-state", room.gameState);
        }

        console.log(`玩家 ${playerName} 加入房间 ${roomId}`);
      } catch (error) {
        console.error("加入房间失败:", error);
        socket.emit("error", "加入房间失败");
      }
    });

    // 创建房间
    socket.on(
      "create-room",
      (data: { roomName: string; playerName: string }) => {
        try {
          const { roomName, playerName } = data;
          const player: Player = {
            id: socket.id,
            name: playerName,
            cards: [],
            score: 0,
            isLandlord: false,
          };

          const room = roomManager.createRoom(roomName, player);
          const roomId = room.id;

          // 加入Socket.IO房间
          socket.join(roomId);

          // 发送房间信息
          io.to(roomId).emit("room-updated", room);

          console.log(`玩家 ${playerName} 创建房间 ${roomId}`);
        } catch (error) {
          console.error("创建房间失败:", error);
          socket.emit("error", "创建房间失败");
        }
      },
    );

    // 开始游戏
    socket.on("start-game", (data: { roomId: string }) => {
      try {
        const { roomId } = data;
        const room = roomManager.getRoom(roomId);

        if (!room) {
          socket.emit("error", "房间不存在");
          return;
        }

        if (room.players.length !== 3) {
          socket.emit("error", "需要3名玩家才能开始游戏");
          return;
        }

        if (room.gameState) {
          socket.emit("error", "游戏已开始");
          return;
        }

        // 创建游戏
        const game = gameManager.createGame(roomId, room.players);
        room.gameState = game.getState();

        // 更新房间
        roomManager.updateRoom(room);

        // 通知所有玩家
        io.to(roomId).emit("game-started", {
          roomId,
          gameState: room.gameState,
        });

        // 发送每个玩家的可见状态
        room.players.forEach((player: Player) => {
          io.to(player.id).emit("game-state", game.getVisibleState(player.id));
        });

        // 发送每个玩家的可见状态
        room.players.forEach((player) => {
          io.to(player.id).emit("game-state", game.getVisibleState(player.id));
        });

        console.log(`房间 ${roomId} 游戏开始`);
      } catch (error) {
        console.error("开始游戏失败:", error);
        socket.emit("error", "开始游戏失败");
      }
    });

    // 叫地主
    socket.on("bid", (data: { roomId: string; score: number }) => {
      try {
        const { roomId, score } = data;
        const room = roomManager.getRoom(roomId);

        if (!room || !room.gameState) {
          socket.emit("error", "游戏不存在");
          return;
        }

        const game = gameManager.getGame(roomId);
        if (!game) {
          socket.emit("error", "游戏不存在");
          return;
        }

        // 叫地主
        const success = game.bid(socket.id, score);
        if (!success) {
          socket.emit("error", "叫地主失败");
          return;
        }

        // 更新房间游戏状态
        room.gameState = game.getState();
        roomManager.updateRoom(room);

        // 通知所有玩家
        io.to(roomId).emit("game-event", {
          type: "player-bid",
          data: {
            playerId: socket.id,
            score,
          },
          timestamp: Date.now(),
        });

        // 发送每个玩家的可见状态
        room.players.forEach((player) => {
          io.to(player.id).emit("game-state", game.getVisibleState(player.id));
        });

        console.log(`玩家 ${socket.id} 叫地主: ${score}`);
      } catch (error) {
        console.error("叫地主失败:", error);
        socket.emit("error", "叫地主失败");
      }
    });

    // 出牌
    socket.on("play-cards", (data: { roomId: string; cards: any[] }) => {
      try {
        const { roomId, cards } = data;
        const room = roomManager.getRoom(roomId);

        if (!room || !room.gameState) {
          socket.emit("error", "游戏不存在");
          return;
        }

        const game = gameManager.getGame(roomId);
        if (!game) {
          socket.emit("error", "游戏不存在");
          return;
        }

        // 出牌
        const success = game.playCards(socket.id, cards);
        if (!success) {
          socket.emit("error", "出牌无效");
          return;
        }

        // 更新房间游戏状态
        room.gameState = game.getState();
        roomManager.updateRoom(room);

        // 通知所有玩家
        io.to(roomId).emit("game-event", {
          type: "player-played",
          data: {
            playerId: socket.id,
            cards,
          },
          timestamp: Date.now(),
        });

        // 发送每个玩家的可见状态
        room.players.forEach((player) => {
          io.to(player.id).emit("game-state", game.getVisibleState(player.id));
        });

        console.log(`玩家 ${socket.id} 出牌`);
      } catch (error) {
        console.error("出牌失败:", error);
        socket.emit("error", "出牌失败");
      }
    });

    // 不出
    socket.on("pass", (data: { roomId: string }) => {
      try {
        const { roomId } = data;
        const room = roomManager.getRoom(roomId);

        if (!room || !room.gameState) {
          socket.emit("error", "游戏不存在");
          return;
        }

        const game = gameManager.getGame(roomId);
        if (!game) {
          socket.emit("error", "游戏不存在");
          return;
        }

        // 不出
        const success = game.pass(socket.id);
        if (!success) {
          socket.emit("error", "无法不出");
          return;
        }

        // 更新房间游戏状态
        room.gameState = game.getState();
        roomManager.updateRoom(room);

        // 发送每个玩家的可见状态
        room.players.forEach((player) => {
          io.to(player.id).emit("game-state", game.getVisibleState(player.id));
        });

        console.log(`玩家 ${socket.id} 不出`);
      } catch (error) {
        console.error("不出失败:", error);
        socket.emit("error", "不出失败");
      }
    });

    // 断开连接
    socket.on("disconnect", () => {
      console.log(`玩家断开连接: ${socket.id}`);

      // 从所有房间中移除玩家
      const rooms = roomManager.getRooms();
      rooms.forEach((room) => {
        const playerIndex = room.players.findIndex((p) => p.id === socket.id);
        if (playerIndex > -1) {
          room.players.splice(playerIndex, 1);
          roomManager.updateRoom(room);

          // 通知房间内的其他玩家
          io.to(room.id).emit("room-updated", room);
          io.to(room.id).emit("game-event", {
            type: "player-left",
            data: {
              playerId: socket.id,
              playerName: room.players[playerIndex]?.name || "Unknown",
            },
            timestamp: Date.now(),
          });

          console.log(`玩家 ${socket.id} 离开房间 ${room.id}`);
        }
      });
    });

    // 获取房间列表
    socket.on("get-rooms", () => {
      const rooms = roomManager.getRooms();
      socket.emit("rooms-list", rooms);
    });
  });
}

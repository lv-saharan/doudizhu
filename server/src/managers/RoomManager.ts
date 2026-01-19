import { Room, Player } from "../../shared/types/game";

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  // 创建房间
  createRoom(name: string, creator: Player): Room {
    const roomId = this.generateRoomId();

    const room: Room = {
      id: roomId,
      name,
      players: [creator],
      maxPlayers: 3,
      gameState: null,
      createdAt: Date.now(),
    };

    this.rooms.set(roomId, room);
    return room;
  }

  // 获取房间
  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  // 添加玩家到房间
  addPlayerToRoom(roomId: string, player: Player): Room {
    const room = this.rooms.get(roomId);

    if (!room) {
      throw new Error("房间不存在");
    }

    if (room.players.length >= room.maxPlayers) {
      throw new Error("房间已满");
    }

    if (room.players.some((p) => p.id === player.id)) {
      throw new Error("玩家已在房间中");
    }

    room.players.push(player);
    return room;
  }

  // 更新房间
  updateRoom(room: Room): void {
    this.rooms.set(room.id, room);
  }

  // 删除房间
  deleteRoom(roomId: string): boolean {
    return this.rooms.delete(roomId);
  }

  // 获取所有房间
  getRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  // 清理空房间
  cleanupEmptyRooms(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24小时

    this.rooms.forEach((room, roomId) => {
      // 删除空房间或超过24小时且没有游戏的房间
      if (
        room.players.length === 0 ||
        (now - room.createdAt > maxAge && !room.gameState)
      ) {
        this.rooms.delete(roomId);
        console.log(`清理房间: ${roomId}`);
      }
    });
  }

  // 生成房间ID
  private generateRoomId(): string {
    let roomId;
    do {
      roomId = Math.random().toString(36).substr(2, 6).toUpperCase();
    } while (this.rooms.has(roomId));
    return roomId;
  }

  // 定期清理
  startCleanup(interval: number = 60 * 60 * 1000): void {
    setInterval(() => {
      this.cleanupEmptyRooms();
    }, interval);
  }
}

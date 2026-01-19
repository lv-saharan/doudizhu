import { GameEngine } from "../../shared/src/game/engine";
import { Player, GameState } from "../../shared/types/game";

export class GameManager {
  private games: Map<string, GameEngine> = new Map();

  // 创建游戏
  createGame(roomId: string, players: Player[]): GameEngine {
    const game = new GameEngine(roomId, players);
    game.startGame();
    this.games.set(roomId, game);
    return game;
  }

  // 获取游戏
  getGame(roomId: string): GameEngine | undefined {
    return this.games.get(roomId);
  }

  // 删除游戏
  deleteGame(roomId: string): boolean {
    return this.games.delete(roomId);
  }

  // 获取游戏状态
  getGameState(roomId: string): GameState | undefined {
    const game = this.games.get(roomId);
    return game?.getState();
  }

  // 清理已结束的游戏
  cleanupEndedGames(): void {
    const now = Date.now();
    const maxAge = 1 * 60 * 60 * 1000; // 1小时

    this.games.forEach((game, roomId) => {
      const state = game.getState();

      // 删除已结束超过1小时的游戏
      if (state.phase === "ended" && now - state.updatedAt > maxAge) {
        this.games.delete(roomId);
        console.log(`清理已结束的游戏: ${roomId}`);
      }
    });
  }

  // 定期清理
  startCleanup(interval: number = 30 * 60 * 1000): void {
    setInterval(() => {
      this.cleanupEndedGames();
    }, interval);
  }
}

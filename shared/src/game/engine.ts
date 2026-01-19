import {
  GameState,
  Player,
  GamePhase,
  Card,
  CardValue,
  Suit,
  Play,
  CardType,
} from "../types/game";
import {
  createDeck,
  shuffle,
  dealCards,
  sortCards,
  getCardType,
  canBeat,
} from "./cards";

export class GameEngine {
  private state: GameState;

  constructor(roomId: string, players: Player[]) {
    this.state = {
      id: `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      roomId,
      phase: GamePhase.Waiting,
      players: players.map((p) => ({
        ...p,
        cards: [],
        score: 0,
        isLandlord: false,
      })),
      landlord: null,
      currentTurn: null,
      lastPlay: null,
      bottomCards: [],
      deck: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  // 开始游戏
  startGame(): void {
    const deck = shuffle(createDeck());
    const { players: playerCards, bottomCards } = dealCards(deck);

    // 分发手牌
    playerCards.forEach((cards, index) => {
      this.state.players[index].cards = cards;
    });

    this.state.bottomCards = bottomCards;
    this.state.deck = deck;
    this.state.phase = GamePhase.Bidding;
    this.state.currentTurn = 0; // 从第一个玩家开始叫地主
    this.state.updatedAt = Date.now();
  }

  // 叫地主
  bid(playerId: string, score: number): boolean {
    const playerIndex = this.state.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) return false;
    if (playerIndex !== this.state.currentTurn) return false;
    if (this.state.phase !== GamePhase.Bidding) return false;

    // 简化的叫地主逻辑：第一个叫3分的直接成为地主
    // 实际应该记录每个玩家的叫分，最后比较

    if (score === 3) {
      this.setLandlord(playerIndex);
    } else {
      // 轮到下一个玩家
      this.state.currentTurn = (this.state.currentTurn + 1) % 3;
    }

    this.state.updatedAt = Date.now();
    return true;
  }

  // 设置地主
  setLandlord(playerIndex: number): void {
    this.state.landlord = playerIndex;
    this.state.players[playerIndex].isLandlord = true;

    // 将底牌给地主
    this.state.players[playerIndex].cards.push(...this.state.bottomCards);
    sortCards(this.state.players[playerIndex].cards);

    this.state.phase = GamePhase.Playing;
    this.state.currentTurn = playerIndex;
    this.state.updatedAt = Date.now();
  }

  // 出牌
  playCards(playerId: string, cards: Card[]): boolean {
    const playerIndex = this.state.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) return false;
    if (playerIndex !== this.state.currentTurn) return false;
    if (this.state.phase !== GamePhase.Playing) return false;

    const player = this.state.players[playerIndex];

    // 验证手牌
    const cardIds = new Set(player.cards.map((c) => c.id));
    const hasAllCards = cards.every((c) => cardIds.has(c.id));
    if (!hasAllCards) return false;

    // 验证牌型
    const cardType = getCardType(cards);
    if (!cardType.valid) return false;

    // 验证是否可以大过上家
    if (this.state.lastPlay) {
      if (!canBeat(cards, this.state.lastPlay.cards)) {
        return false;
      }
    }

    // 从玩家手牌中移除出的牌
    cards.forEach((card) => {
      const cardIndex = player.cards.findIndex((c) => c.id === card.id);
      if (cardIndex > -1) {
        player.cards.splice(cardIndex, 1);
      }
    });

    // 记录出牌
    this.state.lastPlay = {
      playerId,
      cards,
      type: cardType.type,
    };

    // 检查是否获胜
    if (player.cards.length === 0) {
      this.state.phase = GamePhase.Ended;
      // TODO: 计算得分
    } else {
      // 轮到下一个玩家
      this.state.currentTurn = (this.state.currentTurn + 1) % 3;
    }

    this.state.updatedAt = Date.now();
    return true;
  }

  // 不出
  pass(playerId: string): boolean {
    const playerIndex = this.state.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) return false;
    if (playerIndex !== this.state.currentTurn) return false;
    if (this.state.phase !== GamePhase.Playing) return false;

    // 如果是本轮第一次出牌，不能不出
    if (!this.state.lastPlay) return false;

    // 检查玩家是否有可以出的牌
    const player = this.state.players[playerIndex];
    const canPlay = this.findPlayableCards(
      player.cards,
      this.state.lastPlay.cards,
    );
    if (canPlay.length > 0) {
      return false; // 有可出的牌，不能不出
    }

    // 轮到下一个玩家
    this.state.currentTurn = (this.state.currentTurn + 1) % 3;

    // 如果轮了两圈回到同一个玩家，清除上家出牌记录
    if (this.state.currentTurn === this.state.lastPlay?.playerId) {
      this.state.lastPlay = null;
    }

    this.state.updatedAt = Date.now();
    return true;
  }

  // 查找可出的牌
  private findPlayableCards(hand: Card[], lastPlay: Card[]): Card[] {
    // 简化实现：只检查单张
    // 实际应该检查所有可能的牌型

    const lastType = getCardType(lastPlay);
    if (!lastType.valid) return [];

    // 如果是单张
    if (lastType.type === CardType.Single) {
      const biggerCards = hand.filter((c) => c.value > lastType.rank);
      if (biggerCards.length > 0) {
        return [biggerCards[0]];
      }
    }

    return [];
  }

  // 获取游戏状态
  getState(): GameState {
    return this.state;
  }

  // 获取某个玩家可见的游戏状态 (隐藏其他玩家的手牌)
  getVisibleState(playerId: string): GameState {
    const playerIndex = this.state.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) {
      return this.state;
    }

    const visibleState = { ...this.state };
    visibleState.players = this.state.players.map((p, index) => {
      if (index === playerIndex) {
        return { ...p };
      } else {
        return { ...p, cards: [] }; // 隐藏其他玩家的手牌
      }
    });

    return visibleState;
  }
}

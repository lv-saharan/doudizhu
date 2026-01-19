// 卡牌花色
export enum Suit {
  Spades = 0, // 黑桃
  Hearts = 1, // 红桃
  Clubs = 2, // 梅花
  Diamonds = 3, // 方块
}

// 卡牌值
export enum CardValue {
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
  Jack = 11,
  Queen = 12,
  King = 13,
  Ace = 14,
  Two = 15,
  SmallJoker = 16,
  BigJoker = 17,
}

// 牌型
export enum CardType {
  Single = "single", // 单张
  Pair = "pair", // 对子
  Triple = "triple", // 三张
  TripleWithOne = "triple-with-one", // 三带一
  TripleWithTwo = "triple-with-two", // 三带二
  Straight = "straight", // 顺子
  ConsecutivePairs = "consecutive-pairs", // 连对
  Airplane = "airplane", // 飞机
  AirplaneWithSingles = "airplane-with-singles", // 飞机带单
  AirplaneWithPairs = "airplane-with-pairs", // 飞机带对
  Bomb = "bomb", // 炸弹
  Rocket = "rocket", // 王炸
}

// 游戏阶段
export enum GamePhase {
  Waiting = "waiting",
  Bidding = "bidding",
  Playing = "playing",
  Ended = "ended",
}

// 卡牌接口
export interface Card {
  id: string;
  value: CardValue;
  suit: Suit;
}

// 玩家接口
export interface Player {
  id: string;
  name: string;
  cards: Card[];
  score: number;
  isLandlord: boolean;
}

// 出牌
export interface Play {
  playerId: string;
  cards: Card[];
  type: CardType;
}

// 游戏状态
export interface GameState {
  id: string;
  roomId: string;
  phase: GamePhase;
  players: Player[];
  landlord: number | null;
  currentTurn: number | null;
  lastPlay: Play | null;
  bottomCards: Card[];
  deck: Card[];
  createdAt: number;
  updatedAt: number;
}

// 房间信息
export interface Room {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  gameState: GameState | null;
  createdAt: number;
}

// 游戏事件
export interface GameEvent {
  type:
    | "player-joined"
    | "player-left"
    | "game-started"
    | "player-bid"
    | "player-played"
    | "game-ended";
  data: any;
  timestamp: number;
}

// 叫地主事件
export interface BidEvent extends GameEvent {
  type: "player-bid";
  data: {
    playerId: string;
    score: number;
  };
}

// 出牌事件
export interface PlayedEvent extends GameEvent {
  type: "player-played";
  data: {
    playerId: string;
    cards: Card[];
  };
}

// 游戏结束事件
export interface GameEndedEvent extends GameEvent {
  type: "game-ended";
  data: {
    winnerId: string;
    isLandlordWin: boolean;
    scores: { playerId: string; score: number }[];
  };
}

import { Card, CardValue, Suit, CardType } from "../types/game";

export class CardClass implements Card {
  id: string;
  value: CardValue;
  suit: Suit;

  constructor(value: CardValue, suit: Suit) {
    this.value = value;
    this.suit = suit;
    this.id = `${suit}-${value}`;
  }

  // 获取卡牌显示文本
  getDisplay(): string {
    if (this.value === CardValue.SmallJoker) return "小王";
    if (this.value === CardValue.BigJoker) return "大王";

    const values = [
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
      "2",
    ];
    return values[this.value - 3] || "?";
  }

  // 获取花色符号
  getSuitSymbol(): string {
    const suits = ["♠", "♥", "♣", "♦"];
    return suits[this.suit] || "";
  }

  // 是否为红色花色
  isRed(): boolean {
    return this.suit === Suit.Hearts || this.suit === Suit.Diamonds;
  }

  // 比较卡牌大小
  compareTo(other: Card): number {
    return this.value - other.value;
  }

  // 判断是否为王牌
  isJoker(): boolean {
    return (
      this.value === CardValue.SmallJoker || this.value === CardValue.BigJoker
    );
  }
}

// 创建完整的一副牌
export function createDeck(): Card[] {
  const deck: Card[] = [];

  // 普通牌 (3-A, 2)
  for (let value = CardValue.Three; value <= CardValue.Two; value++) {
    for (let suit = Suit.Spades; suit <= Suit.Diamonds; suit++) {
      deck.push(new CardClass(value, suit));
    }
  }

  // 大小王
  deck.push(new CardClass(CardValue.SmallJoker, Suit.Spades));
  deck.push(new CardClass(CardValue.BigJoker, Suit.Spades));

  return deck;
}

// 洗牌
export function shuffle(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 发牌
export function dealCards(deck: Card[]): {
  players: Card[][];
  bottomCards: Card[];
} {
  const players: Card[][] = [[], [], []];
  const bottomCards = deck.slice(0, 3);

  const dealingCards = deck.slice(3);

  dealingCards.forEach((card, index) => {
    players[index % 3].push(card);
  });

  // 对每个玩家的手牌进行排序
  players.forEach((hand) => {
    sortCards(hand);
  });

  return { players, bottomCards };
}

// 对手牌进行排序 (从大到小)
export function sortCards(cards: Card[]): void {
  cards.sort((a, b) => b.value - a.value);
}

// 获取卡牌的牌型和相关信息
export function getCardType(cards: Card[]): {
  type: CardType;
  rank: number;
  valid: boolean;
} {
  const len = cards.length;

  if (len === 0) {
    return { type: CardType.Single, rank: 0, valid: false };
  }

  sortCards(cards);

  // 单张
  if (len === 1) {
    return { type: CardType.Single, rank: cards[0].value, valid: true };
  }

  // 对子
  if (len === 2) {
    if (
      cards[0].value === CardValue.SmallJoker &&
      cards[1].value === CardValue.BigJoker
    ) {
      return { type: CardType.Rocket, rank: 100, valid: true }; // 王炸
    }
    if (cards[0].value === cards[1].value) {
      return { type: CardType.Pair, rank: cards[0].value, valid: true };
    }
  }

  // 三张
  if (len === 3) {
    if (cards[0].value === cards[2].value) {
      return { type: CardType.Triple, rank: cards[0].value, valid: true };
    }
  }

  // 三带一
  if (len === 4) {
    // 检查是否为炸弹
    if (cards[0].value === cards[3].value) {
      return { type: CardType.Bomb, rank: cards[0].value, valid: true };
    }

    // 检查三带一
    if (cards[0].value === cards[2].value) {
      return {
        type: CardType.TripleWithOne,
        rank: cards[0].value,
        valid: true,
      };
    }
    if (cards[1].value === cards[3].value) {
      return {
        type: CardType.TripleWithOne,
        rank: cards[1].value,
        valid: true,
      };
    }
  }

  // 三带二
  if (len === 5) {
    // 检查三带二 (三个带两个)
    if (
      cards[0].value === cards[2].value &&
      cards[3].value === cards[4].value
    ) {
      return {
        type: CardType.TripleWithTwo,
        rank: cards[0].value,
        valid: true,
      };
    }
    if (
      cards[0].value === cards[1].value &&
      cards[2].value === cards[4].value
    ) {
      return {
        type: CardType.TripleWithTwo,
        rank: cards[2].value,
        valid: true,
      };
    }

    // 检查顺子 (5张连续单牌)
    if (isStraight(cards)) {
      return { type: CardType.Straight, rank: cards[0].value, valid: true };
    }
  }

  // 顺子 (6张及以上)
  if (len >= 6) {
    if (isStraight(cards)) {
      return { type: CardType.Straight, rank: cards[0].value, valid: true };
    }
  }

  // 连对 (3对及以上，6张及以上)
  if (len >= 6 && len % 2 === 0) {
    if (isConsecutivePairs(cards)) {
      return {
        type: CardType.ConsecutivePairs,
        rank: cards[0].value,
        valid: true,
      };
    }
  }

  return { type: CardType.Single, rank: 0, valid: false };
}

// 判断是否为顺子
function isStraight(cards: Card[]): boolean {
  // 顺子不能包含2和王
  if (cards.some((c) => c.value >= CardValue.Two)) {
    return false;
  }

  // 检查是否连续
  for (let i = 0; i < cards.length - 1; i++) {
    if (cards[i].value - cards[i + 1].value !== 1) {
      return false;
    }
  }

  return true;
}

// 判断是否为连对
function isConsecutivePairs(cards: Card[]): boolean {
  // 连对不能包含2和王
  if (cards.some((c) => c.value >= CardValue.Two)) {
    return false;
  }

  // 检查是否都是成对的
  for (let i = 0; i < cards.length; i += 2) {
    if (cards[i].value !== cards[i + 1].value) {
      return false;
    }
  }

  // 检查是否连续
  for (let i = 0; i < cards.length - 2; i += 2) {
    if (cards[i].value - cards[i + 2].value !== 1) {
      return false;
    }
  }

  return true;
}

// 判断是否可以出牌 (比较牌型和大牌)
export function canBeat(currentPlay: Card[], lastPlay: Card[]): boolean {
  const currentType = getCardType(currentPlay);
  const lastType = getCardType(lastPlay);

  if (!currentType.valid) return false;
  if (!lastType.valid) return false;

  // 王炸最大
  if (currentType.type === CardType.Rocket) return true;
  if (lastType.type === CardType.Rocket) return false;

  // 炸弹可以大过任何非炸弹
  if (currentType.type === CardType.Bomb && lastType.type !== CardType.Bomb) {
    return true;
  }

  // 同类型的比较
  if (currentType.type === lastType.type) {
    // 牌数必须相同
    if (currentPlay.length !== lastPlay.length) return false;

    // 比较大小
    return currentType.rank > lastType.rank;
  }

  return false;
}

// 获取可以打过上家的牌型
export function getBeatingCards(hand: Card[], lastPlay: Card[]): Card[][] {
  const possiblePlays: Card[][] = [];
  const lastType = getCardType(lastPlay);

  if (!lastType.valid) return possiblePlays;

  // 如果上家出了王炸，无法大过
  if (lastType.type === CardType.Rocket) return possiblePlays;

  // 尝试寻找能打过的牌
  // 这里简化实现，只返回一个示例
  // 实际应该返回所有可能的出牌组合

  return possiblePlays;
}

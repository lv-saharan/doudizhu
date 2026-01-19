<template>
  <div class="game-container">
    <div class="game-table">
      <!-- Top player (player 2) -->
      <div class="player-area top-player">
        <div class="player-info">
          <div class="player-avatar">👤</div>
          <div class="player-details">
            <span class="player-name">{{
              gameStore.players[2]?.name || "等待中..."
            }}</span>
            <span class="player-cards-count">{{
              gameStore.players[2]?.cards.length || 0
            }}</span>
            <span v-if="gameStore.landlord === 2" class="landlord-badge"
              >地主</span
            >
          </div>
        </div>
      </div>

      <!-- Middle section -->
      <div class="middle-section">
        <!-- Left player (player 1) -->
        <div class="player-area left-player">
          <div class="player-info vertical">
            <div class="player-avatar">👤</div>
            <div class="player-details">
              <span class="player-name">{{
                gameStore.players[1]?.name || "等待中..."
              }}</span>
              <span class="player-cards-count">{{
                gameStore.players[1]?.cards.length || 0
              }}</span>
              <span v-if="gameStore.landlord === 1" class="landlord-badge"
                >地主</span
              >
            </div>
          </div>
        </div>

        <!-- Play area -->
        <div class="play-area">
          <div class="bottom-cards">
            <span class="label">底牌</span>
            <div class="cards-display">
              <div v-if="gameStore.gameState?.bottomCards" class="mini-cards">
                <div
                  v-for="card in gameStore.gameState.bottomCards"
                  :key="card.id"
                  class="mini-card"
                >
                  {{ getCardDisplay(card) }}
                </div>
              </div>
              <div v-else class="placeholder">隐藏</div>
            </div>
          </div>

          <div class="played-cards">
            <div class="last-play">
              <span class="label">上家出牌</span>
              <div v-if="gameStore.lastPlay" class="cards-display">
                <div
                  v-for="card in gameStore.lastPlay.cards"
                  :key="card.id"
                  class="played-card"
                >
                  {{ getCardDisplay(card) }}
                </div>
              </div>
              <div v-else class="placeholder">无</div>
            </div>
          </div>
        </div>

        <!-- Right player (player 0) -->
        <div class="player-area right-player">
          <div class="player-info vertical">
            <div class="player-avatar">👤</div>
            <div class="player-details">
              <span class="player-name">{{
                gameStore.players[0]?.name || "等待中..."
              }}</span>
              <span class="player-cards-count">{{
                gameStore.players[0]?.cards.length || 0
              }}</span>
              <span v-if="gameStore.landlord === 0" class="landlord-badge"
                >地主</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom player (my player) -->
      <div class="player-area bottom-player">
        <div class="player-info">
          <div class="player-avatar">👤</div>
          <div class="player-details">
            <span class="player-name">{{
              gameStore.myPlayer?.name || "等待中..."
            }}</span>
            <span class="player-cards-count">{{
              gameStore.myPlayer?.cards.length || 0
            }}</span>
            <span
              v-if="gameStore.landlord === currentTurn"
              class="turn-indicator"
              >出牌中</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- My cards -->
    <div class="my-cards-area">
      <div class="cards-container">
        <div
          v-for="card in gameStore.myPlayer?.cards || []"
          :key="card.id"
          :class="['card', { selected: isSelected(card) }]"
          @click="toggleCardSelection(card)"
        >
          <div class="card-content">
            <div :class="['card-value', getCardSuitColor(card.suit)]">
              {{ getCardDisplay(card) }}
            </div>
            <div :class="['card-suit', getCardSuitColor(card.suit)]">
              {{ getSuitSymbol(card.suit) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Game controls -->
    <div class="game-controls">
      <div v-if="gameStore.isMyTurn" class="control-buttons">
        <button
          @click="playSelectedCards"
          :disabled="selectedCards.length === 0"
          class="control-btn play-btn"
        >
          出牌
        </button>
        <button @click="pass" class="control-btn pass-btn">不出</button>
        <button @click="hint" class="control-btn hint-btn">提示</button>
      </div>
      <div v-else class="waiting-message">
        <span>等待其他玩家...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGameStore } from "../stores/game";
import type { Card } from "@shared/types/game";

const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();

const selectedCards = ref<Card[]>([]);

const currentTurn = computed(() => gameStore.currentTurn);

function isSelected(card: Card): boolean {
  return selectedCards.value.some((c) => c.id === card.id);
}

function toggleCardSelection(card: Card) {
  const index = selectedCards.value.findIndex((c) => c.id === card.id);
  if (index > -1) {
    selectedCards.value.splice(index, 1);
  } else {
    selectedCards.value.push(card);
  }
}

function getCardDisplay(card: Card): string {
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
  if (card.value === 14) return "小王";
  if (card.value === 15) return "大王";
  return values[card.value - 3];
}

function getSuitSymbol(suit: number): string {
  const suits = ["♠", "♥", "♣", "♦"];
  return suits[suit] || "";
}

function getCardSuitColor(suit: number): string {
  return suit === 1 || suit === 3 ? "red" : "black";
}

function playSelectedCards() {
  if (selectedCards.value.length === 0) return;
  gameStore.playCards(selectedCards.value);
  selectedCards.value = [];
}

function pass() {
  gameStore.pass();
  selectedCards.value = [];
}

function hint() {
  // TODO: 实现提示功能
  alert("提示功能开发中...");
}
</script>

<style scoped>
.game-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  position: relative;
}

.game-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.player-area {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.top-player,
.bottom-player {
  height: 80px;
}

.left-player,
.right-player {
  width: 100px;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 15px;
  border-radius: 10px;
}

.player-info.vertical {
  flex-direction: column;
  text-align: center;
}

.player-avatar {
  font-size: 2rem;
}

.player-details {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.vertical .player-details {
  align-items: center;
}

.player-name {
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
}

.player-cards-count {
  color: #ccc;
  font-size: 0.8rem;
}

.landlord-badge {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
  color: #1a1a2e;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}

.turn-indicator {
  background: #44ff44;
  color: #1a1a2e;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.middle-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.play-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.bottom-cards,
.played-cards {
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
}

.label {
  display: block;
  color: #ccc;
  font-size: 0.8rem;
  margin-bottom: 10px;
}

.cards-display {
  display: flex;
  justify-content: center;
  gap: 5px;
  min-height: 60px;
}

.mini-card,
.played-card {
  background: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.mini-card {
  min-width: 40px;
  text-align: center;
}

.played-card {
  min-width: 50px;
  text-align: center;
}

.placeholder {
  color: #666;
  font-style: italic;
}

.my-cards-area {
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

.cards-container {
  display: flex;
  justify-content: center;
  gap: -20px;
  padding: 10px 0;
  overflow-x: auto;
}

.card {
  background: linear-gradient(135deg, #fff 0%, #f5f5f5 100%);
  width: 80px;
  height: 120px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid #ddd;
  margin-right: -20px;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.card.selected {
  transform: translateY(-20px);
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.card-content {
  text-align: center;
}

.card-value {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.card-suit {
  font-size: 1.2rem;
}

.card-value.red,
.card-suit.red {
  color: #ff4444;
}

.card-value.black,
.card-suit.black {
  color: #1a1a2e;
}

.game-controls {
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.control-btn {
  padding: 15px 40px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-btn {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
  color: #1a1a2e;
}

.play-btn:disabled {
  background: #666;
  color: #999;
  cursor: not-allowed;
}

.pass-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.hint-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 2px solid rgba(255, 215, 0, 0.5);
}

.control-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.waiting-message {
  text-align: center;
  color: #ccc;
  font-size: 1.1rem;
}
</style>

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { io, Socket } from "socket.io-client";
import type { GameState, Player, Card, GameEvent } from "@shared/types/game";

export const useGameStore = defineStore("game", () => {
  // State
  const socket = ref<Socket | null>(null);
  const isConnected = ref(false);
  const currentRoom = ref<string | null>(null);
  const gameState = ref<GameState | null>(null);
  const currentPlayerId = ref<string | null>(null);

  // Getters
  const players = computed(() => gameState.value?.players || []);
  const landlord = computed(() => gameState.value?.landlord || null);
  const currentTurn = computed(() => gameState.value?.currentTurn || null);
  const lastPlay = computed(() => gameState.value?.lastPlay || null);
  const isMyTurn = computed(() => {
    if (!currentPlayerId.value || currentTurn.value === null) return false;
    const playerIndex = players.value.findIndex(
      (p) => p.id === currentPlayerId.value,
    );
    return playerIndex === currentTurn.value;
  });
  const myPlayer = computed(() =>
    players.value.find((p) => p.id === currentPlayerId.value),
  );

  // Actions
  function connect() {
    if (socket.value?.connected) return;

    socket.value = io("http://localhost:3001", {
      transports: ["websocket", "polling"],
    });

    socket.value.on("connect", () => {
      console.log("Connected to game server");
      isConnected.value = true;
      currentPlayerId.value = socket.value?.id || null;
    });

    socket.value.on("disconnect", () => {
      console.log("Disconnected from game server");
      isConnected.value = false;
    });

    socket.value.on("game-state", (state: GameState) => {
      console.log("Game state updated:", state);
      gameState.value = state;
    });

    socket.value.on("game-event", (event: GameEvent) => {
      console.log("Game event:", event);
      handleGameEvent(event);
    });

    socket.value.on("error", (error: string) => {
      console.error("Game error:", error);
      alert(error);
    });
  }

  function disconnect() {
    socket.value?.disconnect();
    socket.value = null;
    isConnected.value = false;
  }

  function joinRoom(roomId: string, playerName: string) {
    if (!socket.value) return;
    socket.value.emit("join-room", { roomId, playerName });
    currentRoom.value = roomId;
  }

  function createRoom(roomName: string, playerName: string) {
    if (!socket.value) return;
    socket.value.emit("create-room", { roomName, playerName });
  }

  function startGame() {
    if (!socket.value || !currentRoom.value) return;
    socket.value.emit("start-game", { roomId: currentRoom.value });
  }

  function bid(score: number) {
    if (!socket.value || !currentRoom.value) return;
    socket.value.emit("bid", { roomId: currentRoom.value, score });
  }

  function playCards(cards: Card[]) {
    if (!socket.value || !currentRoom.value) return;
    socket.value.emit("play-cards", { roomId: currentRoom.value, cards });
  }

  function pass() {
    if (!socket.value || !currentRoom.value) return;
    socket.value.emit("pass", { roomId: currentRoom.value });
  }

  function handleGameEvent(event: GameEvent) {
    switch (event.type) {
      case "player-joined":
        console.log(`Player ${event.data.playerName} joined`);
        break;
      case "player-left":
        console.log(`Player ${event.data.playerName} left`);
        break;
      case "game-started":
        console.log("Game started!");
        break;
      case "player-bid":
        console.log(`Player ${event.data.playerId} bid ${event.data.score}`);
        break;
      case "player-played":
        console.log(`Player ${event.data.playerId} played cards`);
        break;
      case "game-ended":
        console.log(`Game ended! Winner: ${event.data.winnerId}`);
        break;
    }
  }

  return {
    // State
    socket,
    isConnected,
    currentRoom,
    gameState,
    currentPlayerId,

    // Getters
    players,
    landlord,
    currentTurn,
    lastPlay,
    isMyTurn,
    myPlayer,

    // Actions
    connect,
    disconnect,
    joinRoom,
    createRoom,
    startGame,
    bid,
    playCards,
    pass,
  };
});

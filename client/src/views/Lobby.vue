<template>
  <div class="lobby-container">
    <header class="lobby-header">
      <button @click="goHome" class="back-btn">← 返回</button>
      <h1 class="page-title">游戏大厅</h1>
      <div class="connection-status">
        <span
          :class="['status-dot', { connected: gameStore.isConnected }]"
        ></span>
        <span>{{ gameStore.isConnected ? "已连接" : "未连接" }}</span>
      </div>
    </header>

    <main class="lobby-content">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>正在加载房间列表...</p>
      </div>

      <div v-else-if="rooms.length === 0" class="empty-state">
        <div class="empty-icon">🎮</div>
        <p>暂无房间</p>
        <p class="hint">点击"创建房间"开始游戏</p>
      </div>

      <div v-else class="rooms-list">
        <div v-for="room in rooms" :key="room.id" class="room-card">
          <div class="room-info">
            <h3 class="room-name">{{ room.name }}</h3>
            <div class="room-details">
              <span class="room-id">房间号: {{ room.id }}</span>
              <span class="room-players">{{ room.players.length }}/3 玩家</span>
            </div>
          </div>
          <div class="room-actions">
            <button
              @click="joinRoom(room.id)"
              :disabled="room.players.length >= 3"
              class="join-btn"
            >
              {{ room.players.length >= 3 ? "已满" : "加入" }}
            </button>
          </div>
        </div>
      </div>

      <button @click="goHome" class="create-room-btn">
        <span class="btn-icon">➕</span>
        <span>创建新房间</span>
      </button>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "../stores/game";

const router = useRouter();
const gameStore = useGameStore();

const loading = ref(true);
const rooms = ref([
  {
    id: "123",
    name: "新手房",
    players: [
      { id: "1", name: "玩家1" },
      { id: "2", name: "玩家2" },
    ],
  },
]);

onMounted(() => {
  // 模拟加载房间列表
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});

function goHome() {
  router.push("/");
}

function joinRoom(roomId: string) {
  // TODO: 实现加入房间逻辑
  router.push(`/game/${roomId}`);
}
</script>

<style scoped>
.lobby-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.lobby-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.back-btn {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.page-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #fff;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ccc;
  font-size: 0.9rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff4444;
  animation: pulse 2s infinite;
}

.status-dot.connected {
  background: #44ff44;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.lobby-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ccc;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #ffd700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ccc;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state p {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.hint {
  font-size: 0.9rem;
  color: #888;
}

.rooms-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.room-card {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: all 0.3s ease;
}

.room-card:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.room-info h3 {
  color: #fff;
  margin-bottom: 8px;
  font-size: 1.3rem;
}

.room-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #ccc;
  font-size: 0.9rem;
}

.join-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
  color: #1a1a2e;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.join-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

.join-btn:disabled {
  background: #666;
  color: #999;
  cursor: not-allowed;
}

.create-room-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
  color: #1a1a2e;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
  transition: all 0.3s ease;
}

.create-room-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
}

.btn-icon {
  font-size: 1.2rem;
}
</style>

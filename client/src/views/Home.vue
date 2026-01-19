<template>
  <div class="home-container">
    <header class="home-header">
      <h1 class="game-title">🃏 斗地主</h1>
      <p class="game-subtitle">在线多人卡牌游戏</p>
    </header>

    <main class="home-content">
      <div class="menu-container">
        <button @click="showCreateRoom" class="menu-btn primary">
          <span class="btn-icon">➕</span>
          <span>创建房间</span>
        </button>
        <button @click="joinRoom" class="menu-btn">
          <span class="btn-icon">🚪</span>
          <span>加入房间</span>
        </button>
        <button @click="viewLobby" class="menu-btn">
          <span class="btn-icon">🏠</span>
          <span>游戏大厅</span>
        </button>
      </div>

      <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>创建房间</h2>
          <div class="form-group">
            <label>房间名称</label>
            <input v-model="roomName" type="text" placeholder="输入房间名称" />
          </div>
          <div class="form-group">
            <label>玩家昵称</label>
            <input
              v-model="playerName"
              type="text"
              placeholder="输入您的昵称"
            />
          </div>
          <div class="modal-actions">
            <button @click="confirmCreateRoom" class="btn confirm">创建</button>
            <button @click="closeModal" class="btn cancel">取消</button>
          </div>
        </div>
      </div>

      <div v-if="showJoinModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>加入房间</h2>
          <div class="form-group">
            <label>房间号</label>
            <input v-model="roomId" type="text" placeholder="输入房间号" />
          </div>
          <div class="form-group">
            <label>玩家昵称</label>
            <input
              v-model="playerName"
              type="text"
              placeholder="输入您的昵称"
            />
          </div>
          <div class="modal-actions">
            <button @click="confirmJoinRoom" class="btn confirm">加入</button>
            <button @click="closeModal" class="btn cancel">取消</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "../stores/game";

const router = useRouter();
const gameStore = useGameStore();

const showCreateModal = ref(false);
const showJoinModal = ref(false);
const roomName = ref("");
const roomId = ref("");
const playerName = ref("");

function showCreateRoom() {
  showCreateModal.value = true;
}

function joinRoom() {
  showJoinModal.value = true;
}

function viewLobby() {
  router.push("/lobby");
}

function closeModal() {
  showCreateModal.value = false;
  showJoinModal.value = false;
}

function confirmCreateRoom() {
  if (!roomName.value.trim() || !playerName.value.trim()) {
    alert("请填写完整信息");
    return;
  }
  gameStore.createRoom(roomName.value, playerName.value);
  closeModal();
}

function confirmJoinRoom() {
  if (!roomId.value.trim() || !playerName.value.trim()) {
    alert("请填写完整信息");
    return;
  }
  gameStore.joinRoom(roomId.value, playerName.value);
  closeModal();
}
</script>

<style scoped>
.home-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.home-header {
  text-align: center;
  margin-bottom: 60px;
}

.game-title {
  font-size: 4rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  margin-bottom: 10px;
}

.game-subtitle {
  font-size: 1.5rem;
  color: #aaa;
}

.home-content {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.menu-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 20px 30px;
  font-size: 1.2rem;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.menu-btn.primary {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
  color: #1a1a2e;
  border-color: #ffd700;
}

.btn-icon {
  font-size: 1.5rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(135deg, #2a2a4e 0%, #1e1e3e 100%);
  padding: 40px;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.modal-content h2 {
  color: #fff;
  margin-bottom: 30px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #ccc;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #ffd700;
  background: rgba(255, 255, 255, 0.1);
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn.confirm {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
  color: #1a1a2e;
}

.btn.cancel {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style>

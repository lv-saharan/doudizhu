<template>
  <div id="app" class="app-container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useGameStore } from "./stores/game";

const gameStore = useGameStore();

onMounted(() => {
  // Initialize game connection
  gameStore.connect();
});
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  overflow: hidden;
}
</style>

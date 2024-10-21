<template>
  <div>
    <h2>UNO Game Setup</h2>
    <label for="bots">Choose number of bots (1-3):</label>
    <input type="number" id="bots" v-model="numberOfBots" min="1" max="3">
    <button @click="startGame">Start Game</button>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const state = reactive({
  numberOfBots: 1,
});

const startGame = () => {
  // Navigate to the Play Game screen
  console.log(`Starting game with ${state.numberOfBots} bots`);
};
</script>

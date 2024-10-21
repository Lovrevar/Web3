<template>
    <div>
      <h2>Game Over!</h2>
      <p>Winner: {{ winnerName }}</p>
      <p>Final Score: {{ finalScore }}</p>
      <button @click="restartGame">Play Again</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const winnerName = ref('');  // Will be set dynamically when game ends
  const finalScore = ref(0);   // Final score will be calculated dynamically
  
  const router = useRouter(); // To handle navigation
  
  const restartGame = () => {
    // Logic to restart the game and navigate back to the Game Setup screen
    console.log('Restarting the game...');
    router.push('/');  // Navigate back to the Game Setup screen
  };
  </script>
  
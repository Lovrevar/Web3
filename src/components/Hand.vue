<template>
    <div class="deck">
      <!-- Loop through the deck array and render a card for each -->
      <UNOCard v-for="(card, index) in playerHand" :key="index" :card="card" />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import UNOCard from './UnoCard.vue';  // Import the UNOCard component
  import type { ICard } from '../interfaces/IDeck';  // Import the Card interface
  
  export default defineComponent({
  name: 'Hand',
  components: {
    UNOCard,
  },
  props: {
    // Accept playerHand as a prop
    playerHand: {
      type: Array as () => ICard[],
      required: true,
    },
  },
});

  </script>
  
  <style scoped>
  .deck {
    display: flex;
    flex-wrap: wrap;
    gap: 10px; /* Optional: Adds spacing between cards */
  }
  </style>
  
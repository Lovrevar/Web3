<template>
  <div :class="['deck', isVertical ? 'vertical' : '']">
    <!-- Loop through the deck array and render a card for each -->
    <UNOCard 
      v-for="(card, index) in playerHand" 
      :key="index" 
      :card="card" 
      :isVertical= "isVertical"
      :isBotCard= "isBotCard" 
      @click="() => playCard(index)" 
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UNOCard from './UnoCard.vue';
import type { ICard } from '../interfaces/IDeck';

export default defineComponent({
  name: 'HandMrs',
  components: {
    UNOCard,
  },
  props: {
    playerHand: {
      type: Array as () => ICard[],
      required: false,
    },
    isVertical: {
      type: Boolean,
      default: false,
    },
    playCard: {
      type: Function,
      required: false,  // Ensure the playCard method is passed in
    },
    isBotCard: {
        type: Boolean,
        default: false,
    },
  },
});
</script>

<style scoped>
.deck {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.vertical {
  flex-direction: column;
  align-items: center;
}

.vertical .UNOCard {
  margin-bottom: -20px;
  transform: rotate(90deg);
  transform-origin: center center;
}
</style>

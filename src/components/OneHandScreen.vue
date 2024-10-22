<template>
  <div class="game-container">
    <!-- Player Area (Bottom) -->
    <div class="player-area">
      <h2>Player 1 (You)</h2>
      <Hand :playerHand="playerHand" :playCard="playCard" />
    </div>

    <!-- Bot 1 (Top) -->
    <div v-if="numberOfBots >= 1" class="bot-area top centered">
      <h2>Bot 1</h2>
      <Hand :playerHand="botHands[0]" />
    </div>

    <!-- Bot 2 (Left, Vertical) -->
    <div v-if="numberOfBots >= 2" class="bot-area left">
      <h2>Bot 2</h2>
      <Hand :playerHand="botHands[1]" :isVertical="true" />
    </div>

    <!-- Bot 3 (Right, Vertical) -->
    <div v-if="numberOfBots >= 3" class="bot-area right">
      <h2>Bot 3</h2>
      <Hand :playerHand="botHands[2]" :isVertical="true" />
    </div>

    <!-- Discard Pile (Center) -->
    <div class="discard-pile">
      <UNOCard v-if="discardPile.length > 0" :card="discardPile[discardPile.length - 1]" />
    </div>

    <!-- Draw Card Button (Center) -->
    <div class="draw-card-button">
      <button @click="drawCard">Draw Card</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Hand from './Hand.vue';
import UNOCard from './UnoCard.vue';
import { Deck } from '../Classes/Deck';
import { useRoute } from 'vue-router';
import type { ICard } from '../interfaces/IDeck';

const route = useRoute();
const numberOfBots = parseInt(route.query.bots as string);

// Single deck instance for the entire game
const deck = ref<Deck | null>(null);

// Player and bot hands
const playerHand = ref<ICard[]>([]);
const botHands = ref<ICard[][]>([[], [], []]);
const discardPile = ref<ICard[]>([]);

// Initialize the deck
onMounted(() => {
  deck.value = new Deck();
  deck.value.initialize();
  deck.value.shuffle();

  // Deal cards to players and bots
  for (let i = 0; i < 7; i++) {
    playerHand.value.push(deck.value.deal()!);
    for (let j = 0; j < numberOfBots; j++) {
      botHands.value[j].push(deck.value.deal()!);
    }
  }

  // Set the first card in the discard pile
  discardPile.value.push(deck.value.deal()!);
});

// Method to play a card
const playCard = (index: number) => {
  const cardToPlay = playerHand.value[index];

  // Only allow play if the card matches color, number, or type with the top of the discard pile
  const topCard = discardPile.value[discardPile.value.length - 1];
  if (cardToPlay.color === topCard.color || cardToPlay.number === topCard.number || ['WILD', 'DRAW4'].includes(cardToPlay.type)) {
    discardPile.value.push(cardToPlay);  // Add the card to the discard pile
    playerHand.value.splice(index, 1);  // Remove the card from player's hand
  } else {
    alert('You cannot play this card!');
  }
};

// Method to draw a card
const drawCard = () => {
  if (deck.value) {
    const newCard = deck.value.deal();
    if (newCard) {
      playerHand.value.push(newCard);  // Add the new card to the player's hand
    } else {
      alert('No more cards in the deck!');
    }
  }
};
</script>

<style scoped>
/* Centered draw card button but moved slightly to the right */
.draw-card-button {
  position: absolute;
  top: 50%;
  left: 60%;  /* Adjust this value to move it left or right */
  transform: translate(-50%, -50%);
}

.game-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
}

.player-area, .bot-area.top.centered {
  width: 60%;
  margin: 0 auto;
  text-align: center;
}

/* Player Area (Bottom) */
.player-area {
  position: absolute;
  bottom: 20px;
}

/* Bot 1 (Top) */
.bot-area.top.centered {
  position: absolute;
  top: 20px;
}

/* Bot 2 (Left, Vertical) */
.bot-area.left {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
}

/* Bot 3 (Right, Vertical) */
.bot-area.right {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
}

/* Discard Pile (Center) */
.discard-pile {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>

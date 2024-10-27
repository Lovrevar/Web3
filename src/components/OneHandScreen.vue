<template>
  <div class="game-container">
    <!-- Player Area (Bottom) -->
    <div class="player-area">
      <h2>{{ playerName }}</h2>
      <Hand :playerHand="playerHand" :playCard="playCard" />
    </div>

    <!-- Bot Areas -->
    <!-- For 1 Bot: Place on Top -->
    <div v-if="botNames.length === 1" class="bot-area top centered">
      <h2>{{ botNames[0] }}</h2>
      <Hand :playerHand="botHands[0]" :isBotCard="true" />
    </div>

    <!-- For 2 Bots: Place First Bot on Left, Second Bot on Top -->
    <div v-if="botNames.length === 2" class="bot-area left">
      <h2>{{ botNames[0] }}</h2>
      <Hand :playerHand="botHands[0]" :isVertical="true" :isBotCard="true" />
    </div>
    <div v-if="botNames.length === 2" class="bot-area top centered">
      <h2>{{ botNames[1] }}</h2>
      <Hand :playerHand="botHands[1]" :isBotCard="true" />
    </div>

    <!-- For 3 Bots: Place First Bot on Left, Second Bot on Top, Third Bot on Right -->
    <div v-if="botNames.length === 3" class="bot-area left">
      <h2>{{ botNames[0] }}</h2>
      <Hand :playerHand="botHands[0]" :isVertical="true" :isBotCard="true" />
    </div>
    <div v-if="botNames.length === 3" class="bot-area top centered">
      <h2>{{ botNames[1] }}</h2>
      <Hand :playerHand="botHands[1]" :isBotCard="true" />
    </div>
    <div v-if="botNames.length === 3" class="bot-area right">
      <h2>{{ botNames[2] }}</h2>
      <Hand :playerHand="botHands[2]" :isVertical="true" :isBotCard="true" />
    </div>

    <!-- Discard Pile (Center) -->
    <div class="discard-pile">
      <UNOCard v-if="discardPile.length > 0" :card="discardPile[discardPile.length - 1]" />
    </div>

    <!-- Draw Card Button (Center) -->
    <div class="draw-card-button">
      <button @click="drawCard" :disabled="gameOver">Draw Card</button>
    </div>
  </div>
</template>


<script setup lang="ts">

import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Game } from '../Classes/Game';
import { Hand } from '../Classes/Hand';
import { PlayerHand } from '../Classes/PlayerHand';
import UnoCard from './UnoCard.vue';
import HandComponent from './Hand.vue'; // Renaming to avoid conflict with `Hand` class
import { SimpleBot } from '../Classes/SimpleBot';
import type { ICard } from '@/interfaces/IDeck';

// Props
const router = useRouter();
const route = useRoute()

// State variables
const bot
const playerName = ref('Player');
const botNames = ref(['Bot 1', 'Bot 2', 'Bot 3']); 
const discardPile = ref<ICard[]>([]);
const playerHand = ref<PlayerHand | null>(null);
const gameOver = ref(false);
const currentHand = ref<Hand | null>(null);
const game = ref(new Game(playerName.value, botNames.value.length));
const botHands = ref<SimpleBot[]>([]);

// Computed properties for top card and bot areas based on the number of bots
const topCard = computed(() => discardPile.value[discardPile.value.length - 1]);

// Functions

function startNewHand() {
  const hand = game.value.startNewHand();
  currentHand.value = hand as Hand;
  playerHand.value = hand.player;
  discardPile.value = [hand.getTopCard()];
  botNames.value = game.value.getBotNames()
}

// Function to play a card
function playCard(cardIndex: number, chosenColor?: string) {
  if (currentHand.value) {
    if (currentHand.value.play(currentHand.value.player.getCards()[cardIndex])) {
      playerHand.value = currentHand.value.player
      discardPile.value = [currentHand.value.getTopCard()];

      if (currentHand.value.hasEnded) {
        gameOver.value = true;
        router.push({ name: 'GameOverScreen' });
      } 
    } else {
      console.warn("Invalid card play");
    }
  }
}


// Function to draw a card
function drawCard() {
  if (currentHand.value) {
    currentHand.value.drawCard();
    currentHand.value.endTurn();
  }
}

// Initialize the game on mount
onMounted(() => {
  startNewHand();
});

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

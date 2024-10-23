<template>
  <div class="game-container">
    <!-- Player Area (Bottom) -->
    <div class="player-area">
      <h2>Player 1 (You)</h2>
      <Hand :playerHand="playerHand" :playCard="playCard" />
    </div>

    <!-- Bot Areas -->
    <div v-if="numberOfBots >= 1" class="bot-area top centered">
      <h2>{{ botNames[0] }}</h2>
      <Hand :playerHand="botHands[0]" />
    </div>
    <div v-if="numberOfBots >= 2" class="bot-area left">
      <h2>{{ botNames[1] }}</h2>
      <Hand :playerHand="botHands[1]" :isVertical="true" />
    </div>
    <div v-if="numberOfBots >= 3" class="bot-area right">
      <h2>{{ botNames[2] }}</h2>
      <Hand :playerHand="botHands[2]" :isVertical="true" />
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
import { ref, onMounted } from 'vue';
import Hand from './Hand.vue';
import UNOCard from './UnoCard.vue';
import { Deck } from '../Classes/Deck';
import { useRoute } from 'vue-router';
import type { ICard } from '../interfaces/IDeck';
import { SimpleBot } from '../Classes/SimpleBot';
import { Game } from '../Classes/Game';

const route = useRoute();
const numberOfBots = parseInt(route.query.bots as string);

// Single deck instance for the entire game
const deck = ref<Deck | null>(null);

// Player and bot hands
const playerHand = ref<ICard[]>([]);
const botHands = ref<ICard[][]>([[], [], []]);
const discardPile = ref<ICard[]>([]);

// Bots
const bots = ref<SimpleBot[]>([]);

// Names for bots
const botNames = ref<string[]>(["Benjamin", "David", "Lovre"]);

// Track if the bot has said UNO
const botSaidUno = ref<boolean[]>([false, false, false]);

// Game state
const gameOver = ref(false);

// Create a game instance (to calculate points and manage hands)
let game: Game;

onMounted(() => {
  deck.value = new Deck();
  deck.value.initialize();
  deck.value.shuffle();

  game = new Game(deck.value);
  game.start(["Player 1", ...botNames.value.slice(0, numberOfBots)]);

  // Deal cards to players and bots
  for (let i = 0; i < 7; i++) {
    playerHand.value.push(deck.value.deal()!);
    for (let j = 0; j < numberOfBots; j++) {
      botHands.value[j].push(deck.value.deal()!);
    }
  }

  // Initialize bots
  for (let i = 0; i < numberOfBots; i++) {
    bots.value.push(new SimpleBot(botHands.value[i], botNames.value[i]));  // Pass name to SimpleBot
  }

  discardPile.value.push(deck.value.deal()!);  // Set the first card in the discard pile
});

// Method to play a card (player)
const playCard = (index: number) => {
  if (gameOver.value) return;

  const cardToPlay = playerHand.value[index];
  const topCard = discardPile.value[discardPile.value.length - 1];
  if (cardToPlay.color === topCard.color || cardToPlay.number === topCard.number || ['WILD', 'DRAW4'].includes(cardToPlay.type)) {
    discardPile.value.push(cardToPlay);
    playerHand.value.splice(index, 1);
    nextTurn();
  } else {
    alert('You cannot play this card!');
  }
};

// Method to draw a card
const drawCard = () => {
  if (deck.value && !gameOver.value) {
    const newCard = deck.value.deal();
    if (newCard) {
      playerHand.value.push(newCard);
      nextTurn();
    } else {
      alert('No more cards in the deck!');
    }
  }
};

const nextTurn = () => {
  bots.value.forEach((bot, index) => {
    if (gameOver.value) return;

    

    const card = bot.playCard(discardPile.value);
    if (card) {
      discardPile.value.push(card);
      botHands.value[index] = botHands.value[index].filter(c => c !== card);

      // If bot has exactly 1 card, it says UNO
      if (botHands.value[index].length === 1 && !botSaidUno.value[index]) {
        botNames.value[index] = `${bot.name} says UNO`;
        botSaidUno.value[index] = true;
        bot.sayUno();
      } 
      // If bot has no cards, the game is over
      else if (botHands.value[index].length === 0) {
        gameOver.value = true;
        botNames.value[index] = `${bot.name} wins!`;
        game.updateScores();
        game.logRemainingCards(playerHand.value, botHands.value, botNames.value);  // Pass the botNames array here
        alert(`${bot.name} wins!`);
      }
    } else {
      const newCard = deck.value?.deal();
      if (newCard) {
        bot.drawCard(newCard);
        botHands.value[index].push(newCard);
      }
    }
    // Check if bot has previously said UNO but now has more than 1 card
    if (botSaidUno.value[index] && botHands.value[index].length !== 1) {
      botNames.value[index] = `${bot.name}`;
      botSaidUno.value[index] = false;
    }
  });
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

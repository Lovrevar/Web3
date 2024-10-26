<template>
  <div class="game-container">
    <!-- Player Area (Bottom) -->
    <div class="player-area">
      <h2>{{ playerName }}</h2>
      <Hand :playerHand="playerHand" :playCard="playCard" />
    </div>

    <!-- Bot Areas -->
    <!-- For 1 Bot: Place on Top -->
    <div v-if="numberOfBots === 1" class="bot-area top centered">
      <h2>{{ botNames[0] }}</h2>
      <Hand :playerHand="botHands[0]" :isBotCard="true" />
    </div>

    <!-- For 2 Bots: Place First Bot on Left, Second Bot on Top -->
    <div v-if="numberOfBots === 2" class="bot-area left">
      <h2>{{ botNames[0] }}</h2>
      <Hand :playerHand="botHands[0]" :isVertical="true" :isBotCard="true" />
    </div>
    <div v-if="numberOfBots === 2" class="bot-area top centered">
      <h2>{{ botNames[1] }}</h2>
      <Hand :playerHand="botHands[1]" :isBotCard="true" />
    </div>

    <!-- For 3 Bots: Place First Bot on Left, Second Bot on Top, Third Bot on Right -->
    <div v-if="numberOfBots === 3" class="bot-area left">
      <h2>{{ botNames[0] }}</h2>
      <Hand :playerHand="botHands[0]" :isVertical="true" :isBotCard="true" />
    </div>
    <div v-if="numberOfBots === 3" class="bot-area top centered">
      <h2>{{ botNames[1] }}</h2>
      <Hand :playerHand="botHands[1]" :isBotCard="true" />
    </div>
    <div v-if="numberOfBots === 3" class="bot-area right">
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
  const botNamesPerm = ref<string[]>(["Benjamin", "David", "Lovre"]);
const playerName = ref('Me');

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
    console.log(`I played ${cardToPlay.color} ${cardToPlay.number || cardToPlay.type}`);
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
  // Loop through each bot and let them play their turn
  bots.value.forEach((bot, index) => {
    if (gameOver.value) return;

    const card = bot.playCard(discardPile.value);
    if (card) {
      discardPile.value.push(card);  // Add the bot's played card to the discard pile
      botHands.value[index] = botHands.value[index].filter(c => c !== card);  // Remove the card from the bot's hand

      // If the bot has exactly 1 card, it should say UNO
      if (botHands.value[index].length === 1 && !botSaidUno.value[index]) {
        botNames.value[index] = `${bot.name} says UNO`;
        bot.sayUno();
      }
      // If the bot has no cards, the game is over
      else if (botHands.value[index].length === 0) {
        for(let i = 0; i < numberOfBots; i++)
      {
        botNames.value[i]=botNamesPerm.value[i];
        console.log(botNames.value[i]);
      }
        gameOver.value = true;
        
        botNames.value[index] = `${bot.name}`;
        alert(`${bot.name} wins!`);
        // Calculate final points and update names
        game.calculateFinalPoints(playerHand.value, botHands.value, playerName, botNames.value);

        
      }
    } else {
      // If the bot cannot play, it draws a card
      const newCard = deck.value?.deal();
      if (newCard) {
        bot.drawCard(newCard);
        botNames.value[index] = `${bot.name}`;
        botHands.value[index].push(newCard);  // Add the drawn card to the bot's hand
      }
    }

    // Reset the bot's UNO announcement if they now have more than 1 card
    // if (botSaidUno.value[index] && botHands.value[index].length !== 1) {
    //   botNames.value[index] = `${bot.name}`;
    //   botSaidUno.value[index] = false;
    // }
  });

  // Check if it's the player's turn after the bots finish
  if (!gameOver.value) {
    const playerTurn = playerHand.value.length === 1;
    if (playerTurn && !botSaidUno.value[0]) {
      playerName.value = `${playerName.value} says UNO`;
    }

    if (playerHand.value.length === 0) {
      gameOver.value = true;
      playerName.value = `${playerName.value} wins!`;

      // Calculate final points and update names
      game.calculateFinalPoints(playerHand.value, botHands.value, playerName, botNames.value);

      alert(`${playerName.value}  kurac wins!`);
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

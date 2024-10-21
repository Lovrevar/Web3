<template>
  <div class="game-container">
    <div class="player-hand">
      <h2>Your Hand</h2>
      <div v-for="(card, index) in playerHand" :key="index" class="card" @click="playCard(index)">
        {{ card.color }} {{ card.number || card.type }}
      </div>
      <button class="action-button" @click="drawCard">Draw Card</button>
      <button v-if="playerHand.length === 1" class="action-button" @click="sayUno">Say UNO!</button>
    </div>

    <div class="discard-pile">
      <h3>Current Discard Pile: {{ discardPile[discardPile.length - 1].color }} {{ discardPile[discardPile.length - 1].number || discardPile[discardPile.length - 1].type }}</h3>
    </div>

    <div class="opponent-hand">
      <h2>Opponent's Hand: {{ opponentHand.length }} cards</h2>
    </div>

    <div class="game-log">
      <h3>Game Log</h3>
      <ul>
        <li v-for="(log, index) in gameLog" :key="index">{{ log }}</li>
      </ul>
    </div>

    <!-- Color selection for Draw 4 -->
    <div v-if="draw4Active" class="color-selection">
      <h3>Choose Color</h3>
      <button v-for="color in colors" :key="color" @click="chooseColor(color)" class="color-button">{{ color }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import type { Card } from '../interfaces/Deck';
import { SimpleBot } from '../interfaces/botPlay';

// Initialize playerHand, opponentHands, discardPile, gameLog, and other reactive data
const playerHand = reactive<Card[]>([]);
const opponentHand = reactive<Card[]>([]);
const discardPile = reactive<Card[]>([{ type: 'NUMBERED', color: 'RED', number: 1 }]);
const gameLog = reactive<string[]>([]);
const draw4Active = reactive({ value: false }); // Tracks if Draw 4 color selection is active
const botHasDrawnCard = reactive({ value: false });
const skipNextTurn = reactive({ value: false }); // Track if next turn should be skipped

// Define available colors
const colors = ['RED', 'BLUE', 'GREEN', 'YELLOW'] as const;

// Function to initialize both player and bot hands with 7 cards
const initializeHands = () => {
  for (let i = 0; i < 7; i++) {
    playerHand.push(generateRandomCard());
    opponentHand.push(generateRandomCard());
  }
};

// Log the last action
const logAction = (message: string) => {
  gameLog.push(message);
  if (gameLog.length > 10) {
    gameLog.shift(); // Keep only the last 10 log entries
  }
};

// Function to handle player playing a card
const playCard = (index: number) => {
  const selectedCard = playerHand[index];
  const topCard = discardPile[discardPile.length - 1];

  if (selectedCard.color === topCard.color || selectedCard.number === topCard.number || selectedCard.type === 'WILD' || selectedCard.type === 'DRAW4') {
    discardPile.push(selectedCard);
    playerHand.splice(index, 1);
    logAction(`Player played ${selectedCard.color} ${selectedCard.number || selectedCard.type}`);

    // Handle Draw 2 and Draw 4 logic
    if (selectedCard.type === 'DRAW2') {
      logAction('Player played Draw 2');
      botDrawCards(2);
      skipNextTurn.value = true;
      endTurn();
      return;
    }

    if (selectedCard.type === 'DRAW4') {
      logAction('Player played Draw 4');
      draw4Active.value = true; // Activate color selection UI
      botDrawCards(4);
      skipNextTurn.value = true;
      return;
    }

    endTurn();
  } else {
    console.log('You cannot play this card');
  }
};

// Bot logic
const bot = new SimpleBot(opponentHand);

const botTurn = () => {
  if (skipNextTurn.value) {
    logAction('Bot skipped turn');
    skipNextTurn.value = false; // Reset skip flag
    return;
  }

  // Handle Draw 4 color selection for bot
  if (draw4Active.value) {
    autoChooseColorForBot();
    return;
  }

  // Bot plays card if available
  if (botHasDrawnCard.value) {
    const botCard = bot.playCard(discardPile);
    if (botCard) {
      discardPile.push(botCard);
      logAction(`Bot played ${botCard.color} ${botCard.number || botCard.type}`);
      botHasDrawnCard.value = false;

      // Handle Draw 2 and Draw 4 logic for player
      if (botCard.type === 'DRAW2') {
        logAction('Bot played Draw 2');
        playerDrawCards(2);
        skipNextTurn.value = true;
        return;
      }

      if (botCard.type === 'DRAW4') {
        logAction('Bot played Draw 4');
        autoChooseColorForBot();
        playerDrawCards(4);
        skipNextTurn.value = true;
        return;
      }
    }
  } else {
    const botCard = bot.playCard(discardPile);
    if (botCard) {
      discardPile.push(botCard);
      logAction(`Bot played ${botCard.color} ${botCard.number || botCard.type}`);
    } else {
      console.log('Bot draws a card');
      bot.drawCard();
      botHasDrawnCard.value = true;
      logAction('Bot drew a card');
    }
  }
};

// Draw card for the player
const drawCard = () => {
  const newCard = generateRandomCard();
  playerHand.push(newCard);
  logAction(`Player drew a ${newCard.color} ${newCard.number || newCard.type}`);
  endTurn();
};

// Generate a random card
const generateRandomCard = (): Card => {
  const types = ['NUMBERED', 'BLOCK', 'REVERSE', 'DRAW2', 'WILD', 'DRAW4'] as const;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const type = types[Math.floor(Math.random() * types.length)];

  if (type === 'NUMBERED') {
    return { type: 'NUMBERED', color, number: Math.floor(Math.random() * 10) };
  } else {
    return { type, color: type === 'WILD' || type === 'DRAW4' ? null : color }; // Wild cards have null color
  }
};

// Function to choose a color for Draw 4
const chooseColor = (color: typeof colors[number]) => {
  discardPile.push({ type: 'DRAW4', color, number: undefined });
  logAction(`Player chose ${color} for Draw 4`);
  draw4Active.value = false; // Deactivate color selection UI
  endTurn(); // Player's turn ends after color selection
};

// Bot auto chooses color for Draw 4 based on its hand
const autoChooseColorForBot = () => {
  const colorCounts = { RED: 0, BLUE: 0, GREEN: 0, YELLOW: 0 };

  // Count the number of cards of each color in bot's hand
  opponentHand.forEach((card) => {
    if (card.color) colorCounts[card.color]++;
  });

  // Choose the color with the most cards
  const chosenColor = Object.keys(colorCounts).reduce((a, b) => colorCounts[a] > colorCounts[b] ? a : b);
  discardPile.push({ type: 'DRAW4', color: chosenColor as 'RED' | 'BLUE' | 'GREEN' | 'YELLOW', number: undefined });
  logAction(`Bot chose ${chosenColor} for Draw 4`);
  draw4Active.value = false;
  endTurn();
};

// Make the bot draw cards
const botDrawCards = (count: number) => {
  for (let i = 0; i < count; i++) {
    bot.drawCard();
  }
  logAction(`Bot drew ${count} cards`);
};

// Make the player draw cards
const playerDrawCards = (count: number) => {
  for (let i = 0; i < count; i++) {
    const newCard = generateRandomCard();
    playerHand.push(newCard);
  }
  logAction(`Player drew ${count} cards`);
};

// Call this function to initialize the game with 7 cards each
initializeHands();
</script>

<style scoped>
.game-container {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.player-hand, .discard-pile, .opponent-hand, .game-log {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 30%;
}

.card {
  display: inline-block;
  margin: 5px;
  padding: 10px;
  border: 1px solid #333;
  border-radius: 5px;
  background-color: #fff;
  width: 100px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.action-button {
  margin-top: 10px;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.action-button:hover {
  background-color: #45a049;
}

.game-log {
  height: 200px;
  overflow-y: auto;
  text-align: left;
}

ul {
  list-style-type: none;
  padding: 0;
}

.color-selection {
  text-align: center;
}

.color-button {
  margin: 5px;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}

.color-button:hover {
  background-color: #ddd;
}
</style>

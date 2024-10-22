<!-- <template>
  <div class="game-container">
    <div class="player-hand">
      <h2>Your Hand</h2>
      <div v-for="(card, index) in playerHand" :key="index" class="card" @click="playCard(index)">
        <!-- {{ card.color }} {{ card.number || card.type }} -->
        {{ card.color }} {{ card.type === 'NUMBERED' ? card.number : card.type }}
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

      <!-- Display bot's hand for debugging -->
      <h3>Bot's Hand (Debug)</h3>
      <ul>
  <li v-for="(card, index) in opponentHand" :key="'bot-card-' + index">
    {{ card.color }} {{ card.type === 'NUMBERED' ? card.number : card.type }}
  </li>
</ul> 
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router'; // Use this for navigation to game-over screen
import type { ICard } from '../interfaces/IDeck';
import { SimpleBot } from '../interfaces/botPlay';

// Initialize router for navigation
const router = useRouter();

// Initialize playerHand, opponentHands, discardPile, and gameLog
const playerHand = reactive<ICard[]>([]);
const opponentHand = reactive<ICard[]>([]);
const discardPile = reactive<ICard[]>([{ type: 'NUMBERED', color: 'RED', number: 1 }]);
const gameLog = reactive<string[]>([]); // Log of game actions
const botHasDrawnCard = reactive({ value: false }); // Track if bot has drawn a card

// Initialize both player and bot hands with 7 cards at the start of the game
const initializeHands = () => {
  for (let i = 0; i < 7; i++) {
    playerHand.push(generateRandomCard());
    opponentHand.push(generateRandomCard());
  }
  logAction('Game started. Hands have been dealt.');
};

// Log the last action
const logAction = (message: string) => {
  gameLog.push(message);
  if (gameLog.length > 10) {
    gameLog.shift(); // Keep only the last 10 log entries
  }
};

// Function to check if the game should end
const checkGameOver = () => {
  if (playerHand.length === 0) {
    logAction('Player wins the game!');
    router.push('/game-over'); // Navigate to game over screen
  } else if (opponentHand.length === 0) {
    logAction('Bot wins the game!');
    router.push('/game-over'); // Navigate to game over screen
  }
};

// Function to handle player playing a card
const playCard = (index: number) => {
  const selectedCard = playerHand[index];
  const topCard = discardPile[discardPile.length - 1];

  if (selectedCard.color === topCard.color || selectedCard.number === topCard.number || selectedCard.type === 'WILD' || selectedCard.type === 'DRAW4') {
    // Handle special rules for numbered cards (same number, different colors)
    const sameNumberCards = playerHand.filter((card) => card.number === selectedCard.number);
    sameNumberCards.forEach((card) => {
      discardPile.push(card);
      playerHand.splice(playerHand.indexOf(card), 1);
      logAction(`Player played ${card.color} ${card.number || card.type}`);
    });

    checkGameOver(); // Check if the game should end after playing the card
    endTurn();
  } else {
    console.log('You cannot play this card');
  }
};

// Bot logic
const bot = new SimpleBot(opponentHand);

const botTurn = () => {
  // Check if bot has drawn a card last turn and try to play it
  if (botHasDrawnCard.value) {
    const botCard = bot.playCard(discardPile);
    if (botCard) {
      discardPile.push(botCard);
      opponentHand.splice(opponentHand.indexOf(botCard), 1); // Remove the played card from bot's hand
      logAction(`Bot played ${botCard.color} ${botCard.number || botCard.type}`);
      botHasDrawnCard.value = false; // Reset flag after playing the drawn card
      checkGameOver(); // Check if the game should end after the bot's play
    } else {
      console.log('Bot cannot play the drawn card');
    }
  } else {
    // Bot tries to play a card from its hand
    const botCard = bot.playCard(discardPile);
    if (botCard) {
      discardPile.push(botCard);
      opponentHand.splice(opponentHand.indexOf(botCard), 1); // Remove the played card from bot's hand
      logAction(`Bot played ${botCard.color} ${botCard.number || botCard.type}`);
      checkGameOver(); // Check if the game should end after the bot's play
    } else {
      // Bot draws a card if it cannot play
      console.log('Bot draws a card');
      const newCard = bot.drawCard(); // Ensure drawCard returns a valid Card object
      if (newCard) {
        opponentHand.push(newCard); // Add the card to bot's hand
        // botHasDrawnCard.value = true; // Bot has drawn a card and will try to play it next turn
        logAction('Bot drew a card');
      } else {
        console.log('Error: Bot could not draw a card');
      }
    }
  }

  // If the bot has 1 card left, it says UNO
  if (opponentHand.length === 1) {
    logAction('Bot says UNO!');
  }
};

  // If the bot has 1 card left, it says UNO
  if (opponentHand.length === 1) {
    logAction('Bot says UNO!');
  };

// Draw card for the player
const drawCard = () => {
  const newCard = generateRandomCard();
  playerHand.push(newCard);
  if (newCard.type=='NUMBERED') 
  {
    logAction(`Player drew a ${newCard.color} ${newCard.number}`);
  }
  else
  logAction(`Player drew a ${newCard.color} ${newCard.type}`);
  
  checkGameOver(); // Check if the game should end after drawing the card
  endTurn(); // Drawing a card ends the player's turn
};

// Generate a random card
const generateRandomCard = (): Card => {
  const colors = ['RED', 'BLUE', 'GREEN', 'YELLOW'] as const;
  const types = ['NUMBERED', 'BLOCK', 'REVERSE', 'DRAW2', 'WILD', 'DRAW4'] as const;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const type = types[Math.floor(Math.random() * types.length)];

  if (type === 'NUMBERED') {
    // Only assign a number if it's a numbered card
    const number = Math.floor(Math.random() * 10);
    return { type: 'NUMBERED', color, number };
  } else {
    // For non-numbered cards, no number is needed
    return { type, color: type === 'WILD' || type === 'DRAW4' ? null : color }; // Wild and Draw4 cards have null color
  }
};

const sayUno = () => {
  logAction('Player says UNO!');
};

// End turn and trigger bot's turn
const endTurn = () => {
  console.log('Player’s turn ended');
  botTurn();
};

// Call this function to initialize the game with 7 cards each
initializeHands();
</script>

<style scoped>
/* Updated styles for better UI */
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
</style> -->

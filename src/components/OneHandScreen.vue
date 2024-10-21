<template>
  <div>
    <h2>Your Hand</h2>
    <div v-for="(card, index) in playerHand" :key="index" @click="playCard(index)">
      {{ card.color }} {{ card.number || card.type }}
    </div>
    <button @click="drawCard">Draw Card</button>
    <button v-if="playerHand.length === 1" @click="sayUno">Say UNO!</button>

    <h3>Current Discard Pile: {{ discardPile[discardPile.length - 1].color }} {{ discardPile[discardPile.length - 1].number || discardPile[discardPile.length - 1].type }}</h3>

    <h2>Opponent's Hand: {{ opponentHands.length }} cards</h2>
    <button @click="endTurn">End Turn</button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Card } from '../interfaces/Deck'; // Assuming this contains the Card interface
import { Bot } from '../interfaces/Bot'; // Assuming this contains bot play logic

// Initialize playerHand and opponentHands
const playerHand = reactive<Card[]>([
  { type: 'NUMBERED', color: 'RED', number: 5 },
  { type: 'NUMBERED', color: 'BLUE', number: 7 },
  { type: 'REVERSE', color: 'YELLOW' }
]);

const opponentHands = reactive<Card[]>([
  { type: 'NUMBERED', color: 'GREEN', number: 3 },
  { type: 'WILD', color: null }
]);

const discardPile = reactive<Card[]>([{ type: 'NUMBERED', color: 'RED', number: 1 }]);
const scores = reactive([0, 0]); // Player and bot scores

// Player plays a card
const playCard = (index: number) => {
  const selectedCard = playerHand[index];
  const topCard = discardPile[discardPile.length - 1];

  // Check if the card is playable
  if (selectedCard.color === topCard.color || selectedCard.number === topCard.number || selectedCard.type === 'WILD' || selectedCard.type === 'WILD DRAW') {
    discardPile.push(selectedCard);
    playerHand.splice(index, 1); // Remove the card from player's hand
    console.log(`Player played: ${selectedCard.color} ${selectedCard.number || selectedCard.type}`);
    if (playerHand.length === 1) {
      console.log('Player says UNO!');
    }
  } else {
    console.log('You cannot play this card');
  }
};

// Draw a card
const drawCard = () => {
  // Simulating drawing a card (You need to fetch a card from the deck in a real game)
  playerHand.push({ type: 'NUMBERED', color: 'RED', number: Math.floor(Math.random() * 10) });
  console.log('Player drew a card');
};

// Say UNO when only one card remains
const sayUno = () => {
  console.log('Player says UNO!');
};

// Bot's turn logic
const botTurn = () => {
  const topCard = discardPile[discardPile.length - 1];
  const botCard = botPlay(opponentHands, [topCard]);

  if (botCard) {
    discardPile.push(botCard);
    console.log(`Bot plays: ${botCard.color} ${botCard.number || botCard.type}`);
  } else {
    console.log('Bot draws a card');
    opponentHands.push({ type: 'NUMBERED', color: 'BLUE', number: Math.floor(Math.random() * 10) }); // Simulate drawing a card
  }
};

// End turn and allow bot to play
const endTurn = () => {
  console.log('Ending player’s turn');
  botTurn();
};
</script>

<style scoped>
h2 {
  margin-bottom: 10px;
}

div {
  margin-bottom: 20px;
}

button {
  margin-top: 10px;
}
</style>

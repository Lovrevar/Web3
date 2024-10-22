import type { Card } from './Deck'; // Assuming Card interface is in Deck.ts

// Define the Bot interface
export interface Bot {
  // Bot's hand (array of cards)
  hand: Card[];

  // The bot makes a play based on the current discard pile
  playCard(discardPile: Card[]): Card | null;

  // The bot draws a card (you can implement the draw logic separately)
  drawCard(): void;

  // Check if the bot has forgotten to say UNO (if it has only one card left)
  shouldSayUno(): boolean;

  // Bot announces UNO
  sayUno(): void;
}

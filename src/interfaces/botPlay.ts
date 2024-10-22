import type { Card } from './Deck'; // Import the Card interface
import type { Bot } from './Bot';  // Import the Bot interface

// Example implementation of the Bot interface
export class SimpleBot implements Bot {
  hand: Card[];

  constructor(initialHand: Card[]) {
    this.hand = initialHand;
  }

  // Bot decides which card to play
  playCard(discardPile: Card[]): Card | null {
    const topCard = discardPile[discardPile.length - 1];

    // Find all cards in the bot's hand that can be legally played
    const legalPlays = this.hand.filter((card) => {
      return (
        card.color === topCard.color || 
        card.number === topCard.number || 
        card.type === 'WILD' || 
        card.type === 'DRAW4'
      );
    });

    if (legalPlays.length > 0) {
      // Choose a random legal card to play
      const chosenCard = legalPlays[Math.floor(Math.random() * legalPlays.length)];

      // Remove the card from the bot's hand
      this.hand = this.hand.filter(card => card !== chosenCard);
      console.log(`Bot plays: ${chosenCard.color} ${chosenCard.number || chosenCard.type}`);
      return chosenCard;
    }

    // If no legal play, bot draws a card
    console.log('Bot draws a card');
    return null;
  }

  // Bot draws a card and adds it to its hand
  drawCard() : Card{
    // Simulate drawing a card (in reality, this should come from the deck)
    const newCard: Card = { type: 'NUMBERED', color: 'BLUE', number: Math.floor(Math.random() * 10) };
    this.hand.push(newCard);
    console.log('Bot drew a card');
    return newCard;
  }

  // Check if the bot should say UNO
  shouldSayUno(): boolean {
    return this.hand.length === 1;
  }

  // Bot says UNO if it has only one card
  sayUno() {
    if (this.shouldSayUno()) {
      console.log('Bot says UNO!');
    } else {
      console.log('Bot has more than one card, no need to say UNO');
    }
  }
}

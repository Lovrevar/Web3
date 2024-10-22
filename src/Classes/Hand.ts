import type { ICard } from '../interfaces/IDeck';
import type { IPlayerHand } from '../interfaces/IPlayerHand';
import type { IHand } from '../interfaces/IHand';
export class Hand implements IHand {
  private playerHands: IPlayerHand[] = [];
  private discardPile: ICard[] = [];
  private currentPlayer: number = 0;

  constructor(playerHands: IPlayerHand[], discardPile: ICard[]) {
    this.playerHands = playerHands;
    this.discardPile = discardPile;
  }

  // Return the current player's hand
  playerHand(playerIndex: number): IPlayerHand {
    return this.playerHands[playerIndex];
  }

  // Check if a player can play a card based on the current discard pile
  canPlay(cardIndex: number): boolean {
    const playerHand = this.playerHands[this.currentPlayer];
    const card = playerHand.getCards()[cardIndex];
    const topCard = this.discardPile[this.discardPile.length - 1];

    return card.color === topCard.color || card.number === topCard.number || card.type === 'WILD' || card.type === 'DRAW4';
  }

  // Play a card from the current player's hand
  play(cardIndex: number, chosenColor?: 'RED' | 'BLUE' | 'GREEN' | 'YELLOW'): void {
    const playerHand = this.playerHands[this.currentPlayer];
    const card = playerHand.getCards()[cardIndex];
    
    // Add the card to the discard pile
    this.discardPile.push(card);
    
    // Remove the card from the player's hand
    playerHand.removeCard(card);

    // Special handling for WILD and DRAW4 cards
    if (card.type === 'WILD' || card.type === 'DRAW4') {
      if (chosenColor) {
        card.color = chosenColor; // Set the chosen color
      }
    }
    
    // Check for game end after playing
    if (playerHand.getCards().length === 0) {
      console.log(`Player ${this.currentPlayer} has won the hand!`);
    }
  }

  // Draw a card for the current player
  draw(): void {
    const newCard = this.deck.deal();
    this.playerHands[this.currentPlayer].addCard(newCard);
  }

  // Check if the hand has ended (when a player has no cards left)
  hasEnded(): boolean {
    return this.playerHands.some(hand => hand.getCards().length === 0);
  }

  // Return the winner if applicable
  winner(): number | undefined {
    const winnerIndex = this.playerHands.findIndex(hand => hand.getCards().length === 0);
    return winnerIndex !== -1 ? winnerIndex : undefined;
  }

  // Handle saying "UNO"
  sayUno(playerIndex: number): void {
    const playerHand = this.playerHands[playerIndex];
    if (playerHand.hasUno()) {
      console.log(`Player ${playerIndex} says UNO!`);
    }
  }

  // Handle UNO failure accusation
  catchUnoFailure(accuser: number, accused: number): boolean {
    const accusedHand = this.playerHands[accused];
    if (accusedHand.getCards().length === 1 && !accusedHand.hasUno()) {
      // Accused failed to say UNO
      console.log(`Player ${accused} failed to say UNO!`);
      accusedHand.addCard(this.deck.deal());
      accusedHand.addCard(this.deck.deal()); // Penalty for not saying UNO
      return true;
    }
    return false;
  }
}
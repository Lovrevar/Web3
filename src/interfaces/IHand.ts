import type { ICard } from './IDeck';
export interface IHand {
  // Returns the current player's hand (array of cards)
  playerHand(playerIndex: number): ICard[];

  // Check if a player can play a card based on game rules
  canPlay(cardIndex: number): boolean;

  // Play a card (remove it from hand and place it in the discard pile)
  play(cardIndex: number, chosenColor?: 'RED' | 'BLUE' | 'GREEN' | 'YELLOW'): void;

  // Draw a card from the deck and add it to the player's hand
  draw(): void;

  // Check if the hand has ended (no more cards in a player's hand)
  hasEnded(): boolean;

  // Return the winner of the hand (if applicable)
  winner(): number | undefined;

  // Handle UNO failure accusation and apply penalties
  catchUnoFailure(accuser: number, accused: number): boolean;

  // Handle saying "UNO" when a player has one card left
  sayUno(playerIndex: number): void;
}

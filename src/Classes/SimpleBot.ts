import type { ICard } from '../interfaces/IDeck';
import type { IBot } from '../interfaces/IBot';

export class SimpleBot implements IBot {
  hand: ICard[];
  name: string;

  constructor(initialHand: ICard[], name: string) {
    this.hand = initialHand;
    this.name = name;  // Store bot's name
  }

  playCard(discardPile: ICard[]): ICard | null {
    const topCard = discardPile[discardPile.length - 1];
    const legalPlays = this.hand.filter(card => (
      card.color === topCard.color || 
      card.number === topCard.number || 
      card.type === 'WILD' || 
      card.type === 'DRAW4'
    ));

    if (legalPlays.length > 0) {
      const chosenCard = legalPlays[Math.floor(Math.random() * legalPlays.length)];
      this.hand = this.hand.filter(card => card !== chosenCard);
      console.log(`${this.name} played: ${chosenCard.color} ${chosenCard.number || chosenCard.type}`);
      return chosenCard;
    }
    return null;
  }

  drawCard(newCard: ICard): void {
    this.hand.push(newCard);
    console.log(`${this.name} drew a card`);
  }

  shouldSayUno(): boolean {
    return this.hand.length === 1;
  }

  sayUno() {
    console.log(`${this.name} says UNO!`);
  }
}

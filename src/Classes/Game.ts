import type { IDeck } from '../interfaces/IDeck';
import type { IHand } from '../interfaces/IHand';
import { Hand } from './Hand';
import { PlayerHand } from './PlayerHand';

export class Game {
  private hands: IHand[] = [];
  private deck: IDeck;
  private scores: number[] = [];
  private players: string[] = [];
  private currentPlayerIndex: number = 0;
  private gameOver: boolean = false;
  private winningScore: number = 500;

  constructor(deck: IDeck) {
    this.deck = deck;
  }

  // Start the game and initialize players
  start(players: string[]): void {
    this.players = players;
    this.scores = players.map(() => 0);
    this.deck.initialize();
    this.deck.shuffle(Math.random);

    // Deal hands and start the first hand
    const playerHands = players.map(() => new PlayerHand());
    const firstHand = new Hand(playerHands, [this.deck.deal()]);

    this.hands.push(firstHand);
  }

  // Play a round of the game
  playRound(): void {
    const currentHand = this.hands[this.hands.length - 1];
    currentHand.play(this.currentPlayerIndex);

    if (currentHand.hasEnded()) {
      this.updateScores();
      if (this.scores.some(score => score >= this.winningScore)) {
        this.gameOver = true;
        console.log(`Game over! Winner: ${this.getWinner()}`);
      } else {
        this.startNewHand();
      }
    } else {
      this.nextPlayer();
    }
  }

  // Start a new hand
  private startNewHand(): void {
    const playerHands = this.players.map(() => new PlayerHand());
    const newHand = new Hand(playerHands, [this.deck.deal()]);
    this.hands.push(newHand);
  }

  // Move to the next player's turn
  private nextPlayer(): void {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  // Update the scores based on cards left in hands
  private updateScores(): void {
    const currentHand = this.hands[this.hands.length - 1];
    const winnerIndex = currentHand.winner();
    if (winnerIndex !== undefined) {
      this.scores[winnerIndex] += this.calculatePoints();
    }
  }

  // Calculate points based on cards left in other players' hands
  private calculatePoints(): number {
    return this.players.reduce((total, _, index) => {
      if (index !== this.currentPlayerIndex) {
        const hand = this.hands[this.hands.length - 1].playerHand(index);
        return total + hand.getCards().reduce((handTotal, card) => {
          if (card.type === 'NUMBERED') {
            return handTotal + (card.number || 0);
          } else if (['BLOCK', 'REVERSE', 'DRAW2'].includes(card.type)) {
            return handTotal + 20;
          } else {
            return handTotal + 50;
          }
        }, 0);
      }
      return total;
    }, 0);
  }

  // Get the winner of the game if the game has ended
  getWinner(): string | undefined {
    if (this.gameOver) {
      const winningScoreIndex = this.scores.findIndex(score => score >= this.winningScore);
      return this.players[winningScoreIndex];
    }
    return undefined;
  }
}

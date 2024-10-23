import type { ICard } from '../interfaces/IDeck';
import type { IDeck } from '../interfaces/IDeck';
import type { IHand } from '../interfaces/IHand';
import { Hand } from './Hand';
import { PlayerHand } from './PlayerHand';
import { SimpleBot } from './SimpleBot';

export class Game {
  private hands: IHand[] = [];
  private deck: IDeck;
  private scores: number[] = [];
  private players: string[] = [];
  private bots: SimpleBot[] = [];
  private currentPlayerIndex: number = 0;
  private gameOver: boolean = false;
  private winningScore: number = 500;
  private discardPile: ICard[] = [];

  constructor(deck: IDeck) {
    this.deck = deck;
  }

  // Start the game and initialize players and bots
  start(players: string[]): void {
    this.players = players;
    this.scores = players.map(() => 0);
    this.deck.initialize();
    this.deck.shuffle();

    // Deal hands and create bots
    const playerHands = players.map(() => new PlayerHand());
    for (let i = 1; i < players.length; i++) {
      this.bots.push(new SimpleBot(playerHands[i].getCards()));  // Initialize bots with their hands
    }

    // Set discard pile's first card
    this.discardPile.push(this.deck.deal()!);

    // Create the first hand and deal cards
    const firstHand = new Hand(playerHands, this.discardPile, this.deck);
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

  // Play the player's card
  playPlayerCard(index: number): void {
    const currentHand = this.hands[this.hands.length - 1];
    currentHand.play(index);
  }

  // Draw a card for the player
  drawPlayerCard(): void {
    const currentHand = this.hands[this.hands.length - 1];
    currentHand.draw();
  }

  // Bot takes their turn
playBotTurns(botSaidUno: boolean[], botNames: string[]): void {
  this.bots.forEach((bot, index) => {
    // Pass the bot number (index) as the second argument
    const card = bot.playCard(this.discardPile);

    if (card) {
      // Bot plays a card
      this.discardPile.push(card);

      if (bot.hand.length === 1 && !botSaidUno[index]) {
        botNames[index] = `Bot ${index + 1} says UNO`;
        botSaidUno[index] = true;
      } else if (bot.hand.length === 0) {
        botNames[index] = `Bot ${index + 1} wins!`;
        this.gameOver = true;
      }
    } else {
      // Bot draws a card
      const newCard = this.deck.deal();
      if (newCard) {
        bot.drawCard(newCard);
      }
    }
  });
}

  // Update the scores based on cards left in hands
  public updateScores(): void {
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

  // Check if the game has ended
  hasGameEnded(): boolean {
    return this.gameOver;
  }

  // Return the current discard pile's top card
  currentDiscardCard(): ICard {
    return this.discardPile[this.discardPile.length - 1];
  }

  // Get the player's hand
  playerHand(): ICard[] {
    return this.hands[this.hands.length - 1].playerHand(0).getCards();
  }

  // Get the bot's hand
  botHand(index: number): ICard[] {
    return this.bots[index].hand;
  }

  private nextPlayer(): void {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  private startNewHand(): void {
    const playerHands = this.players.map(() => new PlayerHand());

    // Create a new hand and deal cards
    const newHand = new Hand(playerHands, [this.deck.deal()!], this.deck);
    this.hands.push(newHand);

    // Reset current player index to the first player for the new hand
    this.currentPlayerIndex = 0;
  }

  public logRemainingCards(playerHand: ICard[], botHands: ICard[][], botNames: string[]): void {
    console.log("Remaining cards at the end of the game:");
  
    // Helper function to display card details
    const formatCard = (card: ICard) => {
      if (card.type === 'NUMBERED') {
        return `${card.color}${card.number}`;  // Display color and number for numbered cards
      } else {
        return `${card.color}${card.type}`;    // Display color and type for special cards
      }
    };
  
    // Helper function to calculate points for each player's or bot's hand
    const calculatePoints = (hand: ICard[]): number => {
      return hand.reduce((totalPoints, card) => {
        if (card.type === 'NUMBERED') {
          return totalPoints + (card.number || 0);  // Add the card's number for numbered cards
        } else if (['BLOCK', 'REVERSE', 'DRAW2'].includes(card.type)) {
          return totalPoints + 20;  // 20 points for Block, Reverse, and Draw Two cards
        } else if (['WILD', 'DRAW4'].includes(card.type)) {
          return totalPoints + 50;  // 50 points for Wild and Draw Four cards
        }
        return totalPoints;
      }, 0);
    };
  
    // Log player's cards and points at the end
    const playerPoints = calculatePoints(playerHand);
    console.log(`Player 1 cards: ${playerHand.map(formatCard).join(', ')} and they had ${playerPoints} points.`);
  
    // Log each bot's cards and points at the end
    botHands.forEach((botHand, index) => {
      const botPoints = calculatePoints(botHand);
      console.log(`${botNames[index]} cards: ${botHand.map(formatCard).join(', ')} and they had ${botPoints} points.`);
    });
  }
  
  
}

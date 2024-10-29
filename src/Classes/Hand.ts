/*import type { ICard } from '../interfaces/IDeck';
import type { IDeck } from '../interfaces/IDeck';
import type { IPlayerHand } from '../interfaces/IPlayerHand';
import type { IHand } from '../interfaces/IHand';

export class Hand implements IHand {
  private playerHands: IPlayerHand[] = [];
  private discardPile: ICard[] = [];
  private currentPlayer: number = 0;
  private deck: IDeck;

  constructor(playerHands: IPlayerHand[], discardPile: ICard[], deck: IDeck) {
    this.playerHands = playerHands;
    this.discardPile = discardPile;
    this.deck = deck;

    // Deal cards to players when the hand starts
    this.deal(this.playerHands, 7);
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

  // Deal cards to players
  deal(playerHands: IPlayerHand[], numCards: number): void {
    for (let i = 0; i < numCards; i++) {
      playerHands.forEach((hand) => {
        const card = this.deck.deal();
        if (card) {
          hand.addCard(card); // Add the card to the player's hand
        } else {
          throw new Error('Deck is empty. Cannot deal more cards.');
        }
      });
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
*/

import type { ICard } from '../interfaces/IDeck';
import type { IDeck } from '../interfaces/IDeck';
import type { IPlayerHand } from '../interfaces/IPlayerHand';
import type { IHand } from '../interfaces/IHand';
import { PlayerHand } from './PlayerHand';
import { SimpleBot } from './SimpleBot';
import { Deck } from './Deck'
import type { IGame } from '@/interfaces/IGame';


export class Hand implements IHand {
private bots: Map<string, SimpleBot> = new Map<string, SimpleBot>();
private players: string[];
private deck: Deck;
private nextPlayer: string = '';
private direction:number = 1;
private game:IGame;
currentPlayer: string = '';
discardPile: ICard;
drawAmmount: number = 0;
hasEnded: boolean = false;
winner: string = '';
winnerScore: number = 0;
player: IPlayerHand ;

  constructor(game: IGame) {
    this.game = game
    this.players = game.getPlayers()
    this.player = new PlayerHand(this.players[0]);
    for (let i = 1; i < this.players.length; i++) {
      this.bots.set(this.players[i], new SimpleBot(this.players[i]))
    }
    this.deck = new Deck();
    this.deck.initialize();
    this.deck.shuffle();
    this.discardPile = this.deck.deal();
    for(let i = 0; i<7; i++){
    this.player.addCard(this.deck.deal())
    for (let bot of this.bots.values()) {
      bot.drawCard(this.deck.deal());
    }    
    this.currentPlayer = this.players[0];
    this.nextPlayer = this.players[1];
  }
  }

  play(card: ICard, chosenColor?: string): boolean{
    //console.log("function play() Hand.ts");
    if (card.color !== this.discardPile.color 
      && card.number !== this.discardPile.number
      && !(card.type == 'DRAW2' && card.type == 'DRAW2')
      && !['WILD', 'DRAW4'].includes(card.type))
    {
      console.warn("Cannot play that card");
      return false;
    }
    console.log(this.currentPlayer);

    if (this.currentPlayer === this.players[0]) { 
      this.player.removeCard(card);}
    else {
      const bot = this.bots.get(this.currentPlayer);
      if (bot) {
        bot.removeCard(card);
      }  
    }

    this.discardPile = card;
    let x = 1;
    if(card.type == 'BLOCK')
    {
      x=2;
    }
    else if(card.type == 'REVERSE')
    {
      this.direction = -1*this.direction
    }
    else if(card.type == 'WILD')
    {
      if (chosenColor) {
        this.discardPile.color = chosenColor as "RED" | "BLUE" | "GREEN" | "YELLOW" | "BLACK";
      } else {
        console.warn("No color chosen for wild card");
        return false;
      }}
    else if(card.type == 'DRAW2')
    {
      this.drawAmmount = 2
    }
    else if(card.type == 'DRAW4')
    {
      this.drawAmmount = 4;
      if (chosenColor) {
        this.discardPile.color = chosenColor as "RED" | "BLUE" | "GREEN" | "YELLOW" | "BLACK";;
      } else {
        console.warn("No color chosen for wild card");
        return false;
      }}
    this.checkWin()
    this.setPlayers(x)
    //console.log("current player: " +this.currentPlayer + ", next player: " + this.nextPlayer);
    return true;
  }

  drawCard(){
    //console.log("function drawCard() Hand.ts");
    let card = this.deck.deal()
    if (this.currentPlayer === this.players[0]) { 
      this.player.addCard(card);}
    else {
      const bot = this.bots.get(this.currentPlayer);
      if (bot) {
        bot.addCard(card);
      }  
    }
    this.setPlayers(1)
  }

  setPlayers(x: number) {
    let y = (this.players.indexOf(this.currentPlayer)+(x*this.direction))
    this.currentPlayer = this.players[
      (y%this.players.length + this.players.length) % this.players.length
    ];
    this.nextPlayer = this.players[this.players.indexOf(this.currentPlayer)+this.direction]
  }
    
  endTurn(){
    //console.log("function endTurn() Hand.ts");
    if (this.hasEnded)
    { console.log("game ended")
      return;}
    console.log(this.currentPlayer + "'s turn")
    if(this.drawAmmount !== 0)
    {
      if (this.currentPlayer === this.players[0]) {
        for (let i = 0; i < this.drawAmmount; i++) {
          this.player.addCard(this.deck.deal());
        }
      } 
      else {console.log("asdasdasd") 
        const bot = this.bots.get(this.currentPlayer);
        if (bot) {
          for (let i = 0; i < this.drawAmmount; i++) {
            bot.drawCard(this.deck.deal());
          }
        }  
        this.drawAmmount = 0;
      }
    }
    
    if (this.currentPlayer !== this.players[0]) {
      this.botTurn();
    }
  }

  checkWin() {
    if (this.currentPlayer === this.players[0]) {
      if(this.player.getCards().length === 0)
      {
        this.hasEnded = true;
        this.winner = this.currentPlayer;
        this.drawAmmount = 0;
        this.calculateScore();
      }
    } 
    else {
      const bot = this.bots.get(this.currentPlayer);
      if (bot && this.bots.get(this.currentPlayer)?.getCards().length === 0) {
        this.hasEnded = true;
        this.winner = this.currentPlayer;
        this.drawAmmount = 0;
        this.calculateScore();
      }  
     
    }
  }

  private botTurn() {
    console.log("function botTurn() Hand.ts");
    const bot = this.bots.get(this.currentPlayer);
    if(bot)
    {
      bot.playCard(this)
    }
  }

  getTopCard(): ICard{
    return this.discardPile;
  }
  getBots(): SimpleBot[]{
    return Array.from(this.bots.values());
  }

  calculateScore(){
    this.winnerScore = 0;
    //do calculation
    this.game.endHand(this.winner, this.winnerScore)
  }

  getWinnerScore(): number{
    return this.winnerScore;
  }
}
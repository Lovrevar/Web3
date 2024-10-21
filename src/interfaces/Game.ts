export interface Game {
  // Start the game with a set number of players and initialize their hands
  start(players: string[]): void;

  // Play a round of the game
  playRound(): void;

  // Check if the game has ended (a player has reached the winning score)
  hasGameEnded(): boolean;

  // Return the current score of the game
  currentScore(): number[];

  // Return the winner of the game if the score limit is reached
  gameWinner(): string | undefined;
}

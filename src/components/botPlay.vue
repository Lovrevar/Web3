import { Card } from './interfaces';  // Assuming interfaces are in a separate file

// The botPlay function uses the Card interface to type the botHand and discardPile.
export function botPlay(botHand: Card[], discardPile: Card[]): Card | null {
  const legalPlays = botHand.filter((card) => {
    return card.color === discardPile[discardPile.length - 1].color || 
           card.number === discardPile[discardPile.length - 1].number || 
           card.type === 'WILD' || 
           card.type === 'WILD DRAW';
  });

  if (legalPlays.length > 0) {
    const chosenCard = legalPlays[Math.floor(Math.random() * legalPlays.length)];
    console.log(`Bot plays: ${chosenCard.color} ${chosenCard.number || chosenCard.type}`);

    // Simulate bot forgetting to say "UNO"
    if (botHand.length === 2) {
      if (Math.random() < 0.5) {
        console.log('Bot forgot to say UNO!');

        // Apply penalty for bot forgetting to say "UNO"
        // This will depend on your game logic
      } else {
        console.log('Bot says UNO!');
      }
    }

    return chosenCard;
  } else {
    console.log('Bot draws a card');
    return null;  // Bot draws a card if no legal plays
  }
}

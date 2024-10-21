export function botPlay(botHand, discardPile) {
  const legalPlays = botHand.filter(card => {
    return card.color === discardPile.top().color || card.number === discardPile.top().number;
  });

  if (legalPlays.length > 0) {
    const chosenCard = legalPlays[Math.floor(Math.random() * legalPlays.length)];
    console.log(`Bot plays: ${chosenCard.color} ${chosenCard.number || chosenCard.type}`);
    
    // Simulate bot forgetting to say "UNO"
    if (botHand.length === 2) {
      if (Math.random() < 0.5) {
        console.log('Bot forgot to say UNO!');
        // Add logic for bot being caught forgetting "UNO"
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

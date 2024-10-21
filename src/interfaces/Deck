interface Card {
  type: 'NUMBERED' | 'SKIP' | 'REVERSE' | 'DRAW' | 'WILD' | 'WILD DRAW';
  color: 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' | null; // Wild cards have null color
  number?: number; // Only present for NUMBERED cards
}

interface Deck {
  // Initialize the deck with 108 cards, including special cards
  initialize(): Card[];

  // Shuffle the deck using a provided shuffling method
  shuffle(shuffler: Function): void;

  // Deal a card from the deck (removes the card from the deck)
  deal(): Card | undefined;

  // Return the current size of the deck
  size(): number;
}

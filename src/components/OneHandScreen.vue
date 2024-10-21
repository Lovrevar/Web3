<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

// Initialize playerHand and opponentHands as empty arrays or populate with initial values
const playerHand = reactive([]); // Empty array initially, to be filled with cards later
const opponentHands = reactive([]); // Empty array for opponents' hands

const scores = reactive([0, 0, 0]); // Scores of players (or bots)

// Function to calculate score based on remaining cards in hands
const calculateScore = (hands) => {
  let score = 0;
  hands.forEach(hand => {
    hand.forEach(card => {
      if (card.type === 'NUMBERED') {
        score += card.number;
      } else {
        score += (card.type === 'WILD' || card.type === 'WILD DRAW') ? 50 : 20;
      }
    });
  });
  return score;
};

// Function to handle the end of a hand
const endHand = () => {
  const router = useRouter();
  const playerScore = calculateScore(opponentHands); // Calculate score based on opponents' hands
  scores[0] += playerScore;  // Add score to the player (index 0)

  // Check if game is over
  if (scores[0] >= 500) {
    // Navigate to Game Over screen
    router.push('/game-over');
  } else {
    // Start the next hand
    console.log('Starting next hand...');
  }
};

</script>

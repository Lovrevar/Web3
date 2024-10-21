<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const playerHand = reactive([...]);
const opponentHands = reactive([...]); // The hands of bots/opponents
const scores = reactive([0, 0, 0]); // Scores of players (or bots)

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

const endHand = () => {
  const playerScore = calculateScore(opponentHands);
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

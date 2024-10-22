<template>
    <div :class="['card', cardColorClass]">
      <!-- Ellipse -->
      <div class="ellipse"></div>
  
      <!-- Large centered content with the card color applied directly -->
      <div v-if="isNumberCard" class="large-content">{{ card.number }}</div>
      <div v-if="isSkipCard" class="large-content">⦸</div>
      <div v-if="isReverseCard" class="large-content">↻</div>
      <div v-if="isDrawCard" class="large-content"><span class="plus-symbol">+</span>2</div>
      <div v-if="isWildCard" class="wild-content">
  <div class="wild-oval large">
    <div class="wild-segment yellow"></div>
    <div class="wild-segment green"></div>
    <div class="wild-segment blue"></div>
    <div class="wild-segment red"></div>
  </div>
</div>
      <div v-if="isWildDrawCard" class="large-content"><span class="plus-symbol">+</span>4</div>
  
      <!-- Small upper-left corner content with card color applied directly -->
      <div v-if="isNumberCard" class="corner-content top-left">{{ card.number }}</div>
      <div v-if="isSkipCard" class="corner-content top-left">⦸</div>
      <div v-if="isReverseCard" class="corner-content top-left">↻</div>
      <div v-if="isDrawCard" class="corner-content top-left"><span class="plus-symbol small">+</span>2</div>
      <div v-if="isWildCard" class="corner-wild-content top-left">
  <div class="wild-oval">
    <div class="wild-segment yellow"></div>
    <div class="wild-segment green"></div>
    <div class="wild-segment blue"></div>
    <div class="wild-segment red"></div>
  </div>
</div>
      <div v-if="isWildDrawCard" class="corner-content top-left"><span class="plus-symbol small">+</span>4</div>
  
      <!-- Small bottom-right corner content with card color applied directly -->
      <div v-if="isNumberCard" class="corner-content bottom-right">{{ card.number }}</div>
      <div v-if="isSkipCard" class="corner-content bottom-right">⦸</div>
      <div v-if="isReverseCard" class="corner-content bottom-right">↻</div>
      <div v-if="isDrawCard" class="corner-content bottom-right"><span class="plus-symbol small">+</span>2</div>
      <div v-if="isWildCard" class="corner-wild-content bottom-right">
  <div class="wild-oval">   
    <div class="wild-segment yellow"></div>
    <div class="wild-segment green"></div>
    <div class="wild-segment blue"></div>
    <div class="wild-segment red"></div>
  </div>
</div>
      <div v-if="isWildDrawCard" class="corner-content bottom-right"><span class="plus-symbol small">+</span>4</div>
    </div>
  </template>
  
  
  

<script lang="ts">
import { defineComponent } from 'vue';

import type { ICard } from '../interfaces/IDeck.js';

export default defineComponent({
  name: 'UNOCard',
  props: {
    card: {
      type: Object as () => ICard,
      required: true,
    },
  },
  computed: {
    cardColorClass() {
      const color = this.card.color ? this.card.color.toLowerCase() : 'black';
      return color;
    },
    isNumberCard() {
      return this.card.type === 'NUMBERED';
    },
    isSkipCard() {
      return this.card.type === 'BLOCK';
    },
    isReverseCard() {
      return this.card.type === 'REVERSE';
    },
    isDrawCard() {  
      return this.card.type === 'DRAW2';
    },
    isWildCard() {
      return this.card.type === 'WILD';
    },
    isWildDrawCard() {
      return this.card.type === 'DRAW4';
    },
  },
});
</script>

<style scoped>
/* Card base styles */ 
.card {
  width: 100px;
  height: 160px;
  border-radius: 16px;
  display: inline-block;
  position: relative;
  font-family: 'Tahoma';
  text-align: center;
  font-weight: bold;
  font-size: 32px;
  border: 2px solid white;
  margin: 10px;
  overflow: hidden;
}

.red { background-color: #C11F1F; }
.green { background-color: #3E9E32; }
.blue { background-color: #3F4CFF; }
.yellow { background-color: #DED71F; }
.black { background-color: black; }

/* Ellipse */
.ellipse {
  background-color: white;
  width: 80%;
  height: 65%;
  border-radius: 50%;
  margin: auto;
  transform: skewX(-25deg);
  position: absolute;
  top: 15%;
  left: 10%;
}

/* Center symbol (Large content) - Matches card color */
.large-content {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 56px;
}

/* Set the middle symbol color based on the card's color */
.red .large-content {
  color: #C11F1F;
}

.green .large-content {
  color: #3E9E32;
}

.blue .large-content {
  color: #3F4CFF;
}

.yellow .large-content {
  color: #DED71F;
}

/* Corner symbols (Small corner content) - Always white */
.corner-content {
  position: absolute;
  font-size: 20px;
  font-weight: bold;
  color: white; /* Make the corner content white */
}

.top-left {
  top: 5px;
  left: 10px;
}

.bottom-right {
  right: 10px;
  bottom: 5px;
  transform: rotate(180deg);
}

/* Wild card specific changes */
.wild-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 70%;
  height: 70%;
  position: absolute;
  top: 20%;
  left: 15%;
}

.segment {
  width: 45%;
  height: 45%;
  border-radius: 50%;
}

.corner-wild-content {
  position: absolute;
  top: 5px;
  left: 10px;
  width: 20px;
  height: 20px;
  background: linear-gradient(to bottom right, red 50%, blue 50%), linear-gradient(to top right, yellow 50%, green 50%);
  background-size: 100% 100%;
  border-radius: 50%;
}

.plus-symbol {
  font-size: 30px; /* Smaller font size for + in the middle */
}

/* Styling for smaller corner + symbols */
.plus-symbol.small {
  font-size: 14px; /* Smaller font size for + in corners */
}

/* Wild card specific changes */
    .wild-oval {
    position: relative;
    width: 20px;
    height: 30px;
    border-radius: 50%; /* Oval shape */
    overflow: hidden;
    transform: skewX(-25deg); /* Optional: Adds a skew for a slanted appearance */
    border: 1px solid white; /* Thin white border for a cleaner look */
    }

    /* Each segment is half of the oval */
    .wild-segment {
    position: absolute;
    width: 50%;
    height: 50%;
    }

    .yellow {
    background-color: yellow;
    top: 0;
    left: 0;
    }

    .green {
    background-color: green;
    top: 0;
    right: 0;
    }

    .blue {
    background-color: blue;
    bottom: 0;
    left: 0;
    }

    .red {
    background-color: red;
    bottom: 0;
    right: 0;
    }

    /* Positioning of the corner wild content */
    .corner-wild-content {
    position: absolute;
    width: 20px;
    height: 30px;
    }

    .top-left {
    top: 5px;
    left: 10px;
    }

    .bottom-right {
    right: 10px;
    bottom: 5px;
    transform: rotate(180deg); /* Inverts for the opposite corner */
    }
    .wild-oval.large {
  width: 80px;
  height: 120px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) skewX(-25deg); /* Center the large oval */
}
</style>

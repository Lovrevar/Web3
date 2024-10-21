// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import GameSetupScreen from '../components/GameSetupScreen.vue';
import OneHandScreen from '../components/OneHandScreen.vue';
import GameOverScreen from '../components/GameOverScreen.vue';

const routes = [
  { path: '/', component: GameSetupScreen },        // Setup screen (choose bots)
  { path: '/play-hand', component: OneHandScreen }, // Play one hand
  { path: '/game-over', component: GameOverScreen } // Game over screen
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

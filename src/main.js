// src/main.js
import Phaser from 'phaser';
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { Story } from './scenes/Story';
import { Transition } from './scenes/Transition';
import { LevelZero } from './scenes/levels/LevelZero';
import { GameOver } from './scenes/GameOver';

const config = {
  type: Phaser.CANVAS,
  parent: 'game-container',
  backgroundColor: '#028af8',
  pixelArt: true,
  scale: {
    width: 1024,
    height: 768,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false,
    },
  },
  scene: [
    Boot,
    Preloader,
    Story,
    Transition,
    LevelZero,
    GameOver
  ],
};

export default new Phaser.Game(config);

// TODO: Fix issue with unproper collision with angled tiles and objects
// TODO: Add basic UI for the player, like health, ammo
// TODO: Player death
// TODO: Begin programming traps 
// TODO: Create general enemy class and level class. 

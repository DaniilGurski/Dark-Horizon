import Phaser from 'phaser';
import PhaserRaycaster from 'phaser-raycaster'
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { Story } from './scenes/Story';
import { Transition } from './scenes/Transition';
import { LevelZero } from './scenes/levels/LevelZero';

const GRAVITY_Y = 800;

const config = {
    type: Phaser.CANVAS,
    parent: 'game-container',
    backgroundColor: '#028af8',
    pixelArt: true,

    scale: {
        width: 1024,
        height: 768,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GRAVITY_Y },
            debug: false, 
        }
    },

    scene: [
        Boot,
        Preloader,
        Story,
        Transition, 
        LevelZero,
    ],    
};

export default new Phaser.Game(config);

// TODO: Fix issue with unproper collision with angled tiles and objects
// TODO: Add basic UI for the player, like health, ammo
// TODO: Player death
// TODO: Begin programming traps 
// TODO: Create general enemy class and level class. 

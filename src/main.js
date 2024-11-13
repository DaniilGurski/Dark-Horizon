import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { Story } from './scenes/Story';
import { Transition } from './scenes/Transition';

const GRAVITY_Y = 400;

const config = {
    type: Phaser.CANVAS,
    parent: 'game-container',
    backgroundColor: '#028af8',
    // pixelArt: true,

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
            debug: true, 
        }
    },

    scene: [
        Boot,
        Preloader,
        Story,
        Transition, 
    ]
};

export default new Phaser.Game(config);

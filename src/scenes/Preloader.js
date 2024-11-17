import { Scene } from 'phaser';
import DataUtils from '../utils/data-utils';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        // Data
        this.load.json("animations", "data/animations.json");
        
        // Backgrounds
        this.load.image("story-bg", "backgrounds/darkness.png");
        this.load.image("transition-cutscene-bg", "backgrounds/space.png");
        
        // Spritesheets
        this.load.spritesheet("planet", "spritesheets/planet.png", {
            frameWidth: 100,
            frameHeight: 100,
        })
        this.load.image("ship-1", "spritesheets/ship-1.png");
        this.load.image("ship-2", "spritesheets/ship-2.png");
        this.load.image("ship-3", "spritesheets/ship-3.png");
        this.load.image("ship-particle", "spritesheets/particle.png");
        

        // UI
        this.load.image("cross-icon", "ui/cross.png");
        this.load.image("next-icon", "ui/next.png");

        // Sounds
        this.load.audio("typing", "sounds/sci-fi-typing.mp3");
        this.load.audio("space-ambient", "sounds/space-ambient.mp3");
        this.load.audio("spaceship-passing-01", "sounds/spaceship-passing01.mp3");
        this.load.audio("spaceship-passing-02", "sounds/spaceship-passing02.mp3");
        this.load.audio("spaceship-passing-03", "sounds/spaceship-passing03.mp3");
    }

    create ()
    {
        this.scene.start('Story');
        this.createAnimations();
    }

    createAnimations()
    {
        // Get animation data from cache
        const animations = DataUtils.getAnimations(this);

        animations.forEach((animation) => {
            // Generate frames if there are any
            const frames = animation.frames ? 
            this.anims.generateFrameNumbers(animation.asset, { frames: animation.frames }) :
            this.anims.generateFrameNumbers(animation.asset)

            this.anims.create({
                key: animation.key,
                frames: frames,
                frameRate: animation.frameRate,
                repeat: animation.repeat,
                yoyo: animation.yoyo
            })
        })
    }
}

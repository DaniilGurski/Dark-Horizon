import { Scene } from 'phaser';

export class Transition extends Scene
{
    constructor ()
    {
        super('Transition');
    }

    create ()
    {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.add.image(0, 0, "transition-cutscene-bg").setOrigin(0, 0);
        this.sound.add("space-ambient", { loop: true }).play();
        console.log("Transition scene: create invoked")
    }
}

import { Scene } from 'phaser';

export class Transition extends Scene
{
    constructor ()
    {
        super('Transition');
        this.shipDistance = 200;
    }

    startShips(ships) {
        ships.forEach((ship, index) => {
            index += 1;

            ship.body.allowGravity = false;

            this.time.delayedCall(index * 1500, () => {
                console.log("Playing sound", index);
                this.sound.add(`spaceship-passing-0${index}`).play();
            }, [], this);
        
            this.time.addEvent({
                delay: index * 2000,

                callback: () => {
                    ship.setVelocityX(2500);
                    this.cameras.main.flash(1000, 230, 230, 230);
                },

                loop: false
            })
        })
    }

    create ()
    {
        const { width, height } = this.sys.game.config;

        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.zoomTo(1.2, 20000)
        this.add.image(0, 0, "transition-cutscene-bg").setOrigin(0, 0);
        this.sound.add("space-ambient", { loop: true }).play();

        this.planet = this.physics.add.sprite(width / 2, height / 2, "planet").setScale(3.5);
        this.planet.anims.play("planet-spin");
        this.planet.body.allowGravity = false;

        this.ship1 = this.physics.add.sprite(0, height / 2, "ship-1").setScale(2).setOrigin(1, 0.5);
        this.ship2 = this.physics.add.sprite(0, (height / 2) - this.shipDistance, "ship-2").setScale(2).setOrigin(1, 0.5);
        this.ship3 = this.physics.add.sprite(0, (height / 2) + this.shipDistance, "ship-3").setScale(2).setOrigin(1, 0.5);

        this.startShips([this.ship1, this.ship2, this.ship3]);

        this.time.delayedCall(10000, () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
        
            this.time.delayedCall(2000, () => {                
                this.sound.stopAll();
                this.scene.start('LevelZero');
            }, [], this);

        }, [], this);
    }

    // skip cutscene
    update() {
        if (this.input.keyboard.checkDown(this.input.keyboard.addKey('SPACE'), 500)) {
            this.sound.stopAll();
            this.scene.start('LevelZero');
        }
    }
}

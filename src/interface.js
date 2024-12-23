import * as FontLoader from 'webfontloader';

export class PlayerInterface {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;

        // Add the health bar sprite using the atlas
        this.healthbar = this.scene.physics.add.sprite(0, 0, 'healthbar', 'healthbar0005')
            .setOrigin(0, 0)
            .setScale(3)
            .setScrollFactor(0)
            .setDepth(1000);
        this.healthbar.setImmovable(true)
        this.healthbar.body.allowGravity = false

        this.healthbar.x = 260;
        this.healthbar.y = 200;

        // Set the initial frame based on the player's health
        this.updateHealthbar();

        // Ammo UI asset, positioned below the health bar
        this.ammoArrows = this.scene.add.image(this.healthbar.x, this.healthbar.y + 30, 'ammo-arrows')
        .setScale(0.4)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(1000);

        // Ammo text centered on the ammoArrows
        this.ammoText = this.scene.add
        .text(
            (this.ammoArrows.x) + (this.ammoArrows.width * this.ammoArrows.scaleX) / 2,
            this.ammoArrows.y + (this.ammoArrows.height * this.ammoArrows.scaleY) / 2,
            `${this.player.ammo} / ${this.player.maxAmmo}`,
            {
            fontSize: '1rem',
            color: '#ffffff',
            }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(1001);


        FontLoader.load({
            google: {
                families: ['Josefin Sans'],
            },
            active: () => {
                this.ammoText.setFontFamily('Josefin Sans');
            },
        });
    }

    updateHealthbar() {
        // Calculate the frame based on the player's health
        const frame = `healthbar000${Math.max(this.player?.health - 1, 0)}`;
        this.healthbar.setFrame(frame);
    }


    updateAmmoIndicator() {
        this.ammoText.setText(`${this.player.ammo}/${this.player.maxAmmo}`);
    }
}
// TODO: How do we make the interface be part of camera ?
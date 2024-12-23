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
        // this.healthbar.anims.play("healthbar-idle", true);
    }

    updateHealthbar() {
        // Calculate the frame based on the player's health
        const frame = `healthbar000${Math.max(this.player?.health - 1, 0)}`;
        console.log(frame)
        this.healthbar.setFrame(frame);

    }
}
// TODO: How do we make the interface be part of camera ?
export class HealthPickup {
    constructor(scene, x, y) {
        this.player = scene.player;
        this.object = scene.physics.add.sprite(x, y, 'health-pickup').setScale(0.6);

        // add overlap between the player and the pickup, on overlap call the players heal method
        scene.physics.add.overlap(this.player.object, this.object, () => {
            if (this.player.health === this.player.maxHealth) return;
            
            scene.sound.add("health-pickup").setVolume(0.3).play();
            this.player.heal();
            this.object.destroy();
        }, null, scene);

    }
}

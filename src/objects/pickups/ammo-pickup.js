export class AmmoPickup {
  constructor(scene, x, y) {
    this.player = scene.player;
    this.object = scene.physics.add.sprite(x, y, "ammo-pickup").setScale(0.6);

    // add overlap between player and ammo pickup
    scene.physics.add.overlap(
      this.player.object,
      this.object,
      () => {
        if (this.player.ammo === this.player.maxAmmo) return;

        scene.sound.add("ammo-pickup").setVolume(0.3).play();
        this.player.collectAmmo();
        this.object.destroy();
      },
      null,
      scene
    );
  }
}

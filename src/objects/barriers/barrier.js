export default class Barrier {
  constructor(scene, x, y, barrierId) {
    this.scene = scene;
    this.object = scene.physics.add.sprite(x, y, "barrier-active");
    this.object.barrierId = barrierId;

    // Make the object immovable
    this.object.setImmovable(true);

    // Disable physics
    this.object.body.allowGravity = false;
    this.object.body.moves = false;

    // Set collision with the player
    this.scene.physics.add.collider(this.object, this.scene.player.object);

    this.object.owner = this;
  }

  deactivate() {
    this.object.anims.stop();
    this.object.setTexture("barrier-inactive");
    this.object.anims.play("barrier-deactivate");
    this.object.body.enable = false;
  }
}

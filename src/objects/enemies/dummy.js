export default class Dummy {
  constructor(scene, x, y, obstacleLayer) {
    this.health = 3;
    this.scene = scene;
    this.object = scene.physics.add.sprite(x, y, "player", "idle0000").setScale(3).setDepth(0);

    this.scene.physics.add.collider(this.object, obstacleLayer);
    this.scene.physics.add.overlap(this.object, this.scene.player.object);
    this.object.owner = this;
  }

  decreaseHealth() {
    this.health -= 1;
    if (this.health <= 0) {
      this.object.destroy();
    }
  }
}

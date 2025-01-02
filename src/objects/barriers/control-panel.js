export default class ControlPanel {
  constructor(scene, x, y, barrierId) {
    this.scene = scene;
    this.object = scene.physics.add.sprite(x, y, "control-panel-active").setSize(32, 32).setImmovable(true);
    this.object.barrierId = barrierId;
    this.object.body.allowGravity = false;
    this.object.body.allowGravity = false;
    this.object.body.moves = false;

    // Make the object immovable
    this.object.setImmovable(true);
    // Disable physics
    this.object.body.allowGravity = false;
    this.object.body.moves = false;

    this.object.setDepth(1);
    this.object.owner = this;
  }
}

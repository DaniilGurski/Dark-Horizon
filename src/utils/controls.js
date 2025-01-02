import DIRECTIONS from "./directions";

export default class Controls {
  constructor(scene) {
    this.scene = scene;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.shootKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  getSpaceKeyPressed() {
    return Phaser.Input.Keyboard.JustDown(this.spaceKey);
  }

  getJumpKeyPressed() {
    return this.cursors.up.isDown;
  }

  getShootKeyPressed() {
    return Phaser.Input.Keyboard.JustDown(this.shootKey);
  }

  getPressedDirectionKey() {
    let selectedDirection = DIRECTIONS.NONE;

    if (this.cursors.left.isDown) {
      selectedDirection = DIRECTIONS.LEFT;
    } else if (this.cursors.right.isDown) {
      selectedDirection = DIRECTIONS.RIGHT;
    }

    return selectedDirection;
  }
}

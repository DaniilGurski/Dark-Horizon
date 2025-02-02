import DIRECTIONS from "./directions";

export default class Controls {
  constructor(scene) {
    this.scene = scene;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.shootKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.wKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.tabKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
    this.eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // disable context menu on right click
    this.scene.input.mouse.disableContextMenu();
  }

  getEkeyPressed() {
    return this.eKey.isDown;
  }

  getJumpKeyPressed() {
    return this.cursors.up.isDown || this.wKey.isDown || this.tabKey.isDown || this.spaceKey.isDown;
  }

  getShootKeyPressed() {
    return Phaser.Input.Keyboard.JustDown(this.shootKey) || this.scene.input.mousePointer.leftButtonDown();
  }

  getPressedDirectionKey() {
    let selectedDirection = DIRECTIONS.NONE;

    if (this.cursors.left.isDown || this.aKey.isDown) {
      selectedDirection = DIRECTIONS.LEFT;
    } else if (this.cursors.right.isDown || this.dKey.isDown) {
      selectedDirection = DIRECTIONS.RIGHT;
    }

    return selectedDirection;
  }
}

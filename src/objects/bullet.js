export default class Bullet {
  constructor(scene, x, y, direction, angleOffset = 0) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.speed = 800;
    this.object = this.scene.physics.add.sprite(this.x, this.y, "player").setScale(1);
    this.object.anims.play("player-bullet", true);

    // disable physics for the bullet
    this.object.body.allowGravity = false;
    this.object.body.immovable = true;
    this.object.body.onWorldBounds = true;

    // Calculate the angle in radians
    const angleRad = Phaser.Math.DegToRad(angleOffset);
    const speedX = this.speed * Math.cos(angleRad) * (direction === "right" ? 1 : -1);
    const speedY = this.speed * Math.sin(angleRad);

    // set the bullet speed
    this.object.setVelocity(speedX, speedY);

    this.object.owner = this;
    this.scene.bullets.add(this.object);

    // Add collision with obstacles
    this.scene.physics.add.collider(this.object, this.scene.obstacleLayer, this.destroyBullet, null, this);
    this.scene.physics.add.collider(this.object, this.scene.barriers, this.destroyBullet, null, this);

    this.scene.physics.world.on("worldbounds", (body) => {
      if (body.gameObject === this.object) {
        this.destroyBullet();
      }
    });

    // Destroy the bullet after a few seconds
    this.scene.time.delayedCall(300, this.destroyBullet, [], this); // Adjust the delay as needed
  }

  destroyBullet() {
    this.object.destroy();
  }
}

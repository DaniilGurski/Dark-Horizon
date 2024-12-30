import { startKickback } from "../../utils/effects";

// Define per-variant configurations
const ENEMY_VARIANTS = {
  default: {
    speed: 100,
    scale: 1,
    damage: 1,
    health: 3,
  },
  attacker: {
    speed: 80,
    scale: 1.1,
    damage: 2,
    health: 4,
  },
  fast: {
    speed: 150,
    scale: 0.85,
    damage: 1,
    health: 2,
  },
  tank: {
    speed: 50,
    scale: 1.3,
    damage: 6,
    health: 5,
  },
};

export default class DarknessEnemy {
  constructor(scene, x, y, obstacleLayer, type = "default") {
    this.scene = scene;

    // Merge the variant config with your defaults
    this.config = ENEMY_VARIANTS[type] || ENEMY_VARIANTS["default"];
    this.enemyAnimationKey = `${type}-enemy`;

    // Assign stats
    this.health = this.config.health;
    this.damage = this.config.damage;
    this.speed = this.config.speed;

    // Create the sprite with the specified asset and scale
    this.object = scene.physics.add.sprite(x, y, `enemy-${type}`).setScale(this.config.scale);

    // Random patrol direction
    this.directions = ["left", "right"];
    this.currentDirection = this.directions[Math.floor(Math.random() * this.directions.length)];
    this.state = {
      isDead: false,
      isChasing: false,
      isAttacking: false,
      isPatroling: true,
      isStunned: false,
    };

    // Add collision
    scene.physics.add.collider(this.object, obstacleLayer);
    this.object.owner = this;

    // Optional particle emitter for visuals
    this.emitter = this.scene.add.particles(this.object.x, this.object.y, "dark-particle", {
      scale: { start: 1, end: 0 },
      speed: { min: 100, max: 200 },
      lifespan: 400,
      quantity: 100,
      emitting: false,
    });
  }

  patrol() {
    // this.emitter.startFollow(this.object, this.object.width / 2, this.object.height / 2)
    // check if the enemy hits the wall
    if (this.object.body.blocked.right || this.object.body.blocked.left) {
      this.currentDirection = this.currentDirection === "left" ? "right" : "left";
    }

    // move the enemy
    if (this.currentDirection === "left") {
      this.object.setVelocityX(this.config.speed * -1);
    } else if (this.currentDirection === "right") {
      this.object.setVelocityX(this.config.speed);
    }

    // play move animation and flip the sprite
    this.object.flipX = this.currentDirection === "left";
    // this.object.anims.play("darkness-move", true);
  }

  followPlayer() {
    const directionX = this.scene.player.object.x - this.object.x;
    const magnitude = Math.hypot(directionX, 0);
    this.object.setVelocityX((directionX / magnitude) * this.config.speed);
  }

  checkPlayerProximity() {
    const dx = this.object.x - this.scene.player.object.x;
    const dy = this.object.y - this.scene.player.object.y;

    const distanceX = Math.abs(dx);
    const distanceY = Math.abs(dy);

    if (distanceX < 25 && (distanceY < 70 || this.scene.player.inAir)) {
      this.state = {
        ...this.state,
        isAttacking: true,
        isChasing: false,
        isPatroling: false,
      };
    } else if (distanceX < 150 && (distanceY < 70 || this.scene.player.inAir)) {
      this.object.flipX = dx > 0;

      this.state = {
        ...this.state,
        isAttacking: false,
        isChasing: true,
      };
    } else {
      this.state = {
        ...this.state,
        isAttacking: false,
        isChasing: false,
        isPatroling: true,
      };
    }
  }

  decreaseHealth() {
    this.health -= 1;
    this.scene.cameras.main.shake(100, 0.005);

    if (this.health <= 0) {
      this.state = {
        ...this.state,
        isDead: true,
      };
      this.emitter.explode(40);
      // remove from enemies group
      this.object.destroy();
    } else {
      this.state = {
        ...this.state,
        isPatroling: false,
        isChasing: false,
        isAttacking: false,
        isStunned: true,
      };

      this.object.anims.play(`${this.enemyAnimationKey}-hit`, true);

      this.scene.time.delayedCall(1500, () => {
        this.state = {
          ...this.state,
          isStunned: false,
        };
      });

      // bounce back the enemy in the opposide direction of the player
      const dx = this.object.x - this.scene.player.object.x;
      startKickback(this.object, 800, 100, dx > 0, this.kickbackTween);
    }
  }

  update() {
    this.emitter.setPosition(this.object.x, this.object.y);

    if (this.state.isDead) {
      this.object.setVelocity(0);
      this.object.destroy();

      return;
    } else if (this.state.isStunned) {
      return;
    }

    this.checkPlayerProximity();

    if (this.state.isAttacking) {
      if (this.attackInProgress) {
        return;
      }
      this.attackInProgress = true;
      this.object.setVelocityX(0);
      this.object.anims.play(`${this.enemyAnimationKey}-attack`, true);

      // if enemy and player overlap
      this.scene.time.delayedCall(300, () => {
        if (this.scene.physics.overlap(this.object, this.scene.player.object)) {
          this.scene.player.takeDamage(this.config.damage);
          startKickback(this.scene.player.object, 800, 600, null, !this.object.flipX, this.scene.player.kickbackTween);
        }

        this.attackInProgress = false;
      });
    } else if (this.state.isChasing) {
      this.object.anims.play(`${this.enemyAnimationKey}-move`, true);
      this.followPlayer();
    } else if (this.state.isPatroling) {
      this.object.anims.play(`${this.enemyAnimationKey}-move`, true);
      this.patrol();
    } else if (this.state.isStunned) {
      this.object.setVelocity(0);
      this.object.anims.play(`${this.enemyAnimationKey}-hit`, true);
    }
  }
}

import { startKickback } from "../../utils/effects";

// Define per-variant configurations
const ENEMY_VARIANTS = {
  default: {
    speed: 100,
    scale: 1,
    damage: 1,
    health: 3,
    particle: "dark-particle",
    score: 1,
  },
  attacker: {
    speed: 80,
    scale: 1.1,
    damage: 2,
    health: 4,
    particle: "red-particle",
    score: 2,
  },
  fast: {
    speed: 150,
    scale: 0.85,
    damage: 1,
    health: 2,
    particle: "blue-particle",
    score: 1,
  },
  tank: {
    speed: 50,
    scale: 1.3,
    damage: 6,
    health: 5,
    particle: "white-particle",
    score: 3,
  },
};

export default class DarknessEnemy {
  constructor(scene, x, y, obstacleLayer, type = "default") {
    this.scene = scene;
    this.type = type;
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
      isPatroling: true,
      isStunned: false,
    };
    // Add collision
    scene.physics.add.collider(this.object, obstacleLayer);
    this.object.owner = this;
    // Optional particle emitter for visuals

    this.particleColor = ENEMY_VARIANTS[type].particle;

    this.emitter = this.scene.add.particles(this.object.x, this.object.y, this.particleColor, {
      scale: { start: this.particleColor === "white-particle" ? 2 : 1, end: 0 },
      speed: { min: 100, max: 200 },
      lifespan: 400,
      quantity: 100,
      emitting: false,
    });

    // Add overlap between enemy and player
    scene.physics.add.overlap(this.object, scene.player.object, this.dealDamageToPlayer, null, this);

    // Initialize last damage time
    this.lastDamageTime = 0;

    this.damageSounds = [
      this.scene.sound.add("scream1").setVolume(0.2),
      this.scene.sound.add("scream2").setVolume(0.2),
      this.scene.sound.add("scream3").setVolume(0.2),
      this.scene.sound.add("scream4").setVolume(0.2),
    ];

    this.impactSounds = [
      this.scene.sound.add("impact1").setVolume(0.2),
      this.scene.sound.add("impact2").setVolume(0.2),
      this.scene.sound.add("impact3").setVolume(0.2),
    ];
  }

  patrol() {
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
  }

  dealDamageToPlayer() {
    const currentTime = this.scene.time.now;
    const damageCooldown = 1000; // 1 second cooldown

    if (currentTime - this.lastDamageTime > damageCooldown) {
      if (!this.state.isDead && !this.state.isStunned) {
        this.scene.player.disableMovement();
        this.scene.player.takeDamage(this.config.damage);
        startKickback(this.scene.player.object, 500, 200, null, !this.object.flipX, this.scene.player.kickbackTween);
        this.lastDamageTime = currentTime;
      }
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
    if (this.state.isPatroling) {
      this.object.anims.play(`${this.enemyAnimationKey}-move`, true);
      this.patrol();
    } else if (this.state.isStunned) {
      this.object.setVelocity(0);
      this.object.anims.play(`${this.enemyAnimationKey}-hit`, true);
    }
  }

  decreaseHealth() {
    this.health -= 1;
    this.scene.cameras.main.shake(100, 0.005);
    this.damageSounds[Math.floor(Math.random() * this.damageSounds.length)].play();
    this.impactSounds[Math.floor(Math.random() * this.impactSounds.length)].play();

    if (this.health <= 0) {
      this.state = {
        ...this.state,
        isDead: true,
      };
      this.emitter.explode(40);
      this.scene.player.score += ENEMY_VARIANTS[this.type].score;

      // remove from enemies group
      this.object.destroy();
    } else {
      this.state = {
        ...this.state,
        isPatroling: false,
        isStunned: true,
      };

      this.object.setVelocity(0); // Stop the enemy from moving
      this.object.anims.play(`${this.enemyAnimationKey}-hit`, true);

      this.scene.time.delayedCall(1500, () => {
        this.state = {
          ...this.state,
          isStunned: false,
          isPatroling: true,
        };
      });
    }
  }
}

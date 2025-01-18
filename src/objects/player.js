import DIRECTIONS from "../utils/directions";
import Bullet from "./bullet";
import { startKickback } from "../utils/effects";
import { playerConfig } from "../utils/config";

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x - 24;
    this.y = y;
    this.score = 0;
    this.respawnTimer;
    this.health = 6;
    this.ammo = 10;
    this.maxAmmo = 10;
    this.maxHealth = 6;
    this.knockedBack = false;
    this.moving = false;
    this.state = "idle";
    this.inAir = true;
    this.isShooting = false;
    this.reloading = false;
    this.disabled = false;
    this.kickbackTween;
    this.footStepSound;

    this.object = scene.physics.add.sprite(this.x, this.y, "player").setSize(36, 45).setOffset(0.5, 0);
    this.object.body.setGravityY(playerConfig.gravityY);
    this.object.setScale(playerConfig.scale);
    this.object.setDepth(2);
    this.object.on("animationcomplete", () => {
      this.isShooting = false;
    });

    // Footstep sounds
    this.footstepSounds = [
      this.scene.sound.add("step1"),
      this.scene.sound.add("step2"),
      this.scene.sound.add("step3"),
      this.scene.sound.add("step4"),
    ];

    this.damageSounds = [
      this.scene.sound.add("damage1"),
      this.scene.sound.add("damage2"),
      this.scene.sound.add("damage3"),
    ];
    this.trapDamageSounds = [this.scene.sound.add("slice1"), this.scene.sound.add("slice2")];
    this.footstepSoundTimer = null;
    this.jumpSound = this.scene.sound.add("jump");
    this.jumpSound.volume = 0.4;
    this.scene.sound.add("spawn").play();
  }

  playRandomDamageSound(isTrap = false) {
    const randomSound = Phaser.Utils.Array.GetRandom(isTrap ? this.trapDamageSounds : this.damageSounds);
    randomSound.play();
  }

  playRandomFootstepSound() {
    if (this.footstepSoundTimer) {
      return;
    }

    const randomSound = Phaser.Utils.Array.GetRandom(this.footstepSounds);
    randomSound.volume = 0.5;
    randomSound.play();

    // Add a small delay before the next footstep sound is played
    this.footstepSoundTimer = this.scene.time.addEvent({
      delay: 300, // Adjust delay as needed
      callback: () => {
        this.footstepSoundTimer = null;
      },
    });
  }

  stopFootstepSounds() {
    if (this.footstepSoundTimer) {
      this.footstepSoundTimer.remove();
      this.footstepSoundTimer = null;
    }
  }

  setAnimation(name) {
    if (this.object.anims.currentAnim?.key !== name) {
      this.object.anims.play(name, true);
    }
  }

  animate() {
    if (this.state === "idle") {
      this.setAnimation("player-idle");
    } else if (this.state == "walk") {
      this.setAnimation("player-walk");
    } else if (this.state == "jump") {
      this.setAnimation("player-jump");
    }
  }

  tiltSprite(angle) {
    this.scene.tweens.add({
      targets: this.object,
      angle: angle,
      yoyo: false,
      duration: playerConfig.rotationDuration,
      ease: "Sine.easeInOut",
    });
  }

  disableMovement() {
    this.knockedBack = true;
    this.scene.time.delayedCall(500, () => {
      this.knockedBack = false;
    });
  }

  // FIXME: remove this method and use the startKickback function from utils instead

  shoot() {
    if (this.ammo <= 0) {
      this.scene.sound.add("no-ammo").play();
      return;
    }
    this.scene.sound.add("fire").play();

    this.ammo -= 1;
    this.ammo = Phaser.Math.Clamp(this.ammo, 0, this.maxAmmo);
    this.isShooting = true;
    this.reloading = true;
    this.knockedBack = false;
    this.setAnimation("player-shoot");
    startKickback(
      this.object, // The player's Phaser sprite
      800, // Duration (ms)
      playerConfig.kickbackforce,
      0,
      !this.object.flipX, // Flip direction check
      this.kickbackTween, // Pass existing tween reference
      () => {
        this.isShooting = false;
      }
    );
    this.scene.playerInterface.updateAmmoIndicator();

    const direction = this.object.flipX ? "left" : "right";

    new Bullet(this.scene, this.object.x, this.object.y, direction);

    this.scene.time.delayedCall(playerConfig.shootCooldown, () => {
      this.reloading = false;
    });
  }

  takeDamage(amount) {
    this.health -= amount;
    this.scene.cameras.main.flash(300, 255, 0, 0);
    this.scene.cameras.main.shake(200, 0.002);
    this.scene.playerInterface.updateHealthbar();
    this.playRandomDamageSound();

    if (this.health <= 0) {
      // smooth blur effect leading to game over screen
      this.scene.cameras.main.fadeOut(300);

      this.scene.time.delayedCall(300, () => {
        this.scene.changeScene("GameOver");
      });

      return;
    }

    this.health = Phaser.Math.Clamp(this.health, 0, this.maxHealth);

    for (let i = 0; i < 10; i++) {
      this.scene.time.delayedCall(100 * i, () => {
        if (i % 2) {
          this.object.setAlpha(0.5);
        } else {
          this.object.setAlpha(1);
        }
      });
    }

    this.scene.time.delayedCall(1000, () => {
      this.object.setAlpha(1);
    });

    this.scene.playerInterface.updateHealthbar();
  }

  heal() {
    this.health += 4;
    this.scene.playerInterface.updateHealthbar();
  }

  collectAmmo() {
    this.ammo += 4;
    this.ammo = Phaser.Math.Clamp(this.ammo, 0, this.maxAmmo);
    this.scene.playerInterface.updateAmmoIndicator();
  }

  move(direction, jump) {
    if (this.knockedBack || this.disabled) {
      return;
    }

    if (direction === DIRECTIONS.RIGHT) {
      this.object.setVelocityX(playerConfig.speedX);
      this.object.flipX = false;
      this.tiltSprite(playerConfig.rotationAngle);
      if (!this.inAir) {
        this.playRandomFootstepSound();
      }
    } else if (direction === DIRECTIONS.LEFT) {
      this.object.setVelocityX(-playerConfig.speedX);
      this.object.flipX = true;
      this.tiltSprite(-playerConfig.rotationAngle);
      if (!this.inAir) {
        this.playRandomFootstepSound();
      }
    } else {
      this.object.setVelocityX(0);
      this.tiltSprite(0);
    }

    if (jump && !this.inAir) {
      this.object.setVelocityY(playerConfig.speedY);
      this.jumpSound.play();
      this.stopFootstepSounds();
    }

    if (this.isShooting) {
      // kickback effect
      this.object.setVelocityX(this.object.flipX ? playerConfig.kickbackforce : -playerConfig.kickbackforce);
      this.tiltSprite(this.object.flipX ? playerConfig.rotationAngle : -playerConfig.rotationAngle);
    }

    if (this.inAir) {
      this.state = "jump";
      return;
    }

    this.state = this.moving && !this.inAir ? "walk" : "idle";
  }

  update(direction, isJumpKeyPressed, shootKeyPressed) {
    this.moving = direction !== DIRECTIONS.NONE;
    this.inAir = !this.object.body.onFloor();

    if (shootKeyPressed && !this.reloading) {
      this.shoot();
    }

    this.move(direction, isJumpKeyPressed);

    if (!this.isShooting) {
      this.animate();
    }
  }
}


import DIRECTIONS from "../utils/directions";

const playerConfig = {
    gravityY: 400,
    speedX: 280,
    speedY: -900,
    scale: 1.2,
    rotationAngle: 10, // Rotation angle in degrees
    rotationDuration: 50, // Duration of the rotation effect in milliseconds
    shootCooldown: 1200,
    kickbackforce: 500,
}

export default class Player {
    constructor(scene, x, y) {
        this.scene = scene
        this.x = x - 24;
        this.y = y;
        this.respawnTimer;
        this.moving = false; 
        this.state = "idle"
        this.inAir = true; 
        this.isShooting = false;
        this.reloading = false; 
        this.kickbackTween; 

        this.object = scene.physics.add.sprite(this.x, this.y, 'player').setSize(36, 45).setOffset(0.5, 0);
        this.object.body.setGravityY(playerConfig.gravityY);
        this.object.setScale(playerConfig.scale);
        this.object.on('animationcomplete', () => {
            this.isShooting = false;
        });
    }

    setAnimation(name) 
    {
        if (this.object.anims.currentAnim?.key !== name) {
            this.object.anims.play(name, true);
        }
    }


    animate() 
    {
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
            ease: 'Sine.easeInOut',
        });
    }


    shoot() {
        this.isShooting = true;
        this.reloading = true;
        this.setAnimation("player-shoot");
        this.startKickback();

        this.scene.time.delayedCall(playerConfig.shootCooldown, () => {
            this.reloading = false;
        }, [])
    }


    startKickback() {
        const initialKickbackForce = this.object.flipX ? playerConfig.kickbackforce : -playerConfig.kickbackforce;
        const duration = 800; // Duration of the kickback effect in milliseconds

        // stop any previous kickback tweens
        if (this.kickbackTween) {
            this.kickbackTween.stop();
        }

        this.kickbackTween = this.object.scene.tweens.add({
            targets: this.object.body.velocity,
            x: 0,
            ease: 'Power1',
            duration: duration,
            onComplete: () => {
                this.isShooting = false;
            }
        });

        this.object.setVelocityX(initialKickbackForce);
    }

    
    move(direction, jump) 
    {
        if (direction === DIRECTIONS.RIGHT) {
            this.object.setVelocityX(playerConfig.speedX);
            this.object.flipX = false;
            this.tiltSprite(playerConfig.rotationAngle);
        } else if (direction === DIRECTIONS.LEFT) {
            this.object.setVelocityX(-playerConfig.speedX);
            this.object.flipX = true;
            this.tiltSprite(-playerConfig.rotationAngle);
        } else {
            this.object.setVelocityX(0);
            this.tiltSprite(0);
        }


        if (jump && !this.inAir) {
            this.object.setVelocityY(playerConfig.speedY);
        }


        if (this.isShooting) {
            // kickback effect
            this.object.setVelocityX(this.object.flipX ? playerConfig.kickbackforce : -playerConfig.kickbackforce);
            this.tiltSprite(0)
        }


        if (this.inAir) {
            this.state = "jump";
            return; 
        }


        this.state = (this.moving && !this.inAir) ? "walk" : "idle";
    }

    update(direction, isJumpKeyPressed, shootKeyPressed) 
    {   
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

// FIXME shoot animation is beign overwritten by idle.
// FIXME jumping animation is interupting move animation when player is moving.
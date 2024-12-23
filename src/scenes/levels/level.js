// src/scenes/levels/Level.js
import { Scene } from "phaser";
import { getCustomProperty } from "../../utils/helpers";
import { HealthPickup } from "../../objects/pickups/health-pickup";
import { AmmoPickup } from "../../objects/pickups/ammo-pickup";
import Controls from "../../utils/controls";
import Player from "../../objects/player";
import { PlayerInterface } from "../../interface";
import Dummy from "../../objects/enemies/dummy";
import Darkness from "../../objects/enemies/darkness";

export class Level extends Scene {
  constructor(key) {
    super(key);
    this.controls = null;
    this.player = null;
    this.bullets = null;
    this.enemies = null;
    this.pickups = null;
    this.obstacleLayer = null;
  }


  create() {
    // Initialize groups
    this.bullets = this.add.group();

    // Initialize controls
    this.controls = new Controls(this);

    // Set up camera
    this.cameras.main.setZoom(2);
  }


  addMap(mapKey, tilesetKey, tilesetImageKey) {
    // Load the tilemap and tileset
    const map = this.add.tilemap(mapKey);
    const levelTiles = map.addTilesetImage(tilesetKey, tilesetImageKey, 32, 32);

    // Create layers
    map.createLayer("Background", levelTiles);
    this.obstacleLayer = map.createLayer("Obstacles", levelTiles);

    // Set collision
    this.obstacleLayer.setCollisionByExclusion(-1);

    // Get player spawn point
    const playerObject = map.getObjectLayer("Player").objects[0];

    // Create player
    this.player = new Player(this, playerObject.x, playerObject.y);

    // Initialize player interface
    this.playerInterface = new PlayerInterface(this, this.player);

    // Configure camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player.object);

    // Add collision between player and obstacles
    this.physics.add.collider(this.player.object, this.obstacleLayer);

    return map;
  }


  addEnemies(map) {
    const enemiesObject = map.getObjectLayer("Enemy");
    this.enemies = this.physics.add.group();

    enemiesObject.objects.forEach((enemy) => {
      const enemyType = getCustomProperty(enemy, "type");
      const x = Math.floor(enemy.x);
      const y = Math.floor(enemy.y);

      let enemyInstance;
      if (enemyType === "dummy") {
        enemyInstance = new Dummy(this, x, y, this.obstacleLayer);
      } else if (enemyType === "darkness") {
        enemyInstance = new Darkness(this, x, y, this.obstacleLayer);
      }

      if (enemyInstance) {
        this.enemies.add(enemyInstance.object);
      }
    });

    // Add overlap between bullets and enemies
    this.physics.add.overlap(this.bullets, this.enemies, this.bulletHitsEnemy, null, this);
  }


  addPickups(map) {
    const pickupsObject = map.getObjectLayer("Pickup");
    this.pickups = this.physics.add.group();

    pickupsObject.objects.forEach((pickup) => {
      const pickupType = getCustomProperty(pickup, "type");
      const x = Math.floor(pickup.x);
      const y = Math.floor(pickup.y);

      let pickupInstance;
      if (pickupType === "health") {
        pickupInstance = new HealthPickup(this, x, y);
      } else if (pickupType === "ammo") {
        pickupInstance = new AmmoPickup(this, x, y);
      }

      if (pickupInstance) {
        this.pickups.add(pickupInstance.object);
      }
    });


    // disable physics on the pickups
    this.pickups.children.iterate((pickup) => {
      pickup.body.allowGravity = false;
      pickup.body.immovable = true;
    });
  }


  bulletHitsEnemy(bulletSprite, enemySprite) {
    bulletSprite.owner.destroyBullet();
    enemySprite.owner.decreaseHealth();
  }


  changeScene(sceneKey) {
    this.scene.start(sceneKey);
  }
  
  update() {
    const direction = this.controls.getPressedDirectionKey();
    const jumpKeyPressed = this.controls.getJumpKeyPressed();
    const shootKeyPressed = this.controls.getShootKeyPressed();

    this.player.update(direction, jumpKeyPressed, shootKeyPressed);

    // Update all enemies
    this.enemies.children.iterate((enemy) => {
      enemy.owner.update();
    });
  }
}
// src/scenes/levels/Level.js
import { Scene } from "phaser";
import Phaser from "phaser";
import { getCustomProperty } from "../../utils/helpers";
import { HealthPickup } from "../../objects/pickups/health-pickup";
import { AmmoPickup } from "../../objects/pickups/ammo-pickup";
import Controls from "../../utils/controls";
import Barrier from "../../objects/barriers/barrier";
import ControlPanel from "../../objects/barriers/control-panel";
import Player from "../../objects/player";
import { PlayerInterface } from "../../interface";
import Dummy from "../../objects/enemies/dummy";
import DarknessEnemy from "../../objects/enemies/darknessEnemy";
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";
import { startKickback } from "../../utils/effects";
import { playerConfig } from "../../utils/config";

export class Level extends Scene {
  constructor(key) {
    super(key);
    this.controls;
    this.player;
    this.bullets;
    this.enemies;
    this.pickups;
    this.barriers;
    this.controls;
    this.controlPanels;
    this.currentCurrentPanel;
    this.obstacleLayer;
    this.enemyBoundaries;
    this.trapsDataLayer;
    this.decorLayer;
    this.lastTurretShotTime = 0;
    this.turretTraps = [];
  }

  preload() {
    // Plugins
    this.load.scenePlugin("animatedTiles", AnimatedTiles, "animatedTiles", "animatedTiles");
  }

  create() {
    this.controls = new Controls(this);

    // Initialize groups
    this.bullets = this.add.group();

    // Initialize controls
    this.controls = new Controls(this);

    // Set up camera
    this.cameras.main.setZoom(2);
  }

  addMap(mapKey, tilesetKey = "level-tileset", tilesetImageKey = "terrain-tileset") {
    // Load the tilemap and tileset
    const map = this.add.tilemap(mapKey);
    const levelTiles = map.addTilesetImage(tilesetKey, tilesetImageKey, 32, 32);
    const decorTiles = map.addTilesetImage("decor", "decor-tileset", 32, 32);
    const spikeTileset = map.addTilesetImage("laser_spikes_idle", "spike-tileset", 32, 32);
    const laserTileset = map.addTilesetImage("laser_activate", "laser-tileset", 32, 32);
    const sawbladeTileset = map.addTilesetImage("saw_idle", "sawblade-tileset", 32, 32);
    const trapDataTiles = map.addTilesetImage("trap_data", "trap-data-tileset", 32, 32);

    // Create layers
    map.createLayer("Background", levelTiles);
    this.obstacleLayer = map.createLayer("Obstacles", levelTiles);
    this.trapsLayer = map.createLayer("Traps", [spikeTileset, sawbladeTileset, laserTileset]);
    this.trapsDataLayer = map.createLayer("TrapsData", trapDataTiles).setVisible(false);
    this.enemyBoundaries = map.createLayer("EnemyBoundaries", levelTiles).setVisible(false);
    this.decorLayer = map.createLayer("Decor", decorTiles);

    // Set collision
    this.obstacleLayer.setCollisionByExclusion(-1);
    this.enemyBoundaries.setCollisionByExclusion(-1);

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

    // Animate tiles with plugin
    this.sys.animatedTiles.init(map);

    // Add overlap between player and spikes
    return map;
  }

  addEnemies(map) {
    const enemiesObject = map.getObjectLayer("Enemy");
    this.enemies = this.physics.add.group();

    enemiesObject.objects.forEach((enemy) => {
      const enemyName = getCustomProperty(enemy, "name");
      const enemyType = getCustomProperty(enemy, "type") || "default";

      const x = Math.floor(enemy.x);
      const y = Math.floor(enemy.y);

      let enemyInstance;
      if (enemyName === "dummy") {
        enemyInstance = new Dummy(this, x, y, this.obstacleLayer);
      } else if (enemyName === "darkness") {
        enemyInstance = new DarknessEnemy(this, x, y, this.obstacleLayer, enemyType);
        this.physics.add.collider(enemyInstance.object, this.enemyBoundaries);
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

  addBarriersAndControlPanels(map) {
    const barriersObject = map.getObjectLayer("Barrier");
    const controlPanelsObject = map.getObjectLayer("ControlPanel");
    this.barriers = this.physics.add.group();
    this.controlPanels = this.physics.add.group();

    barriersObject.objects.forEach((barrier) => {
      const barrierId = getCustomProperty(barrier, "barrierId");
      const x = Math.floor(barrier.x) + 16;
      const y = Math.floor(barrier.y);

      let barrierInstance;
      barrierInstance = new Barrier(this, x, y, barrierId);

      if (barrierInstance) {
        barrierInstance.object.anims.play("barrier-idle");

        this.barriers.add(barrierInstance.object);
      }
    });

    controlPanelsObject.objects.forEach((controlPanel) => {
      const barrierId = getCustomProperty(controlPanel, "barrierId");
      const x = Math.floor(controlPanel.x) + 16;
      const y = Math.floor(controlPanel.y) + 16;

      const controlPanelInstance = new ControlPanel(this, x, y, barrierId);
      controlPanelInstance.object.anims.play("control-panel-idle");

      this.controlPanels.add(controlPanelInstance.object);
    });

    this.physics.add.overlap(this.player.object, this.controlPanels, (player, panel) => {
      console.log("Player is overlapping a control panel");
      // Store the overlapping panel so we can handle input in 'update'
      this.currentPanel = panel;
    });
  }

  applyTrapData() {
    this.trapsDataLayer.forEachTile((tile) => {
      if (tile.index === -1) return;
      const { type, damage } = tile.properties;

      // Standard tile trap
      if (type !== "turret") {
        const trap = this.physics.add
          .sprite(tile.pixelX + tile.width / 2, tile.pixelY + tile.height / 2, null)
          .setSize(tile.width, tile.height)
          .setVisible(false)
          .setImmovable(true);
        trap.body.allowGravity = false;

        this.physics.add.overlap(this.player.object, trap, () => {
          if (!trap.isOnCooldown) {
            this.player.disableMovement();
            this.player.takeDamage(damage);
            startKickback(this.player.object, 500, 200, -250, this.player.object.flipX, this.player.kickbackTween);
            trap.isOnCooldown = true;
            this.time.delayedCall(1000, () => (trap.isOnCooldown = false));
          }
        });
      } else {
        // Turret trap
        const turret = this.physics.add
          .sprite(tile.pixelX + tile.width / 2, tile.pixelY + tile.height / 2, "turret")
          .setSize(64, 32)
          .setImmovable(true);
        turret.body.allowGravity = false;
        turret.isOnCooldown = false;

        // play animation
        turret.anims.play("turret-shoot");
        this.turretTraps.push(turret);
      }
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
    const spaceKeyPressed = this.controls.getSpaceKeyPressed();

    this.player.update(direction, jumpKeyPressed, shootKeyPressed);

    // Update all enemies
    this.enemies.children.iterate((enemy) => {
      enemy.owner.update();
    });

    // Update all turret traps (damage player if animation is on above frame 12)
    this.turretTraps.forEach((turret) => {
      // add overlap between player and turret
      this.physics.add.overlap(this.player.object, turret, () => {
        if (!turret.isOnCooldown && turret.anims.currentFrame.index >= 19) {
          this.player.disableMovement();
          this.player.takeDamage(3);
          startKickback(this.player.object, 500, 300, -250, this.player.object.flipX, this.player.kickbackTween);
          turret.isOnCooldown = true;
          this.time.delayedCall(1000, () => (turret.isOnCooldown = false)); // Cooldown duration
        }
      });
    });

    // If player presses SPACE and is overlapping a panel:
    if (this.currentPanel && spaceKeyPressed) {
      const panelBarrierId = this.currentPanel.barrierId;

      // Find the barrier with the matching ID
      const matchingBarrier = this.barriers
        .getChildren()
        .find((barrierSprite) => barrierSprite.barrierId === panelBarrierId);

      // Destroy the barrier if found
      if (matchingBarrier) {
        matchingBarrier.owner.deactivate();
      }

      // disabe active animation
      this.currentPanel.anims?.stop();
      this.currentPanel.setTexture("control-panel-inactive");

      // Optionally remove reference so we don't trigger again unless we overlap again
      this.controlPanels.remove(this.currentPanel);
      this.currentPanel = null;
    }

    // If Player is below the world (or off-screen), kill them.
    if (this.player.object.y > this.physics.world.bounds.height) {
      this.changeScene("GameOver");
    }
  }
}

// TODO: kill bullet when it leaves the screen view
// TODO: change enemy direction when it bumbs into a boundary (does not work for none standard enemies)
// TODO: add different death particles for each enemy (?)
// TODO: add small coin like pickups for fun
// TODO: add small ending scene

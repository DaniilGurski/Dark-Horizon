import { Scene } from "phaser";
import DataUtils from "../utils/data-utils";
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    // TODO: Move to boot scene ?
    const healthbarFrameConfig = {
      frameWidth: 50,
      frameHeight: 10,
    };

    const planetFrameConfig = {
      frameWidth: 100,
      frameHeight: 100,
    };

    const turretFrameConfig = {
      frameWidth: 64,
      frameHeight: 32,
    };

    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");

    // Data
    this.load.json("animations", "data/animations/globals.json");
    this.load.json("player-animations", "data/animations/player.json");
    this.load.json("enemy-default-animations", "data/animations/enemies/default.json");
    this.load.json("enemy-attacker-animations", "data/animations/enemies/attacker.json");
    this.load.json("enemy-fast-animations", "data/animations/enemies/fast.json");
    this.load.json("enemy-tank-animations", "data/animations/enemies/tank.json");
    this.load.json("healthbar-frames", "data/animations/healthbar.json");
    this.load.json("turret-frames", "data/animations/traps/turret.json");
    this.load.tilemapTiledJSON("box", "data/box.json");

    // Backgrounds
    this.load.image("story-bg", "backgrounds/darkness.png");
    this.load.image("transition-cutscene-bg", "backgrounds/space.png");

    // Spritesheets
    this.load.spritesheet("planet", "spritesheets/planet.png", planetFrameConfig);
    this.load.spritesheet("turret", "tilesets/traps/electric_turret.png", turretFrameConfig);
    this.load.atlas("player", "spritesheets/characters/player.png", "data/atlas/player.json");
    this.load.atlas("enemy-default", "spritesheets/characters/enemies/darkness.png", "data/atlas/darkness.json");
    this.load.atlas("enemy-attacker", "spritesheets/characters/enemies/red-darkness.png", "data/atlas/darkness.json");
    this.load.atlas("enemy-fast", "spritesheets/characters/enemies/blue-darkness.png", "data/atlas/darkness.json");
    this.load.atlas("enemy-tank", "spritesheets/characters/enemies/gray-darkness.png", "data/atlas/darkness.json");
    // this.load.atlas("trap-turret", "tilesets/traps/electric_turret.png", "data/atlas/turret.json");

    // Images
    this.load.image("ammo-pickup", "spritesheets/pickups/ammo.png");
    this.load.image("health-pickup", "spritesheets/pickups/health.png");
    this.load.image("terrain-tileset", "tilesets/level-tileset.png");
    this.load.image("spike-tileset", "tilesets/traps/laser_spikes_idle.png");
    this.load.image("laser-tileset", "tilesets/traps/laser_activate.png");
    this.load.image("sawblade-tileset", "tilesets/traps/saw_idle.png");
    this.load.image("trap-data-tileset", "tilesets/traps/trap_data.png");
    this.load.image("ship-1", "spritesheets/ship-1.png");
    this.load.image("ship-2", "spritesheets/ship-2.png");
    this.load.image("ship-3", "spritesheets/ship-3.png");
    this.load.image("dark-particle", "spritesheets/dark-particle.png");

    // UI
    // this.load.spritesheet("healthbar", "ui/healthbar.png", healthbarFrameConfig)
    this.load.atlas("healthbar", "ui/healthbar.png", "data/atlas/healthbar.json");
    this.load.image("cross-icon", "ui/cross.png");
    this.load.image("next-icon", "ui/next.png");
    this.load.image("ammo-arrows", "ui/arrows.png");

    // Sounds
    this.load.audio("typing", "sounds/sci-fi-typing.mp3");
    this.load.audio("space-ambient", "sounds/space-ambient.mp3");
    this.load.audio("spaceship-passing-01", "sounds/spaceship-passing01.mp3");
    this.load.audio("spaceship-passing-02", "sounds/spaceship-passing02.mp3");
    this.load.audio("spaceship-passing-03", "sounds/spaceship-passing03.mp3");
    this.load.audio("health-pickup", "sounds/player/pickups/health.wav");
    this.load.audio("ammo-pickup", "sounds/player/pickups/ammo.wav");
  }

  create() {
    console.log("Preloader scene loaded");
    this.scene.start("Story");
    this.createAnimations();
    this.createAtlasAnimations("player", "player-animations");
    this.createAtlasAnimations("enemy-default", "enemy-default-animations");
    this.createAtlasAnimations("enemy-attacker", "enemy-attacker-animations");
    this.createAtlasAnimations("enemy-fast", "enemy-fast-animations");
    this.createAtlasAnimations("enemy-tank", "enemy-tank-animations");
    this.createAtlasAnimations("healthbar", "healthbar-frames");
    // this.createAtlasAnimations("trap-turret", "turret-frames");
  }

  createAnimations() {
    // Get animation data from cache
    const animations = DataUtils.getAnimations(this, "animations");

    animations.forEach((animation) => {
      // Generate frames if there are anys
      const frames = animation.frames
        ? this.anims.generateFrameNumbers(animation.asset, {
            frames: animation.frames,
          })
        : this.anims.generateFrameNumbers(animation.asset);

      this.anims.create({
        key: animation.key,
        frames: frames,
        frameRate: animation.frameRate,
        repeat: animation.repeat,
        yoyo: animation.yoyo,
      });
    });

    console.log(animations);
  }

  createAtlasAnimations(atlas, requestedAnimations) {
    const animations = DataUtils.getAnimations(this, requestedAnimations);

    animations.forEach((animation) => {
      this.anims.create({
        key: animation.key,
        frames: this.anims.generateFrameNames(atlas, {
          prefix: animation.prefix,
          end: animation.end ?? 0,
          zeroPad: animation.zeroPad || 4,
        }),
        frameRate: animation.frameRate,
        repeat: animation.repeat,
        yoyo: animation.yoyo,
      });
    });

    console.log(`${requestedAnimations} loaded`);
    console.log(animations);
  }
}

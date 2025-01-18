import { Scene } from "phaser";
import DataUtils from "../utils/data-utils";
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  A simple progress bar. This is the outline of the bar.
    this.cameras.main.setBackgroundColor("#000000");
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

    const controlPanelFrameConfig = {
      frameWidth: 32,
      frameHeight: 32,
    };

    const barrierFrameConfig = {
      frameWidth: 32,
      frameHeight: 64,
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
    this.load.tilemapTiledJSON("main-level", "data/main-level.json");

    // Backgrounds
    this.load.image("story-bg", "backgrounds/darkness.png");
    this.load.image("transition-cutscene-bg", "backgrounds/space.png");

    // Spritesheets
    this.load.spritesheet("planet", "spritesheets/planet.png", planetFrameConfig);
    this.load.spritesheet("turret", "spritesheets/traps/electric_turret.png", turretFrameConfig);
    this.load.spritesheet(
      "control-panel-active",
      "spritesheets/barriers/control_panel_idle.png",
      controlPanelFrameConfig
    );
    this.load.spritesheet(
      "control-panel-inactive",
      "spritesheets/barriers/control_panel_deactivate.png",
      controlPanelFrameConfig
    );
    this.load.spritesheet("barrier-active", "spritesheets/barriers/barrier_idle.png", barrierFrameConfig);
    this.load.spritesheet("barrier-inactive", "spritesheets/barriers/barrier_deactivate.png", barrierFrameConfig);
    this.load.atlas("player", "spritesheets/characters/player.png", "data/atlas/player.json");
    this.load.atlas("enemy-default", "spritesheets/characters/enemies/darkness.png", "data/atlas/darkness.json");
    this.load.atlas("enemy-attacker", "spritesheets/characters/enemies/red-darkness.png", "data/atlas/darkness.json");
    this.load.atlas("enemy-fast", "spritesheets/characters/enemies/blue-darkness.png", "data/atlas/darkness.json");
    this.load.atlas("enemy-tank", "spritesheets/characters/enemies/white-darkness.png", "data/atlas/darkness.json");

    // Images
    this.load.image("ammo-pickup", "spritesheets/pickups/ammo.png");
    this.load.image("health-pickup", "spritesheets/pickups/health.png");
    this.load.image("terrain-tileset", "tilesets/level-tileset.png");
    this.load.image("decor-tileset", "tilesets/decor.png");
    this.load.image("spike-tileset", "tilesets/traps/laser_spikes_idle.png");
    this.load.image("laser-tileset", "tilesets/traps/laser_activate.png");
    this.load.image("sawblade-tileset", "tilesets/traps/saw_idle.png");
    this.load.image("trap-data-tileset", "tilesets/traps/trap_data.png");
    this.load.image("barrier-data-tileset", "tilesets/barrier_data.png");
    this.load.image("ship-1", "spritesheets/ship-1.png");
    this.load.image("ship-2", "spritesheets/ship-2.png");
    this.load.image("ship-3", "spritesheets/ship-3.png");
    this.load.image("dark-particle", "spritesheets/dark-particle.png");
    this.load.image("blue-particle", "spritesheets/blue-particle.png");
    this.load.image("red-particle", "spritesheets/red-particle.png");
    this.load.image("white-particle", "spritesheets/white-particle.png");
    this.load.image("end-point", "spritesheets/end-point.png");

    // UI
    // this.load.spritesheet("healthbar", "ui/healthbar.png", healthbarFrameConfig)
    this.load.atlas("healthbar", "ui/healthbar.png", "data/atlas/healthbar.json");
    this.load.image("cross-icon", "ui/cross.png");
    this.load.image("next-icon", "ui/next.png");
    this.load.image("ammo-arrows", "ui/arrows.png");

    // Sounds
    this.load.audio("story-track", "music/story.wav");
    this.load.audio("level-track", "music/level.wav");
    this.load.audio("end-track", "music/end.wav");
    this.load.audio("typing", "sounds/typing.wav");
    this.load.audio("space-ambient", "sounds/space-ambient.mp3");
    this.load.audio("spaceship-passing-01", "sounds/spaceship-passing01.mp3");
    this.load.audio("spaceship-passing-02", "sounds/spaceship-passing02.mp3");
    this.load.audio("spaceship-passing-03", "sounds/spaceship-passing03.mp3");
    this.load.audio("ammo-pickup", "sounds/player/pickups/ammo.wav");
    this.load.audio("health-pickup", "sounds/player/pickups/health.wav");
    this.load.audio("barrier-opened", "sounds/barrier_opened.wav");
    this.load.audio("step1", "sounds/player/footsteps/metal1.wav");
    this.load.audio("step2", "sounds/player/footsteps/metal2.wav");
    this.load.audio("step3", "sounds/player/footsteps/metal3.wav");
    this.load.audio("step4", "sounds/player/footsteps/metal4.wav");
    this.load.audio("damage1", "sounds/player/damage/pain1.wav");
    this.load.audio("damage2", "sounds/player/damage/pain2.wav");
    this.load.audio("damage3", "sounds/player/damage/pain3.wav");
    this.load.audio("zap", "sounds/player/damage/zap.wav");
    this.load.audio("slice1", "sounds/player/damage/slicer1.wav");
    this.load.audio("slice2", "sounds/player/damage/slicer2.wav");
    this.load.audio("scream1", "sounds/enemy/damage/scream1.wav");
    this.load.audio("scream2", "sounds/enemy/damage/scream2.wav");
    this.load.audio("scream3", "sounds/enemy/damage/scream3.wav");
    this.load.audio("scream4", "sounds/enemy/damage/scream4.wav");
    this.load.audio("impact1", "sounds/enemy/damage/impact1.wav");
    this.load.audio("impact2", "sounds/enemy/damage/impact2.wav");
    this.load.audio("impact3", "sounds/enemy/damage/impact3.wav");
    this.load.audio("jump", "sounds/player/jump.wav");
    this.load.audio("flatline", "sounds/player/flatline.wav");
    this.load.audio("spawn", "sounds/player/bell.wav");
    this.load.audio("openpanel", "sounds/player/openpanel.wav");
    this.load.audio("no-ammo", "sounds/player/weapon/empty.wav");
    this.load.audio("fire", "sounds/player/weapon/fire.wav");
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

import { Level } from "./level";

export class LevelZero extends Level {
  constructor() {
    super("LevelZero");
  }

  create() {
    // Call the parent class's create method
    super.create();

    // Add the map specific to LevelZero
    const map = this.addMap("main-level", "level-tileset", "terrain-tileset");

    // Add enemies
    this.addEnemies(map);

    // Add pickups
    this.addPickups(map);

    // Add barriers and control panels
    this.addBarriersAndControlPanels(map);

    // Add traps and behavior
    this.applyTrapData();
  }

  update() {
    // Call the parent class's update method
    super.update();
  }
}

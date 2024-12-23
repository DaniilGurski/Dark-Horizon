import { Level } from './level';

export class LevelZero extends Level {
  constructor() {
    super('LevelZero');
  }

  create() {
    // Call the parent class's create method
    super.create();

    // Add the map specific to LevelZero
    const map = this.addMap('box', 'level-tileset', 'terrain-tileset');

    // Add enemies
    this.addEnemies(map);
  }
  
  update() {
    // Call the parent class's update method
    super.update();
  }
}
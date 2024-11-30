import { Scene } from "phaser";
import Controls from "../../utils/controls";
import Player from "../../objects/player";

export class LevelZero extends Scene
{
    constructor ()
    {
        super('LevelZero');

        this.controls;
        this.player;
    }

    create ()
    {
        const map = this.add.tilemap("box");
        const levelTiles = map.addTilesetImage("level-tileset", "terrain-tileset", 32, 32);
        const backgroundLayer = map.createLayer("Background", levelTiles);
        
        this.canvasWidth = this.sys.game.canvas.width;
        this.obstacleLayer = map.createLayer("Obstacles", levelTiles);
        this.controls = new Controls(this);
        this.player = new Player(this, this.canvasWidth / 2, 100);

        this.obstacleLayer.setCollisionByExclusion(-1);
        this.physics.add.collider(this.player.object, this.obstacleLayer);
    }

    update ()
    {
        const direction = this.controls.getPressedDirectionKey();
        const jumpKeyPressed = this.controls.getJumpKeyPressed();
        const shootKeyPressed = this.controls.getShootKeyPressed();

        this.player.update(direction, jumpKeyPressed, shootKeyPressed)
    }
}
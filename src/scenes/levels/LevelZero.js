import { Scene } from "phaser";
import Controls from "../../utils/controls";
import Player from "../../objects/player";
import Dummy from "../../objects/enemies/dummy";
import { getCustomProperty } from "../../utils/helpers";
import Bullet from "../../objects/bullet";


// TODO: abstract the level into a class that extends general level class
export class LevelZero extends Scene
{
    constructor ()
    {
        super('LevelZero');

        this.controls;
        this.player;
        this.bullets;
    }
    
    
    addEnemies(map) {
        const enemiesObject = map.getObjectLayer("Enemy");
        this.enemies = this.physics.add.group();

        enemiesObject.objects.forEach((enemy) => {
            const enemyType = getCustomProperty(enemy, "type");
            const x = Math.floor(enemy.x);
            const y = Math.floor(enemy.y);

            if (enemyType === "dummy") {
                const dummy = new Dummy(this, x, y, this.obstacleLayer);
                this.enemies.add(dummy.object);
            }
        })
    }

    // phaser automaticly identifies the two sprites that collided
    bulletHitsEnemy(bulletSprite, enemySprite) {
        bulletSprite.owner.destroyBullet();
        enemySprite.owner.decreaseHealth();
    }
    
    create ()
    {
        // groups 
        this.bullets = this.add.group();

        // map
        const map = this.add.tilemap("box");
        const levelTiles = map.addTilesetImage("level-tileset", "terrain-tileset", 32, 32);
        const backgroundLayer = map.createLayer("Background", levelTiles);
        
        this.canvasWidth = this.sys.game.canvas.width;
        this.obstacleLayer = map.createLayer("Obstacles", levelTiles);
        this.controls = new Controls(this);
        this.player = new Player(this, this.canvasWidth / 2, 100);
        
        this.addEnemies(map);
        
        this.obstacleLayer.setCollisionByExclusion(-1);
        this.physics.add.collider(this.player.object, this.obstacleLayer);
        this.physics.add.overlap(this.bullets, this.enemies, this.bulletHitsEnemy, null, this);
        
    }
    
    update ()
    {
        const direction = this.controls.getPressedDirectionKey();
        const jumpKeyPressed = this.controls.getJumpKeyPressed();
        const shootKeyPressed = this.controls.getShootKeyPressed();
        
        this.player.update(direction, jumpKeyPressed, shootKeyPressed);
    }
}
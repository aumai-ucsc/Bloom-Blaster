//Inspired by BulletTime player code

class Player extends Phaser.GameObjects.Sprite{

    //x,y: starting sprite position
    //spriteKey: key for the sprite image asset
    //leftKey: key for moving left
    //rightKey: key for moving right
    //playerSpeed: config for movement
    constructor(scene, x, y, texture, frame, leftKey, rightKey, playerSpeed) {
        super(scene, x, y, texture, frame);

        this.left = leftKey;
        this.right = rightKey;
        this.playerSpeed = playerSpeed;

        scene.add.existing(this);

        return this;
    }
    
    update(){

        //Move left
        if (this.left.isDown) {
            //Wall check for left
            if (this.x > (this.displayWidth/2)) {
                this.x -= this.playerSpeed;
            }
        }
        

        //Move right
        if (this.right.isDown) {
            //Wall check for right
            if (this.x < (game.config.width - (this.displayWidth/2))) {
                this.x += this.playerSpeed;
            }
        }
    }
}
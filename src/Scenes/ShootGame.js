class ShootGame extends Phaser.Scene{
    constructor(){
        super("shootGame");

        //Object to hold sprites
        this.my = {sprite: {}};

        //Create health Value
        this.health = 3; //Will Update when player takes damage, reset to 3 every level
    }

    preload(){
        //Sprites for player
        this.load.setPath("./assets/");
        this.load.image("player", "alienBlue.png");

        //Sprite for health
        this.load.image("health", "tileBlue_12.png");
    }

    create(){
        let my = this.my;

        //Create key objects for polling player movement
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Create player sprite
        my.sprite.player = new Player(this, game.config.width/2, game.config.height - 50, "player", null, this.left, this.right, 3);
        my.sprite.player.setScale(0.75);


        //Reset Health to full
        this.health = 3;

        //Create health sprites
        my.sprite.leftHeart = this.add.sprite(game.config.width - 130, 30, "health");
        my.sprite.leftHeart.setScale(0.25);
        my.sprite.midHeart = this.add.sprite(game.config.width - 80, 30, "health");
        my.sprite.midHeart.setScale(0.25);
        my.sprite.rightHeart = this.add.sprite(game.config.width - 30, 30, "health");
        my.sprite.rightHeart.setScale(0.25);
        //Create Health Text
        this.add.text(game.config.width - 210, 30, 'Health:',
            { 
               fontFamily: 'Indie Flower',
               fontSize: '35px',
             }).setOrigin(0.5);
        
        //Create Title
        this.add.text(300, 250, 'S Game over\n W Continue',
            { 
               fontFamily: 'Indie Flower',
               fontSize: '75px',
             }).setOrigin(0.5);

    
        //Event input: Game Over DEBUG
        let sKey = this.input.keyboard.addKey (Phaser.Input.Keyboard.KeyCodes.S);
        sKey.on('down', (key, event) =>{
            this.health--;
        });

        //Event input: Clear Wave
        let wKey = this.input.keyboard.addKey (Phaser.Input.Keyboard.KeyCodes.W);
        wKey.on('down', (key, event) =>{
            this.scene.start("clearWave");
        });
    }

    update(){
        let my = this.my;

        //Player updates
        my.sprite.player.update();

        //Health Updates
        if (this.health == 2){
            my.sprite.rightHeart.visible = false;
        }
        if (this.health == 1){
            my.sprite.midHeart.visible = false;
        }
        
        //Game Over
        if (this.health == 0){
            this.scene.start("gameOver");
        }

    }
}
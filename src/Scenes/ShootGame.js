class ShootGame extends Phaser.Scene{
    constructor(playerScore){
        super("shootGame", playerScore);

        //Object to hold sprites
        this.my = {sprite: {}};

        //Create health Value
        this.health = 3; //Will Update when player takes damage, reset to 3 every level

        //Create a bullet timer
        this.bulletTimer = 5;
        this.bulletCounter = 0;
    }

    preload(){
        //Sprites for player
        this.load.setPath("./assets/");
        this.load.image("player", "alienBlue.png");

        //Sprite for health
        this.load.image("health", "tileBlue_12.png");

        //Sprite for Player Bullet
       this.load.image("bullet", "ballBlue_09.png"); 
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
        
        //Create Score Text
        this.add.text(20, 5, 'Score: ' + playerScore,
            { 
               fontFamily: 'Indie Flower',
               fontSize: '35px',
             });
        
        //Create Title
        this.add.text(300, 250, 'S Game over\n W Continue',
            { 
               fontFamily: 'Indie Flower',
               fontSize: '75px',
             }).setOrigin(0.5);

        //Create Bullet Group
        my.sprite.bulletGroup = this.add.group({
            active: true,
            defaultKey: "bullet",
            maxSize: 3,
            runChildUpdate: true
            }
        )
        //Create the bullets in group
        my.sprite.bulletGroup.createMultiple({
            classType: Bullet,
            active: false,
            key: my.sprite.bulletGroup.defaultKey,
            repeat: my.sprite.bulletGroup.maxSize-1,
            visible: false
        });
        my.sprite.bulletGroup.propertyValueSet("speed", 5);
        my.sprite.bulletGroup.scaleX(0.15);
    
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

        //Shoot bullet functionality
        this.bulletCounter--;
        if (this.space.isDown) {
            if (this.bulletCounter < 0) {
                //Make first bullet active
                let bullet = my.sprite.bulletGroup.getFirstDead();
                //Check for if there are no inactive (available) bullets
                if (bullet != null) {
                    this.bulletCounter = this.bulletTimer;
                    bullet.setScale(0.15);
                    bullet.makeActive();
                    bullet.x = my.sprite.player.x;
                    bullet.y = my.sprite.player.y - (my.sprite.player.displayHeight/2);
                }
            }
        }
        
        //Game Over
        if (this.health == 0){
            this.scene.start("gameOver");
        }

    }
}
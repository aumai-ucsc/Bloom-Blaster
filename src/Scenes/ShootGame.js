class ShootGame extends Phaser.Scene{

    constructor(playerScore){
        super("shootGame", playerScore);

        //Object to hold sprites
        this.my = {sprite: {}};

        //Create a bullet timer
        this.bulletTimer = 60;
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

       //Sprites for ememies
       this.load.image("seed", "foliagePack_019.png")
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
            maxSize: 10,
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
        my.sprite.bulletGroup.propertyValueSet("speed", 3);
        my.sprite.bulletGroup.scaleX(0.15);

        //Create ememy paths

        //Path for phalanx
        this.pointsPhalanx = [
            75, 25,
            75, 200,
            500, 200,
            500, 300,
            75, 300,
            75, 450,
            500, 500,
            500, 700
        ];

        //Path for tree movement
        this.pointsSpin = [
            500, 25,
            500, 250,
            450, 150,
            400, 250,
            350, 300,
            300, 250,
            250, 150,
            200, 250,
            150, 300,
            100, 250,
            50, 500,
            100, 450,
            150, 500,
            200, 550,
            250, 500,
            300, 450,
            350, 500,
            400, 550,
            450, 500,
            500, 450,
            500, 700,
        ]
        this.phalanx = new Phaser.Curves.Spline(this.pointsPhalanx);
        this.freeFly = new Phaser.Curves.Spline(this.pointsSpin);
        // Initialize Phaser graphics, used to draw lines: DEBUG TO CHECK PATHS
        /*
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(2, 0xffffff, 1);
        this.phalanx.draw(this.graphics, 32);

        this.spinGraph = this.add.graphics();
        this.spinGraph.lineStyle(2, 0xffffff, 1);
        this.freeFly.draw(this.spinGraph, 32);
        */
        //Phalanx Enemy
        my.sprite.seed = this.add.follower(this.phalanx, 10, 10, "seed");
        //Set location
        my.sprite.seed.setX(this.phalanx.points[0].x);
        my.sprite.seed.setY(this.phalanx.points[0].y);
        //Start Follow
        my.sprite.seed.startFollow(shipSpeed);

    
        //Event input: Game Over DEBUG
        let sKey = this.input.keyboard.addKey (Phaser.Input.Keyboard.KeyCodes.S);
        sKey.on('down', (key, event) =>{
            playerHealth--;
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
        if (playerHealth <= 2){
            my.sprite.rightHeart.visible = false;
        }
        if (playerHealth <= 1){
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
        if (playerHealth == 0){
            this.scene.start("gameOver");
        }

    }
}
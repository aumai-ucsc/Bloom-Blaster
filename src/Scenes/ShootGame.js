class ShootGame extends Phaser.Scene{

    constructor(playerScore){
        super("shootGame", playerScore);

        //Object to hold sprites
        this.my = {sprite: {}};

        //Create a bullet timer
        this.bulletTimer = 60;
        this.bulletCounter = 0;

        //Create the enemy bullet timer
        this.treeBulletCounter = 0;

        //Amount of enemies per wave
        this.seedRemain = 5;
        this.treeRemain = 3;
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
       this.load.image("seed", "foliagePack_019.png");  //Phalanx enemy
       this.load.image("tree", "foliagePack_022.png");  //Tree enemy
       this.load.image("sap", "particleYellow_5.png");  //Tree bullet
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
        );
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

        //Create bullet group of enemies
        my.sprite.treeBulletGroup = this.add.group({
            active: true,
            defaultKey: "sap",
            maxSize: 10,
            runChildUpdate: true
            }
        )
        //Create the bullets in group
        my.sprite.treeBulletGroup.createMultiple({
            classType: TreeBullet,
            active: false,
            key: "sap",
            repeat: my.sprite.bulletGroup.maxSize-1,
            visible: false
        });
        my.sprite.treeBulletGroup.propertyValueSet("speed", treeBulletSpeed);
        my.sprite.treeBulletGroup.angle = 180;
        my.sprite.treeBulletGroup.scaleX(0.15);

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
            600, 450,
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
        //Make invisible
        my.sprite.seed.visible = false;

        //tree Enemy
        my.sprite.tree = this.add.follower(this.freeFly, 10, 10, "tree");
        //Make invisible
        my.sprite.tree.visible = false;

    
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

        //Enemy bullet functinality
        this.treeBulletCounter--;

        //Check to see if tree is still on the screen
        if(my.sprite.tree.visible == true){
            if (this.treeBulletCounter < 0) {
                //Make first bullet active
                let treeBullet = my.sprite.treeBulletGroup.getFirstDead();
                //Check for if there are no inactive (available) bullets
                if (treeBullet != null) {
                    this.treeBulletCounter = treeBulletTimer;
                    treeBullet.setScale(0.15);
                    treeBullet.makeActive();
                    treeBullet.x = my.sprite.tree.x;
                    treeBullet.y = my.sprite.tree.y - (my.sprite.tree.displayHeight/2);
                }
            }
        }

        //Enemy Spawning
        if(this.seedRemain > 0 && my.sprite.seed.visible == false){
            //Set location
            my.sprite.seed.setX(this.phalanx.points[0].x);
            my.sprite.seed.setY(this.phalanx.points[0].y);
            my.sprite.seed.visible = true;
            //Start Follow
            my.sprite.seed.startFollow({
                from: 0,
                to: 1,
                delay: 0,
                duration: shipSpeed,
                ease: 'linear',
                repeat: 0,
                yoyo: false,
            });
        }
        if(this.treeRemain > 0 && my.sprite.tree.visible == false){
            //Set location
            my.sprite.tree.setX(this.freeFly.points[0].x);
            my.sprite.tree.setY(this.freeFly.points[0].y);
            my.sprite.tree.visible = true;
            //Start Follow
            my.sprite.tree.startFollow({
                from: 0,
                to: 1,
                delay: 0,
                duration: shipSpeed - 500,
                ease: 'Sine.easeInOut',
                repeat: 0,
                yoyo: false,
                rotateToPath: true,
                rotationOffset: 90
            }, 0);
        }

        //Stop enemy follow
        //If reaching end of path
        if(my.sprite.seed.x == 500 && my.sprite.seed.y == 700){
            //Reduce number of seed enemies left to spawn
            this.seedRemain--;
            //Make seed invisible
            my.sprite.seed.visible = false;
            //Stop follow for tree
            my.sprite.seed.stopFollow();
        }
        if(my.sprite.tree.x == 600 && my.sprite.tree.y == 450){
            //Reduce number of tree enemies left to spawn
            this.treeRemain--;
            //Make tree invisible
            my.sprite.tree.visible = false;
            //Stop follow for tree
            my.sprite.tree.stopFollow();
        }

        //Bullet collision with enemy
        for (bullet in bulletGroup){
            if(bullet.active){
                
            }
        }


        //Game Over
        if (playerHealth == 0){
            this.scene.start("gameOver");
        }

    }
    // A center-radius AABB collision check from ArrayBoom
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
}
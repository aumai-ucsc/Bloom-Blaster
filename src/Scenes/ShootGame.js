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

        //Create bullet arrays
        this.my.sprite.bulletArr = [];
        this.my.sprite.treeBulletArr = [];
        this.maxBullet = 10;

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

       //Animations
       //Seed Animations
       this.load.image("bloom1", "foliagePack_002.png");
       this.load.image("bloom2", "foliagePack_001.png");

       //Tree Animations
       this.load.image("tree1", "foliagePack_036.png");
       this.load.image("tree2", "foliagePack_029.png");
       this.load.image("tree3", "foliagePack_032.png");

       //Sounds
       this.load.audio("shoot", "scratch_004.ogg");
       this.load.audio("grow", "maximize_006.ogg");
       this.load.audio("hit", "error_003.ogg");
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
        this.scoreBoard = this.add.text(20, 5, 'Score: ' + playerScore,
            { 
               fontFamily: 'Indie Flower',
               fontSize: '35px',
             });

        //Create Animations
        this.anims.create({
            key: "sprout",
            frames: [
                { key: "bloom1" },
                { key: "bloom2" },
            ],
            frameRate: 4,
            hideOnComplete: true
        });
        this.anims.create({
            key: "flourish",
            frames: [
                { key: "tree"},
                { key: "tree1"},
                { key: "tree2"},
               { key: "tree3"},
            ],
            frameRate: 6,
            hideOnComplete: true
        })

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

        //Controls
        document.getElementById('description').innerHTML = '<h2>ShootGame.js</h2><br>A: Move Left <br>D: Move Right <br>SPACE: Shoot';

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
        if (this.space.isDown && this.bulletCounter < 0) {
            this.bulletCounter = this.bulletTimer
            if (my.sprite.bulletArr.length < this.maxBullet) {
                my.sprite.bulletArr.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y, "bullet")
                );
                my.sprite.bulletArr[my.sprite.bulletArr.length-1].setScale(0.15, 0.15);
                this.sound.play("shoot");
            }
        }
        //Remove Bullets
        my.sprite.bulletArr = my.sprite.bulletArr.filter((bullet) => bullet.y > -(bullet.displayHeight/2));
        //Move bullets
        for (let bullet of my.sprite.bulletArr) {
            bullet.y -= 3;
        }

        //Enemy bullet functinality
        this.treeBulletCounter--;
        if (my.sprite.tree.visible && this.treeBulletCounter < 0) {
            this.treeBulletCounter = treeBulletTimer
            if (my.sprite.treeBulletArr.length < this.maxBullet) {
                my.sprite.treeBulletArr.push(this.add.sprite(
                    my.sprite.tree.x, my.sprite.tree.y, "sap")
                );
                my.sprite.treeBulletArr[my.sprite.treeBulletArr.length-1].setScale(0.15, 0.15);
            }
        }
        //Remove Bullets
        my.sprite.treeBulletArr = my.sprite.treeBulletArr.filter((treeBullet) => treeBullet.y < (700 + treeBullet.displayHeight/2));
        //Move bullets
        for (let bullet of my.sprite.treeBulletArr) {
            bullet.y += treeBulletSpeed;
        }
        
        //Stop enemy follow
        //If reaching end of path
        if(my.sprite.seed.x == 500 && my.sprite.seed.y == 700){
            //Reduce number of seed enemies left to spawn
            seedRemain--;
            //Make seed invisible
            my.sprite.seed.visible = false;
            //Stop follow for seed
            my.sprite.seed.stopFollow();
            //Decrease Health
            playerHealth--;
        }
        if(my.sprite.tree.x == 600 && my.sprite.tree.y == 450){
            //Reduce number of tree enemies left to spawn
            treeRemain--;
            //Make tree invisible
            my.sprite.tree.visible = false;
            //Stop follow for tree
            my.sprite.tree.stopFollow();
        }


        //Enemy Spawning
        if(seedRemain > 0 && my.sprite.seed.visible == false){
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
        if(treeRemain > 0 && my.sprite.tree.visible == false){
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

        //Bullet collision with enemy
        for (let bullet of my.sprite.bulletArr) {
            if (this.collides(my.sprite.seed, bullet) && my.sprite.seed.visible) {
                //Bullet animations
                this.bloom = this.add.sprite(my.sprite.seed.x, my.sprite.seed.y, "seed").play("sprout");

                //Play sound
                this.sound.play("grow");

                //Remove sprite from array by moving it outside of bounds
                bullet.y = -100;
                //Reduce number of seed enemies left to spawn
                seedRemain--;
                //Make seed invisible
                my.sprite.seed.visible = false;
                //Stop follow for seed
                my.sprite.seed.stopFollow();
                //Decrease Health
                playerScore += 5 * scoreMult;
                //Update score
                this.scoreBoard.setText('Score: ' + playerScore);
            }
            if (this.collides(my.sprite.tree, bullet) && my.sprite.tree.visible) {
                //Bullet animations
                this.flourish = this.add.sprite(my.sprite.tree.x, my.sprite.tree.y, "tree").play("flourish");

                //Remove sprite from array by moving it outside of bounds
                bullet.y = -100;
                //Reduce number of tree enemies left to spawn
                treeRemain--;
                //Make seed invisible
                my.sprite.tree.visible = false;
                //Stop follow for seed
                my.sprite.tree.stopFollow();
                //Decrease Health
                playerScore += 10 * scoreMult;
                //Update score
                this.scoreBoard.setText('Score: ' + playerScore);
                }
        }

        //Bullet enemy collision with player
        for (let bullet of my.sprite.treeBulletArr){
            if (this.collides(my.sprite.player, bullet)){
                //Remove bullet
                bullet.y = 800;
                //Play sound
                this.sound.play("hit");
                //Reduce Player Health
                playerHealth--;
            }
        }
        
        //Clear Wave
        if (seedRemain <= 0 && treeRemain <= 0){
            //Move bullets off screen
            for (let bullet of my.sprite.treeBulletArr){
                bullet.y = 800;
            }
            for (let bullet of my.sprite.bulletArr){
                bullet.y = -100;
            }

            this.scene.start("clearWave");
        }

        //Game Over
        if (playerHealth == 0){
            //Move bullets off screen
            for (let bullet of my.sprite.treeBulletArr){
                bullet.y = 800;
            }
            for (let bullet of my.sprite.bulletArr){
                bullet.y = -100;
            }
            this.scene.start("gameOver");
        }

    }
    // A center-radius AABB collision check from ArrayBoom
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        console.log('Bullet hit')
        return true;
    }
}
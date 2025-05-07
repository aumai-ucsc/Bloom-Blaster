class clearWave extends Phaser.Scene{
    constructor(){
        super("clearWave");
    }

    preload(){
        
    }

    create(){
        //Create Title
        this.add.text(300, 250, 'S: Continue',
            { 
               fontFamily: 'Indie Flower',
               fontSize: '75px',
             }).setOrigin(0.5);

    
        //Event input: Continue
        let sKey = this.input.keyboard.addKey (Phaser.Input.Keyboard.KeyCodes.S);
        sKey.on('down', (key, event) =>{
            //Difficulty increasers after every wave
            if(shipSpeed > 2000){
                shipSpeed -= 1000;
            }
            if(treeBulletSpeed < 4){
                treeBulletSpeed ++;
            }
            if(treeBulletTimer > 30){
                treeBulletTimer -= 15;
            }

            //Reset enemy wave
            seedRemain = 5;
            treeRemain = 3;

            //Increase score multiplier with difficulty up to 2.5x
            if(scoreMult < 5){
                scoreMult += 1;
            }
            this.scene.start("shootGame");
        });
    }

    update(){

    }
}
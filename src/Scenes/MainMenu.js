class MainMenu extends Phaser.Scene{
    constructor(){
        super("mainMenu");
    }

    preload(){
        
    }

    create(){
        //Create Title
        this.add.text(300, 250, 'Bloom Blaster',
            { 
               fontFamily: 'Indie Flower',
               fontSize: '75px',
             }).setOrigin(0.5);

        //Create Prompt
        this.add.text(300, 350, 'Press \'S\' to start',
            { 
               fontFamily: 'Indie Flower',
               fontSize: '25px',
             }).setOrigin(0.5);

        //Event input: start Game
        let sKey = this.input.keyboard.addKey (Phaser.Input.Keyboard.KeyCodes.S);
        sKey.on('down', (key, event) =>{
            playerScore = 0;
            playerHealth = 3;
            shipSpeed = 10000;
            this.scene.start("shootGame");
        });
         
    }

    update(){

    }
}
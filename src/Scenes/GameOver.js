class GameOver extends Phaser.Scene{
    constructor(){
        super("gameOver");
    }

    preload(){
        
    }

    create(){
        //Create Title
        this.add.text(300, 250, 'GameOVer, S Main',
            { 
               fontFamily: 'Indie Flower',
               fontSize: '75px',
             }).setOrigin(0.5);

    
        //Event input: Game Over
        let sKey = this.input.keyboard.addKey (Phaser.Input.Keyboard.KeyCodes.S);
        sKey.on('down', (key, event) =>{
            this.scene.start("mainMenu");
        });
    }

    update(){

    }
}
class GameOver extends Phaser.Scene{
    constructor(){
        super("gameOver");
    }

    preload(){
        
    }

    create(){
        //Create Title
        this.add.text(300, 250, 'Final Score\n' + playerScore,
            { 
               fontFamily: 'Indie Flower',
               fontSize: '75px',
             }).setOrigin(0.5);

        //Create Prompt
        this.add.text(300, 450, 'Press \'S\' to return to the main menu',
            { 
               fontFamily: 'Indie Flower',
               fontSize: '25px',
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
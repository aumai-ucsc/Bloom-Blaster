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
            if(shipSpeed > 2000){
                shipSpeed -= 1000;
            }
            this.scene.start("shootGame");
        });
    }

    update(){

    }
}
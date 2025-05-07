// Jim Whitehead
// Created: 4/14/2024
// Phaser: 3.70.0
//
// Cubey
//

// debug with extreme prejudice
"use strict"

//Adjusted by Aaron Mai

//Assets by Kenny Assets
// Player Character: https://kenney.nl/assets/platformer-art-extended-enemies
// Enemies: https://kenney.nl/assets/foliage-pack
// UI and Bullets: https://kenney.nl/assets/puzzle-pack-2
// Sounds: https://kenney.nl/assets/interface-sounds

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 600,
    height: 700,
    scene: [MainMenu, ShootGame, GameOver, clearWave]
}


//Persitstent Variables between waves
//Global Variable for player score
let playerScore = 0;

//Global Variable for player health
let playerHealth = 3;

//Global Variable for enemy speed
let shipSpeed = 10000;

//Global variable of enemy bullet properties
let treeBulletSpeed = 1;
let treeBulletTimer = 180;

//Golbal Variable for score multipliers
let scoreMult = 1;

//For some reason, my enemies are disappearing after they are all defeated
let seedRemain = 5;
let treeRemain = 3;

const game = new Phaser.Game(config);

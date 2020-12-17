import GameEngine from './game-engine.js';


function main(){
    GameEngine.setCanvas("gameCanvas");

    GameEngine.initListeners();

    GameEngine.setMap('../img/theSkeldLQ.png').then( () => {
        requestAnimationFrame( () => GameEngine.run() );
    } );
}


main();
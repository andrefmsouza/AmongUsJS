import GameEngine from './game-engine.js';

function main(){

    GameEngine.createPlayer();

    try{
        GameEngine.initConnection( io('http://localhost:3000', {transports: ['websocket', 'polling', 'flashsocket']}) );
    }catch(e){
        console.log("Não foi possivel conectar ao servidor. Mode single player habilitado");
        GameEngine.setSinglePlayer(true);
    }

    GameEngine.setCanvas("gameCanvas");

    GameEngine.initListeners();

    GameEngine.setMap('./img/theSkeldLQ.png', './img/theSkeldLQ-MAP.png').then( () => {
        GameEngine.setVision('./img/vision.png').then( () => {
            GameEngine.initializeSprites('./img/sprites.png').then( () => {

                GameEngine.setColorPlayer( 'black' );
                requestAnimationFrame( () => GameEngine.run() );

            //requestAnimationFrame( () => GameEngine.run() )
            } );
        } );
    } );
}


main();
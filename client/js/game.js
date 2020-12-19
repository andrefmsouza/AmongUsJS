import GameEngine from './game-engine.js';


function main(){

    GameEngine.initConnection( io('http://localhost:3000', {transports: ['websocket', 'polling', 'flashsocket']}) );

    GameEngine.setCanvas("gameCanvas");

    GameEngine.initListeners();

    GameEngine.setMap('./img/theSkeldLQ.png').then( () => {
        requestAnimationFrame( () => GameEngine.run() );
    } );
}


main();
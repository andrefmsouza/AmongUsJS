import GameEngine from './game-engine.js';


function main(){

    try{
        GameEngine.initConnection( io('http://localhost:3000', {transports: ['websocket', 'polling', 'flashsocket']}) );
    }catch(e){
        console.log("Não foi possivel conectar ao servidor. Mode single player habilitado");
        GameEngine.setSinglePlayer(true);
    }

    GameEngine.setCanvas("gameCanvas");

    GameEngine.initListeners();

    GameEngine.setMap('./img/theSkeldLQ.png').then( () => {
        requestAnimationFrame( () => GameEngine.run() );
    } );
}


main();
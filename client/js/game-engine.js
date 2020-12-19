import CollisionDetection from './collision-detection.js';
import DrawCanvas from './draw-canvas.js';

import Cafeteria from './cafeteria.js';
import Weapons from './weapons.js';

const GameEngine = {

    VELOCITY: 3,
    CANVAS_WIDTH: 720,
    CANVAS_HEIGHT: 480,
    PLAYER_REF_CANVAS: {
        x: 0,
        y: 0
    },
    DEV: true,
    INPUT_DEV_MODE: {},

    canvas: {},
    ctx: {},
    map: {},

    player:{
        x: 2465,
        y: 545,
        width: 40,
        height: 50,
        status: 'alive',
        serverIndex: -1
    },
    serverPlayers: [],

    socket: {},

    keyPressed: {},

    obstacles:[
        ...Cafeteria.obstacles,
        ...Weapons.obstacles
    ],

    initConnection(socket){
        this.socket = socket;

        this.socket.emit('new player', this.player);

        this.socket.on('player index', (index) => this.setPlayerIndex(index) );

        this.socket.on('players', (players) => this.setServerPlayers(players) );
    },

    setPlayerIndex(index){
        this.player.serverIndex = index;
    },

    setServerPlayers(players){
        this.serverPlayers = players;
    },

    sendPlayerPositionToServer(){
        this.socket.emit('update player', this.player);
    },

    setDevMode( mode ){
        this.DEV = mode;
    },

    setCanvas(idCanvas){
        this.canvas = document.getElementById(idCanvas);
        this.canvas.width = this.CANVAS_WIDTH;
        this.canvas.height = this.CANVAS_HEIGHT;
        
        this.ctx = this.canvas.getContext("2d");

        this.PLAYER_REF_CANVAS.x = Math.floor( ( this.canvas.width / 2 ) - ( this.player.width / 2) );
        this.PLAYER_REF_CANVAS.y = Math.floor( ( this.canvas.height / 2 ) - ( this.player.height / 2) ); 
    },

    setMap(path){
        this.map = new Image();
        this.map.src = path;
        
        if( this.DEV ){
            this.INPUT_DEV_MODE = document.createElement("INPUT");
            this.INPUT_DEV_MODE.readOnly = true;

            document.body.append( this.INPUT_DEV_MODE );

            this.BTN_DEV_MODE = document.createElement("BUTTON");
            this.BTN_DEV_MODE.innerHTML = `Player status - ${this.player.status}`;
            this.BTN_DEV_MODE.onclick = () =>{
                this.player.status =  this.player.status == 'alive' ? 'dead' : 'alive';
                this.BTN_DEV_MODE.innerHTML = `Player status - ${this.player.status}`;
            };

            document.body.append( this.BTN_DEV_MODE );
        }

        return new Promise( (resolve, reject) => {
            this.map.onload = function() {
                resolve();
            };
        });

        
    },

    initListeners(){
        document.addEventListener("keydown", (evet) => GameEngine.keyDownListener(event) );
        document.addEventListener("keyup", (event) => GameEngine.keyUpListener(event) );
    },

    keyDownListener(event){
        if( ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(event.key) ){
            event.preventDefault();
            this.keyPressed[event.key] = true;
        }
    },
    
    keyUpListener(event){
        if( ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(event.key) ){
            event.preventDefault();
            delete this.keyPressed[event.key];
        }
    },

    movePlayer(){
        let sendUpdate = false;
        if( this.keyPressed["ArrowUp"] ){
            if( this.player.status != 'alive' || !CollisionDetection.collisionDetection( this.obstacles, { ...this.player, y: this.player.y - this.VELOCITY } ) ){
                this.player.y -= this.VELOCITY;
                sendUpdate = true;
            }
        }
        if( this.keyPressed["ArrowRight"] ){
            if( this.player.status != 'alive' || !CollisionDetection.collisionDetection( this.obstacles, {...this.player, x: this.player.x + this.VELOCITY } ) ){
                this.player.x += this.VELOCITY;
                sendUpdate = true;
            }
        }
        if( this.keyPressed["ArrowDown"] ){
            if( this.player.status != 'alive' || !CollisionDetection.collisionDetection( this.obstacles, {...this.player, y: this.player.y + this.VELOCITY } ) ){
                this.player.y += this.VELOCITY;
                sendUpdate = true;
            }
        }
        if( this.keyPressed["ArrowLeft"] ){
            if( this.player.status != 'alive' || !CollisionDetection.collisionDetection( this.obstacles, {...this.player, x: this.player.x - this.VELOCITY } ) ){
                this.player.x -= this.VELOCITY;
                sendUpdate = true;
            }
        }

        
        if(sendUpdate){
            this.sendPlayerPositionToServer();
        }

        if( this.DEV )
            this.INPUT_DEV_MODE.value = `X: ${this.player.x} - Y: ${this.player.y}`;
    },

    setPlayerStatus(status){
        this.player.status = status
    },

    run(){

        this.movePlayer();
        
        //Background
        DrawCanvas.drawRect(this.ctx, 0, 0, this.canvas.width, this.canvas.height, "green");
        DrawCanvas.drawMap( this.canvas, this.ctx, this.map, this.player );
        //Server Players
        DrawCanvas.drawServerPlayers(this.ctx, this.canvas, this.serverPlayers, "white", this.player, this.PLAYER_REF_CANVAS);
        //Player
        DrawCanvas.drawPlayer(this.ctx, this.canvas, this.player, "red");

        if( this.DEV ){
            DrawCanvas.drawObjects(this.obstacles, this.ctx, this.PLAYER_REF_CANVAS, this.player, "red");
        }

        requestAnimationFrame( () => this.run() );
    }
};


export default GameEngine;
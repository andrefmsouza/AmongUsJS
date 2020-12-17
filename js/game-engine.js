import CollisionDetection from './collision-detection.js'

const GameEngine = {

    VELOCITY: 7,
    CANVAS_WIDTH: 720,
    CANVAS_HEIGHT: 480,
    CANVAS_CENTER: {
        x: 0,
        y: 0
    },
    DEV: true,
    INPUT_DEV_MODE: {},

    canvas: {},
    ctx: {},
    map: {},

    player:{
        x: 2098,
        y: 592,
        width: 40,
        height: 40
    },

    keyPressed: {},

    obstacles:[],

    setDevMode( mode ){
        this.DEV = mode;
    },

    setCanvas(idCanvas){
        this.canvas = document.getElementById(idCanvas);
        this.canvas.width = this.CANVAS_WIDTH;
        this.canvas.height = this.CANVAS_HEIGHT;
        
        this.ctx = this.canvas.getContext("2d");

        this.CANVAS_CENTER.x = Math.floor( ( this.canvas.width / 2 ) - ( this.player.width / 2) );
        this.CANVAS_CENTER.y = Math.floor( ( this.canvas.height / 2 ) - ( this.player.height / 2) ); 
    },

    setMap(path){
        this.map = new Image();
        this.map.src = path;
        
        if( this.DEV ){
            this.INPUT_DEV_MODE = document.createElement("INPUT");
            this.INPUT_DEV_MODE.readOnly = true;

            document.body.append( this.INPUT_DEV_MODE );
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
        if( this.keyPressed["ArrowUp"] ){
            if( !CollisionDetection.collisionDetection( this.obstacles, { ...this.player, y: this.player.y - this.VELOCITY }, this.canvas ) ){
                this.player.y -= this.VELOCITY;
            }
        }
        if( this.keyPressed["ArrowRight"] ){
            if( !CollisionDetection.collisionDetection( this.obstacles, {...this.player, x: this.player.x + this.VELOCITY }, this.canvas ) ){
                this.player.x += this.VELOCITY;
            }
        }
        if( this.keyPressed["ArrowDown"] ){
            if( !CollisionDetection.collisionDetection( this.obstacles, {...this.player, y: this.player.y + this.VELOCITY }, this.canvas ) ){
                this.player.y += this.VELOCITY;
            }
        }
        if( this.keyPressed["ArrowLeft"] ){
            if( !CollisionDetection.collisionDetection( this.obstacles, {...this.player, x: this.player.x - this.VELOCITY }, this.canvas ) ){
                this.player.x -= this.VELOCITY;
            }
        }

        if( this.DEV )
            this.INPUT_DEV_MODE.value = `X: ${this.player.x} - Y: ${this.player.y}`;
    },

    drawBackground(){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },

    drawMap(){
        this.ctx.drawImage(
            this.map,
            this.player.x - 100, //img start x
            this.player.y - 100, //img start y
            500, //img width size
            500, //img height size
            0, //canvas initial x
            0, //canvas initial y
            this.canvas.width, //canvas width size
            this.canvas.height //canvas height size
        );
    },

    drawPlayer(){
        this.ctx.fillStyle = "red";

        this.ctx.fillRect( this.CANVAS_CENTER.x, this.CANVAS_CENTER.y, this.player.width, this.player.height);
    },

    drawObstacles(){

    },

    run(){

        this.movePlayer();
        
        this.drawBackground();
        this.drawMap();
        this.drawPlayer();

        if( this.DEV ){
            this.drawObstacles();
        }

        requestAnimationFrame( () => this.run() );
    }
};


export default GameEngine;
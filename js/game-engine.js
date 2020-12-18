import CollisionDetection from './collision-detection.js';
import DrawCanvas from './draw-canvas.js';

const GameEngine = {

    VELOCITY: 3,
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
        x: 2030,
        y: 560,
        width: 40,
        height: 50
    },

    keyPressed: {},

    obstacles:[
        {
            type: 'line',
            x1: 1958,
            y1: 82,
            x2: 1795,
            y2: 256
        },
        {
            type: 'line',
            x1: 1958,
            y1: 82,
            x2: 2490,
            y2: 82
        },
        {
            type: 'line',
            x1: 2490,
            y1: 82,
            x2: 2730,
            y2: 331
        },
        {
            type: 'line',
            x1: 2730,
            y1: 331,
            x2: 2730,
            y2: 530
        },
        {
            type: 'line',
            x1: 1795,
            y1: 256,
            x2: 1795,
            y2: 530
        },
        {
            type: 'line',
            x1: 2515,
            y1: 1023,
            x2: 2730,
            y2: 810
        },
        {
            type: 'line',
            x1: 2515,
            y1: 1023,
            x2: 2311,
            y2: 1023
        },
        {
            type: 'line',
            x1: 2205,
            y1: 1023,
            x2: 2005,
            y2: 1023
        },
        {
            type: 'line',
            x1: 1800,
            y1: 815,
            x2: 2005,
            y2: 1023
        },
        {
            type: 'line',
            x1: 1800,
            y1: 815,
            x2: 1800,
            y2: 615
        },
        {
            type: 'line',
            x1: 2730,
            y1: 616,
            x2: 2730,
            y2: 810
        },
        

        {
            type: 'circle',
            x: 2000,
            y:795,
            radius: 84
        },
        {
            type: 'circle',
            x: 2075,
            y:795,
            radius: 84
        },

        {
            type: 'circle',
            x: 2415,
            y:795,
            radius: 84
        },
        {
            type: 'circle',
            x: 2485,
            y:795,
            radius: 84
        },

        {
            type: 'circle',
            x: 2210,
            y: 585,
            radius: 84
        },
        {
            type: 'circle',
            x: 2281,
            y: 585,
            radius: 84
        },

        {
            type: 'circle',
            x: 2000,
            y: 362,
            radius: 84
        },
        {
            type: 'circle',
            x: 2071,
            y: 362,
            radius: 84
        },

        {
            type: 'circle',
            x: 2415,
            y: 362,
            radius: 84
        },
        {
            type: 'circle',
            x: 2486,
            y: 362,
            radius: 84
        }
    ],

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
            if( !CollisionDetection.collisionDetection( this.obstacles, { ...this.player, y: this.player.y - this.VELOCITY } ) ){
                this.player.y -= this.VELOCITY;
            }
        }
        if( this.keyPressed["ArrowRight"] ){
            if( !CollisionDetection.collisionDetection( this.obstacles, {...this.player, x: this.player.x + this.VELOCITY } ) ){
                this.player.x += this.VELOCITY;
            }
        }
        if( this.keyPressed["ArrowDown"] ){
            if( !CollisionDetection.collisionDetection( this.obstacles, {...this.player, y: this.player.y + this.VELOCITY } ) ){
                this.player.y += this.VELOCITY;
            }
        }
        if( this.keyPressed["ArrowLeft"] ){
            if( !CollisionDetection.collisionDetection( this.obstacles, {...this.player, x: this.player.x - this.VELOCITY } ) ){
                this.player.x -= this.VELOCITY;
            }
        }

        if( this.DEV )
            this.INPUT_DEV_MODE.value = `X: ${this.player.x} - Y: ${this.player.y}`;
    },

    run(){

        this.movePlayer();
        
        //Background
        DrawCanvas.drawRect(this.ctx, 0, 0, this.canvas.width, this.canvas.height, "green");
        DrawCanvas.drawMap( this.canvas, this.ctx, this.map, this.player );
        //Player
        DrawCanvas.drawPlayer(this.ctx, this.canvas, this.player, "red");

        if( this.DEV ){
            DrawCanvas.drawObjects(this.obstacles, this.ctx, this.CANVAS_CENTER, this.player, "blue", this.MAP_ZOOM);
        }

        requestAnimationFrame( () => this.run() );
    }
};


export default GameEngine;
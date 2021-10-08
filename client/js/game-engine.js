import CollisionDetection from './collision-detection.js';
import DrawCanvas from './draw-canvas.js';

import Cafeteria from './map-area/cafeteria.js';
import Navigation from './map-area/navigation.js';
import O2 from './map-area/o2.js';
import Weapons from './map-area/weapons.js';
import Shields from './map-area/shields.js';
import Communication from './map-area/communication.js';

import Player from './player.js';

const GameEngine = {

    VELOCITY: 3,
    CANVAS_WIDTH: 720,
    CANVAS_HEIGHT: 480,
    PLAYER_REF_CANVAS: {
        x: 0,
        y: 0
    },
    DEV: true,
    SINGLE_PLAYER: false,
    INPUT_DEV_MODE: {},

    canvas: {},
    ctx: {},
    map: {},

    canvasCollision: {},
    ctxCollision: {},
    mapCollision: {},

    player:{},
    originalSprite: "",

    sprites: {},

    serverPlayers: [],

    socket: {},

    keyPressed: {},

    obstacles:[
        ...Cafeteria.obstacles,
        ...Weapons.obstacles,
        ...O2.obstacles,
        ...Navigation.obstacles,
        ...Shields.obstacles,
        ...Communication.obstacles
    ],

    colors:{
        red: {
            red: [193,23,1],
            blue: [117,10,58],
            darkGreen: [75,100,111],
            lightGreen: [155,198,222]
        },
        brown: {
            red: [112,74,19],
            blue: [92,39,16],
            darkGreen: [75,100,111],
            lightGreen: [155,198,222]
        },
        orange: {
            red: [235,127,0],
            blue: [176,64,0],
            darkGreen: [75,100,111],
            lightGreen: [155,198,222]
        },
        yellow: {
            red: [246,248,28],
            blue: [193,137,0],
            darkGreen: [75,100,111],
            lightGreen: [155,198,222]
        },
        pink: {
            red: [232,83,192],
            blue: [167,39,180],
            darkGreen: [75,100,111],
            lightGreen: [155,198,222]
        },
        purple: {
            red: [105,40,195],
            blue: [57,17,129],
            darkGreen: [75,100,111],
            lightGreen: [155,198,222]
        },
        blue: {
            red: [17,36,218],
            blue: [7,11,148],
            darkGreen: [75,100,111],
            lightGreen: [155,198,222]
        },
        cyan: {
            red: [183,254,216],
            blue: [53,167,193],
            darkGreen: [75,100,111],
            lightGreen: [155,198,222]
        },
        green: {
            red: [34,127,24],
            blue: [19,77,42],
            darkGreen: [75,100,111],
            lightGreen: [155,198,222]
        },
        lime: {
            red: [97,240,0],
            blue: [45,168,42],
            darkGreen: [75,100,111],
            lightGreen: [155,198,222]
        },
        white: {
            red: [214,224,242],
            blue: [132,147,195],
            darkGreen: [75,100,111],
            lightGreen: [155,198,222]
        },
        black: {
            red: [63,71,79],
            blue: [30,31,39],
            darkGreen: [75,100,111],
            lightGreen: [155,198,222]
        },
        fortegreen: {
            red: [46,152,73],
            blue: [22,63,21],
            darkGreen: [75,100,111],
            lightGreen: [155,198,222]
        },
        tan: {
            red: [145,137,117],
            blue: [80,66,61],
            darkGreen: [75,100,111],
            lightGreen: [155,198,222]
        },  
    },

    initConnection(socket){
        this.socket = socket;

        this.socket.emit('new player', this.player);

        this.socket.on('player index', (index) => this.setPlayerIndex(index) );

        this.socket.on('players', (players) => this.setServerPlayers(players) );
    },

    createPlayer(){
        this.player = new Player();
    },

    setSinglePlayer(mode){
        this.SINGLE_PLAYER = mode;
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
        // this.map.src = './img/theSkeldLQ-MAP.png';
        
        if( this.DEV ){
            this.INPUT_DEV_MODE = document.createElement("INPUT");
            this.INPUT_DEV_MODE.readOnly = true;

            document.body.append( this.INPUT_DEV_MODE );

            this.BTN_DEV_MODE = document.createElement("BUTTON");
            this.BTN_DEV_MODE.innerHTML = `Player status - ${this.player.status}`;
            this.BTN_DEV_MODE.onclick = () =>{
                this.player.status =  this.player.status != 'dead' ? 'dead' : 'stopped';
                this.BTN_DEV_MODE.innerHTML = `Player status - ${this.player.status}`;
            };

            document.body.append( this.BTN_DEV_MODE );

            document.body.append( document.createElement("BR") );


            //CHANGE COLOR
            let colors = Object.entries(this.colors);

            for(let i =0; i < colors.length ;i++){
                let color = colors[i];

                let newColor =  document.createElement("BUTTON");
                newColor.classList.add('setColor');
                newColor.style.backgroundColor = `rgb( ${color[1].red[0]} , ${color[1].red[1]}, ${color[1].red[2]})`;

                newColor.onclick = () =>{
                    this.setColorPlayer(color[0], () => {  } );
                };

                document.body.append( newColor );

            }
        }

        return new Promise( (resolve, reject) => {
            this.map.onload = () => {
                this.canvasCollision = document.createElement('canvas');
                
                
                this.mapCollision = new Image();
                this.mapCollision.src = './img/theSkeldLQ-MAP.png';

                this.mapCollision.onload = () => {

                    this.canvasCollision.width = this.mapCollision.width;
                    this.canvasCollision.height = this.mapCollision.height;
                    this.ctxCollision    = this.canvasCollision.getContext('2d');

                    this.ctxCollision.drawImage( this.mapCollision, 0, 0 );
                    resolve();
                };
            };
        });

        
    },

    initializeSprites(path){
        
        return new Promise( (resolve, reject) => {
            let originalSprite = new Image();

            originalSprite.onload = () => {
                //CREATE COLORS
                let colors = Object.entries(this.colors);

                for(let i =0; i < colors.length ;i++){
                    let color = colors[i][0];
            
                    let newSprite = new Image();
                    
                    newSprite.src = this.sprites.original.src;
                    
                    this.setColorSprite( newSprite, color).then( (newSprite) => {
                        this.sprites[color] = newSprite;
                    } )
                    
                }

                resolve();
            }

            originalSprite.src = path;

            this.sprites.original = originalSprite;
        });

    },

    verifyColor(color, newColors){
        //RED
        if( color[0] >= 25 &&   //red
            color[1] <= 25 && //green
            color[2] <= 75 //blue
        ){
            return [
                newColors.red[0],
                newColors.red[1],
                newColors.red[2],
            ];
        //BLUE
        }else if( color[0] <= 50 &&   //red
            color[1] <= 50 && //green
            color[2] >= 50 //blue
        ){
            return [
                newColors.blue[0],
                newColors.blue[1],
                newColors.blue[2],
            ];
        //DARK GREEN
        }else if( color[0] <= 50 &&   //red
            color[1] <= 150 && //green
            color[1] >= 25 && //green
            color[2] <= 50 //blue
        ){
            return [
                newColors.darkGreen[0],
                newColors.darkGreen[1],
                newColors.darkGreen[2],
            ];
        //LIGHT GREEN
        }else if( color[0] <= 50 &&   //red
            color[1] >= 150 && //green
            color[2] <= 50 //blue
        ){
            return [
                newColors.lightGreen[0],
                newColors.lightGreen[1],
                newColors.lightGreen[2],
            ];
        }

        return color;
    },

    setColorSprite(sprite, color){

       let newColors = {
            red: [
                this.colors[color].red[0],
                this.colors[color].red[1],
                this.colors[color].red[2]
            ],
            blue: [
                this.colors[color].blue[0],
                this.colors[color].blue[1],
                this.colors[color].blue[2]
            ],
            darkGreen: [
                this.colors[color].darkGreen[0],
                this.colors[color].darkGreen[1],
                this.colors[color].darkGreen[2]
            ],
            lightGreen: [
                this.colors[color].lightGreen[0],
                this.colors[color].lightGreen[1],
                this.colors[color].lightGreen[2]
            ]
        }

        return new Promise( (resolve, reject) => {
            var newSpriteCanvas = document.createElement('canvas');
            var newSpriteCtx= newSpriteCanvas.getContext("2d");
            var newSpriteWidth = sprite.width;
            var newSpriteHeight = sprite.height;

            newSpriteCanvas.width = newSpriteWidth;
            newSpriteCanvas.height = newSpriteHeight;

            // draw the image on the temporary canvas
            newSpriteCtx.drawImage(sprite, 0, 0, newSpriteWidth, newSpriteHeight);

            // pull the entire image into an array of pixel data
            var imageData = newSpriteCtx.getImageData(0, 0, newSpriteWidth, newSpriteHeight);

            // examine every pixel, 
            // change any old rgb to the new-rgb
            for ( var i=0; i < imageData.data.length; i+=4 )
            {
                let colorVerified = this.verifyColor( [
                    imageData.data[i],
                    imageData.data[i+1],
                    imageData.data[i+2]
                ], newColors );

                imageData.data[i] = colorVerified[0];
                imageData.data[i+1] = colorVerified[1];
                imageData.data[i+2] = colorVerified[2];
            }
            // put the altered data back on the canvas  
            newSpriteCtx.putImageData(imageData,0,0);
            // put the re-colored image back on the image
            sprite.onload = () => {
                resolve(sprite);
            };
            
            sprite.src = newSpriteCanvas.toDataURL('image/png');
        });
    },

    initListeners(){
        document.addEventListener("keydown", (event) => GameEngine.keyDownListener(event) );
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
        let positionUpdated = false;
        if( this.keyPressed["ArrowUp"] ){
            if( this.player.y - this.VELOCITY > 0 && ( this.player.status == 'dead' || !CollisionDetection.collisionDetection( this.obstacles, { ...this.player, y: this.player.y - this.VELOCITY }, 1, this ) ) ){
                this.player.y -= this.VELOCITY;
                positionUpdated = true;
            }
        }
        if( this.keyPressed["ArrowRight"] ){
            if( this.player.x + this.VELOCITY < this.map.width && ( this.player.status == 'dead' || !CollisionDetection.collisionDetection( this.obstacles, {...this.player, x: this.player.x + this.VELOCITY }, 1, this ) ) ){
                this.player.x += this.VELOCITY;
                this.player.direction = 'right';
                positionUpdated = true;
            }
        }
        if( this.keyPressed["ArrowDown"] ){
            if( this.player.y + this.VELOCITY < this.map.height && ( this.player.status == 'dead' || !CollisionDetection.collisionDetection( this.obstacles, {...this.player, y: this.player.y + this.VELOCITY }, 1, this ) ) ){
                this.player.y += this.VELOCITY;
                positionUpdated = true;
            }
        }
        if( this.keyPressed["ArrowLeft"] ){
            if( this.player.x - this.VELOCITY > 0 && ( this.player.status == 'dead' || !CollisionDetection.collisionDetection( this.obstacles, {...this.player, x: this.player.x - this.VELOCITY }, 1, this ) ) ){
                this.player.x -= this.VELOCITY;
                this.player.direction = 'left';
                positionUpdated = true;
            }
        }

        if(positionUpdated || this.player.status == 'dead' ){
            this.player.nextSpriteCounter++;
            
            if( this.player.nextSpriteCounter % 6 == 0 )
                this.player.spriteIndex++;

            
            if( this.player.status == 'dead' ){
                if( this.player.spriteIndex >= this.player.sprites.ghost.length )
                    this.player.spriteIndex = 0;
            }else{
                if( this.player.spriteIndex >= this.player.sprites.running.length )
                    this.player.spriteIndex = 0;

                this.player.status = 'running';
            }

            if(this.SINGLE_PLAYER == false){
                this.sendPlayerPositionToServer();
            }
        }else{
            this.player.status = 'stopped';
        }
        

        if( this.DEV )
            this.INPUT_DEV_MODE.value = `X: ${this.player.x} - Y: ${this.player.y}`;
    },

    setPlayerStatus(status){
        this.player.status = status
    },

    setColorPlayer(color){
        this.player.color = color;
    },

    run(){

        try{
            this.movePlayer();
            
            //Background
            DrawCanvas.drawRect(this.ctx, 0, 0, this.canvas.width, this.canvas.height, "green");
            DrawCanvas.drawMap( this.canvas, this.ctx, this.map, this.player );
            //Server Players
            DrawCanvas.drawServerPlayers(this.ctx, this.canvas, this.serverPlayers, "white", this.player, this.PLAYER_REF_CANVAS);
            //Player
            DrawCanvas.drawPlayer(this.ctx, this.canvas, this.player, "red");
            let playerSprite = this.sprites[this.player.color] ? this.player.color : 'original';

            DrawCanvas.drawPlayerSprite(this.ctx, this.player, this.player, this.PLAYER_REF_CANVAS, this.sprites[playerSprite]);

            if( this.DEV ){
                DrawCanvas.drawObjects(this.obstacles, this.ctx, this.PLAYER_REF_CANVAS, this.player, "red");
            }
        }catch(e){
            console.log(e);
        }

        requestAnimationFrame( () => this.run() );
    }
};


export default GameEngine;
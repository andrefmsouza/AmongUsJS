const Player = function(){
    this.x =  1540;
    this.y =  611;
    this.width = 40;
    this.height = 50;
    this.status = 'stopped';
    this.serverIndex = -1;
    this.nextSpriteCounter = 0;
    this.spriteIndex = 0;
    this.direction = 'right';
    this.sprites ={
        stopped: {
            x: 0,
            y: 0,
            width: 200,
            height: 271
        },
        running:[
            {
                x: 204,
                y: 0,
                width: 200,
                height: 271
            },
            {
                x: 423,
                y: 0,
                width: 200,
                height: 271
            },
            {
                x: 633,
                y: 0,
                width: 200,
                height: 271
            },
            {
                x: 836,
                y: 0,
                width: 200,
                height: 271
            },
        ],
        ghost: [
            {
                x: 1048,
                y: 0,
                width: 200,
                height: 271
            },
            {
                x: 1257,
                y: 0,
                width: 200,
                height: 271
            },
            {
                x: 1462,
                y: 0,
                width: 200,
                height: 271
            }
        ]
    };
    this.color = "original";
}

export default Player;
const CollisionDetection = {
    collisionDetection( obstacles, playerPosition, canvasProporcion = false ){
        for( i in obstacles){
            let obstacle = obstacles[i];
    
            if(obstacle.type == 'line'){
                if( this.lineRectCollision( obstacle, playerPosition, canvasProporcion ) )
                    return true;
            }else if(obstacle.type == 'circle'){
            }else if(obstacle.type == 'rect'){
                if( rectRectCollision( obstacle, playerPosition, canvasProporcion ) )
                    return true;
            }
        }
    
        return false;
    
    },
    
    lineLineCollision(line1, line2){
        let uA = ((line2.x2-line2.x1)*(line1.y1-line2.y1) - (line2.y2-line2.y1)*(line1.x1-line2.x1)) / ((line2.y2-line2.y1)*(line1.x2-line1.x1) - (line2.x2-line2.x1)*(line1.y2-line1.y1));
        let uB = ((line1.x2-line1.x1)*(line1.y1-line2.y1) - (line1.y2-line1.y1)*(line1.x1-line2.x1)) / ((line2.y2-line2.y1)*(line1.x2-line1.x1) - (line2.x2-line2.x1)*(line1.y2-line1.y1));
    
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
            return true;
        }
        return false;
    },
    
    lineRectCollision(obstacle, playerPosition, canvasProporcion = false){
        if(canvasProporcion){
            var widthImgProporcion = playerPosition.width * 100 / canvasProporcion.width;
            var heightImgProporcion = playerPosition.height * 100 / canvasProporcion.height;
        }else{
            var widthImgProporcion = playerPosition.width;
            var heightImgProporcion = playerPosition.height;
        }
    
        let left =   lineLineCollision(obstacle, {
            x1: playerPosition.x,
            y1: playerPosition.y,
            x2: playerPosition.x,
            y2: playerPosition.y + heightImgProporcion,
        });
        let right =  lineLineCollision(obstacle, {
            x1: playerPosition.x + widthImgProporcion, 
            y1: playerPosition.y,
            x2: playerPosition.x + widthImgProporcion,
            y2: playerPosition.y + heightImgProporcion
        });
        let top =    lineLineCollision(obstacle, {
            x1: playerPosition.x,
            y1: playerPosition.y,
            x2: playerPosition.x + widthImgProporcion,
            y2: playerPosition.y
        });
        let bottom = lineLineCollision(obstacle, {
            x1: playerPosition.x,
            y1: playerPosition.y + heightImgProporcion,
            x2: playerPosition.x + widthImgProporcion,
            y2: playerPosition.y + heightImgProporcion
        });
    
        if (left || right || top || bottom) {
            return true;
        }
        return false;
    },
    
    rectRectCollision( obstacle, playerPosition, canvasProporcion = false ){
        if(canvasProporcion){
            var widthImgProporcion = playerPosition.width * 100 / canvasProporcion.width;
            var heightImgProporcion = playerPosition.height * 100 / canvasProporcion.height;
        }else{
            var widthImgProporcion = playerPosition.width;
            var heightImgProporcion = playerPosition.height;
        }
    
        if (obstacle.x < playerPosition.x + widthImgProporcion &&
            obstacle.x + obstacle.width >  playerPosition.x &&
            obstacle.y < playerPosition.y + heightImgProporcion &&
            obstacle.y + obstacle.height > playerPosition.y) {
                return true;
        }
    
        return false;
    },
}

export default CollisionDetection;
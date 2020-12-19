const CollisionDetection = {
    collisionDetection( obstacles, playerPosition, zoom = 1 ){
        for( let i in obstacles){
            let obstacle = obstacles[i];
    
            if(obstacle.type == 'line'){
                if( CollisionDetection.lineRectCollision( obstacle, playerPosition, zoom ) )
                    return true;
            }else if(obstacle.type == 'circle'){
                if( CollisionDetection.rectCircleCollision( obstacle, playerPosition, zoom ) )
                    return true;
            }else if(obstacle.type == 'rect'){
                if( CollisionDetection.rectRectCollision( obstacle, playerPosition, zoom ) )
                    return true;
            }else if(obstacle.type == 'ellipse'){
                if( CollisionDetection.lineRectCollision( obstacle, playerPosition, zoom ) )
                    return true;
            }
        }
    
        return false;
    
    },

    rectCircleCollision(obstacle, playerPosition, zoom = 1){
        let widthImgProporcion = playerPosition.width  / zoom;
        let heightImgProporcion = playerPosition.height / zoom;

        //distances between the circle’s center and the rectangle’s center
        var distX = Math.abs( obstacle.x - playerPosition.x - widthImgProporcion / 2 );
        var distY = Math.abs( obstacle.y - playerPosition.y - heightImgProporcion / 2);

        //too far to collide
        if (distX > ( widthImgProporcion / 2 + obstacle.radius)) { return false; }
        if (distY > ( heightImgProporcion / 2 + obstacle.radius)) { return false; }

        //rect inside the circle
        if (distX <= ( widthImgProporcion / 2)) { return true; } 
        if (distY <= ( heightImgProporcion / 2)) { return true; }

        //Using Pythagoras formula to compare the distance between circle and rect centers.
        var dx = distX - widthImgProporcion / 2;
        var dy = distY- heightImgProporcion / 2;
        return ( dx * dx + dy * dy <= ( obstacle.radius * obstacle.radius ) );
    },
    
    lineLineCollision(line1, line2){
        let uA = ((line2.x2-line2.x1)*(line1.y1-line2.y1) - (line2.y2-line2.y1)*(line1.x1-line2.x1)) / ((line2.y2-line2.y1)*(line1.x2-line1.x1) - (line2.x2-line2.x1)*(line1.y2-line1.y1));
        let uB = ((line1.x2-line1.x1)*(line1.y1-line2.y1) - (line1.y2-line1.y1)*(line1.x1-line2.x1)) / ((line2.y2-line2.y1)*(line1.x2-line1.x1) - (line2.x2-line2.x1)*(line1.y2-line1.y1));
    
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
            return true;
        }
        return false;
    },
    
    lineRectCollision(obstacle, playerPosition, zoom = 1){
        let widthImgProporcion = playerPosition.width  / zoom;
        let heightImgProporcion = playerPosition.height / zoom;
    
        let left =   CollisionDetection.lineLineCollision(obstacle, {
            x1: playerPosition.x,
            y1: playerPosition.y,
            x2: playerPosition.x,
            y2: playerPosition.y + heightImgProporcion,
        });
        let right =  CollisionDetection.lineLineCollision(obstacle, {
            x1: playerPosition.x + widthImgProporcion, 
            y1: playerPosition.y,
            x2: playerPosition.x + widthImgProporcion,
            y2: playerPosition.y + heightImgProporcion
        });
        let top =    CollisionDetection.lineLineCollision(obstacle, {
            x1: playerPosition.x,
            y1: playerPosition.y,
            x2: playerPosition.x + widthImgProporcion,
            y2: playerPosition.y
        });
        let bottom = CollisionDetection.lineLineCollision(obstacle, {
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
    
    rectRectCollision( obstacle, playerPosition, zoom = 1 ){
        
        let widthImgProporcion = playerPosition.width  / zoom;
        let heightImgProporcion = playerPosition.height / zoom;
        
    
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
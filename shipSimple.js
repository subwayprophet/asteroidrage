import {canvasShip,lineToAngle} from './canvas.js';

export function Ship(radius) {
    let ctx = canvasShip.getContext('2d');
    let canvasWidth = canvasShip.getBoundingClientRect().width;
    let canvasHeight = canvasShip.getBoundingClientRect().height;

    this.x0 = canvasWidth/2;
    this.y0 = canvasHeight/2;

    this.currX = this.x0;
    this.currY = this.y0;

    this.prevX = this.currX;
    this.prevY = this.prevY;

    this.orientation = -90;
    this.speed = 0;
    this.minNonZeroSpeed = 0.01;

    this.rocketForce = 5;
    this.retroRocketForce = 5;

    this.getAccelerationInterval = function() {
        if(this.speed < this.minNonZeroSpeed) return 1;
        return this.speed / 5;
    }

    this.create = function() {
        this.draw();
        this.addEventListeners();
    }

    this.fly = function() {
        let s = this;
        s.move();
        window.requestAnimationFrame(function() {
            s.fly();
        })
    }

    this.explode = function() {
        let s = this;
        console.log('YOU COLLIDED WITH AN ASTEROID!!! LOSESR!!!');
        console.log('ship centerpoint: ' + this.currX + ', ' + this.currY);
        ctx.beginPath();
        let degrees = 360;
        ctx.arc(s.currX,s+radius,10,0,degrees.toRads());
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    this.fireRocket = function() {
        this.speedUp(this.rocketForce);
        this.drawRocketFire();
    }
    this.fireRetroRocket = function() {
        this.slowDown(this.retroRocketForce);
        this.drawRocketFire();
    }
    this.drawRocketFire = function() {
        let s = this;
        ctx.beginPath();
        let degrees = 360;
        ctx.arc(s.currX,s.currY,10,0,degrees.toRads());
        ctx.fillStyle = 'red';
        ctx.fill();
    }

    this.draw = function() {
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        let s = this;
        let degrees = 360;
        ctx.beginPath();
        if(s.currX > canvasWidth) s.currX = 0;
        if(s.currY > canvasHeight) s.currY = 0;
        if(s.currX < 0) s.currX = canvasWidth;
        if(s.currY < 0) s.currY = canvasHeight;
        //circle? hard to use
        //ctx.arc(s.currX,s.currY,radius,0,degrees.toRads());
        //rectangle? no orientation built in
        /*
        let width = radius;
        let height = radius * 2;
        let startX = s.currX - width/2;
        let startY = s.currY - height/2;
        let rightX = startX + width;
        let topY = startY + height;
        ctx.moveTo(startX,startY);
        ctx.lineTo(startX,topY);
        ctx.lineTo(rightX,topY);
        ctx.lineTo(rightX,startY);
        ctx.lineTo(startX,startY);
        ctx.fillStyle = 'blue';
        ctx.fill();
        */
        //thick line? using my current orientation? yes!
        lineToAngle(ctx,s.currX,s.currY,radius,s.orientation);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 10;
        ctx.stroke();
    }

    //todo: wrong?
    this.shove = function(x,y) {
        if(x===0) x=1; //bogus
        if(y===0) y=1; //fix
        let tanTheta = x/y;
        let theta = Math.atan(tanTheta.toRads());
        this.orientation += theta;
    }

    this.rotate = function(degrees) {
        this.orientation += degrees;
    }

    this.speedUp = function() {
        this.speed += this.getAccelerationInterval();
    }
    this.slowDown = function() {
        this.speed -= this.getAccelerationInterval();
    }

    this.move = function() {
        let s = this;
        let hypoteneuse = s.speed;
        let x = Math.cos(s.orientation.toRads()) * hypoteneuse;
        let y = Math.sin(s.orientation.toRads()) * hypoteneuse;
        s.moveBy(x,y);
    }
    this.moveBy = function(x,y) {
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX += x;
        this.currY += y;
        this.draw();
    }
    


    this.addEventListeners = function() {
        let s = this;
        window.addEventListener("keydown", function (event) {
            if (event.defaultPrevented) {
              return; // Do nothing if the event was already processed
            }
          
            switch (event.key) {
              case "Down": // IE/Edge specific value
              case "ArrowDown":
                s.fireRetroRocket(); //y starts at top so y positive is down
              break;
              case "Up": // IE/Edge specific value
              case "ArrowUp":
                s.fireRocket();
                break;
              case "Left": // IE/Edge specific value
              case "ArrowLeft":
                // Do something for "left arrow" key press.
                s.rotate(-5);
                break;
              case "Right": // IE/Edge specific value
              case "ArrowRight":
                s.rotate(5);
                break;
              case "Enter":
                //car.accelerateTo(0);
                break;
              case "Esc": // IE/Edge specific value
              case "Escape":
                // Do something for "esc" key press.
                break;
              default:
                return; // Quit when this doesn't handle the key event.
            }
          
            // Cancel the default action to avoid it being handled twice
            event.preventDefault();
          }, true);
    }
}
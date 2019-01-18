$(function(){
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//------------------------Variables-------------------//

var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = Math.random() * 3;
var dy = -5;
var radius = 10;
var colorBricks = "#0095DD";
var colorPaddle="#F5F1D5";
var colorScore="#FCFFF5";
var colorBall =randomColorGenerator();
var paddleH = 10;
var paddleW = 120;
var paddleX = (canvas.width - paddleW) / 2;
var paddleY = canvas.height - paddleH - 2;
var rightButton = false;
var leftButton = false;
var brickRows = 7;
var brickColumns = 10;
var brickWidth = 120;
var brickHeight = 30;
var brickPadding = 10;
var offset = 30;
var score = 0;
var SpeedCounter = dy+6;
var Lives = 3;

// OBJECTS

var paddle=new Paddle(paddleX,paddleY,paddleW,paddleH);
var ball=new Ball(x,y,dx,dy,radius);
var drawText=new DrawText();
var brick=new Bricks();

// All bricks sit here

var bricks = [];
for (var i = 0; i < brickColumns; i++) {
    bricks[i] = [];
    for (var j = 0; j < brickRows; j++) {
        bricks[i][j] = {x: 0, y: 0, status: 1}
    }
}

//-----------------------Events-----------------------------------//

$(document).keydown(function(e){
    if (e.keyCode == 39) {
        rightButton = true;
    }
    if (e.keyCode == 37) {
        leftButton = true;
    }

});
$(document).keyup(function(e){
 if (e.keyCode == 39) {
        rightButton = false;
    }
    if (e.keyCode == 37) {
        leftButton = false;
    }

});

// ------------------------Drawing Functions-----------------//

function DrawText(){
    this.drawScore =function () {
        ctx.font = "16px Eater";
        ctx.fillStyle = colorScore;
        ctx.fillText("Score: " + score, 4, 17)
    }
    this.drawLives =function () {
        ctx.font = "16px Indie Flower";
        ctx.fillStyle = colorScore;
        ctx.fillText("Lives: " + Lives, canvas.width - 90, 17);
    }
   this.drawPaddleHit=function(){
        ctx.font="16px Eater";
        ctx.fillStyle=colorScore;
        ctx.fillText("PaddleHits: "+SpeedCounter,canvas.width/2,17);
    }


}


//--------------------Random color generator-----------------//

function randomColorGenerator() {
    var colorLetters = '0123456789ABCDEF';
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += colorLetters[Math.floor(Math.random() * 16)]
    }
    return color;
}

// ---------------------------- Ball Object ---------------------------//

function Ball(x,y,dx,dy,radius){
    this.x=x;
    this.y=y;
    this.dx=dx;
    this.dy=dy;
    this.radius=radius;
    
    this.draw =function(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = colorBall;
        ctx.fill();
        ctx.closePath();
        this.x += this.dx;
        this.y += this.dy;




    };
    this.move=function () {
        if (this.y + this.dy < this.radius){
            this.dy = -this.dy;
    }
    else if(this.y +this.dy> canvas.height - this.radius-3) {
            if (this.x  > paddle.paddleX  - 4 && this.x <paddle.paddleX + paddle.paddleW + 5) {
                this.dx=8*((this.x-(paddle.paddleX+paddle.paddleW/2))/paddle.paddleW);
                if (SpeedCounter % 2 == 0) {
                    this.dy = -this.dy-0.5;
                }
                else
                    this.dy = -this.dy;
                SpeedCounter++;
            }

         else {
                Lives--;
                if (!Lives) {
                    alert("Game Over");
                    document.location.reload();
                }
                else {
                    paddle.paddleX = (canvas.width - paddleW) / 2;
                    this.dx = Math.random() * 3;
                    this.dy = -Math.random() * 5-4;
                    this.x = canvas.width / 2;
                    this.y = canvas.height - 30;
                }
            }
    }
        if (this.x +this.dx> canvas.width - this.radius ||this. x +this.dx < this.radius) {
            this.dx = -this.dx;
        }
    };




}

//--------------------------BALL OBJECT ENDS HERE ------------------//

//--------------------------Paddle Object ------------------------//

function Paddle(paddleX,paddleY,paddleW,paddleH) {
    this.paddleX=paddleX;
    this.paddleY=paddleY;
    this.paddleW=paddleW;
    this.paddleH=paddleH;

    this.draw =function () {
        ctx.beginPath();
        ctx.rect(this.paddleX, this.paddleY, this.paddleW, this.paddleH);
        ctx.fillStyle = colorPaddle;
        ctx.fill();
        ctx.closePath();
    }
    this.paddleMove =function () {
        if (rightButton && canvas.width > this.paddleX + this.paddleW + 2) {
            this.paddleX += 10;
        }
        else if (leftButton && this.paddleX > 2) {
            this.paddleX -= 10;
        }
    }
}

//----------------------------Paddle Object End !! -----------------------------//



//----------------------------Bricks Object Starts Here------------------------//
function Bricks(){
    this.draw=function(){
        for (var i = 0; i < brickColumns; i++) {
        for (var j = 0; j < brickRows; j++) {
            if (bricks[i][j].status == 1) {
                var brickX = (i * (brickWidth + brickPadding) + offset);
                var brickY = (j * (brickHeight + brickPadding) + offset);
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = colorBricks;
                ctx.fill();
                ctx.closePath();
                 }
            }
        }
    };
    this.destroyBrick=function(){
    for (var c = 0; c < brickColumns; c++) {
        for (var r = 0; r < brickRows; r++) {
            if (bricks[c][r].status == 1)
                if (ball.x > bricks[c][r].x && ball.x < bricks[c][r].x + brickWidth
                    && ball.y > bricks[c][r].y && ball.y < bricks[c][r].y + brickHeight) {
                    ball.dy = -ball.dy;
                    bricks[c][r].status = 0;
                    score += 2;
                    if (score / 2 == brickColumns * brickRows) {
                        alert("You Win")
                        document.location.reload();
                    }
                }
            }
        }
    };
};
//--------------------------Bricks OBJECT ENDS HERE !!! -------------------//

// ------------------ EVERYTHING GOES HERE !!! -----------------------------//

function clearAndDraw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ball.draw();
    ball.move();
    paddle.draw();
    paddle.paddleMove();
    brick.draw();
    brick.destroyBrick();
    drawText.drawLives();
    drawText.drawScore();
    drawText.drawPaddleHit();
    requestAnimationFrame(clearAndDraw)


}
setTimeout(function(){
    for (var i = 0; i <= brickColumns-1; i++) {
        for (var j = 0; j <= brickRows-1; j++) {
            if (bricks[i][j].status == 1) {
                alert("You Lose")
                document.location.reload();

             }
            break; }
        break;}
},60000)
clearAndDraw();
});
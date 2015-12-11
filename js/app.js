//'use strict';
//Boundaries of the game board (x or y values)
var LEFT_WALL = 3;
var RIGHT_WALL = 403;
var BOTTOM_WALL = 396;
var WATER = 63;

//starting and reset point for the player
var START_X = 203;
var START_Y = 396;

//a frequently-used formula for picking n random numbers
var randNum = function(n) {
    return Math.floor(Math.random() * n);
};

//variables to keep track of lives remaining, score and high score
var lives = 3;
var score = 0;
var highScore = 0;

//a function to put lives, score, high score on the screen (in the DOM)
var scoring = function() {
    document.getElementById("score_box").innerHTML =
        "Score: <strong>" + score + "</strong> ---";
    document.getElementById("lives_remaining").innerHTML =
        "Lives Remaining: <strong>" + lives + "</strong> ---";
    document.getElementById("high_score").innerHTML =
        "Your High Score: <strong>" + highScore + "</strong>";
};

//calls the function when the game loads
scoring();

//five possible player images
var playerImages = ['images/char-boy.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png',
    'images/char-cat-girl.png'
];

//add all player images to the html and add a listener for clicks...
//which allows user to change player image at any time
document.getElementById("sprite1").addEventListener("click", function() {
    player.sprite = playerImages[0];
});
document.getElementById("sprite2").addEventListener("click", function() {
    player.sprite = playerImages[1];
});
document.getElementById("sprite3").addEventListener("click", function() {
    player.sprite = playerImages[2];
});
document.getElementById("sprite4").addEventListener("click", function() {
    player.sprite = playerImages[3];
});
document.getElementById("sprite5").addEventListener("click", function() {
    player.sprite = playerImages[4];
});

// Enemies our player must avoid
var Enemy = function(sprite, x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > 500) {
        this.reset();
    }
};

//Send enemies back to a random spot with a negative x value
//and a new random speed
Enemy.prototype.reset = function() {
    this.x = ((Math.random() * -900) - 100);
    this.speed = (Math.random() * 400) + 200;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player(sprite, x, y) {
    //pick one of the five player sprites at random to start the game
    this.sprite = playerImages[randNum(5)];
    //position the sprite at the start point
    this.x = START_X;
    this.y = START_Y;
};
//jshint calls this semicolon unnecessary. Is it needed since the 
//function isn't being called?

Player.prototype.reset = function() {
    //reset puts player back to the start, updates score and lives...
    this.x = START_X;
    this.y = START_Y;
    //...and checks to see if any lives are left
    if (lives === 0) {
        //stops the game with an alert, reports the score
        alert("Game Over! Score: " + score);
        //updates the high score if appropriate
        if (score > highScore) {
            highScore = score;
        }
        //resets score, lives for new game
        score = 0;
        lives = 3;
        //calls fresh treasure and enemy functions
        newTreasure();
        newEnemy();
    }
    //...and calls scoring function to update score and lives
    scoring();
};

Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //values chosen to keep player roughly centered in the squares
    VERTICAL_MOVE = 83;
    HORIZONTAL_MOVE = 100;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//The following controls the player's movement
Player.prototype.handleInput = function(input, allowedKeys) {
    switch (input) {
        case 'up':
            this.y -= VERTICAL_MOVE;
            /* if player reaches the water, add 200 to score, add a life,
            update onscreen score/lives, send player back to start. */
            if (this.y <= WATER) {
                score += 200;
                lives += 1;
                this.reset();
                scoring();
            }
            break;
        case 'down':
            //moves player down unless player is at bottom wall
            if (this.y < BOTTOM_WALL) {
                this.y += VERTICAL_MOVE;
            }
            break;
        case 'left':
            // moves player left unless at left wall
            if (this.x > LEFT_WALL) {
                this.x -= HORIZONTAL_MOVE;
            }
            break;
        case 'right':
            //moves player right unless at right wall
            if (this.x < RIGHT_WALL) {
                this.x += HORIZONTAL_MOVE;
            }
            break;
    }
};

//defines treasures to be collected for extra points
function Treasure(sprite, x, y) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
};
//jshint calls this semicolon unnecessary. Is it needed since the 
//function isn't being called?

Treasure.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.checkCollisions = function() {
    //check player-enemy colllisons
    //loop through each enemy...
    for (i = 0; i < allEnemies.length; i++) {
        //...see if y values match exactly and x values are within 80 in either
        //direction. the value 80 eliminates collisons of transparent margins
        if (this.y == allEnemies[i].y && Math.abs(this.x -
                allEnemies[i].x) < 80) {
            //removes a life and send player back to start
            lives -= 1;
            this.reset();
        }
    }
    //check player-treasure collisons
    //loop through each treasure...
    for (i = 0; i < allTreasures.length; i++) {
        //...see if x and y values match
        if (this.x == allTreasures[i].x && this.y == allTreasures[i].y) {
            //remove the treasures from the board's visible area
            allTreasures[i].x = -300;
            allTreasures[i].y = 396;
            //award the player 100 points
            score += 100;
            //update the scoring displayed on screen
            scoring();
        }
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
//loop thru this function pushing six enemies to allEnemies
var newEnemy = function() {
    //empty out allEnemies by setting length to zero. 
    //to create a new set of enemies with each new game
    allEnemies.length = 0;
    for (i = 0; i < 6; i++) {
        //x[0] varies start point from just off the board to about halfway
        //across the board, and x[1] varies placement off (to the left) 
        //of the board
        var x = [((Math.random() - 0.2) * 450), ((Math.random() * -500) - 200)];
        //y values chosen to center enemies vertically on path
        var y = [64, 147, 230];
        //provides a variety of speeds
        speed = ((Math.random() * 600) + 200);
        //choose x[0] or x[1] and y[0], y[1] or y[2]
        var enemy = new Enemy(this.sprite, x[randNum(2)], y[randNum(3)], speed);
        allEnemies.push(enemy);
    }
};

newEnemy();

var player = new Player();

var allTreasures = [];
//loop through this function, push one, two or three treasures to allTreasures
var newTreasure = function() {
    //empty out allTreasures by setting length to zero. 
    //to create a new set of treasures with each new game
    allTreasures.length = 0;
    //three images to be used for treasure
    var treasureSprite = ['images/Key.png',
        'images/Star.png',
        'images/Gem Blue.png',
        'images/Gem Orange.png',
        'images/Heart.png'
    ];
    //boundaries of the 15-square treasure area (the gray stone squares)
    var treasureX = [3, 103, 203, 303, 403];
    var treasureY = [230, 147, 64];
    //run loop at least twice and as many as five times
    for (i = 0; i <= (randNum(4) + 1); i++) {
        //chose randomly among the treasure sprites
        var treasure = new Treasure(treasureSprite[randNum(5)],
            //place treasures from left to right w/unique x, random y
            treasureX[i], treasureY[randNum(3)]);
        allTreasures.push(treasure);
    }
};

newTreasure();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
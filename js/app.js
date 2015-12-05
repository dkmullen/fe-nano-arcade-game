//Boundaries of the game board
var leftWall = 3;
var rightWall = 403;
var bottomWall = 396;
var water = 63;
//starting and reset point for the player
var startX = 203;
var startY = 396;
//boundaries of the six-square treasure area
var treasureX = [103, 203, 303];
var treasureY = [147, 64];
//three images to be used for treasure
var treasureSprite = ['images/Key.png', 'images/Star.png', 'images/Gem Blue.png'];
//two frequently-used math formulas
//the first picks between 0 and 1
var twoOptions = function() {
	return Math.round(Math.random());
};
//and the second picks from 0, 1, and 2
var threeOptions = function() {
	return Math.floor(Math.random()* 3);
};
var tries = 3;
var score = 0;
var highScore = 0;
var scoring = function() {
	document.getElementById("score_box").innerHTML = "Score: " + score + " ---";
	document.getElementById("tries_remaining").innerHTML = "Tries Remaining: " + tries + " ---";
	document.getElementById("high_score").innerHTML = "Your High Score: " + highScore;
};
//put the starting score of 0 and tries remaining on the screen as game starts
scoring();
document.getElementById("sprite1").addEventListener("click", chooseSprite);

function chooseSprite() {
	player.sprite = 'images/char-boy.png';
};


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
	//Send enemies back to a random spot with a negative x value
	//and a new random speed
	if (this.x > 500) {
		this.x = ((Math.random()* -900) - 100);
		this.speed = (Math.random() * 400) + 200;
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player(sprite, x, y) {
	this.sprite = 'images/char-cat-girl.png';
	this.x = startX;
	this.y = startY;
	//reset puts player back to the start, updates score and tries...
	this.reset = function() {
		player.x = startX;
		player.y = startY;
		//...and checks to see if any tries are left
		if (tries == 0) {
			alert("Game Over! Score: " + score);
			if (score > highScore) {
				highScore = score;
			}
			score = 0;
			tries = 3;
		}
		scoring();
	};
};
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	verticalMove = 83;
	horizontalMove = 100;
};
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//The following controls the player's movement
Player.prototype.handleInput = function(input, allowedKeys) {
	if (input == 'up') {
		player.y -=verticalMove;
		/* if player completely reaches the water, add 200 to score, add a try,
		send player back to start, update onscreen score/tries */
		if (player.y <= water) {
			score += 200;
			tries += 1;
			player.reset();
			scoring();
		}
	}
	else if (input == 'down') {
		//moves player down unless player is at bottomWall
		if (player.y < bottomWall) {
			player.y +=verticalMove;
		}
	}
	else if (input == 'left') {
		// moves player left unless at leftWall
		if (player.x > leftWall) {
			player.x -=horizontalMove;
		}
	}
	else if (input == 'right') {
		//moves player right unless at rightWall
		if (player.x < rightWall) {
			player.x +=horizontalMove;
		}
	}
};
function Treasure(sprite, x, y) {
	this.sprite = sprite;
	this.x = x;
	this.y = y;
};
Treasure.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


function checkCollisions() {
	//check player-enemy colllisons
	//loop through each enemy
	for (i = 0; i < allEnemies.length; i++) {
		//see if y values match exactly and x values are within 80 in either direction
		//the value of 80 helps eliminate collisons of sprite margins
		if (player.y == allEnemies[i].y && Math.abs(player.x - allEnemies[i].x) < 80) {
			tries -= 1;
			player.reset();
		}
	}
	//check player-treasure collisons
	//loop through each treasure
	for (i = 0; i < allTreasures.length; i++) {
		//see if x and y values match
		if (player.x == allTreasures[i].x && player.y == allTreasures[i].y) {
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
	for (i=0; i < 6; i++) {
		//x[0] varies start point from just off the board to about halfway across the board...
		//...and x[1] varies placement off (to the left) of the board
		var x = [((Math.random() - 0.2) * 450), ((Math.random() * -500) - 200)];
		//y values chosen to center enemies vertically on path
		var y = [64, 147, 230];
		//provides a variety of speeds
		speed = ((Math.random() * 600) + 200);
		//choose x[0] or x[1] and y[0], y[1] or y[2]
		var n = new Enemy(this.sprite, x[twoOptions()], y[threeOptions()], speed);
		allEnemies.push(n);			
	}
};
newEnemy();

var player = new Player();

var allTreasures = [];
//loop through this function and push one, two or three treasures to allTreasures
var newTreasure = function() {
	//chose randomly among the three treasure sprites and place them randomly
	//in the six squares of the treasure area (problem - can put two or three in one square)
	for (i = 0; i <= (threeOptions()); i++) {
		var treasure = new Treasure(treasureSprite[threeOptions()], 
		   treasureX[threeOptions()], treasureY[twoOptions()]);
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

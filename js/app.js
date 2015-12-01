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
		this.speed = (Math.random() * 800) + 200;
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
	this.x = 203;
	this.y = 396;
};
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//The following controls the player's movement
Player.prototype.handleInput = function(input, allowedKeys) {
	verticalMove = 83;
	horizontalMove = 100;
	if (input == 'up') {
		/* if player completely reaches the water, sends him 
		back to the bottom */
		player.y -=verticalMove;
		if (player.y <= 30) {
			player.y = 396, player.x = 203;
		}
	}
	else if (input == 'down') {
		//keeps player from going below start point
		if (player.y < 396) {
			player.y +=verticalMove;
		}
	}
	else if (input == 'left') {
		// keeps player on the board
		if (player.x >= 103) {
			player.x -=horizontalMove;
		}
		else {
			//Keeps player on the board
			player.x = 3;
		}
	}
	else if (input == 'right') {
		if (player.x <= 303) {
			player.x +=horizontalMove;
		}
		else {
			// keeps player on the board
			player.x = 403
		}
	}
};
function Treasure(sprite, x, y) {
	this.sprite = 'images/Key.png';
	this.x = x;
	this.y = y;
};
Treasure.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


function checkCollisions() {
	for (i = 0; i < allEnemies.length; i++) {
		if (player.y == allEnemies[i].y && Math.abs(player.x - allEnemies[i].x) < 80) {
			player.y = 396, player.x = 203;
		}
	}
	if (player.x == treasure.x && player.y == treasure.y) {
		treasure.x = 3, treasure.y = 396;
	}
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
for (i=0; i < 6; i++) {
	//x[0] varies start point from just off the board to about halfway across the board...
	//...and x[1] varies placement off (to the left) of the board
	var x = [((Math.random() - 0.2) * 450), ((Math.random() * -500) - 200)];
	//y values chosen to center enemies vertically on path
	var y = [64, 147, 230];
	//provides a variety of speeds
	speed = ((Math.random() * 600) + 200);
	//choose x[0] or x[1] and y[0], y[1] or y[2]
	var n = new Enemy(this.sprite, x[(Math.round(Math.random()))], y[(Math.floor(Math.random()* 3))], speed);
	//add n to the array and repeat the loop till there are six enemies
	allEnemies.push(n);
};
var player = new Player();

var treasureX = [103, 203, 303];
var treasureY = [147, 64];
var treasure = new Treasure(this.sprite, treasureX[(Math.floor(Math.random()* 3))], treasureY[(Math.round(Math.random()))]);

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

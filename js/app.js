// Enemies our player must avoid
var Enemy = function(sprite, x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
	this.x = x;
	this.y = y;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	speed = Math.floor(((Math.random() + 0.5) * 250));
	this.x += speed * dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player(sprite, x, y) {
	this.sprite = 'images/char-boy.png';
	this.x = 203;
	this.y = 400;
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
	verticalMove = 80;
	horizontalMove = 100;
	if (input == 'up') {
		/* if player completely reaches the water, sends him 
		back to the bottom */
		player.y -=verticalMove;
		if (player.y <= 30) {
			player.y = 400, player.x = 203;
		}
	}
	else if (input == 'down') {
		//keeps player from going below start point
		if (player.y < 400) {
			player.y +=verticalMove;
		}
	}
	else if (input == 'left') {
		// keeps player on the board
		if (player.x >= 103) {
			player.x -=horizontalMove;
		}
		else {
			//Keeps player from going past 3
			player.x = 3;
		}
	}
	else if (input == 'right') {
		if (player.x <= 303) {
			player.x +=horizontalMove;
		}
		else {
			// Stops player at 403
			player.x = 403
		}
		
	}
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

//Math.random varies horizontal start point from -0.2 to 240
var enemy1 = new Enemy('images/enemy-bug.png', (Math.random() - 0.2) * 300, 65);
var enemy2 = new Enemy('images/enemy-bug.png', (Math.random() - 0.2) * 300, 147);
var enemy3 = new Enemy('images/enemy-bug.png', (Math.random() - 0.2) * 300, 230);
var allEnemies = [enemy1, enemy2, enemy3];
var player = new Player();


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

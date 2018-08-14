(function() {
	var gameController = function ($scope, $routeParams, $rootScope, $location, $timeout, $interval) {
		///////////////////////////////////////////////
		/// VARIABLES
		///////////////////////////////////////////////

		// username
		$rootScope.root = $rootScope.root || {};
		$rootScope.root.username = $rootScope.root.username || 'Guest';

		// variables for game play
		var gameStart = false;
		var gameEnd = false;
		$scope.score = 0;

		// variables for your player
		var player_width = 10;
		var player_height = 10;
		var player_x = 200;
		var player_y = 440;
		var player_dx = 2;
		var player_dy = 2;
		var left = false;
		var right = false;
		var up = false;
		var down = false;

		// variables for the obstacles
		var obstacles = [];

		// need the same kind of obstacle in each row, spaced evenly
		// small cars, long cars, trains
		// slow, medium, fast
		// spaced horizontally differently per row
		// moving in different directions per row
		// spaced vertically differently between rows
		var obstacleSettings = {
			top: 300,
			left: -10000,
			height: 10,
			size: [30, 60, 90, 120, 150, 180],
			speed: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4],
			direction: [-1, 1],
			spacing_horizontal: [40, 60, 90, 120, 150, 180],
			spacing_vertical: [15, 20, 30, 40, 50, 60]
		};

		///////////////////////////////////////////////
		/// FUNCTIONS
		///////////////////////////////////////////////

		// Re-initialize variables when the game starts
		function init() {
			$scope.score = 0;
			player_width = 10;
			player_height = 10;
			player_x = 200;
			player_y = 440;
			player_dx = 2;
			player_dy = 2;
		}

		// Submit your score
		$scope.submitScore = function() {
			// recalculate the score to help prevent cheaters from changing their score
			// there is a leeway of 10 points since it's possible you could have moved backwards
	    	for (var i = 0; i < obstacles.length; i++) {
				if (obstacles[i][0].top > player_y && $scope.score - (i + 1) > 10) {
					$scope.score = i + 1;
					$scope.$apply();
				}
			}
			var scoreObj = { Username: $rootScope.root.username, Score: $scope.score };
			var jsonScoreObj = JSON.stringify(scoreObj);
			var url = 'addscore';
			
			$.ajax({
	  			url: url,
	  			type: 'POST',
	  			data: jsonScoreObj,
	  			contentType: 'application/json; charset=utf-8',
			})
			.always(function() {
				$timeout(function() {
					$location.url('/highscores');
				}, 1000);
			});
		};

		// Locator function in a loop
		$scope.mainLoop = function() {			
			// logic for the game to end or not
			if (!gameEnd) {
				// draw and update our canvas here
				$scope.draw();
				$scope.update();
				// Recursively call our loop
				window.requestAnimationFrame($scope.mainLoop);
			} else {
				// Clear the canvas
				ctx.fillStyle = '#050505';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				
				// set the text that displays on the canvas
				ctx.fillStyle = '#f1f1f1';
				ctx.font = '20px zig';
				ctx.fillText('GAME OVER', 130, 240);
				
				// add our new score into the database
				$scope.submitScore();
			}
		};

		// Update ball position
		$scope.update = function() {
			// Move the player, left key takes priority over right
			if (left && player_x > 0 + player_width / 2) {
				player_x -= player_dx;
			} else if (right && player_x < canvas.width - player_width / 2) {
				player_x += player_dx;
			};
			
			// Move the player, up key takes priority over down.
			if (up && player_y > -5 + player_height / 2) {
				player_y -= player_dy;
			} else if (down && (player_y < canvas.height - player_height / 2 || player_y > -5 + player_height / 2)) {
				player_y += player_dy;
			};

			// Game end function if you've sunk below the canvas
			if (player_y > 505) {
				gameEnd = true;
			}

			// Game end function if you've hit an obstacle
			// top-left corner, top-right corner, bottom-left corner, bottom-right corner
			if (ctx.getImageData(player_x - (1 + player_width / 2), player_y - (1 + player_height / 2), 1, 1).data[0] == 241
				|| ctx.getImageData(player_x + player_width / 2, player_y - (1 + player_height / 2), 1, 1).data[0] == 241
				|| ctx.getImageData(player_x - (1 + player_width / 2), player_y + player_height / 2, 1, 1).data[0] == 241
				|| ctx.getImageData(player_x + player_width / 2, player_y + player_height / 2, 1, 1).data[0] == 241) {
				gameEnd = true;
			}

		    // Constantly move the screen view slowly down
		    if (!gameEnd) {
		    	// move the player down
		    	player_y += 0.5;

		    	// move the obstacles down
		    	// and move the rows left or right
		    	for (var i = 0; i < obstacles.length; i++) {
					for (var j = 0; j < obstacles[i].length; j++) {
						obstacles[i][j].top += 0.5;
						obstacles[i][j].left += (obstacles[i][j].speed * obstacles[i][j].direction);
					}

					// find the number of obstacles the player has passed so far
					if (obstacles[i][0].top > player_y && i + 1 > $scope.score) {
						$scope.updateScore(i + 1);
					}
				}
		    } 

			return true;
		};

		// Draw everything
		$scope.draw = function() {
			// Clear the canvas
			ctx.fillStyle = '#050505';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Draw the player
			ctx.fillStyle = '#f2f2f2';
			ctx.fillRect(player_x - player_width / 2, player_y - player_height / 2, player_width, player_height);

			// Draw the obstacles
			ctx.fillStyle = '#f1f1f1';
			for (var i = 0; i < obstacles.length; i++) {
				// only draw them if they're in view
				if (obstacles[i][0].top < 550 && obstacles[i][0].top > -50) {
					for (var j = 0; j < obstacles[i].length; j++) {
						ctx.fillRect(obstacles[i][j].left, obstacles[i][j].top, obstacles[i][j].size, obstacles[i][j].height);
					}
				}
			}
		};

		// Build your obstacles
		$scope.buildObstacles = function() {
			// build them one row at a time
			for (var i = 0; i < 30; i++) {
				// so randomly pick each of the variables
				// then pick the vertical height space
				var currentRow = [];
				var currentRowSettings = {
					top: obstacleSettings.top,
					left: obstacleSettings.left,
					height: obstacleSettings.height,
					size: obstacleSettings.size[Math.floor(Math.random() * obstacleSettings.size.length)],
					speed: obstacleSettings.speed[Math.floor(Math.random() * obstacleSettings.speed.length)],
					direction: obstacleSettings.direction[Math.floor(Math.random() * obstacleSettings.direction.length)],
					spacing_horizontal: obstacleSettings.spacing_horizontal[Math.floor(Math.random() * obstacleSettings.spacing_horizontal.length)],
					spacing_vertical: obstacleSettings.spacing_vertical[Math.floor(Math.random() * obstacleSettings.spacing_vertical.length)]
				};

				// place obstacles in the row
				while (currentRowSettings.left < 10410) {
					currentRow.push(
						{
							top: currentRowSettings.top,
							left: currentRowSettings.left,
							height: currentRowSettings.height,
							size: currentRowSettings.size,
							speed: currentRowSettings.speed,
							direction: currentRowSettings.direction,
							spacing_horizontal: currentRowSettings.spacing_horizontal,
							spacing_vertical: currentRowSettings.spacing_vertical
						}
					);
					currentRowSettings.left += (currentRowSettings.size + currentRowSettings.spacing_horizontal);
				}

				// place that row in the array of all obstacles
				obstacles.push(currentRow);

				// move the top position up for the next row
				obstacleSettings.top -= (currentRowSettings.height + currentRowSettings.spacing_vertical);
			}
		};

		// Keep score and build more obstacles
		$scope.updateScore = function(newScore) {
			if (gameStart && !gameEnd) {
				$scope.score = newScore;
				$scope.$apply();
				if ($scope.score % 10 === 0) {
					obstacleSettings.top = obstacles[obstacles.length - 1][obstacles[obstacles.length - 1].length - 1].top - 40;
					$scope.buildObstacles();
				}
			}
		};

		// Move your player on keydown
		document.onkeydown = function(e) {
			var theKey = e.keyCode;
			switch (theKey) {
				// Controls
				case 37: // Left
					left = true; // Will take priority over the right key
					break;
				case 38: // Up
					up = true; // Will take priority over the down key
					// Start the game
					if (!gameStart) {
						gameStart = true;
						init();
						$scope.mainLoop();
					}
					break;
				case 39: // Right
					right = true;
					break;
				case 40: // Down
					down = true;
					break;
				default: // Stop movement on any other key
					up = down = left = right = false;
			};
		};

		// Stop moving your player on keyup
		document.onkeyup = function(e) {
			var theKey = e.keyCode;
			switch (theKey) {
				// Controls
				case 37: // Left
					left = false; // Will take priority over the right key
					break;
				case 38: // Up
					up = false; // Will take priority over the down key
					break;
				case 39: // Right
					right = false;
					break;
				case 40: // Down
					down = false;
					break;
				default: // Stop movement on any other key
					up = down = left = right = false;
			};
		};


		///////////////////////////////////////////////
		/// GAME INIT
		///////////////////////////////////////////////

		// set up the canvas
		var canvas = document.getElementById('gameCanvas');
		var ctx = canvas.getContext('2d');

		// build your obstacles
		$scope.buildObstacles();

		// draw the first frame
		$scope.draw();

		// set the opening text that displays on the canvas
		ctx.fillStyle = '#f1f1f1';
		ctx.font = '14px zig';
		ctx.fillText('PRESS THE UP ARROW KEY TO START', 33, 400);

	};

	gameController.$inject = ['$scope', '$routeParams', '$rootScope', '$location', '$timeout', '$interval'];

	angular.module('CrossyBlock')
	    .controller('gameController', gameController);
}());

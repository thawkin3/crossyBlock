var app = angular.module('CrossyBlock', ['ngRoute']);

app.config(function ($routeProvider){
	$routeProvider
		.when('/', {
			// controller: 'authenticateController',
			templateUrl:'javascripts/app/views/authenticateView.html'
		})
		.when('/game', {
			// controller: 'gameController',
			templateUrl:'javascripts/app/views/gameView.html'
		})
		.when('/highscores', {
			// controller: 'highscoresController',
			templateUrl:'javascripts/app/views/highscoresView.html'
		})
		.otherwise({ 
			redirectTo: '/' 
		});
});

app.run(function($rootScope) {
	$rootScope.user = "Guest";
});
(function() {
	var highscoresController = function ($scope, $routeParams, $rootScope) {
		$scope.highscores = [];

		$.ajax({
  			url: '/getHighScores',
  			type: 'GET',
  			contentType: 'application/json; charset=utf-8',
		})
		.done(function (data) {
			$scope.$apply(function() {
				$scope.highscores = data;
			});
		});
	};

	highscoresController.$inject = ['$scope', '$routeParams', '$rootScope'];

	angular.module('CrossyBlock')
	    .controller('highscoresController', highscoresController);
}());

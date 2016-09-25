(function() {

	var authenticateController = function ($scope, $routeParams, $rootScope, $location, $timeout) {

		$rootScope.root = {
			username: ""
		}

		$scope.submitUsername = function () {
			if ($rootScope.root.username != "") {
				$location.url("/game");
			}
		}

	};

	authenticateController.$inject = ['$scope', '$routeParams', '$rootScope', '$location', '$timeout'];

	angular.module('CrossyBlock')
	    .controller('authenticateController', authenticateController);

}());
(function() {

	var authenticateController = function ($scope, $routeParams, $rootScope, $location, $timeout) {

		$scope.showSignIn = false;
		$scope.showCreate = true;

		$(document).ready(function(){

		    $(".loginTab").click(function(){
		    	$(".errorMsg").hide();
		    	$(".missingUsername").hide();
		    	$(".missingPassword").hide();
		    	$("#createSubmit").removeClass("btn-danger");
		    	$("#signInSubmit").removeClass("btn-danger");
		    	$(".loginTab").removeClass("activeTab");
		    	$(this).addClass("activeTab");
		    	if ($(this).attr("id") == "createTab") {
		    		$("#inputName3").val("");
		        	$("#inputPassword3").val("");
		    		$scope.$apply(function(){
		    			$scope.showSignIn = false;
						$scope.showCreate = true;
					});
		    	} else {
		    		$("#InputName1").val("");
		        	$("#InputPassword1").val("");
		    		$scope.$apply(function(){
		    			$scope.showSignIn = true;
						$scope.showCreate = false;
					});
		    	}
		    });

		    $("input").on("keydown", function(){
		    	$("#createSubmit").removeClass("btn-danger");
		    	$("#signInSubmit").removeClass("btn-danger");
		    	$(".errorMsg").hide();
		    	$(".missingUsername").hide();
		    	$(".missingPassword").hide();
		    });

		    $("#createForm").submit(function(e){
		        var theUsername = $("#InputName1").val().toUpperCase();
		        var thePassword = $("#InputPassword1").val().toUpperCase();

		        if (theUsername != "" && thePassword != "") {

			        var myobj = { "Username": theUsername, "Password": thePassword };
			        jobj = JSON.stringify(myobj);
			    
			    	var url = "adduser";
					$.ajax({
			  			url:url,
			  			type: "POST",
			  			data: jobj,
			  			contentType: "application/json; charset=utf-8",
			  			success: function(data,textStatus) {
		      				$timeout(function(){
			      				console.log("Done adding user");
			      				$rootScope.user = myobj.Username;
			      				$("#createSubmit").removeClass("btn-danger");
			      				$location.url("/game");
			      			},100);
			  			}
					})
					.fail(function(){
						$("#createSubmit").addClass("btn-danger");
						$(".errorMsg").show();
					});

				} else {
					if (theUsername == "") {
						$(".missingUsername").show();
						$("#createSubmit").addClass("btn-danger");
					}
					if (thePassword == "") {
						$(".missingPassword").show();
						$("#createSubmit").addClass("btn-danger");
					}
				}

			});

			$("#signInForm").submit(function(e){
		        var theUsername = $("#inputName3").val().toUpperCase();
		        var thePassword = $("#inputPassword3").val().toUpperCase();

		        if (theUsername != "" && thePassword != "") {

			        var myobj = {"Username": theUsername, "Password": thePassword };
			        jobj = JSON.stringify(myobj);
			    
			    	var url = "getuser";
					$.ajax({
			  			url:url,
			  			type: "POST",
			  			data: jobj,
			  			contentType: "application/json; charset=utf-8",
			  			success: function(data,textStatus) {
			      			$timeout(function(){	
			      				$rootScope.user = myobj.Username;
			      				$("#signInSubmit").removeClass("btn-danger");
			      				$location.url("/game");
			      			},100);
			  			}
					})
					.fail(function(){
						$("#signInSubmit").addClass("btn-danger");
						$(".errorMsg").show();
					});

				} else {
					if (theUsername == "") {
						$(".missingUsername").show();
						$("#signInSubmit").addClass("btn-danger");
					}
					if (thePassword == "") {
						$(".missingPassword").show();
						$("#signInSubmit").addClass("btn-danger");
					}
				}

			});


		});



	};

	authenticateController.$inject = ['$scope', '$routeParams', '$rootScope', '$location', '$timeout'];

	angular.module('CrossyBlock')
	    .controller('authenticateController', authenticateController);

}());
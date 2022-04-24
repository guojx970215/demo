 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:LoginCtrl
  * @description
  * # LoginCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('LoginCtrl', function ($state, userServices, $location, $uibModal, $cookies) {
 
     var vm = this;
     vm.submitLoginForm = submitForm;
     vm.forgotPassword = forgotPassword;
 
     if(userServices.isLoggedIn()){
       $location.path('/home');
       return;
     }
     function submitForm(){
     	var loaderDiv = '<div class="loader"></div>';
 		$(loaderDiv).appendTo('body'); //Add Loader
       if(!vm.username){
         return;
       }
 
       if(!vm.password){
         return;
       }
 
       //submit form
       userServices.userLogin(vm.username, vm.password, "WEB").then(function(data){
       	$('.loader').remove(); //remove Loader
         $location.path('/home');
       }, function(data){
       	//console.log('login error:', data);
         if(data.data && data.data.message){
           	if(data.status == '422'){
 			    messageModal(data.data.message.message);
 	    	}else if(data.status == '401'){
 			    messageModal("Please enter correct password !!");
 	    	}else if(data.status == '404'){
 			    userServices.validateTralIndividual(vm.username).then(function(response){
 					if(response.status === 200){
 						accountExpireAlert("Your Account is Expired. Please Update your account.");
 						//console.log('sucess: ', response);
 					}
 		      	}, function (data) {
 		      		//console.log('error: ', data);
 		      		$('.loader').remove(); //remove Loader
 		      		messageModal("Your account is cancelled. Please contact Admin.");
 
 		    	});
 			    // console.log("Call check api");
 	    	}
         }
       });
     }
 
     function accountExpireAlert(item) {
 		vm.shownModal = true;
       	var modalInstance = $uibModal.open({
             "animation": true,
             "templateUrl": 'views/modals/okModal.html',
             "backdrop": 'static',
             "controller": "okModalCtrl",
             "size": "sm",
             resolve: {
                 items: function () {
                   return item;
                 }
             }
     	});
         modalInstance.result.then(function (data) {
         	// console.log(data);
 			//$state.go('trialPayment');
         }, function () {
         	$cookies.remove('trailUserName',{path: '/'});
         	$cookies.put('trailUserName', vm.username, {path: '/'});
         	$state.go('trialPayment');
         });
 	};
 
     //Forgot password modal
     function forgotPassword(){
   		var modalInstance = $uibModal.open({
 	        "animation": true,
 	        "templateUrl": 'views/modals/forgotPassword.html',
 	        "controller": "forgotPasswordCtrl",
 	        resolve: {
 	            items: function () {
 	              return [];
 	            }
 	        }
     	});
     	modalInstance.result.then(function (data) {
     	}, function () {
 			// console.log('Modal dismissed at: ' + new Date());
 		});
     }
 
     //send message to common modal
     function messageModal(item){
   		var modalInstance = $uibModal.open({
 	        "animation": true,
 	        "templateUrl": 'views/modals/okModal.html',
 	        "controller": "okModalCtrl",
 	        "size": "sm",
 	        resolve: {
 	            items: function () {
 	              return item;
 	            }
 	        }
     	});
     	modalInstance.result.then(function () {
     	}, function () {
 			// console.log('Modal dismissed at: ' + new Date());
 		});
     }
 
   });
 
  //------------------- modal controller ------------------------------
 
  //forgot password
  angular.module('nanhaiMainApp')
     .controller('forgotPasswordCtrl', function($scope, $uibModalInstance, items, $uibModal, userServices) {
 
 		 $scope.selectAccessCode = false;
 		 $scope.selectEmail = false;
 
 		//reset Password With Email
 		 $scope.requestResetPasswordwithEmail = function () {
 			var username = $scope.userName;
 			userServices.requestResetPasswordwithEmail(username).then(function(data){
 	      		if(data){
 	      			var success = "Please check your email!!";
 			    	messageModal(success);
 	      			$uibModalInstance.close(data);
 	      		}
 
 	      	}, function(data){
 	      		if(data.data){
 	      			if(data.status == '422'){
 	      				var error2 = data.data.message.message;
 			    		messageModal(error2);
 	      			}
 	      		}
 	   		});
    		};
 
    		//reset Password With AccessCode
 	  	$scope.resetPasswordWithAccessCode = function () {
 			var formData = {
 				 "accessCode": $scope.accessCode,
 				 "newPassword": $scope.password,
 				 "userName": $scope.userNameForAccessCode
 			};
 			userServices.resetPasswordWithAccessCode(formData).then(function(data){
       			var success = "Your password reset successfully!!";
 		    	messageModal(success);
 	        	$uibModalInstance.close(data);
 	      	}, function(data){
 	      		if(data.data){
 	      			if(data.status == '422'){
 	      				var error2 = data.data.message.message;
 			    		messageModal(error2);
 	      			}
 	      		}
 	   		});
    		};
 
 
 
     	$scope.cancel = function() {
     		$uibModalInstance.dismiss('cancel');
 		};
 
 
 		//send message to common modal
 	    
 		function messageModal(item){
 					  var modalInstance = $uibModal.open({
 						"animation": true,
 						"templateUrl": 'views/modals/okModal.html',
 						"controller": "okModalCtrl",
 						"size": "sm",
 						resolve: {
 							items: function () {
 							  return item;
 							}
 						}
 					});
 					modalInstance.result.then(function () {
 					}, function () {
 						// console.log('Modal dismissed at: ' + new Date());
 					});
 				}
 
 
   });

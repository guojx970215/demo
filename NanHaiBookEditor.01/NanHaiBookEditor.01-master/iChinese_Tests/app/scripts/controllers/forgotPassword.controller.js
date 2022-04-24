 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:ReportCtrl
  * @description
  * # ReportCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
     .controller('forgotPasswordWithemailCtrl', function ($scope, $state, userServices, $stateParams, $location, $uibModal) {
         
         var vm = this;
        	vm.resetToken = $stateParams.token;
        	vm.username = $stateParams.username;
        	
        	vm.Confirm = Confirm;
        	    
         init();
 
         function init() {
         }  
 	        
 
       	function Confirm() {
 
       		if($scope.newPassword === undefined || ($scope.newPassword !== $scope.confirmPassword)){
       			return;
       		}
       		var formData = {
 	        	"newPassword": $scope.newPassword      
        		};
         	if(vm.resetToken && vm.username){
            		userServices.resetPassword(formData, vm.resetToken, vm.username).then(function(data){
            			if(data){
            				var alert = "Your password reset successfully!!";
 			    		messageModal(alert,"pwdReset");
 	                	//$state.go('/');
 	                	//window.location = loc;
            			}              	                
 	              }, function(data){
 	                  if(data.data){
 	                      if(data.status == '400'){
 	                      	var error1 = data.data.message;
 			    			messageModal(error1);
 	                         // window.alert(data.data.message);
 	                      }
 	                      if(data.status == '422'){
 	                      		var error2 = data.data.message.message;
 			    				messageModal(error2);
 	                         // window.alert(data.data.message.message);
 	                      }
 	                  }	      		
 	        	});  
         	}
   		}
 
     	//send message to common modal
     	function messageModal(item,type){
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
 				if(item == "Your password reset successfully!!"){
 					var loc = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '' + '/icr');
 					// console.log("loc", loc);
 	                //window.location = loc;
 	                window.location.assign('/icr');
 	                // console.log(alert);
 				}
 			});
     	}
         
     });
     
 //common modal
 angular.module('nanhaiMainApp')
 	.controller('okModalCtrl', function($scope, $uibModalInstance, items, $uibModal) {
 		$scope.getItems = items;
 		
 	  	$scope.ok = function() {
         	$uibModalInstance.dismiss('ok');
 		};
 	});

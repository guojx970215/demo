 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:ProfileCtrl
  * @description
  * # ProfileCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('ProfileTrialCtrl', function (userServices, $location, $scope, $filter, $uibModal, $state,
   												$cookies, $cookieStore) {
     var vm = this;
     var braintreeSetup = false;
 	vm.subscriptionLength = 'icr-monthly';
 	var braintreeCustomerId = "";
 	var getTrailUserName = $cookies.get('trailUserName');
 	// console.log('getTrailUserName', getTrailUserName);
 
     init();
 
     function init(){
 		// console.log("Came to trial payment page");
     	var loaderDiv = '<div class="loader"></div>';
 		$(loaderDiv).appendTo('body'); //Add Loader
 
       	validateTral();
       	getPaymentPlans();
     }
 
     //getProfileInfo
     function validateTral(){
       	userServices.validateTralIndividual(getTrailUserName).then(function(response){
 			if(response.status === 200){
 				TrialPlansBrainTreeToken(response.data); //payment for Trial Account
 			}
       	}, function (data) {
       		// console.log('error: ', data);
       		logout();
       		$('.loader').remove(); //remove Loader
     	});
     }
 
     function logout() {
 		window.location.assign('/'); //redirect to login page
 
 		$cookies.remove('nanhaiIndividualSession', {path: '/'});
   		$cookies.remove('nanhaiIndividualUserId', {path: '/'});
   		$cookies.remove('nanhaiIndividualSession', {path: '/student'});
   		$cookies.remove('nanhaiIndividualUserId', {path: '/student'});
   		$cookieStore.remove('moback_session');
 	    $cookieStore.remove('moback_share_cookie');
 	    $cookieStore.remove('cookieClassPicked');
 	}
 	/*-------------- Trial Account> subscription ---------------------*/
 
 	//get paymeny token
     function TrialPlansBrainTreeToken(userDetails) {
     	  var trialData ={
     		"dateOfBirth" : userDetails.birthDay,
     		"firstName" : userDetails.firstName,
     		"lastName" :userDetails.lastName,
     		"level" : userDetails.level,
     		"email" : userDetails.email,
     		"password" : userDetails.password,
     		"userName" : userDetails.userName,
     		"trial" : userDetails.trial,
     		"settings": {
           		"language": userDetails.language,
         	},
     	};
       	userServices.getPaymentToken(trialData).then(function (data) {
   			//console.log('getPaymentToken: ', data);
         	if (data.data.clientToken) {
         		$('.loader').remove(); //remove Loader
 	          	braintreeCustomerId = data.data.customer.id;
 	          	braintree.setup(data.data.clientToken, "dropin", {
 	            	container: "trialPaymentWidget",
 					onPaymentMethodReceived: function (obj) {
           			 	if(data.status === 200){
 		          			if (obj.nonce) {
 				              	if (!vm.couponCode) {
 				              		userServices.triggerBrainTreePayment(obj.nonce, braintreeCustomerId, vm.subscriptionLength).then(function (response) {
 					                  $scope.isDisabled = true; //submit button disabled
 					                  if (response.status === 200) {
 					                    var IndcustomerId = response.data.id;
 					                    createTrialAccount(IndcustomerId, braintreeCustomerId);
 					                  }
 					                }, function (response) {
 					                	 // console.log('error couponCode: ', response);
 					                  	if (response.data && response.data.message) {
 					                    	messageModal(response.data.message.message);
 					                  	}
 					                });
 				              	}else{
 					              	userServices.valiateDiscountCode(vm.subscriptionLength, vm.couponCode).then(function (data) {
 						       			if(data.status === 200){
 							                userServices.triggerBrainTreePayment(obj.nonce, braintreeCustomerId, vm.subscriptionLength, vm.couponCode).then(function (response) {
 							                  $scope.isDisabled = true; //submit button disabled
 							                  if (response.data) {
 							                    	var IndcustomerId = response.data.id;
 							                    	createTrialAccount(IndcustomerId, braintreeCustomerId);
 							                  }
 							                }, function (response) {
 							                	// console.log('error couponCode: ', response);
 							                  	if (response.data && response.data.message) {
 							                    	messageModal(response.data.message.message);
 							                  	}
 							                });
 					                	}else if(data.status === 422){
 					                		messageModal(data.data.message.message);
 					                	}
 					                }, function (data) {
 								      	if (data.data) {
 								        	if (data.status == '422') {
 						                    	messageModal(data.data.message.message);
 								        	}
 								      	}
 								      	validateTral();
 							    	});
 						    	}
 			              	}
 		              	}
 					}
 	          	});
         	}else{
         		$('.loader').remove(); //remove Loader
         	}
       	}, function (data) {
 	      	$('.loader').remove(); //remove Loader
     	});
     }
 
    // create Trial Account
     function createTrialAccount(IndcustomerId, braintreeCustomerId) {
       	var loaderDiv = '<div class="loader"></div>';
 		$(loaderDiv).appendTo('body');
 
       	userServices.convertToPaidUserAfterExpiration(IndcustomerId, braintreeCustomerId, getTrailUserName).then(function (response) {
 	      	if(response.status === 200){
 	      		successMessageModal("Payment Successful!!");
 	      	}else if(response.status === 404){
 	      		messageModal(response.data.error);
 	      		$('.loader').remove();
 	      	}else if(response.status === 500){
 	      		messageModal(response.data.error);
 	      		$('.loader').remove();
 	      	}
       	}, function (response) {
       		$('.loader').remove();
       		// console.log('trial error:', response);
         	if (response.data && response.data.message) {
           		messageModal(response.data.message.message);
         	}
       	});
     }
 
    /* ------------ paid Account -----------*/
     //getPaymentPlans
     function getPaymentPlans(){
      	userServices.getPaymentPlans().then(function(responsePlans){
      		if(responsePlans.status === 200){
      			vm.getPaymentPlan = responsePlans.data;
      		}else{
      			messageModal('Error');
      		}
        	}, function(data){
           	// console.log(data);
      	});
     }
 
   	//send message to common modal
     function successMessageModal(item){
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
     		// console.log('Modal dismissed at: ' + new Date());
 			$cookies.remove('trailUserName',{path: '/'});
       		window.location.assign('/icr'); //redirect to login page
       		$('.loader').remove();
     	}, function () {
 			$cookies.remove('trailUserName',{path: '/'});
       		window.location.assign('/icr'); //redirect to login page
       		$('.loader').remove();
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

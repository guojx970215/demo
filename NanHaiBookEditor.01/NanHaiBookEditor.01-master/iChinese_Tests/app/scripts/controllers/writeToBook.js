 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:BookCtrl
  * @description
  * # BookCtrl
  * Controller of the nanhaiMainApp
  */
 
 angular.module('nanhaiMainApp')
 	.controller('WriteToBookCtrl', function ($scope, $uibModalInstance, items, bookServices, $cookies,
 												 			userServices, $stateParams ) {
 	
 	var getCookieAssignmentId =  $cookies.get('cookieAssignmentId'); 
 
 	// writing
 	var bookId = items.id;
 	var bookText = items.text;
 	if(bookText === undefined){
 	  	userServices.getProfile().then(function(response){
 	  		var studentName = response.data.userName;
 			if(studentName){
 				if(getCookieAssignmentId === undefined){					 	
 				    bookServices.getWritingforBook(studentName, bookId).then(function (data) {		    	       
 					 	$scope.getComment = data.data.text; 
 				    }, function (data) {
 				      	// console.log(data);
 				    });	
 			    } else if(getCookieAssignmentId !== undefined){ 
 					bookServices.getWritingforAssignment(studentName, bookId, getCookieAssignmentId).then(function (data) {
 					 	$scope.getComment = data.data.text;
 					}, function (data) {
 					    // console.log(data);
 				    });
 				}	    		    		    
 			}
 			
 		});
 	}else{
 		$scope.getComment = bookText;
 	}
      	
   	$scope.commentSubmit = function () {
 		var postData = {
 			"bookId": bookId,
       		"text": $scope.getComment     		
    		};
    		postData.send = 0;
    		if(getCookieAssignmentId != undefined){
   			postData.assignmentId = getCookieAssignmentId;
   		}
 		if ($scope.addCommentsToBook.$valid) { 
 			$('.write_icon').removeClass('disabled');
         	$uibModalInstance.close(postData);
         }	    		
   	};	
 
  	$scope.closeModal = function () {
  		var postData = {
 			"bookId": bookId,
       		"text": $scope.getComment     		
    		};
    		postData.send = 1;
    		if(getCookieAssignmentId != undefined){
   			postData.assignmentId = getCookieAssignmentId;
   		}
  		$('.write_icon').removeClass('disabled');
     	$uibModalInstance.close(postData);
 	};
 
  
 });
 

 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:LoginCtrl
  * @description
  * # LoginCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('headerController', function ($location, $stateParams, $cookies) {
     
     var vm = this;
 	vm.assignmentId = $stateParams.assignmentId;
     vm.exitToMain = exitToMain;
     vm.pageTitle = '';
 
     init();
 
     function init(){
       var pageLocation = $location.path();
       if(pageLocation !== ('/assignment/' + vm.assignmentId)){
       		//var getCookieAssignmentId =  $cookies.get('cookieAssignmentId'); 
       		//console.log('cookies: ', getCookieAssignmentId);
       		$cookies.remove('cookieAssignmentId');
       }
       var pageTitle = '';
       switch (pageLocation) {
         case '/assignment':
           pageTitle = 'Assignment';
           break;
         case '/assignment/' + vm.assignmentId:
           pageTitle = 'Assignment';
           break;
         case '/myLibrary':
           pageTitle = 'My Library';
           break;
         case '/openReading':
           pageTitle = 'Open Reading';
           break;
         case '/progressReading':
           pageTitle = 'Progress Reading';
           break;
         case '/profile':
           pageTitle = 'Profile';
           break;
       }
       vm.pageTitle = pageTitle;
     }
 
 
     function exitToMain(){
       return $location.path('/');
     }
 
   });

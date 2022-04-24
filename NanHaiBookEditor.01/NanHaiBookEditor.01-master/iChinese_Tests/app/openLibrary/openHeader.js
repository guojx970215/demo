 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:headerCtrl
  * @description
  * # LoginCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('openHeaderController', function ($location, $stateParams, $cookies) {
 
     var vm = this;
 	vm.assignmentId = $stateParams.assignmentId;
     vm.exitToMain = exitToMain;
     vm.pageTitle = '';
 
     init();
 
     function init(){
       var pageLocation = $location.path();
       var pageTitle = '';
       switch (pageLocation) {
         case 'openLibrary':
           pageTitle = 'Open Library';
           break;
       }
       vm.pageTitle = pageTitle;
     }
 
 
     function exitToMain(){
       return $location.path('/');
     }
 
   });

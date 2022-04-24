 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:LoginCtrl
  * @description
  * # LoginCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('FooterController', function ($location, userServices) {
     var vm = this;
 
 
     vm.showFooter = showFooter;
 
     function showFooter() {
       //do not show footer for landing page
       //console.log($location.path());
       return $location.path() != '/';
     }
 
 
   });

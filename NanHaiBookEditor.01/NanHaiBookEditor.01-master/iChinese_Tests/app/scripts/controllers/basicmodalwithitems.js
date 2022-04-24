 'use strict';
 
 /**
  * @ngdoc function
  * @name forteInternalMobilityApp.controller:BasicmodalCtrl
  * @description
  * # BasicmodalCtrl
  * Controller of the forteInternalMobilityApp
  */
 angular.module('nanhaiMainApp')
   .controller('BasicModalItemsCtrl', function ($scope, $modalInstance, items) {
 
     $scope.items = items;
     //console.log($scope.items);
 
     $scope.cancel = function() {
       // console.log($scope.id);
       $modalInstance.dismiss('cancel');
     };
 
     $scope.ok = function() {
       $modalInstance.close($scope.items);
     };
   });

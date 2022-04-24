 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:openBookPopupCtrl
  * @description
  * # bookPopupCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('openBookPopupCtrl', function ($scope, $modalInstance, items, openBookServices, endpoints, $sce, $state, $stateParams, $cookies) {
 
   var vm = this;
     $scope.items = items;
 
 
     //  $scope.bookUrl = $sce.trustAsResourceUrl('/#!/bookFrame/'+items.bookId);  // remove ! if book is not loading....
 
           if (window.location.href.indexOf("localhost") > -1) {
             $scope.bookUrl = $sce.trustAsResourceUrl('/#!/libraryAccess/openBookFrame/'+items.bookId); // remove ! if book is not loading....
           } else {
              $scope.bookUrl = $sce.trustAsResourceUrl(endpoints.BASE_URL + 'student/#!/libraryAccess/openBookFrame/'+items.bookId);  // remove ! if book is not loading....
           }
      // console.log("Items", items);
      $scope.bookTitle = items.bookTitle;
      $scope.viewMode = items.viewMode;
 
     $cookies.put('miniBook', true);
 
     $scope.cancel = function() {
       // console.log($scope.id);
         var origin = $cookies.get('bookOrigin');
         var minibook = $cookies.get('miniBook');
         // console.log("minibook1",minibook);
         $cookies.remove('miniBook');
         $modalInstance.dismiss('cancel');
     };
 
     $scope.ok = function() {
       $modalInstance.close($scope.items);
     };
 
   });

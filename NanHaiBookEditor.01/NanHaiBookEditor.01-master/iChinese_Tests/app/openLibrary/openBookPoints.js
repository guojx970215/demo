 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:openBookPointsModalCtrl
  * @description
  * # openBookPointsModalCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('openBookPointsModalCtrl', function ($scope, $modalInstance, items, openBookServices, endpoints, $sce, $state, $stateParams, $cookies) {
 
   var vm = this;
     $scope.items = items;
     // console.log("Oitems",items);
     $scope.quizExists = items.quiz;
     if ($scope.quizExists){
       $scope.quizUrl = items.quizUrl;
     }
 
       $scope.message = items.data.data.message;
 
      $scope.openQuiz = function(){
        $modalInstance.dismiss('cancel');
        $state.go('openBookQuiz', {bookId: items.bookId});
 
      }
 
      $scope.replay =function(){
         location.reload();
      }
 
     $scope.cancel = function() {
         var origin = $cookies.get('bookOrigin');
         var minibook = $cookies.get('miniBook');
       //window.close();
       $cookies.remove('miniBook');
       $modalInstance.dismiss('cancel');
       var origin = $cookies.get('bookOrigin');
       // console.log(origin);
       //window.location = "#!/"+origin;
       $state.go(origin);
     };
 
     $scope.ok = function() {
       $modalInstance.close($scope.items);
     };
 
   });

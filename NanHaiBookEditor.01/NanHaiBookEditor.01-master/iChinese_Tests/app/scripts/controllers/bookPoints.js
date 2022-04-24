 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:AchievementCtrl
  * @description
  * # bookPopupCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('bookPointsModalCtrl', function ($scope, $modalInstance, items,bookServices, classServices, userServices, endpoints, $sce, $state, $stateParams, $cookies) {
 
   var vm = this;
     $scope.items = items;
     // console.log("Oitems",items);
     $scope.quizExists = items.quiz;
     if ($scope.quizExists){
       $scope.quizUrl = items.quizUrl;
     }
 
      $scope.teacherMsg =  $cookies.get("nanhaiRole");
      if($cookies.get('nanhaiTeacherUserId')){
       $scope.message = "";
      }else{
       $scope.message = items.data.data.message;
      }
 
      $scope.openQuiz = function(){
       var origin = $cookies.get('bookOrigin');
       var minibook = $cookies.get('miniBook');
       // console.log("minibook1",minibook);
       if (sessionStorage.startTrack != null){
                var sessionKey = JSON.parse(sessionStorage.startTrack);
                var stopTrack = {
                  "sessionActivity": "BOOK_READ_END"
                };
               if (minibook !== undefined || minibook !== "true"){
                  bookServices.stopTrack(stopTrack,sessionKey).then(function (response) {
                      // console.log("Book Reading Ended:", response);
                      sessionStorage.removeItem('startTrack');
                  });
                }
       }
         var startQuiz = {
           "bookId":items.bookId,
           "sessionActivity": "QUIZ_ATTEMPT_START"
         };
         bookServices.startQuizTrack(startQuiz).then(function (response) {
         // console.log("Quiz Started: ", response.data);
         sessionStorage.setItem('startQuizTrack', JSON.stringify(response.data));
         });
        $modalInstance.dismiss('cancel');
        $state.go('quiz', {bookId: items.bookId});
      }
 
      $scope.replay =function(){
       var origin = $cookies.get('bookOrigin');
       var minibook = $cookies.get('miniBook');
       // console.log("minibook1",minibook);
       if (sessionStorage.startTrack != null){
                var sessionKey = JSON.parse(sessionStorage.startTrack);
                var stopTrack = {
                  "sessionActivity": "BOOK_READ_END"
                };
               if (minibook !== undefined || minibook !== "true"){
                  bookServices.stopTrack(stopTrack,sessionKey).then(function (response) {
                      // console.log("Book Reading Ended:", response);
                      sessionStorage.removeItem('startTrack');
                  });
                }
       }
       var timeout  = setTimeout(function () {
         location.reload();
     }, 1000);
 
      }
      var teacherMode = (typeof $state.current.data !== "undefined" && $state.current.data.teacherView) ? true : false;
 
     $scope.cancel = function() {
         var origin = $cookies.get('bookOrigin');
         var minibook = $cookies.get('miniBook');
       if (sessionStorage.startTrack != null){
          var sessionKey = JSON.parse(sessionStorage.startTrack);
          var stopTrack = {
            "sessionActivity": "BOOK_READ_END"
          };
         if (minibook !== undefined || minibook !== "true"){
            bookServices.stopTrack(stopTrack,sessionKey).then(function (response) {
                // console.log("Book Reading Ended:", response);
                sessionStorage.removeItem('startTrack');
            });
          } else if (minibook === "true" ) {
            $cookies.remove('miniBook');
          }
        }
     // console.log("teacherMode",teacherMode);
     if(teacherMode){
       window.close();
     }
     else{
       $modalInstance.dismiss('cancel');
       var origin = $cookies.get('bookOrigin');
       // console.log(origin);
       window.location = "#!/"+origin;
     }
 
       //$state.go("/"+origin);
 
     };
 
     $scope.ok = function() {
       $modalInstance.close($scope.items);
     };
 
   });

 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:OpenQuizCtrl
  * @description
  * # OpenQuizCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('OpenQuizCtrl', function (openQuizService, $sce, $state, $stateParams, $cookies, $scope, $timeout,$uibModal) {
     var vm = this;
     vm.quiz = {};
     vm.quizDone = false;
     //this.currentQuestion = {};
     vm.questionIndex = 1;
     vm.questionLength = 0;
     var timeStart = 0;
     vm.questionTypeLabel = questionTypeLabel;
     vm.playAnswer = playAnswer;
     vm.playQuestion = playQuestion;
     vm.simple = true;
     vm.bookId = '';
     vm.mode = '';
     vm.audioPathSrc = '';
     vm.quesAnswered = [];
     vm.answeredCount = 0;
     vm.profileSetting = [];
     vm.simpleResult;
 
 
     $scope.isEmpty = function(value){
       if (value == '' || value == null){
         return true;
       }
       else{
         return false;
       }
     //return (value == '' || value == null);
     };
 
 
 	vm.quizeOrigin = $cookies.get('quizeOrigin');
 
 	var getWordMode = $cookies.get('wordMode');
 
       if(!vm.quizDone){
         getQuizInfo();
       }
 
 
 
     function getQuizInfo() {
     	var loaderDiv = '<div class="loader"></div>';
 		$(loaderDiv).appendTo('body'); //Add Loader
 
       	vm.bookId = $stateParams.bookId;
 
 	      	openQuizService.getOpenQuiz(vm.bookId).then(function (quizresponse) {
             // console.log("QUIZINFO",quizresponse);
             vm.quizData = quizresponse;
             vm.quiz = quizresponse.data;
             vm.questionLength = vm.quiz.questions.length;
             // console.log("vm.quiz", vm.quiz);
             // Logic to display Quiz answers if already quiz is taken
              vm.firstAttempt = quizresponse.data.firstAttempt;
              if (vm.firstAttempt === false){
                vm.submittedAnswers = null;
              }
 
              $scope.settings = sessionStorage.getItem('booksettings');
              // console.log("settings values", JSON.parse($scope.settings));
              var settingValues = JSON.parse($scope.settings);
              if(settingValues[0].languageSetting === 'Simplified'){
                vm.simple = true;
              }else{
                vm.simple = false;
              }
 
              $('.loader').remove();
 	      	},function(){
             	$('.loader').remove(); //remove Loader
             });
 
 	}
 
 
     this.checkQuestions = function () {
       if (vm.quiz.questions) {
         return (vm.questionIndex < vm.quiz.questions.length) ? true : false;
       }
     };
 
     vm.getQuestionState = function (question,quizData) {
       vm.quizData = quizData;
       // console.log("start from this: ",vm.questionIndex );
       //vm.optionsActivated = true;
        // console.log("question",vm.quizData);
        // console.log("index",vm.questionIndex);
 
       // user coming second time.
       if (vm.quizData.firstAttempt === true){
         if (question.answered === true){
             if (vm.questionIndex == question.id ){
               return 'answered';
             }
             else{
               //return 'correctAnswersActive';
               return 'answeredActive';
             }
         }
         else{
           if (vm.questionIndex == question.id){
             return 'correctAnswers';
           }
           else{
               return 'correctAnswersActive';
           }
         }
       }
       else{
         if (question.answered === true){
             if (vm.questionIndex == question.id ){
               return 'answered';
             }
             else{
               //return 'correctAnswersActive';
               return 'answeredActive';
             }
         }
         else{
           if (vm.questionIndex == question.id ){
               return 'borderActive';
             }
         }
         return '';
       }
       // Intially when quiz is not attempted
       if (vm.questionIndex === question.id) {
         // console.log("question.id",question.id);
         return 'active';
       }
         // console.log("question.answered",question.answered);
       // if (question.answered === true ) {
       //   //console.log("question.answered",question.answered);
       //   return 'answered';
       // }
       return '';
     };
 
     vm.selectQuestion = function (question) {
       vm.questionIndex = question.id;
     };
 
     vm.answeredAllQuestions = function () {
 	      if (vm.quiz.questions && vm.quiz.firstAttempt) {
 	        for (var j = 0; j < vm.quiz.questions.length; j++) {
 	          if (vm.quiz.questions[j].answered !== true) {
 	            return false;
 	          }
 	        }
 	        return true;
 	      }
 	      return true;
     };
 
 
     //to show submit button after all answered
     this.ansChanged = function () {
       //console.log(vm.quiz.questions[vm.questionIndex - 1].userAnswer);
 
       if (vm.quiz.questions[vm.questionIndex - 1].type === 'multiple_answer') {
         // console.log("came to multiple_answer");
         //quizAnswer.userAnswer =  [];
         var userAnswer = [];
         var picked = 0;
         for (var j = 0; j < vm.quiz.questions[vm.questionIndex - 1].answers.length; j++) {
           if (vm.quiz.questions[vm.questionIndex - 1].answers[j].userPicked) {
            // console.log(vm.quiz.questions[vm.questionIndex - 1].answers[j].simp_answer);
             // if(!checkIdExists(vm.quiz.questions[vm.questionIndex-1].id)){
             //     vm.quesAnswered.push({"id":vm.quiz.questions[vm.questionIndex-1].id,"answered":true});
             // }
             picked++;
           }
         }
         //if ans selected
         vm.quiz.questions[vm.questionIndex - 1].answered = (picked > 0) ? true : false;
 
       } else if (vm.quiz.questions[vm.questionIndex - 1].type === 'fill_in_blank') {
         vm.quiz.questions[vm.questionIndex - 1].answered =
           (vm.quiz.questions[vm.questionIndex - 1].userAnswer && vm.quiz.questions[vm.questionIndex - 1].userAnswer != "") ?
             true : false;
       } else {
         vm.quiz.questions[vm.questionIndex - 1].answered = true;
         vm.tradAnswer = true;
         // console.log("finallll l",vm.quiz.questions);
 
       }
     };
 
     function checkIdExists(id) {
       return vm.quesAnswered.some(function (el) {
         return el.id === id;
       });
     }
 
     function questionTypeLabel() {
       if (vm.quiz.questions) {
         var type = vm.quiz.questions[vm.questionIndex - 1].type;
 
         switch (type) {
           case 'multiple_choice':
             return 'Multiple Choice';
             break;
           case 'multiple_answer':
             return 'Multiple Answer';
             break;
           case 'true_or_false':
             return 'True or False';
             break;
           case 'fill_in_blank':
             return 'Fill in the Blank';
             break;
         }
       }
     }
 
     function playQuestion(question) {
       if (question.question_audio) {
         var audioPath = vm.quiz.baseResourceUrl + question.question_audio;
         vm.audioPathSrc = audioPath;
         $("#playAudioFile").attr("src", audioPath);
         document.getElementById('playAudioFile').play();
       }
     }
 
 
     function playAnswer(choice) {
       if (choice.answer_audio) {
         var audioPath = vm.quiz.baseResourceUrl + choice.answer_audio;
         vm.audioPathSrc = audioPath;
         $("#playAudioFile").attr("src", audioPath);
         document.getElementById('playAudioFile').play();
       }
     }
 
     this.submitAnswer = function () {
     	var loaderDiv = '<div class="loader"></div>';
 		$(loaderDiv).appendTo('body'); //Add Loader
 
       	if (vm.answeredAllQuestions() !== true) {
       		$('.loader').remove(); //remove Loader
         	return false;
       	} else {
 
         	//create object for questions answeredActive
           // console.log("vm.quiz", vm.quiz);
            vm.finalQuestions = vm.quiz.questions;
            // console.log("final Questions before",vm.quiz.questions);
 
            for (var i=0;i<vm.finalQuestions.length;i++){
             for (var j=0;j<vm.finalQuestions[i].answers.length;j++){
               if (vm.simple && vm.finalQuestions[i].answered === undefined){
               if (vm.finalQuestions[i].answers[j].simp_answer == vm.finalAnswers[i+1][0]){
                 //vm.finalQuestions[i]['answered'] = true;
                 vm.finalQuestions[i]['userAnswer'] = vm.finalAnswers[i+1][0];
               }
               else if(vm.finalQuestions[i].answered === undefined){
                 //vm.finalQuestions[i]['answered'] = false;
                 vm.finalQuestions[i]['userAnswer'] = vm.finalAnswers[i+1][0];
               }
             }
             else if (!vm.simple && vm.finalQuestions[i].answered === undefined){
               if (vm.finalQuestions[i].answers[j].trad_answer == vm.finalAnswers[i+1][0]){
                 //vm.finalQuestions[i]['answered'] = true;
                 vm.finalQuestions[i]['userAnswer'] = vm.finalAnswers[i+1][0];
               }
               else if(vm.finalQuestions[i].answered === undefined){
                 //vm.finalQuestions[i]['answered'] = false;
                 vm.finalQuestions[i]['userAnswer'] = vm.finalAnswers[i+1][0];
               }
             }
           }
 
            }
           // console.log("final Questions after",vm.finalQuestions);
           // console.log("final Answers",vm.finalAnswers);
           //return false;
 
         	vm.userAnswers = openQuizService.contructQuizAnswerSubmission(vm.finalQuestions, vm.simple);
           // console.log("userAnswers",vm.userAnswers);
         	//submit quiz answers to server
 	        	openQuizService.submitQuizAnswer(vm.bookId, vm.userAnswers).then(function (response) {
 	          		vm.quizResults = response.data;
                 // console.log("results",vm.quizResults);
 	          		$('.loader').remove(); //remove Loader
 	         	},function(){
 	         		$('.loader').remove(); //remove Loader
 	        	});
         	vm.quizDone = true;
       	}
     };
 
     this.resultCount = function (quizItem) {
       var count = 0;
       for (var k in quizItem) {
         if (quizItem.hasOwnProperty(k)) {
           ++count;
         }
       }
       return count;
     };
 
     var origin = $cookies.get('bookOrigin');
 
     this.exit = function () {
       // console.log("came exit");
     	var loaderDiv = '<div class="loader"></div>';
       	$(loaderDiv).appendTo('body');
 
       	vm.bookId = $stateParams.bookId;
       	var role = $cookies.get('nanhaiRole');
       	var origin = $cookies.get('bookOrigin');
 
 	      if (origin) {
 	        	var assnmntId = null;
 				var res = origin.split("/");
 
 				if( res.length > 1 ){
 					assnmntId = res[1];
 					$state.go('folderAssignment', {assignmentId: assnmntId});
 				}else{
 					if(origin === "assignmentReport") origin = "report";
           			$state.go(origin);
 				}
 	      	} else {
 	        	if (role === 'INDIVIDUAL')
 	          	$state.go('/');
 	        	else
 	          	$state.go('assignment');
 	      	}
 	  	$cookies.remove('wordMode');
       $cookies.remove('assignmentSettings');
     };
 
     this.readBook = function () {
       //var origin = $cookies.get('bookOrigin');
       //$cookies.put('bookOrigin', $cookies.get(origin));
       $state.go('openBook', {bookId: $stateParams.bookId});
 
     };
 
     this.redoQuiz = function () {
       if(vm.quizResults.percentage < 75){
         // console.log("came here");
         var msg = "To attempt the quiz, you have to re-read book!";
         messagePopup(msg);
         //alert(msg);
       }else{
         window.location.reload();
       }
     };
 
     this.openBook = function(){
       // console.log($stateParams.bookId);
       var bookId = $stateParams.bookId;
       var bookTitle = vm.quiz.book.bookTitle;
       var viewMode = vm.quiz.book.viewMode;
       var data  = {'bookId':bookId,'bookTitle':bookTitle, 'viewMode' :viewMode};
     //  $cookies.put('miniBook', true);
       //$window.open('/#!/bookFrame/'+bookId, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
       messageModal(data);
       //send message to bookPopup modal
     }
 
     function messageModal(item){
       var modalInstance = $uibModal.open({
           "animation": true,
           "templateUrl": 'openLibrary/views/modals/openBookPopup.html',
           "controller": "openBookPopupCtrl",
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
 
       //send message to common modal
     function messagePopup(item){
       var modalInstance = $uibModal.open({
           "animation": true,
           "templateUrl": 'openLibrary/views/modals/okModal.html',
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
       //    if (vm.quizResults.maxScore.pass === false){
       //     //$state.go('book', {bookId: $stateParams.bookId});
       // }
       // console.log('Modal dismissed at: ' + new Date());
     });
     }
 
   });

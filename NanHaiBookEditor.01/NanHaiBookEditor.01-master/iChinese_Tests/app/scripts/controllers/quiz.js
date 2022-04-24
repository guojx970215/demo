 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:QuizCtrl
  * @description
  * # QuizCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('QuizCtrl', function (userServices, quizService, bookServices, $sce, $state, $stateParams, $cookies, $scope, $timeout,$uibModal) {
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
 
     vm.teacherQuiz = $cookies.get('nanhaiTeacherUserId');
 
     $scope.isEmpty = function(value){
       if (value == '' || value == null){
         return true;
       }
       else{
         return false;
       }
     //return (value == '' || value == null);
     };
 
 	var getCookieAssignmentId =  $cookies.get('cookieAssignmentId');
 
 	vm.quizeOrigin = $cookies.get('quizeOrigin');
 
 	var getWordMode = $cookies.get('wordMode');
 
 	var teacherMode = (typeof $state.current.data !== "undefined" && $state.current.data.teacherView) ?
       true : false;
 
 
    if (teacherMode) {
       getTeacherQuizInfo();
     } else {
       getQuizInfo();
     }
 
 
 
 	function getTeacherQuizInfo() {
       vm.bookId = $stateParams.bookId;
       quizService.getTeacherQuiz(vm.bookId).then(function (quizresponse) {
         vm.mode = 'teacherMode';
         //vm.quiz = response.data;
     	  //vm.questionLength = vm.quiz.response.length;
             quizService.getTeacherProfile().then(function(response){
                   if(response.data){
                       var settings = response.data.settings;
                       // console.log("teacher Resp",response.data);
                       if (getWordMode === undefined){
                             if(settings && (settings.language === "Traditional")) {
                                     vm.simple   = false;
                             }
                       }else if(getWordMode === "Traditional" ){
                         vm.simple   = false;
                         $cookies.remove('wordMode');
                       }
                   $('.loader').remove(); //remove Loader
                   }else{
                     $('.loader').remove(); //remove Loader
                   }
                 vm.assignmentMode = '';
                 vm.quiz = quizresponse.data;
                 vm.questionLength = vm.quiz.questions.length;
             },function(){
               $('.loader').remove(); //remove Loader
             });
       });
     }
 
     function getQuizInfo() {
     	var loaderDiv = '<div class="loader"></div>';
 		$(loaderDiv).appendTo('body'); //Add Loader
 
       	vm.bookId = $stateParams.bookId;
       	if(getCookieAssignmentId === undefined){
           $cookies.remove('assignmentSettings');
 	      	quizService.getQuiz(vm.bookId).then(function (quizresponse) {
             // console.log("QUIZINFO",quizresponse);
             vm.quizData = quizresponse;
             // Logic to display Quiz answers if already quiz is taken
              vm.firstAttempt = quizresponse.data.firstAttempt;
              if (vm.firstAttempt === false){
                //vm.submittedAnswers = currentMaxScore.submittedAnswers;
              }
 
 
 	            //get user profile
 	            userServices.getProfile().then(function(response){
                 //vm.simpleResult = response.data;
 	              	if(response.data){
                     vm.profileSetting = response.data;
                     // console.log("checkqqqqq", vm.profileSetting);
 	                    var settings = response.data.settings;
 	                    if (getWordMode === undefined){
 		          			if(settings.language === "Traditional") {
 	                      		vm.simple   = false;
 	                    	}
 		          		}else if(getWordMode === "Traditional" ){
 		          			vm.simple   = false;
 		          			$cookies.remove('wordMode');
 		          		}
 		          		$('.loader').remove(); //remove Loader
 	              	}else{
 	              		$('.loader').remove(); //remove Loader
 	              	}
 	              	vm.assignmentMode = '';
 	            	vm.quiz = quizresponse.data;
 	            	vm.questionLength = vm.quiz.questions.length;
 	            },function(){
 	            	$('.loader').remove(); //remove Loader
 	            });
 	      	},function(){
             	$('.loader').remove(); //remove Loader
             });
 	    }else{
 	    	quizService.getQuizFromAssignment(vm.bookId, getCookieAssignmentId).then(function (quizresponse) {
           // get Assignment settings from prvious page
           if ($cookies.get('assignmentSettings') !== ''){
             vm.assignmentSetting = $cookies.get('assignmentSettings');
             vm.assignmentMode = quizresponse.data.enableAudio;
             vm.quiz = quizresponse.data;
             // console.log("Quiz lll", vm.quiz);
             vm.questionLength = vm.quiz.questions.length;
             $('.loader').remove(); //remove Loader
           }
           //$('.loader').remove();
 	            //get user profile
 	            // userServices.getProfile().then(function(response){
 	            //   	if(response.data){
 	            //         var settings = response.data.settings;
 	            //         if (getWordMode === undefined){
 		          	// 		if(settings.language === "Traditional") {
 	            //           		vm.simple   = false;
 	            //         	}
 		          	// 	}else if(getWordMode === "Traditional" ){
 		          	// 		vm.simple   = false;
 		          	// 		$cookies.remove('wordMode');
 		          	// 	}
 		          	// 	$('.loader').remove(); //remove Loader
 	            //   	}else{
 	            //   		$('.loader').remove(); //remove Loader
 	            //   	}
 	            //   vm.assignmentMode = quizresponse.data.enableAudio;
 	            // 	vm.quiz = quizresponse.data;
              //    console.log("Quiz lll", vm.quiz);
 	            // 	vm.questionLength = vm.quiz.questions.length;
 	            // },function(){
 	            // 	$('.loader').remove(); //remove Loader
 	            // });
 	      	},function(){
             	$('.loader').remove(); //remove Loader
             });
 	    }
 
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
        if(getCookieAssignmentId && vm.assignmentSetting){
         vm.simple = vm.assignmentSetting;
         if (vm.simple == "Simplified"){
               vm.simple = true;
               //console.log("Simple check", vm.simple);
            }
            else{
               vm.simple = false;
               //console.log("Traditional check", vm.simple);
            }
        }else{
           vm.simple = vm.profileSetting.settings.language;
            if (vm.simple == "Simplified"){
               vm.simple = true;
               // console.log("Simple check", vm.simple);
            }
            else{
               vm.simple = false;
               // console.log("Traditional check", vm.simple);
            }
        }
 
 
       // Logic for previous submitted answers
       if (vm.quizData.firstAttempt === false && vm.mode !== 'teacherMode'){
           if (vm.quizData.currentMaxScore.submittedAnswers !== null){
             if (vm.questionIndex == question.id){
                 var ques = vm.quizData.questions[vm.questionIndex -1].answers;
                 vm.finalAnswers = vm.quizData.currentMaxScore.submittedAnswers;
                 var submittedAnswers = vm.quizData.currentMaxScore.submittedAnswers;
                 //console.log("submittedAnswers",submittedAnswers[1+1][0]);
                 // console.log("vm.simple",ques.length );
                 for(var i=0;i<ques.length;i++){
                   // j loop is for check matching value for submitted answers to question answers
                   // console.log("vm.simple234",vm.simple);
                   //console.log("ssss",submittedAnswers);
                     for (var j=0;j<ques.length;j++){
                       // console.log("aaaaaaaaaaaaaaaaaaaaaaa",submittedAnswers[vm.questionIndex][0]);
                       // if (vm.quizData.currentMaxScore.simple === false)
                       if (vm.simple === false){ //(ques[i].simp_answer == submittedAnswers[vm.questionIndex][0])
                         if( (ques[i].trad_answer == submittedAnswers[vm.questionIndex][0]) || (ques[i].answer_image == submittedAnswers[vm.questionIndex][0]) ){
                           // console.log("activated234");
                           //vm.simple = false;
                           //vm.imgAnswer =  submittedAnswers[vm.questionIndex][0];
                           vm.tradAnswer = submittedAnswers[vm.questionIndex][0];
                           //vm.simpAnswer = submittedAnswers[vm.questionIndex][0];
                           //console.log("submittedAnswers[i+1][0] "+ [i+1][0],submittedAnswers[i+1][0]);
                           //vm.optionsActivated = true;
                         }
                       }
                       else{
                         if(ques[i].simp_answer == submittedAnswers[vm.questionIndex][0] || (ques[i].answer_image == submittedAnswers[vm.questionIndex][0]) ){
                           // console.log("activated1");
                           vm.simpAnswer = submittedAnswers[vm.questionIndex][0];
                           //vm.imgAnswer  = submittedAnswers[vm.questionIndex][0];
                           //vm.simple = true;
                         }
                       }
 
                     }
                 //  }
 
                 }
             }
           }
       }
 
       // user coming second time.
       if (vm.quizData.firstAttempt === false && vm.mode !== 'teacherMode'){
         if (question.answered === true){
             if (vm.questionIndex == question.id ){
               return 'answered';
             }
             else{
               //return 'correctAnswersActive';
               return 'answeredActive';
             }
         }
         else if (vm.quizData.currentMaxScore.gradedAnswers[question.id] !== true){
           if (vm.questionIndex == question.id){
             return 'wrongAnswersActive';
           }
           else{
             return 'wrongAnswers';
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
     	if (!teacherMode) {
 	      if (vm.quiz.questions && vm.quiz.firstAttempt) {
 	        for (var j = 0; j < vm.quiz.questions.length; j++) {
 	          if (vm.quiz.questions[j].answered !== true) {
 	            return false;
 	          }
 	        }
 	        return true;
 	      }
         if(vm.quiz.questions && !vm.quiz.firstAttempt){
           for(var i = 0; i < vm.quiz.questions.length; i++){
             if(vm.quiz.questions[i].answered !== true && vm.quizData.currentMaxScore.gradedAnswers[i+1] === false){
               //console.log("came to else 1", vm.quizData.currentMaxScore.gradedAnswers[i+1]);
               return false;
             }
           }
           return true;
         }
 	      //return true;
      	}else{
      		return false;
      	}
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
        if(getCookieAssignmentId && vm.assignmentSetting){
         vm.simple = vm.assignmentSetting;
         if (vm.simple == "Simplified"){
               vm.simple = true;
               //console.log("Simple check", vm.simple);
            }
            else{
               vm.simple = false;
               //console.log("Traditional check", vm.simple);
            }
        }else{
           vm.simple = vm.profileSetting.settings.language;
            if (vm.simple == "Simplified"){
               vm.simple = true;
               // console.log("Simple check", vm.simple);
            }
            else{
               vm.simple = false;
               // console.log("Traditional check", vm.simple);
            }
        }
            // if(getCookieAssignmentId){
            //  vm.simple = ;
            // }
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
 
         	vm.userAnswers = quizService.contructQuizAnswerSubmission(vm.finalQuestions, vm.simple);
           // console.log("userAnswers",vm.userAnswers);
         	//submit quiz answers to server
         	if(getCookieAssignmentId === undefined){
 	        	quizService.submitQuizAnswer(vm.bookId, vm.userAnswers).then(function (response) {
                 vm.quizResults = response.data;
//console.log("OmaxScore[qSubmit] - " + vm.quizResults.maxScore.percentage);
                 // console.log("results",vm.quizResults);
                 // Call API to send point of quiz
               if (sessionStorage.startQuizTrack != null){
                        var sessionKey = JSON.parse(sessionStorage.startQuizTrack);
                        var stopQuizTrack = {
                          "sessionActivity": "QUIZ_ATTEMPT_END",
                          "pass":vm.quizResults.pass,
                          "percentage":vm.quizResults.percentage
                        };
                        bookServices.stopQuizTrack(stopQuizTrack,sessionKey).then(function (response) {
                            // console.log("Quiz Ended: ", response);
                            sessionStorage.removeItem('startQuizTrack');
                        });
                      }
 	          		$('.loader').remove(); //remove Loader
 	         	},function(){
 	         		$('.loader').remove(); //remove Loader
 	        	});
         	}else{
//console.log("Assignment-Quiz - " + getCookieAssignmentId);
         		quizService.submitQuizAnswerFromAssignment(vm.bookId, getCookieAssignmentId, vm.userAnswers).then(function (response) {
//console.log("Aresponse[qSubmit] - ");
//console.log(response.data);
                 vm.quizResults = response.data;
                 if ((vm.quizResults.maxScore === undefined) || (vm.quizResults.maxScore === null) || (vm.quizResults.maxScore === "")) {
                  vm.quizResults.maxScore = {};
                  vm.quizResults.maxScore.percentage = vm.quizResults.percentage;
                 }
//console.log("AmaxScore[qSubmit] - " + vm.quizResults.percentage);
                 // console.log("results12",vm.quizResults);
                 //Call end track api
                 if (sessionStorage.startQuizTrack != null){
                   var sessionKey = JSON.parse(sessionStorage.startQuizTrack);
                   var stopQuizTrack = {
                     "sessionActivity": "QUIZ_ATTEMPT_END",
                     "pass":vm.quizResults.pass,
                     "percentage":vm.quizResults.percentage
                   };
                   bookServices.stopQuizTrack(stopQuizTrack,sessionKey).then(function (response) {
                       // console.log("Quiz Ended: ", response);
                       sessionStorage.removeItem('startQuizTrack');
                   });
                 }
 	          		$('.loader').remove(); //remove Loader
 	        	},function(){
 	         		$('.loader').remove(); //remove Loader
 	        	});
         	}
         	vm.quizDone = true;
       	}
     };
 
     this.getQuizIcon = function (quizItem) {
       var correct = '';
       if (quizItem) {
         correct = true;
       } else {
         correct = false;
       }
       return correct ? 'fa-check' : 'fa-times';
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
     vm.page = 'Assignment';
     if (origin === 'myLibrary') {
       vm.page = 'My Library';
     } else if (origin === 'openReading') {
       vm.page = 'Open Reading';
     } else if (origin === "progressReading") {
       vm.page = 'Level Reading';
     }else if (origin === "report") {
       vm.page = 'Report';
     }
 
     this.exit = function () {
       // console.log("came exit");
     	var loaderDiv = '<div class="loader"></div>';
       	$(loaderDiv).appendTo('body');
 
       	vm.bookId = $stateParams.bookId;
       	var role = $cookies.get('nanhaiRole');
       	var origin = $cookies.get('bookOrigin');
 
 	  	if (teacherMode) {
         	window.close();
       	} else {
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
       	}
 	  	$cookies.remove('wordMode');
       $cookies.remove('assignmentSettings');
     };
 
     this.readBook = function () {
       //var origin = $cookies.get('bookOrigin');
       //$cookies.put('bookOrigin', $cookies.get(origin));
       $state.go('book', {bookId: $stateParams.bookId});
 
     };
 
     this.redoQuiz = function () {
       console.log("maxScore[redoQuiz] - " + vm.quizResults.maxScore);

       if(vm.quizResults.maxScore.percentage < 75){
         // console.log("came here");
         var msg = "To pass the quiz, you have to re-read book again to finish quiz.";
         messagePopup(msg);
         //alert(msg);
       }else{
         vm.bookId = $stateParams.bookId;
         var startQuiz = {
           "bookId":vm.bookId,
           "sessionActivity": "QUIZ_ATTEMPT_START"
         };
         bookServices.startQuizTrack(startQuiz).then(function (response) {
         // console.log("Quiz Started: ", response.data);
         sessionStorage.setItem('startQuizTrack', JSON.stringify(response.data));
         });
         var timeout  = setTimeout(function () {
           window.location.reload();
       }, 1000);
       }
 
       // if (vm.quizResults.maxScore.pass === false){
       //   console.log("$stateParams.bookId",$stateParams.bookId);
       //   //var origin = $cookies.get('bookOrigin');
       //   //$cookies.put('bookOrigin', $cookies.get(origin));
       //   $state.go('book', {bookId: $stateParams.bookId});
       // }
       // else{
       //   window.location.reload();
       // }
       //var origin = $cookies.get('bookOrigin');
 
       //window.location  = "#/quiz/"+ $stateParams.bookId;
       //$cookies.put('bookOrigin', origin);
     //  $state.go('quiz', {bookId: $stateParams.bookId});
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
           "templateUrl": 'views/modals/bookPopup.html',
           "controller": "BookPopupCtrl",
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
       //    if (vm.quizResults.maxScore.pass === false){
       //     //$state.go('book', {bookId: $stateParams.bookId});
       // }
       // console.log('Modal dismissed at: ' + new Date());
     });
     }
 
   });

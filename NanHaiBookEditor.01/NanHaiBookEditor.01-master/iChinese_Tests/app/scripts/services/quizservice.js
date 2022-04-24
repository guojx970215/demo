 'use strict';
 
 /**
  * @ngdoc service
  * @name nanhaiMainApp.quizService
  * @description
  * # quizService
  * Service in the nanhaiMainApp.
  */
 angular.module('nanhaiMainApp')
   .service('quizService', function ($http,apiService, endpoints) {
 
     this.getQuiz = function(bookId){
       var req = {
         method: 'GET',
         url: endpoints.admin + 'quiz/' + bookId
       };
       return apiService.userAPICall(req);
     };
 
      this.getQuizFromAssignment = function(bookId, assignmentId){
       var req = {
         method: 'GET',
         url: endpoints.admin + 'quiz/' + assignmentId + '/' + bookId
       };
       return apiService.userAPICall(req);
     };
 
 	this.getTeacherQuiz = function(bookId){
       var req = {
         method: 'GET',
         url: endpoints.admin + 'quiz/' + bookId
       };
       return apiService.teacherAPICall(req);
     };
     //get user profile
     this.getTeacherProfile = function () {
       var req = {
         method: 'GET',
         url: endpoints.user + 'profile'
       };
       return apiService.teacherAPICall(req);
     };//get user profile
     this.contructQuizAnswerSubmission = function(questions,simple){
       // console.log("final submission 122323",simple);
       var quizAnswers = {};
       quizAnswers.answers = {};
       // console.log("submittedQues",questions);
       for (var i = 0; i < questions.length; i++) {
         //var quizAnswer = {id : questions[i].id, timeSpent: questions[i].timeSpent};
         //var quizAnswer = {id : questions[i].id};
         //var quizAnswer = {};
       //   quizAnswer.answers = {};
         if(questions[i].type === 'multiple_answer'){
           //quizAnswer.userAnswer =  [];
           var userAnswer =  [];
           for (var j = 0; j < questions[i].answers.length; j++) {
             if(questions[i].answers[j].userPicked){
               if(simple) {
                 if (answers[j].simp_answer == '' && answers[j].trad_answer == '' && answers[j].question_image != ''){
                   userAnswer.push(questions[i].answers[j].question_image);
                 }
                 else if (answers[j].simp_answer != '' && answers[j].trad_answer != '' && answers[j].question_image != ''){
                   userAnswer.push(questions[i].answers[j].simp_answer);
                 }
                 else if (answers[j].simp_answer != '' && answers[j].trad_answer != '' && answers[j].question_image == ''){
                   userAnswer.push(questions[i].answers[j].simp_answer);
                 }
 
               }else{
                 if (answers[j].simp_answer == '' && answers[j].trad_answer == '' && answers[j].question_image != ''){
                   userAnswer.push(questions[i].answers[j].question_image);
                 }
                 else if (answers[j].simp_answer != '' && answers[j].trad_answer != '' && answers[j].question_image != ''){
                   userAnswer.push(questions[i].answers[j].trad_answer);
                 }
                 else if (answers[j].simp_answer != '' && answers[j].trad_answer != '' && answers[j].question_image == ''){
                   userAnswer.push(questions[i].answers[j].trad_answer);
                 }
               }
             }
             //quizAnswer.userAnswer = "ma";
           }
           quizAnswers.answers[questions[i].id] = userAnswer;
           // console.log("picked answer:",userAnswer);
         } else {
           // console.log("its multiple Choice");
           if(questions[i].userAnswer){
             // console.log("Answers", questions[i].userAnswer);
             quizAnswers.answers[questions[i].id] = [questions[i].userAnswer];
           }
         }
          //quizAnswers.push(quizAnswer);
 
 
        }
        quizAnswers['simple'] = simple;
        // console.log("final submission",quizAnswers);
        return quizAnswers;
     };
 
     this.submitQuiz = function(answers){
       var quizResults = {};
       quizResults.items = [];
       var correctCount = 0;
       //create a random quiz result
       for (var i = 0; i < answers.length; i++) {
         var quizItem = {};
         quizItem.correct = (Math.random() > 0.5) ? true : false;
         if(quizItem.correct){
           correctCount++;
         }
         quizResults.items.push(quizItem);
       }
       quizResults.correctCount = correctCount;
       return quizResults;
     };
     /*submit quiz answers*/
     this.submitQuizAnswer = function(bookId,ansData){
       var req = {
         method: 'POST',
         url: endpoints.admin + 'quiz/' + bookId,
         data: ansData
 
       };
       return apiService.userAPICall(req);
     };
 
 	/*submit quiz answers from Assignment book*/
     this.submitQuizAnswerFromAssignment = function(bookId, assignmentId, ansData){
       var req = {
         method: 'POST',
         url: endpoints.admin + 'quiz/' + assignmentId + '/' + bookId,
         data: ansData
 
       };
       return apiService.userAPICall(req);
     };
 
   });

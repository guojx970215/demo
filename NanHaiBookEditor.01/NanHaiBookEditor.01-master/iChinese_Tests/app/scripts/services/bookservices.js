   'use strict';
   
   /**
    * @ngdoc service
    * @name nanhaiMainApp.bookServices
    * @description
    * # bookServices
    * Service in the nanhaiMainApp.
    */
   angular.module('nanhaiMainApp')
     .service('bookServices', function (apiService, endpoints) {
   
       this.getChildIframe = function () {
         var iframe = document.getElementsByTagName('iframe')[0];
         return iframe.contentWindow;
       };
       this.getOpenReadingC = function (filterData,limit,page) {
         var req = {
           method: 'POST',
             url: endpoints.admin + 'openreadingcount',
           data: filterData
   
         };
         return apiService.userAPICall(req);
       };
       /*fetch open reading books*/
       this.getOpenReading = function (filterData,limit,page) {
         var req = {
           method: 'POST',
           url: endpoints.admin + 'openreading?limit='+limit+'&page='+page,
           data: filterData
   
         };
         return apiService.userAPICall(req);
       };
       this.getLevelReadingC = function (filterData,limit,page) {
         var req = {
           method: 'POST',
           url: endpoints.admin + 'progressreadingcount',
           data: filterData
         };
         return apiService.userAPICall(req);
       };
       //fetch progress reading
       this.getLevelReading = function (filterData,limit,page) {
         var req = {
           method: 'POST',
           url: endpoints.admin + 'progressreading?limit='+limit+'&page='+page,
           data: filterData
         };
         return apiService.userAPICall(req);
       };
       var cachingAllInterestLevel;
       /*fetch interest level*/
       this.getInrestLevel = function () {
         var req = {
           method: 'GET',
           url: endpoints.admin + 'viewAllInterestLevel',
         };
         if(!cachingAllInterestLevel) cachingAllInterestLevel = apiService.userAPICall(req);
         return cachingAllInterestLevel;
       };
       var cachingLevel;
       this.getProficiencyLevel = function () {
         var req = {
           method: 'GET',
           url: endpoints.admin + 'level',
         };
         if(!cachingLevel) cachingLevel = apiService.userAPICall(req);
         return cachingLevel;
       };
   
   
       var cachingAllCategoryAndSubCategoryForTextType;
       /*fetch text type*/
       this.getTextType = function () {
         var req = {
           method: 'GET',
           url: endpoints.admin + 'getAllCategoryAndSubCategoryForTextType',
         };
         if(!cachingAllCategoryAndSubCategoryForTextType) cachingAllCategoryAndSubCategoryForTextType = apiService.userAPICall(req);
         return cachingAllCategoryAndSubCategoryForTextType;
       };
       var cachingAllCategoryForSeries;
       /*fetch series*/
       this.getSeries = function () {
         var req = {
           method: 'GET',
           url: endpoints.admin + 'viewAllCategoryForSeries',
         };
         if(!cachingAllCategoryForSeries) cachingAllCategoryForSeries = apiService.userAPICall(req);
         return cachingAllCategoryForSeries;
       };
       var cachingTopic;
       /*fetch topics*/
       this.getTopics = function () {
         var req = {
           method: 'GET',
           url: endpoints.admin + 'topic',
         };
         if(!cachingTopic) cachingTopic = apiService.userAPICall(req);
         return cachingTopic;
       };
       var cachingAllProgramType;
       /*fetch program types*/
       this.getProgramTypes = function () {
         var req = {
           method: 'GET',
           url: endpoints.admin + 'viewAllProgramType',
         };
         if(!cachingAllProgramType) cachingAllProgramType = apiService.userAPICall(req);
         return cachingAllProgramType;
       };
   
       //fetch my library
       this.getBooksByFolderId = function (folderId, filterData) {
         var req = {
           method: 'POST',
           url: endpoints.student + 'folder/filter/' + folderId,
           data: filterData
   
         };
         return apiService.userAPICall(req);
       };
       //create folder
       this.createFolder = function (formData) {
         var req = {
           method: 'POST',
           url: endpoints.student + 'folder',
           data: formData
         };
         return apiService.userAPICall(req);
       };
       this.updateFolder = function (folderId, formData) {
         var req = {
           method: 'PUT',
           url: endpoints.student + 'folder/' + folderId,
           data: formData
         };
         return apiService.userAPICall(req);
       };
       this.deleteFolder = function (folderId, formData) {
         var req = {
           method: 'DELETE',
           url: endpoints.student + 'folder/' + folderId,
           headers: {
             "Content-Type": "application/json"
           },
           data: formData
         };
         return apiService.userAPICall(req);
       };
       //add books to the folder
       this.AddBooksToFolder = function (folderId, bookIds) {
         var req = {
           method: 'POST',
           url: endpoints.student + 'folder/' + folderId + '/book/',
           data: {
             "bookId": bookIds
           }
         };
         return apiService.userAPICall(req);
       };
         this.getBookcurbp = 0;
       //delete books from the folder
       this.removeBooksFromFolder = function (folderId, bookIds) {
         var req = {
           method: 'DELETE',
           url: endpoints.student + 'folder/' + folderId + '/book/',
           headers: {
             "Content-Type": "application/json"
           },
           data: {
             "bookId": bookIds
           }
         };
         return apiService.userAPICall(req);
       };
       this.getAllFolders = function () {
         var req = {
           method: 'GET',
           url: endpoints.student + 'folderlist',
         };
         return apiService.userAPICall(req);
       };
   
       this.getBook = function (bookId) {
         var req = {
           method: 'GET',
           url: endpoints.admin + 'book/' + bookId
         };
         return apiService.userAPICall(req);
       };
   
       this.getBookFromAssignment = function (assignmentId, bookId) {
         var req = {
           method: 'GET',
           url: endpoints.admin + 'book/' + assignmentId + '/'+ bookId
         };
         return apiService.userAPICall(req);
       };
   
       this.getTeacherBook = function (bookId) {
         var req = {
           method: 'GET',
           url: endpoints.admin + 'book/' + bookId
         };
         return apiService.teacherAPICall(req);
       };
   
       this.getTeacherProfile = function(userName){
         var req = {
         method: 'GET',
         url: endpoints.user + 'profile'
         };
         return apiService.teacherAPICall(req);
       };
   
   
       this.getParentBook = function (bookId) {
         var req = {
           method: 'GET',
           url: endpoints.admin + 'book/' + bookId
         };
         return apiService.parentAPICall(req);
       };
   
       this.readBook = function (bookId, progress) {
         var req = {
           method: 'POST',
           url: endpoints.admin + 'read/' + bookId,
           data: {"readNow": progress}
         };
         return apiService.userAPICall(req);
       };
   
       this.readProgress = function (bookId, assignmentId, readProgress) {
         var req = {
           method: 'POST',
           url: endpoints.admin + 'read/' + assignmentId + '/'+ bookId,
           data: {"readNow": readProgress}
         };
         return apiService.userAPICall(req);
       };
   
       this.getBookmark = function (bookId) {
         var req = {
           method: 'GET',
           url: endpoints.admin + 'bookmark/' + bookId
         };
         return apiService.userAPICall(req);
       };
   
       this.startTrack = function (bookData) {
         var req = {
           method: 'POST',
           url: endpoints.admin + 'track/start',
           data:bookData
         };
         return apiService.userAPICall(req);
       };
       this.startQuizTrack = function (quizData) {
         var req = {
           method: 'POST',
           url: endpoints.admin + 'track/start',
           data:quizData
         };
         return apiService.userAPICall(req);
       };
   
       this.stopTrack = function (bookData,sessionKey) {
         var req = {
           method: 'POST',
           url: endpoints.admin + 'track/end',
           headers: {
             "SessionKey": sessionKey
           },
           data:bookData
         };
         return apiService.userAPICall(req);
       };
       this.stopQuizTrack = function (quizData,sessionKey) {
         var req = {
           method: 'POST',
           url: endpoints.admin + 'track/end',
           headers: {
             "SessionKey": sessionKey
           },
           data:quizData
         };
         return apiService.userAPICall(req);
       };
   
       this.setBookmark = function (bookId, page) {
         var req = {
           method: 'POST',
           url: endpoints.admin + 'bookmark/' + bookId + '/' + page,
           data: {"page": page}
         };
         return apiService.userAPICall(req);
       };
   
   	this.writing = function (postData) {
         var req = {
           method: 'POST',
           url: endpoints.student + 'writing',
           data: postData
         };
         return apiService.userAPICall(req);
      	};
   
     this.share = function(postData){
       var req = {
         method: 'PUT',
         url: endpoints.student + 'writing/send/'+ postData.userId + '/' + postData.bookId + '/' + postData.assignmentId
       };
       return apiService.userAPICall(req);
     }
   
     this.shareWritingToParent = function(postData){
       var req = {
         method: 'PUT',
         url: endpoints.student + 'writing/send/'+ postData.userId + '/' + postData.bookId
       };
       return apiService.userAPICall(req);
     }
   
   	this.getWritingforBook = function (studentName, bookId) {
         var req = {
           method: 'GET',
           url: endpoints.student + 'writing/' + studentName + '/' + bookId,
         };
         return apiService.userAPICall(req);
       };
   
     	this.getWritingforAssignment = function (studentName, bookId, assignmentId) {
         var req = {
           method: 'GET',
           url: endpoints.student + 'writing/' + studentName + '/' + bookId + '/' + assignmentId,
         };
         return apiService.userAPICall(req);
      };
   
      this.submitRecording = function (postData) {
         var req = {
           method: 'POST',
           url: endpoints.student + 'recording',
           data: postData
         };
         return apiService.userAPICall(req);
      };
      this.sendRecordingToTeacherAPI = function (studentName, bookId, assignmentId) {
         var req = {
           method: 'PUT',
           url: endpoints.student + 'recording/send/' + studentName + '/' + bookId + '/' + assignmentId
           //data: postData
         };
         return apiService.userAPICall(req);
      };
   
      this.sendRecordingToParentAPI = function (studentName, bookId) {
         var req = {
           method: 'PUT',
           url: endpoints.student + 'recording/send/' + studentName + '/' + bookId
           //data: postData
         };
         return apiService.userAPICall(req);
      };
   
      this.updateRecordingToTeacherAPI = function (studentName, bookId, assignmentId) {
        // console.log("came twice");
         var req = {
           method: 'PUT',
           url: endpoints.student + 'recording/send/' + studentName + '/' + bookId  + '/'
           //data: postData
         };
         return apiService.userAPICall(req);
      };
   
         this.getBookcurbpp = 0;
      this.getRecording = function (studentName, bookId) {
         var req = {
           method: 'GET',
           url: endpoints.student + 'recording/' + studentName + '/' + bookId
         };
         return apiService.userAPICall(req);
      };
   
      this.getRecordingWithAssignment = function (studentName, bookId, assignmentId) {
         var req = {
           method: 'GET',
           url: endpoints.student + 'recording/' + studentName + '/' + bookId + '/' + assignmentId
           };
         return apiService.userAPICall(req);
      };
   
      this.downloadFile = function (fileId) {
         var req = {
           method: 'GET',
           url: endpoints.student + 'location/file/' + fileId,
         };
         return apiService.userAPICall(req);
      };
   
   
     });

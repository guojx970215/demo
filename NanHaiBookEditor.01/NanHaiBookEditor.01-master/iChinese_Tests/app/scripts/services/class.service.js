 'use strict';
 
 /**
  * @ngdoc service
  * @name nanhaiMainApp.bookServices
  * @description
  * # bookServices
  * Service in the nanhaiMainApp.
  */
 angular.module('nanhaiMainApp')
   .service('classServices', function (endpoints, $q, $cookies, apiService) {
     // AngularJS will instantiate a singleton by calling "new" on this function
 
     this.getClasses = function(){
       var req = {
         method: 'GET',
         url: endpoints.user + 'getClasses'
       };
 
       return apiService.userAPICall(req);
     };
 
     this.getMyLiveAssignments = function(){
       var req = {
         method: 'GET',
         url: endpoints.school + 'liveassignments'
       };
 
       return apiService.userAPICall(req);
     };
     this.getAssignmentsByClassId = function(classId){
       var req = {
         method: 'GET',
         url: endpoints.school + 'liveassignments/' + classId
       };
 
       return apiService.userAPICall(req);
     };
      this.getBookByClassId = function(classId,assignmentId){
       var req = {
         method: 'GET',
         url: endpoints.school + 'myassignments/' + classId +'/'+assignmentId
       };
 
       return apiService.userAPICall(req);
     };
     this.getMyAssignmentsByClassId = function(classId){
       var req = {
         method: 'GET',
         url: endpoints.school + 'myassignments/' + classId
       };
 
       return apiService.userAPICall(req);
     };
     this.getAssignmentBooks = function(classId, assignmentId) {
       var req = {
         method: 'GET',
         url: endpoints.school + 'myassignments/' + classId +'/' + assignmentId
       };
       return apiService.userAPICall(req);
     };
 	
 	this.getMyAssignmentInClassWithFilter = function(classId, assignmentId, postData) {
       var req = {
         method: 'POST',
         url: endpoints.school + 'myassignments/' + classId +'/' + assignmentId,
         data: postData
       };
       return apiService.userAPICall(req);
     };
     
 
   });

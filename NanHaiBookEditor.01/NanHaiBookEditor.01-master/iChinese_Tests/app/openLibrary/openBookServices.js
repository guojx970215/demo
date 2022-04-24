 'use strict';
 
 /**
  * @ngdoc service
  * @name nanhaiMainApp.openBookServices
  * @description
  * # bookServices
  * Service in the nanhaiMainApp.
  */
 angular.module('nanhaiMainApp')
   .service('openBookServices', function (apiService, endpoints) {
 
     this.getChildIframe = function () {
       var iframe = document.getElementsByTagName('iframe')[0];
       return iframe.contentWindow;
     };
 
     /*fetch interest level*/
     this.getInrestLevel = function () {
       var req = {
         method: 'GET',
         url: endpoints.admin + 'viewAllInterestLevel',
       };
       return apiService.apiCall(req);
     };
     this.getProficiencyLevel = function () {
       var req = {
         method: 'GET',
         url: endpoints.admin + 'level',
       };
       return apiService.apiCall(req);
     };
 
     /*fetch text type*/
     this.getTextType = function () {
       var req = {
         method: 'GET',
         url: endpoints.admin + 'getAllCategoryAndSubCategoryForTextType',
       };
       return apiService.apiCall(req);
     };
     /*fetch series*/
     this.getSeries = function () {
       var req = {
         method: 'GET',
         url: endpoints.admin + 'viewAllCategoryForSeries',
       };
       return apiService.apiCall(req);
     };
     /*fetch topics*/
     this.getTopics = function () {
       var req = {
         method: 'GET',
         url: endpoints.admin + 'topic',
       };
       return apiService.apiCall(req);
     };
     /*fetch program types*/
     this.getProgramTypes = function () {
       var req = {
         method: 'GET',
         url: endpoints.admin + 'viewAllProgramType',
       };
       return apiService.apiCall(req);
     };
 
     /*fetch open library books*/
     this.getOpenLibraryBooks = function (filterData,limit,page,sortField) {
       var req = {
         method: 'POST',
         url: endpoints.admin + 'libraryaccess/openreading?limit='+limit+'&page='+page+'&sortField='+sortField,
         data: filterData
 
       };
 
       return apiService.apiCall(req);
     };
 
     this.getOpenBook = function (bookId) {
       var req = {
         method: 'GET',
         url: endpoints.admin + 'libraryaccess/book/' + bookId
       };
       return apiService.apiCall(req);
     };
 
     this.readOpenBook = function (bookId, progress) {
       var req = {
         method: 'POST',
         url: endpoints.admin + 'libraryaccess/read/' + bookId,
         data: {"readNow": progress}
       };
       return apiService.apiCall(req);
     };
 
   });

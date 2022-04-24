 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:AnnouncementsCtrl
  * @description
  * # AnnouncementsCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('AnnouncementsCtrl', function () {
 
     this.announcements = [];
     var self = this;
 
     for (var i = 0; i < 20; i++) {
       var announcement = {
         date: '9/05/15 1:34pm',
         title: 'New Books Available'
       };
       self.announcements.push(announcement);
       // console.log("self.announcements", self.announcements);
     }
 
   });

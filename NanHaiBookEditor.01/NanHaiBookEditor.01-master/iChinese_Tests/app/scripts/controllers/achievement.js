 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:AchievementCtrl
  * @description
  * # AchievementCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('AchievementCtrl', function ($modal) {
 
     this.achievements = [];
     var self = this;
 
     for (var i = 0; i < 30; i++) {
       var achievement = {
         title: 'Achievement Name',
         body: 'Read the whole series of Great Chinese War Revelations',
         url: 'images/51o2UG3sp3L._SX305_BO1,204,203,200_.jpg'
       };
       self.achievements.push(achievement);
     }
 
     this.viewAchievement = function(achievement){
       $modal.open({
         templateUrl: 'views/modals/achievement.html',
         controller: 'BasicModalItemsCtrl',
         size: 'lg',
         resolve: {
           items: function () {
             return achievement;
           }
         }
       });
     };
 
 
 
 
   });

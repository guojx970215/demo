 'use strict';
 
 /**
  * @ngdoc directive
  * @name nanhaiMainApp.directives
  * @description
  * # fallback image directive
  */
 angular.module('nanhaiMainApp')
   .directive('miniAvatar', function (userServices) {
     "use strict";
     return {
       templateUrl: './scripts/directives/avatar/avatar.html',
       restrict: 'EAC',
       replace: false,
       link: function postLink(scope, element, attrs) {
 
         scope.isMustache = false;
         scope.isHat = false;
         scope.isEyewear = false;
         scope.isTie = false;
         scope.currentAvatar = {};
         userServices.getGameProfile().then(function () {
           userServices.STORAGE_AVATAR().then(function (response) {
             var currentAvatar = {};
             for (var key in response.data) {
               if (key !== 'accessory') {
                 if (response.data[key].length !== 0) {
                   for (var i = 0; i < response.data[key].length; i++) {
                     if (response.data[key][i].is_equipped === true) {
                       currentAvatar[key] = response.data[key][i];
                     }
                     ;
                   }
                 }
               } else {
                 scope.isMustache = true;
                 scope.isHat = true;
                 scope.isEyewear = true;
                 scope.isTie = true;
 
                 var accessory = {};
                 for (var i = 0; i < response.data[key].length; i++) {
                   if (response.data[key][i].is_equipped === true) {
                     var subKey = response.data[key][i].sub_type
                     accessory[subKey] = response.data[key][i];
                   }
                   ;
                 }
                 currentAvatar[key] = accessory;
               }
             }
             // console.log(currentAvatar);
             scope.currentAvatar = currentAvatar;
           });
         });
 
       }
     };
 
   });

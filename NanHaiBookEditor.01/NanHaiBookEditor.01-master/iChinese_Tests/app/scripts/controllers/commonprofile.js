 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:commonprofileController
  * @description
  * # LoginCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('commonprofileController', function (userServices,profileService,$location,$scope) {
     var vm = this;
 
     vm.exitToMain = exitToMain;
     vm.currentAvatar = {};
     $scope.pageLocation = $location.path();
     
     init();
 
     function init(){
       var userProfile = profileService.getData('profileData');
       // if (userProfile !== null) {
       //   console.log("Profile Sessionstorage::",userProfile);
       //   vm.profile = userProfile;
       // }else{
         userServices.getProfile().then(function(response){
           vm.profile = response.data;
         });
       //}
     
 
       
       //getAvatar();
     }
 
     function exitToMain(){
       return $location.path('/');
     }
 
     // ---------profile avatar------------------------
     function getAvatar(){
       userServices.STORAGE_AVATAR().then(function(response){
          var currentAvatar = {};
             // console.log(response.data);            
             for(var key in response.data){
               // console.log( response.data[key])
               if (response.data[key].length !== 0) {
                 for(var i = 0; i < response.data[key].length; i++){
                   if (response.data[key][i].is_equipped === true) {
                     currentAvatar[key] = response.data[key][i];  
                   };
                 }
               };
              ;
             }
             
             vm.currentAvatar = currentAvatar;
             // return currentAvatar;
       });
     };
 
   });

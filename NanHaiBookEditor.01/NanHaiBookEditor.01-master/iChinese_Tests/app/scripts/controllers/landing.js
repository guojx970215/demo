 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:LandingCtrl
  * @description
  * # LoginCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('LandingCtrl', function (userServices,profileService, $scope, $uibModal, $cookieStore, $cookies, $sce, $timeout) {
     var vm = this;
     vm.logout = logout;
     vm.launchGame = launchGame;
     vm.getNewAchievements = [];
     vm.score = false;
     $scope.isStudent = false;
     vm.isNewAnnoucements = [];
     $timeout(function () {
       init();
     });
 
 
     function init() {
       sessionStorage.clear();
       //get game profile to prevent bugs
       userServices.getGameProfile();
 
       //get userprofile
       getProfile();
 
       // show profile
       vm.toggleScoreBoard();
 
       // get voice Announcements if exist
       getVoiceRemAnnouncemnt();
       isNewAnnouncement();
 
       //get all announcements
       vm.newAnnouncement = false;
       var loaderDiv = '<div class="loader"></div>';
       $(loaderDiv).appendTo('body');
       userServices.getAnnouncements().then(function (response) {
       		// console.log('getAnnouncements: ',response);
       		if(response.status === 200){
 		        vm.announcements = response.data;
 		        vm.announcements.forEach(function (el) {
 		          // el.message = $sce.trustAsHtml(el.message);
 		          if (el.ack === null) {
                 // console.log("came inside announcements");
 		            vm.newAnnouncement = true;
 		          }
 
 		        });
       		}
       	 	$('.loader').remove();
       },function (response){
       	 $('.loader').remove();
       	// console.log('getAnnouncements error: ',response);
       });
       //get New Achievements
       getNewAchievements();
     }
 
     //profile
     function getProfile() {
       userServices.getProfile().then(function (response) {
         vm.profile = response.data;
         // console.log('vm.profile: ',vm.profile);
 
         if (response.data.role[0] === 'STUDENT') {
           $scope.isStudent = true;
           profileService.setData('profileData',vm.profile);
         } else if (response.data.role[0] === 'INDIVIDUAL') {
           //  do nothing
           profileService.setData('profileData',vm.profile);
         } else {
           alert("You are not a student");
           logout();
         }
         if ($cookies.get('nanhaiRole') == "") {
           $cookies.put('nanhaiRole', response.data.role[0]);
         }
       });
     };
 
   // get voice remininder Announcement.
     function getVoiceRemAnnouncemnt() {
       userServices.getVoiceAnnouncement().then(function (response) {
         // console.log("Voice Announcement:", response);
         // console.log(response);
         vm.voiceAnnouncement = response.data;
         // vm.profile = response.data;
         // console.log('vm.profile: ',vm.profile);
         //
         // if (response.data.role[0] === 'STUDENT') {
         //   $scope.isStudent = true;
         //   profileService.setData('profileData',vm.profile);
         // } else if (response.data.role[0] === 'INDIVIDUAL') {
         //   //  do nothing
         //   profileService.setData('profileData',vm.profile);
         // } else {
         //   alert("You are not a student");
         //   logout();
         // }
         // $cookies.put('nanhaiRole', response.data.role[0]);
       });
     };
 
 //get New annoucements
   function isNewAnnouncement(){
     userServices.isNewStudentClassAnnouncement().then(function(response){
       vm.isNewAnnoucements = response.data;
       // console.log("vm.isNewAnnoucements", vm.isNewAnnoucements);
       if(vm.isNewAnnoucements === true){
         vm.newAnnouncement = true;
       }
     });
   };
 
     //get New Achievements
     function getNewAchievements() {
       userServices.getNewAchievements().then(function (response) {
         vm.getNewAchievements = response.data;
         //console.log(response.data);
       });
     }
 
     //Add to folder
     $scope.showModalAddFolder = function () {
       var modalInstance = $uibModal.open({
         backdrop: 'static',
         keyboard: false,
         "animation": true,
         "templateUrl": 'views/announcements.html',
         "controller": "AnnouncementModalCtrl",
         resolve: {
           items: function () {
             return vm.announcements;
           },
           callback: function(){
             //get userprofile
             return getProfile;
           }
         }
       });
       modalInstance.result.then(function (formData) {
         // console.log('formData:', formData);
 
       }, function (announcements) {
         // console.log('Modal dismissed at: ' + new Date());
         //vm.newAnnouncement = false;
         announcements.forEach(function (el) {
           if (el.ack === null || el.ack === undefined) {
             vm.newAnnouncement = true;
           }else{
             vm.newAnnouncement = false;
           }
         });
       });
     };
 
     function logout() {
     	userServices.logoutUser().then(function (response) {
     		// console.log("logout: ", response);
 	      var loaderDiv = '<div class="loader"></div>';
 	      $(loaderDiv).appendTo('body');
 	      $cookieStore.remove('moback_session');
 	      $cookieStore.remove('moback_share_cookie');
 	      $cookieStore.remove('cookieClassPicked');
         sessionStorage.clear();
 	      userServices.logout();
 	      $timeout(function () {
 	        $('.loader').remove();
 	        window.location.assign('/icr');
 	      }, 1500);
 		});
 	}
 
     //console.log(window.location.host);
     function launchGame() {
        var startGameTrack = {
          "sessionActivity": "GAME_START"
        };
        userServices.startGameTrack(startGameTrack).then(function (response) {
            // console.log("Game Started: ", response);
            if (response.data != null){
              sessionStorage.setItem('startGameTrack', JSON.stringify(response.data));
              window.location.assign('/game/#/main');
            }
 
        });
     }
 
 //Popup to show the game section is disabled
 vm.disabledPopup = disabledPopupModal;
 
     function disabledPopupModal(v){
         var item = "Teacher has disabled the game section";
         vm.shownModal = true;
         var modalInstance = $uibModal.open({
             "animation": true,
             "templateUrl": 'views/modals/okModal.html',
             "backdrop": 'static',
             "controller": "okModalCtrl",
             "size": "sm",
             resolve: {
                 items: function () {
                   return item;
                 }
             }
       });
     }
 
     this.toggleScoreBoard = function () {
       vm.score = (vm.score) ? false : true;
     };
 
 
   });
 //-----------------------------------------MODAL SECTION ------------------------------------------
 //add book to the library
 angular.module('nanhaiMainApp').controller('AnnouncementModalCtrl', function ($scope, $uibModalInstance, items, callback, userServices) {
 
   $scope.announcements = items;
 
   if (items !== undefined) {
     if (items.length !== 0) {
       $scope.isAnnouncement = false;
       for (var i = 0; i < items.length; i++) {
         if (items[i].point === 0) {
           $scope.announcements[i].isPoints = false;
         } else {
           $scope.announcements[i].isPoints = true;
         }
       }
     } else {
       $scope.isAnnouncement = true;
     }
   } else {
     $scope.isAnnouncement = true;
   }
   $scope.readAnnouncement = function (index, announcement) {
     // console.log("read", announcement);
     for (var i = 0; i < $scope.announcements.length; i++) {
       $scope.announcements[i].exapndRead = false;
     }
     $scope.announcements[index].exapndRead = true;
     userServices.getAnnouncementsByAId(announcement.classResp.classId, announcement.id).then(function (response) {
       // console.log(response);
       $scope.announcements[index].ack = response.data.ack;
       //get userprofile
       callback();
     });
     // $scope.exapndRead = true;
   };
 
   $scope.checkNewAnnouncement = function () {
     // console.log($scope.announcements);
     var find = _.find($scope.announcements, function (el) {
       return el.ack === null;
     });
     return typeof find !== 'undefined';
   };
 
   // function isNewAnnouncement(){
   //   userServices.isNewStudentClassAnnouncement().then(function(response){
   //     vm.isNewAnnoucements = response.data;
   //     console.log("vm.isNewAnnoucements", vm.isNewAnnoucements);
   //   });
   // }
 
 
   $scope.submitForm = function () {
     //$uibModalInstance.close($scope.announcements);
   };
 
   $scope.closeModal = function () {
     $uibModalInstance.dismiss($scope.announcements);
   };
 
 });

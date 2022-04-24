 'use strict';
 
 /**
  * @ngdoc service
  * @name nanhaiMainApp.bookServices
  * @description
  * # bookServices
  * Service in the nanhaiMainApp.
  */
 angular.module('nanhaiMainApp')
   .service('userServices', function (endpoints, $q, $cookies, $state, apiService, $uibModal) {
     // AngularJS will instantiate a singleton by calling "new" on this function
     //login
     var usercounter = 0;
     function counting(){
       usercounter++;
       if(usercounter > 120){
         usercounter = 0;
         cachingAnnouncements = "";
         cachingStorageAvatar = "";
         cachingGameProfile = "";
       }
     }
     setInterval(counting,1000);
     this.userLogin = function (userid, password, sessionType) {
       return $q(function (resolve, reject) {
         var toPost = {
           "password": password,
           "userName": userid,
           "sessionType": sessionType
         };
 
         var req = {
           method: 'POST',
           url: endpoints.user + 'login',
           data: toPost
         };
 
         apiService.apiCall(req).then(function (data) {
           var role = '';
           role = data.data.roles[0];
           if (role === 'STUDENT' || role === 'INDIVIDUAL') {
             if (data.data && data.data.authToken) {
               saveToken(data.data, userid);
               resolve(data);
             }
           } else {
             // console.log("You are not student !!");
             var error2 = "You are not student !!";
             messageModal(error2);
           }
         }, function (data) {
           reject(data);
         });
       });
     }; //login
 
     this.logoutUser = function () {
       var req = {
         method: 'DELETE',
         url: endpoints.user + 'logout'
       };
       return apiService.userAPICall(req);
     };
 
     this.startGameTrack = function (gameData) {
       var req = {
         method: 'POST',
         url: endpoints.admin + 'track/start',
         data:gameData
       };
       return apiService.userAPICall(req);
     };
 
     //get user profile
     this.getProfile = function () {
       var req = {
         method: 'GET',
         url: endpoints.user + 'profile'
       };
       return apiService.userAPICall(req);
     };//get user profile
 
     //get Voice Reminder Announcement
     this.getVoiceAnnouncement = function () {
       var req = {
         method: 'GET',
         url: endpoints.school + 'isunreadAssignmentExist'
       };
       return apiService.userAPICall(req);
     };//get Voice Reminder Announcement
 
     /*update user profile*/
     this.updateProfile = function (formData) {
       var req = {
         method: 'POST',
         url: endpoints.user + 'profile',
         data: formData
 
       };
       return apiService.userAPICall(req);
     };
     var cachingAnnouncements;
     this.getAnnouncements = function () {
       var req = {
         method: 'GET',
         url: endpoints.school + 'myclassannouncement'
       };
       if(!cachingAnnouncements) cachingAnnouncements = apiService.userAPICall(req);
       return cachingAnnouncements;
     };
     this.getAnnouncementsByAId = function (classId, announcementId) {
       var req = {
         method: 'GET',
         url: endpoints.school + 'myclassannouncement/' + classId + '/' + announcementId
       };
       return apiService.userAPICall(req);
     };
 
     this.isNewStudentClassAnnouncement = function(){
       var req = {
         method : 'GET',
         url: endpoints.school + 'newclassannouncement'
       };
       return apiService.userAPICall(req);
     };
     //check isLoggedIn
     this.isLoggedIn = function () {
       var teacherMode = (typeof $state.current.data !== "undefined" && $state.current.data.teacherView) ?
         true : false;
       var parentMode = (typeof $state.current.data2 !== "undefined" && $state.current.data2.parentView) ?
         true : false;
       var checkCookies = false;
       if (teacherMode) {
         checkCookies = $cookies.get('nanhaiTeacherSession');
       } else if (parentMode) {
         checkCookies = $cookies.get('nanhaiParentSession');
       } else {
         checkCookies = $cookies.get('nanhaiIndividualSession');
         $cookies.put('bookOrigin', 'openReading');
         checkCookies = "dGl0YW5mb3JjZXwxNTU3MDY3NjAzNjQ1fFtJTkRJVklEVUFMXXwwNDFjN2E1OS1iNjBmLTRhZjgtYWFiOS1jNThiM2NhZTFkY2QuMzhjNDIwMmQ0YWViZmUyOWZjNzE0OWI4MGZlZGM3ZTNmZDMyYzJlZDExMTE0MzY1YWE5NjZmYzc5ZWJlYTY4Zg==";
       }
       return checkCookies;
     };
 
     function saveToken(loginData, userid) {
       if ($cookies.get('nanhaiv4') !== undefined){
         $cookies.put('nanhaiv4','v4',  {path:"/"});
         //var path = 'https://ichinesereader.com/icr/#/';
         $cookies.put('nanhaiIndividualSession', loginData.authToken);
         $cookies.put('nanhaiIndividualUserId', userid , {path: '/'});
         if ($cookies.get('nanhaiRole') === undefined) {
            if ($cookies.get('nanhaiRole') !== 'STUDENT' && $cookies.get('nanhaiRole') !== 'TEACHER' && $cookies.get('nanhaiRole') !== 'ADMIN' && $cookies.get('nanhaiRole') !== 'PARENT') {
              $cookies.remove('nanhaiRole', {path: '/'});
              $cookies.remove('nanhaiRole', {path: '/student'});
            }
            $cookies.put('nanhaiRole', 'STUDENT', {path: '/'});
         }
       }
       else{
         // Remove Old Cookies
         $cookies.remove('nanhaiIndividualSession', loginData.authToken);
         $cookies.remove('nanhaiIndividualUserId', userid , {path: '/'});
         $cookies.remove('nanhaiIndividualSession', {path: '/'});
         $cookies.remove('nanhaiIndividualUserId', {path: '/'});
         $cookies.remove('nanhaiIndividualSession', {path: '/student'});
         $cookies.remove('nanhaiIndividualUserId', {path: '/student'});
         $cookies.remove('nanhaiRole', {path: '/'});
         $cookies.remove('nanhaiRole', {path: '/student'});
         $cookies.remove('trailUserName', {path: '/'});
         // set New cookies
         $cookies.put('nanhaiv4','v4',  {path:"/"});
         $cookies.put('nanhaiIndividualSession', loginData.authToken);
         $cookies.put('nanhaiIndividualUserId', userid , {path: '/'});
       }
     }
 
     this.logout = function () {
       $cookies.remove('nanhaiIndividualSession', {path: '/'});
       $cookies.remove('nanhaiIndividualUserId', {path: '/'});
       $cookies.remove('nanhaiIndividualSession', {path: '/student'});
       $cookies.remove('nanhaiIndividualUserId', {path: '/student'});
       $cookies.remove('nanhaiRole', {path: '/'});
       $cookies.remove('nanhaiRole', {path: '/student'});
       $cookies.remove('trailUserName', {path: '/'});
     };
 
     //for report
 
     this.getReadHistory = function () {
       var req = {
         method: 'GET',
         url: endpoints.admin + 'history'
       };
       return apiService.userAPICall(req);
     };
 
     this.getLeaderBoard = function () {
       var req = {
         method: 'GET',
         url: endpoints.admin + 'leaderboard'
       };
       return apiService.userAPICall(req);
     };
     this.getLeaderBoardByClassId = function (classId) {
       var req = {
         method: 'GET',
         url: endpoints.admin + 'leaderboard/' + classId
       };
       return apiService.userAPICall(req);
     };
 
     var cachingStorageAvatar;
     // avatar
     this.STORAGE_AVATAR = function () {
       var req = {
         method: 'GET',
         url: endpoints.BASE_URL + 'storage/avatar',
       };
       if(!cachingStorageAvatar) cachingStorageAvatar = apiService.userAPICall(req);
       return cachingStorageAvatar;
     };
 
     this.getNewAchievements = function () {
       var req = {
         method: 'GET',
         url: endpoints.user + 'unlocked'
       };
       return apiService.userAPICall(req);
     };
     var cachingGameProfile;
     this.getGameProfile = function () {
       var req = {
         method: 'GET',
         url: endpoints.BASE_URL + 'users/user',
       };
       if(!cachingGameProfile) cachingGameProfile = apiService.userAPICall(req);
       return cachingGameProfile;
     };
 
     this.validateTralIndividual = function (userName) {
       var req = {
         method: 'GET',
         url: endpoints.payment + 'check/' + userName
       };
       return apiService.apiCall(req);
     };
 
 	this.getSubscription = function () {
       var req = {
         method: 'GET',
         url: endpoints.payment
       };
       return apiService.userAPICall(req);
     };
 
     this.updateSubscription = function (formData) {
       var req = {
         method: 'PUT',
         url: endpoints.payment + 'subscription',
         data: formData
       };
 
       return apiService.userAPICall(req);
     };
 
     this.updatePayment = function (formData) {
       var req = {
         method: 'PUT',
         url: endpoints.payment + 'type',
         data: formData
       };
 
       return apiService.userAPICall(req);
     };
 
 	this.convertToPaidUser = function (customerId, braintreeCustomerId) {
       var req = {
         method: 'POST',
         url: endpoints.payment + 'convert',
         data: {
           braintreeCustomerId: braintreeCustomerId,
           customerId: customerId
         }
       };
 
       return apiService.userAPICall(req);
     };
 
     this.convertToPaidUserAfterExpiration = function (customerId, braintreeCustomerId, userName) {
     	// console.log('customerId: ', customerId);
 		// console.log('braintreeCustomerId: ', braintreeCustomerId);
 		// console.log('userName: ', userName);
       var req = {
         method: 'POST',
         url: endpoints.payment + 'convert/' + userName,
         data: {
           braintreeCustomerId: braintreeCustomerId,
           customerId: customerId
         }
       };
 
       return apiService.userAPICall(req);
     };
 
     this.cancelSubscription = function () {
       var req = {
         method: 'POST',
         url: endpoints.payment + 'cancel'
       };
       return apiService.userAPICall(req);
     };
 
     this.getPaymentPlans = function () {
       var req = {
         method: 'GET',
         url: endpoints.payment + 'plans'
       };
 
       return apiService.apiCall(req);
     };
 
     this.getPaymentToken = function (formData) {
       var req = {
         method: 'POST',
         url: endpoints.payment + 'get_token',
         data: formData
       };
 
       return apiService.userAPICall(req);
     };
 
 	this.listTrialPlans = function(){
       var req = {
         method: 'GET',
         url: endpoints.payment + 'trial/plans'
       };
       return apiService.userAPICall(req);
     };
 
 	this.triggerBrainTreePayment = function(userToken, customerId, planSelected, couponCode){
       var req = {
         method: 'POST',
         url: endpoints.payment + 'pay',
         data: {
           token: userToken,
           customerId: customerId,
           planId: planSelected,
           couponCode:couponCode
         }
       };
       return apiService.userAPICall(req);
     };
 
     this.valiateDiscountCode = function (planId, couponCode) {
       var req = {
         method: 'GET',
         url: endpoints.payment + 'validate/' + planId + '/' + couponCode
       };
       return apiService.apiCall(req);
     };
 
     this.requestResetPasswordwithEmail = function (username) {
       var req = {
         method: 'GET',
         url: endpoints.user + 'resetpassword/email/' + username
       };
       return apiService.userAPICall(req);
     };
 
     this.resetPasswordWithAccessCode = function (formData) {
       var req = {
         method: 'POST',
         url: endpoints.user + 'resetpassword/accesscode',
         data: formData
       };
       return apiService.apiCall(req);
     };
 
     this.resetPassword = function (formData, resetToken, username) {
       var req = {
         method: 'POST',
         url: endpoints.user + 'resetpassword/email/' + resetToken + '/' + username,
         data: formData
       };
       return apiService.apiCall(req);
     };
 
 
     //-------------------------send message to common modal----------------------//
     function messageModal(item) {
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
         // console.log('Modal dismissed at: ' + new Date());
       });
     }
 
   });

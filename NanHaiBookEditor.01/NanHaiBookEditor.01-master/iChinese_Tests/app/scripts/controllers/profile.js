 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:ProfileCtrl
  * @description
  * # ProfileCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('ProfileCtrl', function(userServices, $location, $scope, $filter, $uibModal, bookServices, $window, $state, $timeout) {
     var vm = this;
     vm.pinyin = false;
     vm.audio = false;
     vm.dictionary = false;
     /*vm.music      = false;*/
     vm.role = '';
     vm.currentAvatar = {};
     var currentPlanId = '';
     var braintreeSetup = false;
     vm.cancelSubscription = cancelSubscription;
     vm.updatePayment = updatePayment;
     vm.updateSubscription = updateSubscription;
     vm.createSubcription = createSubcription;
     $scope.isDisabled = false;
     vm.progressLevelValue = [];
     $scope.creditInfo;
     $scope.trialAccount;
//console.log("vm-BD - " + vm.birthDay);
     init();
 
     function init() {
       //setup levels
       // $scope.levels = [];
       // for (var i = 0; i < 20; i++) {
       //     var level = {level: (i+1), label: 'Level ' + (i+1)};
       //     $scope.levels.push(level);
       //  	}
       getProfileInfo();
       getSubscription();
       getAvatar();
       getPaymentPlans();
       getProficiencyLevel();
     }
 
     //proficiency level
     function getProficiencyLevel() {
       bookServices.getProficiencyLevel().then(function(response) {
         vm.level = [];
         vm.proficiencyLevel = response.data;
         vm.level = vm.proficiencyLevel;
         // console.log("Level1111", vm.level);
         for (var i = 0; i < vm.proficiencyLevel.length; i++) {
           if (vm.proficiencyLevel[i].intermediate === false && vm.proficiencyLevel[i].hidden === false) {
             vm.progressLevelValue.push(vm.level[i]);
           }
         }
       });
     }
     //getPaymentPlans
     function getPaymentPlans() {
       userServices.getPaymentPlans().then(function(responsePlans) {
         vm.getPaymentPlan = responsePlans.data;
         // console.log("vm.getPaymentPlan", vm.getPaymentPlan);
       });
     }
 
     //getProfileInfo
     function getProfileInfo() {
       userServices.getProfile().then(function(response) {
         if (response.data) {
           // console.log(response.data);
           vm.getProfileInfo = response.data;
           vm.role = response.data.role[0];
           vm.profile = response.data;
           vm.languageSetting = response.data.settings.language;
           vm.pinyin = response.data.settings.pinyin;
           vm.audio = response.data.settings.audio;
           vm.dictionary = response.data.settings.dictionary;
           vm.bilingualSetting = response.data.settings.lang;
           /*vm.music = response.data.settings.music;*/
           vm.firstName = response.data.firstName;
           vm.lastName = response.data.lastName;
           vm.email = response.data.email;
           vm.gender = response.data.gender;
           //vm.birthDay =$filter('date')(response.data.birthDay, 'MM/dd/yyyy');
           vm.bDate = response.data.dateOfBirth;
           if (vm.bDate == null) {
             vm.birthDay = '';
           } else {
             vm.birthDay = $filter('date')(new Date(response.data.dateOfBirth), 'MM/dd/yyyy');
           }
           vm.nickName = response.data.nickName;
           vm.userName = response.data.userName;
           vm.proficiencyLevel = response.data.level;
           // console.log("Level", vm.proficiencyLevel);
           if (response.data.level != null) {
             // console.log("came here");
             for (var l = 0; l < vm.progressLevelValue.length; l++) {
               if (vm.progressLevelValue[l].name === response.data.level) {
                 vm.temp1 = vm.progressLevelValue[l].name;
                 // console.log("Check level", vm.temp1);
               }
             }
           }else{
             // console.log("came here1");
             location.reload();
           }
           vm.proficiencyLevel = vm.temp1;
           vm.UniqueAccessCode = response.data.accessCode;
           //vm.levelSelected = $scope.levels[response.data.level-1];
           vm.startDate = response.data.timestampCreated;
           vm.endDate = response.data.timestampAccountExpiration;
           vm.creditCard = response.data.creditCard;
           $scope.customerId = response.data.customerId;
           $scope.trialAccount = response.data.trial;
           
           // console.log("vm.creditCard", vm.creditCard, $scope.customerId, $scope.trialAccount);
           //Level
           // if(response.data.level !== null){
           //   for(var l=0; l<vm.proficiencyLevel.length;l++){
           //     if(vm.proficiencyLevel[l].name === response.data.book.level.name){
           //       vm.temp = vm.proficiencyLevel[l];
           //     }
           //   }
           //    vm.proficiencyLevel =vm.temp;
           // }
 
           getBrainTreeToken(vm.getProfileInfo); //payment
 
         }
       });
     }
 
     // get Individual subscription
     function getSubscription() {
       userServices.getSubscription().then(function(response) {
         // console.log(response.data);
         if (response.status === 422) {
           $scope.isDisabled = true;
         }
         vm.transactions = response.data.transactions;
         currentPlanId = response.data.currentPlanId;
         // console.log(currentPlanId, "vm.transactions", vm.transactions);
         vm.currentPlanId = response.data.currentPlanId;
       }, function(data) {
         // console.log("data", data);
         if (data.data) {
           if (data.status == 500) {
             var error1 = data.data.error;
             //messageModal(error1);
           }
         }
       });
     }
 
     //update payment
     function updatePayment() {
       var loaderDiv = '<div class="loader"></div>';
       $(loaderDiv).appendTo('body');
       // console.log("To check plans", vm.currentPlanId);
     }
 
     function updateSubscription() {
       //console.log({planId: vm.currentPlanId, couponCode: vm.couponCode});
       //only update subscription if plan changed, or new coupon code
       // console.log("spinner");
       if (currentPlanId != vm.currentPlanId || vm.couponCode) {
         var toPost = {
           planId: vm.currentPlanId
         };
         if (vm.couponCode) {
           toPost.couponCode = vm.couponCode;
         }
         var loaderDiv = '<div class="loader"></div>';
         $(loaderDiv).appendTo('body');
         userServices.updateSubscription(toPost).then(function(data) {
           // console.log(data);
           currentPlanId = vm.currentPlanId;
           // console.log("currentPlanId", currentPlanId);
           getProfileInfo();
           messageModal('Subscription Successfully Updated');
           $('.loader').remove();
         }, function(data) {
           //console.log(data);
           if (data.data && data.status == '422') {
             var error1 = data.statusText;
             messageModal(error1);
             $('.loader').remove();
           }
         });
       }
     }
 
     //get payment token
     function getBrainTreeToken(profileInfo) {
       //only run this function once
       if (braintreeSetup) {
         return;
       }
       braintreeSetup = true;
       // console.log(profileInfo);
       userServices.getPaymentToken(profileInfo).then(function(data) {
         if (data.data.clientToken) {
           // console.log(data.data);
           vm.braintreeCustomerId = data.data.customer.id;
           $scope.creditInfo = profileInfo.creditCard;
           braintree.setup(data.data.clientToken, "dropin", {
             container: "paymentWidget",
             onPaymentMethodReceived: function(obj) {
               //console.log(obj.nonce);
               if (obj.nonce) {
                 if (profileInfo.trial == true) {
                   var loaderDiv = '<div class="loader"></div>';
                   $(loaderDiv).appendTo('body');
                   userServices.triggerBrainTreePayment(obj.nonce, vm.braintreeCustomerId, vm.currentPlanId).then(function(response) {
                     $scope.isDisabled = true; //submit button disabled
                     // console.log("response123", response);
                     if (response.status === 200 && response.data.status == "ACTIVE") {
                       // console.log("Came here 1");
                       var IndcustomerId = response.data.id;
                       //createSubcription(IndcustomerId);
                       userServices.convertToPaidUser(IndcustomerId, vm.braintreeCustomerId).then(function(data) {
                         // console.log("Payment got converted");
                         //$('.loader').remove();
                         $window.location.reload();
                       });
                       // console.log("IndcustomerId", IndcustomerId);
                       $('.loader').remove(); //remove Loader
                     }else{
                       // console.log("Came here 2");
                       messageModal(response.data.message.message);
                       $('.loader').remove(); //remove Loader
                     }
                   }, function(response) {
                     if (response.data && response.data.message) {
                       var error2 = response.data.message.message;
                       messageModal(error2);
                       $('.loader').remove(); //remove Loader
                     }
                   });
                 }
                 // console.log("profileInfo.trial", profileInfo.trial);
                 if (profileInfo.trial !== true) {
                   // console.log("spinner1");
                   var loaderDiv = '<div class="loader"></div>';
                   $(loaderDiv).appendTo('body');
                   userServices.updatePayment({
                     paymentMethodNonce: obj.nonce
                   }).then(function(data) {
                     // console.log(data);
                     getProfileInfo();
                     if (data.status === 200) {
                       messageModal('Payment Method Successfully Updated');
                       $('.loader').remove();
                       $timeout($state.reload, 5000);
                     } else {
                       messageModal(data.data.message);
                       $('.loader').remove();
                       $timeout($state.reload, 5000);
                     }
 
                   }, function(data) {
                     // console.log(data);
                     if (data.data) {
                       if (data.status == '422') {
                         var error1 = data.statusText;
                         messageModal(error1);
                       }
                     }
                   });
                 } else {
                   // console.log("came here");
                   return false;
                 }
               }
             }
           });
         }
       });
     }
 
     function createSubcription(IndcustomerId) {
       // console.log("Convert payment");
       userServices.convertToPaidUser(IndcustomerId, vm.braintreeCustomerId).then(function(data) {
         // console.log("Payment got converted");
       });
     }
 
     // cancel Individual subscription
     function cancelSubscription() {
       var item = "If you cancel your subscription, you will no longer have access to thousands of titles on ichineseReader.com, and may lose all your previous reading records, badges, and points you've earned.";
       var modalInstance = $uibModal.open({
         "animation": true,
         "templateUrl": 'views/modals/cancelSubcription.html',
         "controller": "cancelSubscriptionModalCtrl",
         "size": "sm",
         resolve: {
           items: function() {
             return item;
           }
         }
       });
       modalInstance.result.then(function(data) {
         // console.log(data);
         if (data == "ok") {
           userServices.cancelSubscription().then(function(response) {
             if (response.status = '200') {
               $scope.isDisabled = true;
               var success = "Your subscription is canceled successfully !!";
               messageModal(success);
               var timeout  = setTimeout(function () {
                 window.location.reload();
               }, 3000);
             }
           });
         }
 
       }, function() {
         // console.log('Modal dismissed at: ' + new Date());
       });
 
     }
 
     function getAvatar() {
       userServices.STORAGE_AVATAR().then(function(response) {
         var currentAvatar = {};
         for (var key in response.data) {
           if (response.data[key].length !== 0) {
             for (var i = 0; i < response.data[key].length; i++) {
               if (response.data[key][i].is_equipped === true) {
                 currentAvatar[key] = response.data[key][i];
               };
             }
           };
         }
         vm.currentAvatar = currentAvatar;
         // console.log($scope.currentAvatar.arms.details);
       });
     };
     this.getToggleStatus = function(type) {
       var toggleStatus = false;
       switch (type) {
         /*
         case 'music':
           toggleStatus = vm.music;
           break;*/
 
         case 'audio':
           toggleStatus = vm.audio;
           break;
         case 'pinyin':
           toggleStatus = vm.pinyin;
           break;
         case 'dictionary':
           toggleStatus = vm.dictionary;
           break;
       }
       return (toggleStatus) ? 'switch-on' : 'switch-off';
     };
     this.togglePinyin = function() {
       vm.pinyin = (vm.pinyin) ? false : true;
     };
     this.toggleAudio = function() {
       vm.audio = (vm.audio) ? false : true;
     };
     /*
     this.toggleMusic = function(){
       vm.music = (vm.music) ? false : true;
     };*/
 
     this.toggleDictionary = function() {
       vm.dictionary = (vm.dictionary) ? false : true;
     };
 
     this.updateSettings = function() {
//       var bDte = Date.parse(vm.birthDay);
//console.log(vm.birthDay);
      if (vm.birthDay !== "" && vm.birthDay !== undefined && vm.birthDay !== null) {
//console.log("NotEmpty - " + vm.birthDay);
        var bDte = new Date(vm.birthDay);
        var thisBD = (parseInt(bDte.getMonth()) + 1) + "/" + bDte.getDate() + "/" + bDte.getFullYear();
      } else {
        var thisBD = null;
      }
//console.log("birthDay - " + vm.birthDay);
//console.log("bDte-Month - " + bDte.getMonth());
//console.log("filter-BD" + $filter('date')(vm.birthDay, "MM/dd/yyyy"));
       var formData = {
         "firstName": vm.firstName,
         "lastName": vm.lastName,
         "nickName": vm.nickName,
         "email": vm.email,
         "gender": vm.gender,
//         "birthday": $filter('date')(vm.birthDay, "MM/dd/yyyy"),
         "level": vm.proficiencyLevel,
         "settings": {
           "language": vm.languageSetting,
           "lang": vm.bilingualSetting,
           "pinyin": vm.pinyin,
           "audio": vm.audio,
           "dictionary": vm.dictionary,
           /*"music": vm.music,*/
         }
       };
       if (thisBD !== null) {
         formData.birthday = thisBD;
       }
       userServices.updateProfile(formData).then(function(data) {
         if (data) {
           var success = "Profile updated successfully !!";
           messageModal(success);
           getProfileInfo();
         }
 
       }, function(data) {
         // console.log(data);
       });
     };
 
     vm.worldRank = 199;
     vm.classRank = 3;
     vm.totalPointsEarned = (12535397).toLocaleString(); //toLocaleString() to put (,) within a large number
     vm.defaultLanguage = 'Simple';
     vm.profileImg = 'images/yeoman.png';
 
 
 
     //date popup helper scripts
     $scope.dateOptions = {
       formatYear: 'yy',
       startingDay: 1
     };
     $scope.status = {
       opened: false
     };
     $scope.open = function($event) {
       $scope.status.opened = true;
     };
 
     //send message to common modal
     function messageModal(item) {
       var modalInstance = $uibModal.open({
         "animation": true,
         "templateUrl": 'views/modals/okModal.html',
         "controller": "okModalCtrl",
         "size": "sm",
         resolve: {
           items: function() {
             return item;
           }
         }
       });
       modalInstance.result.then(function() {}, function() {
         // console.log('Modal dismissed at: ' + new Date());
       });
     }
 
   });
 
 //-------------------modal controoler--------------
 angular.module('nanhaiMainApp')
   .controller('okModalCtrl', function($scope, $uibModalInstance, items) {
 
     $scope.getItems = items;
 
     $scope.ok = function() {
       $uibModalInstance.close('ok');
     };
   });
 // cancel subscription modal
 angular.module('nanhaiMainApp')
   .controller('cancelSubscriptionModalCtrl', function($scope, $uibModalInstance, items) {
 
     $scope.subscription = items;
     $scope.ok = function() {
       $uibModalInstance.close('ok');
     };
     $scope.cancel = function() {
       $uibModalInstance.close('cancel');
     };
   });

 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:openCommonProfileController
  * @description
  * # LoginCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('openCommonProfileController', function ($location,$scope) {
     var vm = this;
 
     vm.exitToMain = exitToMain;
     vm.currentAvatar = {};
     $scope.pageLocation = $location.path();
     init();
 
     function init(){
       if(sessionStorage.getItem('booksettings') === null){
         $scope.languageSetting = 'Simplified';
         $scope.bilingualSetting = 'Mandarin';
         $scope.Pinyin = true;
       }else{
         var settings = JSON.parse(sessionStorage.getItem('booksettings'));
         $scope.languageSetting = settings[0].languageSetting;
         $scope.bilingualSetting = settings[1].bilingualSetting;
         $scope.Pinyin = settings[2].Pinyin;
       }
       bookProfileSettings();
     }
 
     function exitToMain(){
       return $location.path('/');
     }
 
     // ---------profile avatar------------------------
 
     function bookProfileSettings(){
 
         vm.languageSetting = $scope.languageSetting;
         vm.bilingualSetting = $scope.bilingualSetting;
         vm.Pinyin = $scope.Pinyin;
         // console.log("vm.languageSetting", vm.languageSetting, "vm.bilingualSetting", vm.bilingualSetting, "vm.Pinyin", vm.Pinyin);
         //if($cookies.get("booksettings") == null){
           var openReadingSettings = [{'languageSetting':vm.languageSetting},{'bilingualSetting':vm.bilingualSetting},{'Pinyin':vm.Pinyin}];
           sessionStorage.setItem("booksettings",JSON.stringify(openReadingSettings));
         //}
     }
     $scope.changeStatus = function(){
       $scope.Pinyin = !$scope.Pinyin;
       vm.Pinyin = $scope.Pinyin;
       // console.log("vm.Pinyin", vm.Pinyin);
       if(sessionStorage.getItem("booksettings") !== null){
         var openReadingSettingValues = [{'languageSetting':vm.languageSetting},{'bilingualSetting':vm.bilingualSetting},{'Pinyin':vm.Pinyin}];
         sessionStorage.setItem("booksettings",JSON.stringify(openReadingSettingValues));
       }
     }
 
     $scope.updatingSettingResponse = function(){
       vm.languageSetting = $scope.languageSetting;
       vm.bilingualSetting = $scope.bilingualSetting;
       //vm.Pinyin = $scope.Pinyin;
       //Pinyin();
 
       // console.log("Value1",vm.languageSetting, "Value2", vm.bilingualSetting, "Value3", vm.Pinyin);
       if(sessionStorage.getItem("booksettings") !== null){
         var openReadingSettingValues = [{'languageSetting':vm.languageSetting},{'bilingualSetting':vm.bilingualSetting},{'Pinyin':vm.Pinyin}];
         sessionStorage.setItem("booksettings",JSON.stringify(openReadingSettingValues));
         $scope.languageSetting = vm.languageSetting;
         $scope.bilingualSetting = vm.bilingualSetting;
         $scope.Pinyin = vm.Pinyin;
       }
     }
 
 
   });

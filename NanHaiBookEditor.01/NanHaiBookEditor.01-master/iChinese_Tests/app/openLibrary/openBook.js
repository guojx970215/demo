 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:OpenBookCtrl
  * @description
  * # OpenBookCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('OpenBookCtrl', function (openBookServices, endpoints, $sce, $state, $stateParams, $cookies, $scope, $timeout, $uibModal,$window) {
 
     var vm = this;
     $cookies.remove('wordMode');
     vm.bookInfo = {};
     vm.bookRespData = {};
     vm.bookProgressInfo = {};
     vm.bookUrl = '';
     vm.wordMode = 'Simplified';
     vm.bilingualLanguage = 'Mandarin';
     vm.showQuiz = showQuiz;
     vm.launchQuiz = launchQuiz;
     vm.bookmarkPage = 0;
    // vm.backgroundMusicPlaying = false;
     vm.voices = false;
     vm.autoplay = false;
     vm.dictionary = false;
     vm.pinyin = false;
     vm.leftNavActive = false;
     vm.bookOrigin = $cookies.get('bookOrigin');
     vm.mode = '';
     vm.textToggle = true;
     vm.pinyinShow = false;
     //vm.voicesShow = false;
     vm.dictionaryShow = false;
     vm.backgroundMusicPlayingShow = false;
     vm.autoplayShow = false;
     vm.showSendBtn = false;
     vm.showShareBtn = false;
     vm.audioUrl= '';
     vm.readComplete = false;
     var self = this;
     vm.microphoneShow = true;
     vm.popUp = false;
     vm.openReadPopUp = openReadPopUp;
     vm.disableButton = false;
     $scope.class = "bookContainer";
     var bookInfoPopupData;
     $scope.intermediateFalse = true;
     //vm.bookReadPoints = true;
     vm.toggleReadApi = true;

     // console.log("Value", $state);
 
       getBookInfo();
 
     var canvas = document.querySelector('.visualizer');
     //var audioCtx = new (window.AudioContext || webkitAudioContext)();
     //var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
     var AudioContext = window.AudioContext || window.webkitAudioContext || false;
     if (AudioContext) {
       // Do whatever you want using the Web Audio API
        var audioCtx = new AudioContext;
       // ...
   } else {
       // Web Audio API is not supported
       //messageModal("Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox for recording feature");
       // console.log("Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox for recording feature");
   }
 
     var canvasCtx = canvas.getContext("2d");
 
     function getBookInfo() {
       addProfileSettings();
     }
 
       function addProfileSettings(){
         var bookId = $stateParams.bookId;
           openBookServices.getOpenBook(bookId).then(function (bookResp) {
 
             vm.bookRespData = bookResp.data.book;
             // console.log("bookResp",bookResp.data.book);
             if(bookResp.data.book.level.intermediate === true){
               $scope.intermediateFalse = true;
             }else{
               $scope.intermediateFalse = false;
             }
             vm.bilingual = bookResp.data.book.bilingual;
             // console.log("vm.bilingual", vm.bookRespData);
           //vm.bilingualLanguage = bookResp.data.book.language;
 
             var bookFeatures = bookResp.data.book.bookFeatures;
             // console.log("bookFeatures", bookResp.data.book.bookFeatures);
             vm.pinyinShow = bookFeatures.pinyin;
             //vm.bilingualLanguage = bookFeatures.voice;
             vm.dictionaryShow = bookFeatures.dictionary;
             vm.backgroundMusicPlayingShow = bookFeatures.bgMusic;
             vm.autoplayShow = bookFeatures.voice;
       		vm.simplifiedOption = bookFeatures.simplified;
       		vm.traditionalOption = bookFeatures.traditional;
 
            $scope.settings = sessionStorage.getItem('booksettings');
            // console.log("settings values", JSON.parse($scope.settings));
            var settingValues = JSON.parse($scope.settings);
            vm.wordMode = settingValues[0].languageSetting;
            vm.bilingualLanguage = settingValues[1].bilingualSetting;
            vm.pinyin = settingValues[2].Pinyin;
            // console.log("vm.wordMode", vm.wordMode, "vm.bilingualLanguage", vm.bilingualLanguage, "vm.pinyin",vm.pinyin);
 
            if (vm.bilingual !== true){
              // console.log("came here to check bilingual");
                if(vm.bilingualLanguage === 'Cantonese'){
                  vm.bilingualLanguage = 'No_audio';
                  vm.voices = false;
                }else{
                  vm.bilingualLanguage = settingValues[1].bilingualSetting;
                  vm.voices = true;
                }
           }else{
                  vm.bilingualLanguage = settingValues[1].bilingualSetting;
           }
 
 
           assignBookInfo(bookResp);
           });
       }
 
 
 
 function openReadPopUp(){
     // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa",bookInfoPopupData);
     bookPointsModal(bookInfoPopupData);
 }
 
     function assignBookInfo(response) {
 
       var bookData = response.data.book;
       vm.bookProgressInfo = response.data;
       delete vm.bookProgressInfo.book;
 
       vm.bookInfo = bookData;
       // console.log("Bookdata", bookData);
       // console.log("bookUrlIframe",bookData.bookContentLink);
       $.ajax({
         type: "GET",
         url: bookData.bookContentLink,
         contentType: "text/html",
         beforeSend: function(xhr, settings){
                 xhr.setRequestHeader('Access-Control-Request-Headers', '');
                 xhr.setRequestHeader("Origin", "*");},
         success: function(data){
 
           //document.getElementById('iframe').src = "data:text/html;charset=utf-8," + escape(html);
             vm.bookBasePath =  bookData.bookContentLink;
             //console.log("bookBasePath",vm.bookBasePath);
             var n = vm.bookBasePath.lastIndexOf("books");
             var s = vm.bookBasePath.substr(0, n);
             var res = data.replace(/\.\.\//g, s+"books/");
 
             var assetUrl = vm.bookBasePath.lastIndexOf("/");
             var k = vm.bookBasePath.substr(0, assetUrl+1);
             localStorage.setItem('bookBasePath',k+"assets");
             var reData = res.replace(/\.\//g, k);
 
             //console.log(reData);
             var iframe = document.getElementById('content-frame');
             var innerDoc = iframe.contentDocument;
             innerDoc.open();
             innerDoc.writeln(reData);
             innerDoc.close();
 
             $('#content-frame').load(function() {
               var aa = innerDoc.getElementById('play-start');
               $(aa).css('background-image', 'url("/images/play_icon.png")');
             });
         }
     });
 
       vm.bookUrl = $sce.trustAsResourceUrl(bookData.bookContentLink);
       //vm.bookUrl = $sce.trustAsResourceUrl('http://localhost:9000/bookSample/content.html'); //use this for localhost testing
       //vm.bookUrl = $sce.trustAsResourceUrl('http://localhost:9000/bookSample/book2/content.html');
 
       $timeout(function () {
         //getBookStats();
         getBookStats();
       }, 2400);
     }
 
     function getBookStats() {
       $('.loader').remove();
       // console.log("came to stats",vm.bilingualLanguage);
       var bookIframe = openBookServices.getChildIframe();
       if (vm.currentPage !== undefined) {
         bookIframe.gotoPage(vm.currentPage);
       }
       var textDisplay = "s";
       if (vm.wordMode === "Simplified") {
         textDisplay = "s";
       }else if(vm.wordMode === "Traditional"){
         textDisplay = "t";
       }else{
           vm.textToggle = false;
       }
 
       var LanguageDisplay = "m";
       if (vm.bilingualLanguage === "Mandarin") {
         LanguageDisplay = "m";
         var bookIframe = openBookServices.getChildIframe();
         var assetUrl = vm.bookBasePath.lastIndexOf("/");
         var k = vm.bookBasePath.substr(0, assetUrl+1);
         // console.log("path",k);
         bookIframe.fReadToggle(false,k);
         bookIframe.fLangToggle('m');
       }else if(vm.bilingualLanguage === "Cantonese"){
         LanguageDisplay = "c";
         var bookIframe = openBookServices.getChildIframe();
         var assetUrl = vm.bookBasePath.lastIndexOf("/");
         var k = vm.bookBasePath.substr(0, assetUrl+1);
         // console.log("path",k);
         bookIframe.fReadToggle(false,k);
         bookIframe.fLangToggle('c');
       }
       if(vm.bilingualLanguage !== "No_audio"){
         vm.voices = true;
       }
       else{
         vm.voices = false;
       }
 
 
       /*if(self.currentPage > 0 && vm.voices) {
         $('#innerBook').contents().find('#play-overlay').hide();
       }*/
       //initialize book
       bookIframe.init(
         vm.bookInfo.bookTitle,  //simplified book title
         vm.bookInfo.bookTitle,  //traditional book title
         //vm.backgroundMusicPlaying, //background music
         false,
         vm.voices, //audio voice toggle
         vm.autoplay, //autoplay toggle
         vm.textToggle, //text toggle
         textDisplay, //text display, s or t
         vm.pinyin, //text pinyin
         vm.dictionary //dictionary toggle
 
       );
 
     //console.log("LanguageDisplay", LanguageDisplay);
     //document.body.style.zoom = 0.6;
 
       vm.currentPage  = bookIframe.getPage();
 
       vm.pageTotal    = bookIframe.getTotalPage();
     }
 
     this.getToggleStatus = function (type) {
       var toggleStatus = false;
 
       switch (type) {
        /*
         case 'music':
          toggleStatus = vm.backgroundMusicPlaying;
          break;*/
 
         case 'voice':
           toggleStatus = vm.voices;
           break;
         case 'pinyin':
           toggleStatus = vm.pinyin;
           break;
         case 'autoplay':
           toggleStatus = vm.autoplay;
           break;
         case 'dictionary':
           toggleStatus = vm.dictionary;
           break;
         case 'autoFit':
           toggleStatus = vm.autoFit;
           break;
       }
       return (toggleStatus) ? 'fa-toggle-on' : 'fa-toggle-off';
     };
 
     this.gotoFirstPage = function () {
 
       var bookIframe = openBookServices.getChildIframe();
       bookIframe.goFirstPage();
     };
 
     this.gotoLastPage = function () {
       var bookIframe = openBookServices.getChildIframe();
       bookIframe.goLastPage();
     };
 
     this.simplified = function () {
       var bookIframe = openBookServices.getChildIframe();
       bookIframe.showText('s');
       vm.wordMode = 'Simplified';
       // console.log("Simplified");
     };
 
     this.traditional = function () {
       var bookIframe = openBookServices.getChildIframe();
       bookIframe.showText('t');
       vm.wordMode = 'Traditional';
       // console.log("Traditional");
     };
 
 
     this.turnOffWords = function () {
       var bookIframe = openBookServices.getChildIframe();
       bookIframe.hideText();
       vm.wordMode = 'No text';
       // console.log("No text");
     };
 
     this.updateWordMode = function () {
       switch (vm.wordMode) {
         case 'Simplified':
           vm.simplified();
           break;
         case 'Traditional':
           vm.traditional();
           break;
         case 'No text':
           vm.turnOffWords();
           break;
       }
         if(vm.wordMode === 'No text'){
           $cookies.put('wordMode', 'Simplified');
         }else{
         $cookies.put('wordMode', vm.wordMode);
       }
     };
 
   this.mandarin = function () {
 
       var bookIframe = openBookServices.getChildIframe();
       bookIframe.fLangToggle('m');
       vm.bilingualLanguage = 'Mandarin';
     };
 
     this.cantonese = function () {
       var bookIframe = openBookServices.getChildIframe();
       bookIframe.fLangToggle('c');
       vm.bilingualLanguage = 'Cantonese';
     };
 
 
 
   this.updateBilingualLanguage = function () {
       switch (vm.bilingualLanguage) {
         case 'Mandarin':
           vm.toggleVoice();
           vm.mandarin();
           break;
         case 'Cantonese':
           vm.toggleVoice();
           vm.cantonese();
           break;
           case 'No_audio':
             vm.toggleVoice();
             break;
       }
     };
 
     this.togglePinyin = function () {
       vm.pinyin = (vm.pinyin) ? false : true;
 
       var bookIframe = openBookServices.getChildIframe();
       if (vm.pinyin) {
         bookIframe.showPinyin();
       } else {
         bookIframe.hidePinyin();
       }
     };
 
     this.toggleAutoFit = function () {
       vm.autoFit = (vm.autoFit) ? false : true;
       if (vm.autoFit){
         $scope.class="bookContainer autoFit";
         $scope.iframeClass ="iframeClass";
       }
       else{
         $scope.class="bookContainer";
         $scope.iframeClass ="";
       }
     };
 
     this.toggleDictionary = function () {
       vm.dictionary = (vm.dictionary) ? false : true;
 
       var bookIframe = openBookServices.getChildIframe();
       if (vm.dictionary) {
         bookIframe.showDict();
       } else {
         bookIframe.hideDict();
       }
     };
 
     this.toggleAutoPlay = function () {
       vm.autoplay = (vm.autoplay) ? false : true;
 
       var bookIframe = openBookServices.getChildIframe();
       if (vm.autoplay) {
         bookIframe.autoplayOn();
       } else {
         bookIframe.autoplayOff();
       }
     };
 
 
     this.toggleVoice = function () {
       // console.log("vm.bilingualLanguage",vm.bilingualLanguage);
       if (vm.bilingualLanguage !== 'No_audio'){
         vm.voices = true;
       }
       else{
         //console.log("else NoAudio",vm.bilingualLanguage);
         vm.voices = false;
       }
       //vm.bilingualLanguage = 'No_audio';
       //vm.voices = (vm.voices) ? false : true;
       var bookIframe = openBookServices.getChildIframe();
       if (vm.voices) {
       //	console.log('bookAudio: ', bookAudio);
       	if(bookAudio === true){
       		bookIframe.readOn();
       	}else{
       		bookIframe.readOff();
       	}
       } else {
         bookIframe.readOff();
       }
     };
 
     this.pageChanged = function () {
 
       var bookIframe = openBookServices.getChildIframe();
       bookIframe.gotoPage(self.currentPage);
     };
 
     this.gotoNextPage = function () {
       if (self.currentPage < self.pageTotal) {
         self.currentPage++;
         var bookIframe = openBookServices.getChildIframe();
         bookIframe.gotoPage(self.currentPage);
       }
 
     };
 
 
 
     this.gotoPrevPage = function () {
       if (self.currentPage > 1) {
         self.currentPage--;
         var bookIframe = openBookServices.getChildIframe();
         bookIframe.gotoPage(self.currentPage);
       }
     };
 
     this.isLeftNavActive = function () {
       if (vm.leftNavActive) {
         return 'is-active';
       }
     };
 
     this.toggleLeftNav = function () {
 
       vm.leftNavActive = (vm.leftNavActive) ? false : true;
     };
 
     this.exit = function () {
 
       	audioCtx.close().then(function() {
         	//console.log("audioCtx closed");
 
         	var loaderDiv = '<div class="loader"></div>';
       		$(loaderDiv).appendTo('body');
           //$('.loader').remove();
       	});
       	 exitToLibrary();
         // return;
         //$state.go('openLibrary');
     };
 
     function exitToLibrary() {
       	var origin = $cookies.get('bookOrigin');
         var minibook = $cookies.get('miniBook');
         // console.log("minibook",minibook);
         	//window.close();
           $state.go(origin);
     }
 
     function showQuiz() {
        if (vm.bookProgressInfo.quizAvailable) {
         if (vm.bookProgressInfo.readComplete || teacherMode) {
           return true;
         }
         //if (vm.pageTotal) {
           if (vm.readComplete) {
             return true;
           }
         //}
       }
       return false;
     }
 
     function launchQuiz() {
 
        audioCtx.close().then(function() {
        // console.log("audioCtx closed");
       });
       var bookId = $stateParams.bookId;
 
       if (vm.bookProgressInfo.readComplete || vm.readComplete) {
         // console.log(vm.bookProgressInfo); //return false;
           $state.go('openBookQuiz', {bookId: bookId});
       }
     }
 
     //setup update page parent listener
     window.updatePage = function (page, total) {
       // console.log("curPage::",page,"Total:",total);
       vm.currentPage = page;
       vm.pageTotal = total;
 
 
 
       if (page === total) {
         vm.popUp = true;
           var bookId = $stateParams.bookId;
           var progress = Math.round((vm.currentPage / vm.pageTotal) * 100); //pass percentage reading value to book read api
 
              if (vm.toggleReadApi && ($cookies.get('miniBook') !== "true")) {
                 if(progress === 100){
                       openBookServices.readOpenBook(bookId, progress).then(function (response) {
                       //console.log("quizExists",response);
                       var quizExists = vm.bookRespData.quiz;
                       // console.log("Book", vm.bookRespData);
                       if (quizExists){
                         var quizUrl = vm.bookRespData.quizLinkUrl;
                       }
                       bookInfoPopupData = {"data":response,"bookId":bookId,"quiz":quizExists,"quizUrl":quizUrl};
                       //vm.bookReadPoints = false;
                     }).finally(function () {
                     //console.log("updated read percentage for non-assignment book");
                       vm.popUp = true;
                       vm.readComplete = true;
                     });
                 }
                 vm.toggleReadApi = false;
                }
       }
 
       $scope.$apply();
     };
 
     //send message to common modal
     function messageModal(item){
       var modalInstance = $uibModal.open({
           "animation": true,
           "templateUrl": 'openLibrary/views/modals/okModal.html',
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
 
     //Book OpenPopup
     function bookPointsModal(item){
       // console.log("Book point Item", item);
       var modalInstance = $uibModal.open({
           "animation": true,
           "templateUrl": 'openLibrary/views/modals/openBookPoints.html',
           "controller": "openBookPointsModalCtrl",
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
 
 
     //Add recording To Book
 	$('.record_wrapper').hide();
 	var bookAudio = true;
 	this.addRecording = function () {
 
 		if(!vm.recordData || !isAudio){
 			if(!vm.isPlay){
 			  	if(bookAudio === true){
 			  	//	console.log('iffff: ', bookAudio);
 		        	$('.record_icon').addClass('disabled');
 		        	$('.record_wrapper').fadeIn();
 
 		        	var bookIframe = openBookServices.getChildIframe();
 		        	bookIframe.pauseRead();
 		        	bookAudio = false;
 
 			  	}else{
 			  		//console.log('elseeeee: ', bookAudio);
 			  		$('.record_wrapper').fadeOut();
 			    	$('.record_icon').removeClass('disabled');
 
 			   		var bookIframe = openBookServices.getChildIframe();
 			    	bookIframe.resumeRead();
 			    	bookAudio = true;
 			  	}
 			}
 		}
 		// console.log('vm.recordData: ', vm.recordData);
 		// console.log('isAudio: ', isAudio);
 		// console.log('playyyyy: ', vm.isPlay);
 	};
 
 
     //-------------------RECORDING----------------------
 
 
     var mediaRecorder;
     var vm = this;
     var bookId = $stateParams.bookId;
     vm.isPlay = false;
     vm.recordData = "";
 
 
 //Book Autofit
 angular.element(document).ready(function () {
   pageScale();
   //console.log("resize by default");
     $(window).on("resize", function(){
         pageScale();
       //console.log("resize on resize");
     });
 });
   function pageScale() {
 
       var hScale = $(window).height() / 984;
       hScale = hScale.toFixed(2) - 0.02;
       //console.log('hScale',hScale);
       $(".bookContainer").css('transform', 'scale('+hScale+')');
       var pageTopFix = ((984 * hScale) - 984)/2;
       //console.log('pageTopFix',pageTopFix);
       $(".bookContainer").css("top", pageTopFix-10);
   }
 
 
  });
 
 
 // The configuration below will disable the close on [ESC / click outside] for all modals.
 
 angular.module('ui.bootstrap').config(function ($provide) {
     $provide.decorator('$uibModal', function ($delegate) {
         var open = $delegate.open;
 
         $delegate.open = function (options) {
             options = angular.extend(options || {}, {
                 backdrop: 'static',
                 keyboard: false
             });
 
             return open(options);
         };
         return $delegate;
     })
 });

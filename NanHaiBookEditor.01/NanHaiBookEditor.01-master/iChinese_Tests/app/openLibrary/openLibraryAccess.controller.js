 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:openLibraryAccessCtrl
  * @description
  * # openLibraryAccessCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('openLibraryAccessCtrl', function ($http,openBookServices, $scope, $location, $cookies, $filter, $state,
   														$uibModal) {
 
     var vm = this;
     var leftNavActive = false;
     vm.books = [];
     vm.folders = [];
     vm.folderSelected = '';
     vm.filterData = {};
     vm.isLeftNavActive = isLeftNavActive;
     vm.toggleLeftNav = toggleLeftNav;
     vm.exitToMain = exitToMain;
     vm.readBook = readBook;
     vm.gotoQuiz = gotoQuiz;
     vm.pagePath = '';
     vm.proficiencyLevel = [];
     vm.InterestLevel = [];
     vm.FilterLevel = [];
     $scope.selectedProficiency = [];
     $scope.selectedInterestLevel = [];
     $scope.selectedTextTypes = [];
     $scope.selectedSeries     = [];
     $scope.selectedSeriesArr  = [];
     $scope.selectedTopics = [];
     $scope.selectedProgram = [];
 
     if (sessionStorage.getItem("openReadingFilter") == null ){
 
         var openReadingFilter = [{'searchKeyword':''},{'proficiencyLevel':''},{'interestLevel':''},
         {'textType':''},{'series':''},{'topics':''},{'programFilter':''}];
         sessionStorage.setItem("openReadingFilter",JSON.stringify(openReadingFilter));
     }
     else{
       $scope.openReadingFilter = sessionStorage.openReadingFilter;
     }
     //vm.nextPage = nextPage;
     init();
 
 // start of search and remove
     $scope.clearAll = function(){
       $scope.searchKeyword = '';
       var Keyword = JSON.parse(sessionStorage.openReadingFilter);
       Keyword[0].searchKeyword = '';
       sessionStorage.setItem("openReadingFilter",JSON.stringify(Keyword));
       clear();
     };
 
   $scope.removeAll = function(){
     var Keyword = $scope.searchKeyword;
     if (Keyword.length == 0){
       clear();
     }
   };
   function clear(){
       vm.filterData.query = '';
       vm.page = 0;
       var searchKeyword = JSON.parse(sessionStorage.openReadingFilter);
       searchKeyword[0].searchKeyword = $scope.searchKeyword;
       sessionStorage.setItem("openReadingFilter",JSON.stringify(searchKeyword));
       getOpenLibraryBooks();
   }
 
 // End of search and remove
 
     vm.isEmptyObject = function (obj) {
       return $.isEmptyObject(obj);
     };
 
     function init() {
       vm.pagePath = $location.path();
       //pagination
       vm.items = [];
       vm.busy = false;
       vm.page = 0;
       vm.prevPage = 0;
       vm.limit = 20;
       vm.isClickEnable = true;
       vm.sortField = '';
       getOpenLibraryBooks();
 
       /*get interest level*/
       //vm.interests = [];
       openBookServices.getInrestLevel().then(function (response) {
         vm.interests = response.data;
         // console.log("vm.interests",vm.interests);
       });
 
       /*get Text type*/
       openBookServices.getTextType().then(function (response) {
         vm.textCategories = response.data;
       });
 
       /*get series */
       openBookServices.getSeries().then(function (response) {
         vm.serieses = response.data;
       });
       /*get topics */
       openBookServices.getTopics().then(function (response) {
         vm.topics = response.data;
       });
       /*get programTypes */
       openBookServices.getProgramTypes().then(function (response) {
         vm.programypes = response.data;
       });
       // get proficiencies
       openBookServices.getProficiencyLevel().then(function (response) {
         vm.proficiencies = response.data;
         // console.log("vm.proficiencies",vm.proficiencies);
       });
 
       if (sessionStorage.openReadingFilter != null){
         var Keyword = JSON.parse(sessionStorage.openReadingFilter);
         // console.log(Keyword[0].searchKeyword);
           if (Keyword[0].searchKeyword != ''){
             vm.filterData.query = Keyword[0].searchKeyword;
             $scope.searchKeyword = Keyword[0].searchKeyword;
             vm.page = 0;
 
           }
           getOpenLibraryBooks();
       }
 
       // session for proficiencyLevel
       if (sessionStorage.openReadingFilter != null){
         if ((sessionStorage.openReadingFilter).length != 0 ){
           var parsedProficiencyLevel = JSON.parse(sessionStorage.openReadingFilter);
           if (parsedProficiencyLevel[1].proficiencyLevel != ''){
             $scope.selectedProficiency = parsedProficiencyLevel[1].proficiencyLevel;
             vm.filterData.proficiencyLevel = $scope.selectedProficiency;
           }
           getOpenLibraryBooks();
        }
       }
 
       // session for InterestLevel
       if (sessionStorage.openReadingFilter != null){
         if ((sessionStorage.openReadingFilter).length != 0){
           var parsedInterestLevel = JSON.parse(sessionStorage.openReadingFilter);
           if (parsedInterestLevel[2].interestLevel != ''){
             $scope.selectedInterestLevel = parsedInterestLevel[2].interestLevel;
             vm.filterData.interestLevel = $scope.selectedInterestLevel;
 
           }
           getOpenLibraryBooks();
         }
       }
 
       // session for textType
       if (sessionStorage.openReadingFilter != null){
         if ((sessionStorage.openReadingFilter).length != 0){
           var parsedtextType = JSON.parse(sessionStorage.openReadingFilter);
           if (parsedtextType[3].textType != ''){
             $scope.selectedTextTypes = parsedInterestLevel[3].textType;
             vm.filterData.textType = $scope.selectedTextTypes;
           }
           getOpenLibraryBooks();
         }
       }
 
       // session for series
       if (sessionStorage.openReadingFilter != null){
         if ((sessionStorage.openReadingFilter).length != 0){
           var parsedseries = JSON.parse(sessionStorage.openReadingFilter);
           if (parsedseries[4].series != ''){
             $scope.selectedSeriesArr = parsedseries[4].series;
             vm.filterData.seriesId = parsedseries[4].series;
             for (var i=0;i<parsedseries[4].series.length;i++){
               $scope.selectedSeries.push(parsedseries[4].series[i].id);
             }
           }
           getOpenLibraryBooks();
         }
       }
 
       // session for topics
       if (sessionStorage.openReadingFilter != null){
         if ((sessionStorage.openReadingFilter).length != 0){
           var parsedtopics = JSON.parse(sessionStorage.openReadingFilter);
           if (parsedtopics[5].topics != ''){
             // console.log(parsedtopics[5].topics);
             $scope.selectedTopics = parsedtopics[5].topics;
             vm.filterData.topics = $scope.selectedTopics;
           }
           getOpenLibraryBooks();
         }
       }
       // session for programFilter
       if (sessionStorage.openReadingFilter != null){
         if ((sessionStorage.openReadingFilter).length != 0){
           var parsedprogramFilter = JSON.parse(sessionStorage.openReadingFilter);
           if (parsedprogramFilter[6].programFilter != ''){
             // console.log(parsedprogramFilter[6].programFilter);
             $scope.selectedProgram = parsedprogramFilter[6].programFilter;
             vm.filterData.programType = $scope.selectedProgram;
           }
           getOpenLibraryBooks();
         }
       }
 
     }
 
     /*init*/
     $(document).on("shown.bs.collapse hidden.bs.collapse", ".panel-collapse", function (e) {
       $(e.target)
         .prev('.panel-heading')
         .find("i.indicator")
         .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
 
     });
     //----------Search text-------------------------
       $scope.count = 0;
       $scope.searchQuery = function() {
         $scope.count++;
         vm.filterData.query = $scope.searchKeyword;
         vm.page = 0;
         var searchKeyword = JSON.parse(sessionStorage.openReadingFilter);
         searchKeyword[0].searchKeyword = $scope.searchKeyword;
         sessionStorage.setItem("openReadingFilter",JSON.stringify(searchKeyword));
         getOpenLibraryBooks();
       };
 
     // ---------proficiency level filter--------------
 
     //$scope.selectedProficiencyArr   = [];
     $scope.setProficiencyFilter = function (item) {
         var pos = $scope.selectedProficiency.indexOf(item.name);
           vm.page = 0;
           vm.isClickEnable = false;
           var proficiencyLevel = JSON.parse(sessionStorage.openReadingFilter);
         if (pos == -1) {
             var level = item.name;
             $scope.selectedProficiency.push(level);
             vm.filterData.proficiencyLevel = $scope.selectedProficiency;
             proficiencyLevel[1].proficiencyLevel = $scope.selectedProficiency;
             sessionStorage.setItem("openReadingFilter",JSON.stringify(proficiencyLevel));
             getOpenLibraryBooks();
         } else {
           $scope.selectedProficiency.splice(pos, 1);
           proficiencyLevel[1].proficiencyLevel.splice(pos,1);
           sessionStorage.setItem("openReadingFilter",JSON.stringify(proficiencyLevel));
           getOpenLibraryBooks();
         }
     };
     // ---------Interest level filter--------------
 
     $scope.setInterestsFilter = function (item) {
       var pos = $scope.selectedInterestLevel.indexOf(item.displayName);
         //vm.limit = 0;
         vm.page = 0;
         vm.isClickEnable = false;
         var interestLevel = JSON.parse(sessionStorage.openReadingFilter);
       if (pos == -1) {
         $scope.selectedInterestLevel.push(item.displayName);
         interestLevel[2].interestLevel = $scope.selectedInterestLevel;
         vm.filterData.interestLevel = $scope.selectedInterestLevel;
         sessionStorage.setItem("openReadingFilter",JSON.stringify(interestLevel));
         getOpenLibraryBooks();
       } else {
         $scope.selectedInterestLevel.splice(pos, 1);
         interestLevel[2].interestLevel.splice(pos,1);
         sessionStorage.setItem("openReadingFilter",JSON.stringify(interestLevel));
         getOpenLibraryBooks();
       }
      // console.log('selected: ', $scope.selectedInterestLevel);
     };
     // ---------Text types filter textType--------------
     $scope.setTextTypeFilter = function (item) {
       var pos = $scope.selectedTextTypes.indexOf(item);
       vm.page = 0;
       vm.isClickEnable = false;
       var textType = JSON.parse(sessionStorage.openReadingFilter);
       if (pos == -1) {
         $scope.selectedTextTypes.push(item);
         vm.filterData.textType = $scope.selectedTextTypes;
         textType[3].textType = $scope.selectedTextTypes;
         sessionStorage.setItem("openReadingFilter",JSON.stringify(textType));
         getOpenLibraryBooks();
       } else {
         $scope.selectedTextTypes.splice(pos, 1);
         textType[3].textType.splice(pos,1);
         sessionStorage.setItem("openReadingFilter",JSON.stringify(textType));
         getOpenLibraryBooks();
       }
     };
     $scope.checkSubcategoryExist = function (category) {
       return category.subFilter.length > 0 ? true : false;
     };
 
     // ---------series level filter--------------
 
 
     $scope.setSeriesFilter = function (item) {
         var pos = $scope.selectedSeries.indexOf(item.id);
         //vm.limit = 0;
         vm.page = 0;
         vm.isClickEnable = false;
       var series = JSON.parse(sessionStorage.openReadingFilter);
         if (pos == -1) {
               $scope.selectedSeries.push(item.id);
               $scope.selectedSeriesArr.push(item);
               vm.filterData.seriesId = $scope.selectedSeries;
               series[4].series = $scope.selectedSeriesArr;
               sessionStorage.setItem("openReadingFilter",JSON.stringify(series));
               getOpenLibraryBooks();
         } else {
             $scope.selectedSeries.splice(pos, 1);
              $scope.selectedSeriesArr.splice(pos, 1);
              series[4].series.splice(pos,1);
              sessionStorage.setItem("openReadingFilter",JSON.stringify(series));
              getOpenLibraryBooks();
         }
 
     };
     // ---------topics level filter--------------
 
     $scope.setTopicsFilter = function (item) {
       //console.log('item',item);
       var pos = $scope.selectedTopics.indexOf(item);
       vm.page = 0;
       vm.isClickEnable = false;
       var topics = JSON.parse(sessionStorage.openReadingFilter);
       if (pos == -1) {
         $scope.selectedTopics.push(item);
         vm.filterData.topics = $scope.selectedTopics;
         topics[5].topics = $scope.selectedTopics;
         sessionStorage.setItem("openReadingFilter",JSON.stringify(topics));
         getOpenLibraryBooks();
       } else {
         $scope.selectedTopics.splice(pos, 1);
         topics[5].topics.splice(pos,1);
         sessionStorage.setItem("openReadingFilter",JSON.stringify(topics));
         getOpenLibraryBooks();
       }
     };
     // ---------program type filter--------------
 
     $scope.setProgramFilter = function (item) {
       //console.log('item',item);
       var pos = $scope.selectedProgram.indexOf(item.displayName);
       //vm.limit = 0;
       vm.page = 0;
       vm.isClickEnable = false;
       var programFilter = JSON.parse(sessionStorage.openReadingFilter);
       if (pos == -1) {
         $scope.selectedProgram.push(item.displayName);
         vm.filterData.programType = $scope.selectedProgram;
         programFilter[6].programFilter = $scope.selectedProgram;
         sessionStorage.setItem("openReadingFilter",JSON.stringify(programFilter));
         getOpenLibraryBooks();
       } else {
         $scope.selectedProgram.splice(pos, 1);
         programFilter[6].programFilter.splice(pos,1);
         sessionStorage.setItem("openReadingFilter",JSON.stringify(programFilter));
         getOpenLibraryBooks();
       }
 
     };
 
     $scope.clearFilter = function (filter, item, origin,key) {
       //vm.limit = 0;
       vm.page = 0;
       if(origin == "series"){
         var pos = $scope.selectedSeries.indexOf(item.id);
         var series = JSON.parse(sessionStorage.openReadingFilter);
         var position = series[4].series.indexOf(item.id);
         series[4].series.splice(position,1);
         sessionStorage.setItem("openReadingFilter",JSON.stringify(series));
         filter.splice(filter.indexOf(item.id), 1);
         $scope.selectedSeries.splice(filter.indexOf(item), 1);
         //vm.filterData.proficiencyLevel = proficiencyLevel[0].proficiencyLevel.splice(pos,1);
       }else{
         var openReadingFilter = JSON.parse(sessionStorage.openReadingFilter);
         if (key == 'proficiencyLevel'){
           var proficiencyLevel = JSON.parse(sessionStorage.openReadingFilter);
           var position = proficiencyLevel[1].proficiencyLevel.indexOf(item);
           proficiencyLevel[1].proficiencyLevel.splice(position,1);
           sessionStorage.setItem("openReadingFilter",JSON.stringify(proficiencyLevel));
           filter.splice(filter.indexOf(item), 1);
         }
         if (key == 'interestLevel'){
           // console.log(filter);
           var interestLevel = JSON.parse(sessionStorage.openReadingFilter);
           var position = interestLevel[2].interestLevel.indexOf(item);
           interestLevel[2].interestLevel.splice(position,1);
           sessionStorage.setItem("openReadingFilter",JSON.stringify(interestLevel));
           filter.splice(filter.indexOf(item), 1);
 
         }
         if (key == 'textType'){
           var textType = JSON.parse(sessionStorage.openReadingFilter);
           var position = textType[3].textType.indexOf(item);
           textType[3].textType.splice(position,1);
           sessionStorage.setItem("openReadingFilter",JSON.stringify(textType));
           filter.splice(filter.indexOf(item), 1);
         }
         if (key == 'topics'){
           var topics = JSON.parse(sessionStorage.openReadingFilter);
           var position = topics[5].topics.indexOf(item);
           topics[5].topics.splice(position,1);
           sessionStorage.setItem("openReadingFilter",JSON.stringify(topics));
           filter.splice(filter.indexOf(item), 1);
         }
         if (key == 'programType'){
           var programFilter = JSON.parse(sessionStorage.openReadingFilter);
           var position = programFilter[6].programFilter.indexOf(item);
           programFilter[6].programFilter.splice(position,1);
           sessionStorage.setItem("openReadingFilter",JSON.stringify(programFilter));
           filter.splice(filter.indexOf(item), 1);
         }
 
       }
       getOpenLibraryBooks();
     };
 
     //select all books
     $scope.checkAll = function () {
       if ($scope.selectedAll) {
         $scope.selectedAll = true;
       } else {
         $scope.selectedAll = false;
       }
 
       for (var i = 0; i < vm.books.length; i++) {
         vm.books[i].book.selected = $scope.selectedAll;
       }
 
     };
     function isLeftNavActive() {
       if (leftNavActive) {
         return 'is-active';
       }
     }
 
     function toggleLeftNav() {
       leftNavActive = (leftNavActive) ? false : true;
     }
 
     function exitToMain() {
       return $location.path('/');
     }
 
     function readBook(book) {
       $cookies.put('bookOrigin', 'openLibrary');
       $state.go('openBook', {bookId: book.bookId});
     }
 
     function gotoQuiz(book) {
       // detect browser Disable Back button.
       window.addEventListener('popstate', function(event,data) {
       history.pushState("jibberish", null, null);
       window.onpopstate = function () {
       history.pushState('newjibberish', null, null);
         // disabled Backbutton, user has to click on exit only
           };
       });
       $cookies.put('bookOrigin', 'openLibrary');
       $state.go('openBookQuiz', {bookId: book.bookId});
 
     }
 
     //disable button
     $scope.bookSelected = function () {
       var count = 0;
       angular.forEach(vm.books, function (books) {
         if (books.book.selected) count++;
       });
       return count;
     };
 
     //page scroll
     $(window).scroll(function() {
       //console.log('Reached bottom');
        if (vm.limit!== 0 && vm.page!== 0 && $state.current.url == "/libraryAccess/openLibraryBooks") {
         //console.log( $(window).scrollTop()+$("#bookList").height(), $(document).height() );
         // if($(window).scrollTop() == $(document).height() - $(window).height()) {
          if(($(window).scrollTop() + $(window).innerHeight()) >= $(document).height()-100) {
                  //console.log('Reached bottom-','Prev Page:',vm.prevPage,'Current Page:',vm.page);
                  if (vm.prevPage !== vm.page) {
                   getOpenLibraryBooks();
                   //console.log('call api');
                 }
 
           }
        }
 
        //scroll top
        if ($(this).scrollTop() > 1000) {
             $('.scrollup').fadeIn();
         } else {
             $('.scrollup').fadeOut();
         }
     });
     //scroll top on click
     $('.scrollup').click(function () {
         $("html, body").animate({
             scrollTop: 0
         }, 800);
         return false;
     });
 
     function getOpenLibraryBooks() {
      if (vm.busy) return;
       vm.busy = true;
       if (vm.page == 0) {
         var loaderDiv = '<div class="loader"></div>';
         $(loaderDiv).appendTo('body');
       }
 
       vm.isClickEnable = false;
       // console.log(vm.filterData);
 
       openBookServices.getOpenLibraryBooks(vm.filterData,vm.limit,vm.page,vm.sortField).then(function (response) {
         $('.loader').remove();
         $scope.selectedAll = false; // Select All unchecked
 
         var items = response.data;
         // console.log("Book Items", items);
         if (vm.limit!== 0 && vm.page!== 0) {
           if (items.length === 0){ vm.busy = false; vm.prevPage = vm.page; return; }
           for (var i = 0; i < items.length; i++) {
             vm.books.push(items[i]);
           }
         }else{
           vm.books = items;
         }
 
         if (items.length !== 0) { vm.prevPage = vm.page; vm.page = ++vm.page; }
 
         vm.busy = false;
         vm.isClickEnable = true;
 
       }.bind($scope));
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
 
 
   });

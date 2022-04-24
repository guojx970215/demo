   'use strict';
   
   /**
    * @ngdoc function
    * @name nanhaiMainApp.controller:progressReadingCtrl
    * @description
    * # LibraryCtrl
    * Controller of the nanhaiMainApp
    */
   angular.module('nanhaiMainApp')
     .controller('progressReadingCtrl', function (bookServices,userServices, profileService, $scope,$location,$cookies,$filter, $state, $uibModal) {
   
   
       var leftNavActive = false;
       var vm = this;
       vm.books = [];
       vm.filterData = {};
       vm.exitToMain = exitToMain;
       vm.readBook = readBook;
       vm.gotoQuiz = gotoQuiz;
       vm.pagePath = '';
       $scope.selectedTextTypes = [];
       $scope.selectedInterestLevel = [];
       $scope.selectedSeries     = [];
       $scope.selectedTopics = [];
       $scope.selectedProgram = [];
       $scope.selectedSeriesArr  = [];
       if (sessionStorage.getItem("progressReadingFilter") == null ){
   
           var progressReadingFilter = [{'searchKeyword':''},{'textType':''},{'interestLevel':''},
           {'series':''},{'topics':''},{'programFilter':''}];
           sessionStorage.setItem("progressReadingFilter",JSON.stringify(progressReadingFilter));
       }
       else{
         $scope.progressReadingFilter = sessionStorage.progressReadingFilter;
       }
   
       $scope.clearAll = function(){
         $scope.searchKeyword = '';
         var Keyword = JSON.parse(sessionStorage.progressReadingFilter);
         Keyword[0].searchKeyword = '';
         sessionStorage.setItem("progressReadingFilter",JSON.stringify(Keyword));
         clear();
         vm.nubcla = [];
         initbp();
         $scope.readBooktx = vm.page+1;
       };
   
         function readBooknsp(){
             bookServices.getBookcurbpp = vm.page;
         }
     $scope.removeAll = function(){
       var Keyword = $scope.searchKeyword;
       if (Keyword.length == 0){
         clear();
       }
     };
     function clear(){
       vm.filterData.query = '';
       vm.page = 0;
       vm.books= $filter('filter')($scope.books, '');
       var searchKeyword = JSON.parse(sessionStorage.progressReadingFilter);
       searchKeyword[0].searchKeyword = $scope.searchKeyword;
         sessionStorage.setItem("progressReadingFilter",JSON.stringify(searchKeyword));
         // getLevelReadingList();
        bookServices.getLevelReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getLevelReadingList();
           $scope.readBooktx = vm.page+1;
         });
         vm.nubcla = [];
         initbp();
         $scope.readBooktx = vm.page+1;
     }
   
   
       init();
   
         vm.nubcla = [];
         initbp();
         
  
       function init(){
         vm.pagePath = $location.path();
         //pagination
         vm.items = [];
         vm.busy = false;
         vm.page = 0;
         vm.prevPage = 0;
         vm.limit = 20;
         vm.isClickEnable = true;
           initnsb();
        bookServices.getLevelReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           initnsb();
            getLevelReadingList();
           $scope.readBooktx = vm.page+1;
         });
   
         userServices.getProfile().then(function(response){
       	if(response.status === 200){
       		vm.profile = response.data;
       	}
         }, function (data) {
         	// console.log('error: ', data);
         });
         //vm.profile = profileService.getData('profileData');
   
         /*get interest level*/
         //vm.interests = [];
         bookServices.getInrestLevel().then(function(response){
           vm.interests = response.data;
         });
         /*get Text type*/
         bookServices.getTextType().then(function(response){
             vm.textCategories = response.data;
         });
   
         /*get series */
         bookServices.getSeries().then(function(response){
           vm.serieses = response.data;
         });
         /*get topics */
         bookServices.getTopics().then(function(response){
           vm.topics = response.data;
         });
         /*get programTypes */
         bookServices.getProgramTypes().then(function(response){
           vm.programypes = response.data;
         });
         //proficiency for 1-20
         vm.proficiencies = [];
         for (var i = 0; i < 20; i++) {
           var pr = {
             proficiency: i+1
           };
           vm.proficiencies.push(pr);
         }
   
         //session for searchkeyword
         if (sessionStorage.progressReadingFilter != null){
           var Keyword = JSON.parse(sessionStorage.progressReadingFilter);
           // console.log(Keyword[0].searchKeyword);
             if (Keyword[0].searchKeyword != ''){
               vm.filterData.query = Keyword[0].searchKeyword;
               $scope.searchKeyword = Keyword[0].searchKeyword;
               vm.page = 0;
   
             }
             getLevelReadingList();
         }
   
         // session for textType
         if (sessionStorage.progressReadingFilter != null){
           if ((sessionStorage.progressReadingFilter).length != 0){
             var parsedtextType = JSON.parse(sessionStorage.progressReadingFilter);
             if (parsedtextType[1].textType != ''){
               $scope.selectedTextTypes = parsedtextType[1].textType;
               vm.filterData.textType = $scope.selectedTextTypes;
             }
             getLevelReadingList();
           }
         }
   
         // session for InterestLevel
         if (sessionStorage.progressReadingFilter != null){
           if ((sessionStorage.progressReadingFilter).length != 0){
             var parsedInterestLevel = JSON.parse(sessionStorage.progressReadingFilter);
             if (parsedInterestLevel[2].interestLevel != ''){
               $scope.selectedInterestLevel = parsedInterestLevel[2].interestLevel;
               vm.filterData.interestLevel = $scope.selectedInterestLevel;
             }
             getLevelReadingList();
           }
         }
   
         // session for series
         if (sessionStorage.progressReadingFilter != null){
           if ((sessionStorage.progressReadingFilter).length != 0){
             var parsedseries = JSON.parse(sessionStorage.progressReadingFilter);
             if (parsedseries[3].series != ''){
                   $scope.selectedSeriesArr = parsedseries[3].series;
                   vm.filterData.seriesId = parsedseries[3].series;
                 for (var i=0;i<parsedseries[3].series.length;i++){
                   $scope.selectedSeries.push(parsedseries[3].series[i].id);
                 }
             }
             getLevelReadingList();
           }
         }
   
         // session for topics
         if (sessionStorage.progressReadingFilter != null){
           if ((sessionStorage.progressReadingFilter).length != 0){
             var parsedtopics = JSON.parse(sessionStorage.progressReadingFilter);
             if (parsedtopics[4].topics != ''){
               $scope.selectedTopics = parsedtopics[4].topics;
               vm.filterData.topics = $scope.selectedTopics;
             }
             getLevelReadingList();
           }
         }
         // session for programFilter
         if (sessionStorage.progressReadingFilter != null){
           if ((sessionStorage.progressReadingFilter).length != 0){
             var parsedprogramFilter = JSON.parse(sessionStorage.progressReadingFilter);
             if (parsedprogramFilter[5].programFilter != ''){
               $scope.selectedProgram = parsedprogramFilter[5].programFilter;
               vm.filterData.programType = $scope.selectedProgram;
             }
             getLevelReadingList();
           }
         }
   
       }/*init*/
         initnsb();
   
       $(document).on("shown.bs.collapse hidden.bs.collapse", ".panel-collapse", function (e) {
         $(e.target)
           .prev('.panel-heading')
           .find("i.indicator")
           .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
   
       });
         function initbp(){
           vm.nubcla[vm.page+1] = "active";
         }
         function swap(abks,bk1,bk2){
             var tbk = abks[bk1];
             abks[bk1] = abks[bk2];
             abks[bk2] = tbk;
         }
       function getAllFoldersLists(folder) {
         if (!folder) {
           folder = "";
         }
         bookServices.getAllFolders().then(function (data) {
           if (data.data && data.data.allFolder && data.data.allFolder.length >= 0) {
             vm.folders = data.data.allFolder;
             if (vm.folderSelected == '') {
               vm.folderSelected = data.data.allFolder[0];
             } else {
               //to get count of moved folder
               for (var i = 0; i < data.data.allFolder.length; i++) {
                 if (data.data.allFolder[i].id == folder.id) {
                   vm.folderSelected = data.data.allFolder[i];
                 }
               }
               //vm.folderSelected = folder;
             }
   
           } else {
             // console.log("no data");
           }
           //getBooksListsByFolderId();
         });
       };
   
   // progressReadingSearchQuery
       $scope.progressReadingSearchQuery = function() {
         vm.filterData.query = $scope.searchKeyword;
         vm.page = 0;
         vm.books= $filter('filter')($scope.books, $scope.searchKeyword);
         var searchKeyword = JSON.parse(sessionStorage.progressReadingFilter);
         searchKeyword[0].searchKeyword = $scope.searchKeyword;
         sessionStorage.setItem("progressReadingFilter",JSON.stringify(searchKeyword));
         //vm.books= $filter('filter')($scope.books, $scope.searchKeyword);
         // getLevelReadingList();
        bookServices.getLevelReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getLevelReadingList();
           $scope.readBooktx = vm.page+1;
         });
         vm.nubcla = [];
         initbp();
         $scope.readBooktx = vm.page+1;
       };
   
   
       // ---------proficiency level filter--------------
         function initnsb(){
             vm.page = bookServices.getBookcurbpp;
             $scope.readBooktx = vm.page+1;
         }
         $scope.readBookpp = function(nn){
             if(vm.page==1)  return;
             clearsb();
             vm.page = nn-1;
             clearc();
             getLevelReadingList();
             vm.nubcla[vm.page+1] = "active";
             readBooknsp();
             $scope.readBooktx = vm.page+1;
         };
       $scope.selectedProficiency = [];
       $scope.setProficiencyFilter = function (item) {
         var pos = $scope.selectedProficiency.indexOf(item);
         vm.page = 0;
         vm.isClickEnable = false;
         if (pos == -1) {
               $scope.selectedProficiency = [];
               $scope.selectedProficiency.push(item);
               vm.filterData.proficiencyLevel = $scope.selectedProficiency;
               // getLevelReadingList();
        bookServices.getLevelReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getLevelReadingList();
           $scope.readBooktx = vm.page+1;
         });
         } else {
             $scope.selectedProficiency.splice(pos, 1);
        bookServices.getLevelReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getLevelReadingList();
           $scope.readBooktx = vm.page+1;
         });
             // getLevelReadingList();
         }
         vm.nubcla = [];
         initbp();
         $scope.readBooktx = vm.page+1;
       };
       // ---------Text types filter--------------
   
         $scope.readBookfp = function(nn){
             if(vm.page===1) return;
             clearsb();
             vm.page = nn-1;
             clearc();
             getLevelReadingList();
             vm.nubcla[vm.page+1] = "active";
             readBooknsp();
             $scope.readBooktx = vm.page+1;
         };
       $scope.setTextTypeFilter = function (item) {
           var pos = $scope.selectedTextTypes.indexOf(item);
           vm.page = 0;
           vm.isClickEnable = false;
           var textType = JSON.parse(sessionStorage.progressReadingFilter);
           if (pos == -1) {
                 $scope.selectedTextTypes.push(item);
                 vm.filterData.textType = $scope.selectedTextTypes;
                 textType[1].textType = $scope.selectedTextTypes;
                 sessionStorage.setItem("progressReadingFilter",JSON.stringify(textType));
                 // getLevelReadingList();
        bookServices.getLevelReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getLevelReadingList();
           $scope.readBooktx = vm.page+1;
         });
           } else {
               $scope.selectedTextTypes.splice(pos, 1);
               textType[1].textType.splice(pos,1);
               sessionStorage.setItem("progressReadingFilter",JSON.stringify(textType));
        bookServices.getLevelReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getLevelReadingList();
           $scope.readBooktx = vm.page+1;
         });
               // getLevelReadingList();
           }
           vm.nubcla = [];
           initbp();
           $scope.readBooktx = vm.page+1;
       };
       // ---------Interest level filter--------------
   
       $scope.setInterestsFilter = function (item) {
           var pos = $scope.selectedInterestLevel.indexOf(item.displayName);
           var interestLevel = JSON.parse(sessionStorage.progressReadingFilter);
           if (pos == -1) {
                 $scope.selectedInterestLevel.push(item.displayName);
                 vm.filterData.interestLevel = $scope.selectedInterestLevel;
                 interestLevel[2].interestLevel = $scope.selectedInterestLevel;
                 sessionStorage.setItem("progressReadingFilter",JSON.stringify(interestLevel));
                 // getLevelReadingList();
        bookServices.getLevelReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getLevelReadingList();
           $scope.readBooktx = vm.page+1;
         });
           } else {
               $scope.selectedInterestLevel.splice(pos, 1);
               interestLevel[2].interestLevel.splice(pos,1);
               sessionStorage.setItem("progressReadingFilter",JSON.stringify(interestLevel));
        bookServices.getLevelReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getLevelReadingList();
           $scope.readBooktx = vm.page+1;
         });
               // getLevelReadingList();
           }
           vm.nubcla = [];
           initbp();
           $scope.readBooktx = vm.page+1;
       };
       $scope.checkSubcategoryExist = function(category){
         return category.subFilter.length > 0 ? true : false;
       };
   
       // ---------series level filter--------------
         $scope.readBooknp = function(nn){
             if(nn>vm.booktp) return;
             clearsb();
             vm.page = nn-1;
             clearc();
             getLevelReadingList();
             vm.nubcla[vm.page+1] = "active";
             readBooknsp();
             $scope.readBooktx = vm.page+1;
         };
       $scope.setSeriesFilter = function (item) {
       		var pos = $scope.selectedSeries.indexOf(item.id);
           vm.page = 0;
           vm.isClickEnable = false;
           var series = JSON.parse(sessionStorage.progressReadingFilter);
           vm.nubcla = [];
           initbp();
           $scope.readBooktx = vm.page+1;
           if (pos == -1) {
                 $scope.selectedSeries.push(item.id);
                 $scope.selectedSeriesArr.push(item);
                 vm.filterData.seriesId = $scope.selectedSeries;
                 series[3].series = $scope.selectedSeriesArr;
                 sessionStorage.setItem("progressReadingFilter",JSON.stringify(series));
                 // getLevelReadingList();
        bookServices.getLevelReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getLevelReadingList();
           $scope.readBooktx = vm.page+1;
         });
           } else {
               $scope.selectedSeries.splice(pos, 1);
                $scope.selectedSeriesArr.splice(pos, 1);
                series[3].series.splice(pos,1);
                sessionStorage.setItem("progressReadingFilter",JSON.stringify(series));
        bookServices.getLevelReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getLevelReadingList();
           $scope.readBooktx = vm.page+1;
         });
               // getLevelReadingList();
           }
   
       };
       // ---------topics level filter--------------
   
       $scope.setTopicsFilter = function (item) {
           var pos = $scope.selectedTopics.indexOf(item);
           vm.page = 0;
           vm.isClickEnable = false;
           var topics = JSON.parse(sessionStorage.progressReadingFilter);
           vm.nubcla = [];
           initbp();
           $scope.readBooktx = vm.page+1;
           if (pos == -1) {
                 $scope.selectedTopics.push(item);
                 vm.filterData.topics = $scope.selectedTopics;
                 topics[4].topics = $scope.selectedTopics;
                 sessionStorage.setItem("progressReadingFilter",JSON.stringify(topics));
                 // getLevelReadingList();
        bookServices.getLevelReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getLevelReadingList();
           $scope.readBooktx = vm.page+1;
         });
           } else {
               $scope.selectedTopics.splice(pos, 1);
               topics[4].topics.splice(pos,1);
               sessionStorage.setItem("progressReadingFilter",JSON.stringify(topics));
        bookServices.getLevelReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getLevelReadingList();
           $scope.readBooktx = vm.page+1;
         });
               // getLevelReadingList();
           }
       };
       // ---------program type filter--------------
         $scope.readBooknn = function(nn){
             if(nn===vm.page) return;
             clearsb();
             vm.page = nn-1;
             clearc();
             getLevelReadingList();
             vm.nubcla[vm.page+1] = "active";
             readBooknsp();
             $scope.readBooktx = vm.page+1;
         };
   
       $scope.setProgramFilter = function (item) {
           var pos = $scope.selectedProgram.indexOf(item.displayName);
           vm.page = 0;
           vm.isClickEnable = false;
           var programFilter = JSON.parse(sessionStorage.progressReadingFilter);
           vm.nubcla = [];
           initbp();
           $scope.readBooktx = vm.page+1;
           if (pos == -1) {
                 $scope.selectedProgram.push(item.displayName);
                 vm.filterData.programType = $scope.selectedProgram;
                 programFilter[5].programFilter = $scope.selectedProgram;
                 sessionStorage.setItem("progressReadingFilter",JSON.stringify(programFilter));
                 // getLevelReadingList();
        bookServices.getLevelReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getLevelReadingList();
           $scope.readBooktx = vm.page+1;
         });
           } else {
               $scope.selectedProgram.splice(pos, 1);
               programFilter[5].programFilter.splice(pos,1);
               sessionStorage.setItem("progressReadingFilter",JSON.stringify(programFilter));
               // getLevelReadingList();
        bookServices.getLevelReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getLevelReadingList();
           $scope.readBooktx = vm.page+1;
         });
           }
       };
         $scope.readBooklp = function(nn){
             if(nn===vm.page) return;
             clearsb();
             vm.page = nn-1;
             clearc();
             getLevelReadingList();
             vm.nubcla[vm.page+1] = "active";
             readBooknsp();
             $scope.readBooktx = vm.page+1;
         };
   
       $scope.clearFilter = function (filter, item, origin,key) {
         vm.page = 0;
         if(origin == "series"){
           var pos = $scope.selectedSeries.indexOf(item.id);
           var series = JSON.parse(sessionStorage.progressReadingFilter);
           var position = series[3].series.indexOf(item.id);
           series[3].series.splice(position,1);
           sessionStorage.setItem("progressReadingFilter",JSON.stringify(series));
           filter.splice(filter.indexOf(item.id), 1);
           $scope.selectedSeries.splice(filter.indexOf(item), 1);
         }else{
           if (key == 'textType'){
             var textType = JSON.parse(sessionStorage.progressReadingFilter);
             var position = textType[1].textType.indexOf(item);
             textType[1].textType.splice(position,1);
             sessionStorage.setItem("progressReadingFilter",JSON.stringify(textType));
             filter.splice(filter.indexOf(item), 1);
           }
           if (key == 'interestLevel'){
             var interestLevel = JSON.parse(sessionStorage.progressReadingFilter);
             var position = interestLevel[2].interestLevel.indexOf(item);
             interestLevel[2].interestLevel.splice(position,1);
             sessionStorage.setItem("progressReadingFilter",JSON.stringify(interestLevel));
             filter.splice(filter.indexOf(item), 1);
           }
           if (key == 'topics'){
             var topics = JSON.parse(sessionStorage.progressReadingFilter);
             var position = topics[4].topics.indexOf(item);
             topics[4].topics.splice(position,1);
             sessionStorage.setItem("progressReadingFilter",JSON.stringify(topics));
             filter.splice(filter.indexOf(item), 1);
           }
           if (key == 'programType'){
             var programFilter = JSON.parse(sessionStorage.progressReadingFilter);
             var position = programFilter[5].programFilter.indexOf(item);
             programFilter[5].programFilter.splice(position,1);
             sessionStorage.setItem("progressReadingFilter",JSON.stringify(programFilter));
             filter.splice(filter.indexOf(item), 1);
           }
           //filter.splice(filter.indexOf(item), 1);
         }
         // getLevelReadingList();
        bookServices.getLevelReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getLevelReadingList();
           $scope.readBooktx = vm.page+1;
         });
           vm.nubcla = [];
           initbp();
           $scope.readBooktx = vm.page+1;
       };
   
   
       //page scroll
       $(window).scroll(function() {
         // //console.log('Reached bottom');
         //  if (vm.limit!== 0 && vm.page!== 0 && $state.current.url == "/progressReading") {
         //   //console.log( $(window).scrollTop()+$("#bookList").height(), $(document).height() );
         //   // if($(window).scrollTop() == $(document).height() - $(window).height()) {
         //    if(($(window).scrollTop() + $(window).innerHeight()) >= $(document).height()-100) {
         //            //console.log('Reached bottom-','Prev Page:',vm.prevPage,'Current Page:',vm.page);
         //            if (vm.prevPage !== vm.page) {
         //             getLevelReadingList();
         //             //console.log('call api');
         //           }
   
         //     }
         //  }
   
         //  //scroll top
         //  if ($(this).scrollTop() > 1000) {
         //       $('.scrollup').fadeIn();
         //   } else {
         //       $('.scrollup').fadeOut();
         //   }
       });
   
       //scroll top on click
       // $('.scrollup').click(function () {
       //     $("html, body").animate({
       //         scrollTop: 0
       //     }, 800);
       //     return false;
       // });
   
         $scope.readBookgp = function(nn){
             if(!nn) return;
             if(vm.page===nn) return;
             clearsb();
             vm.page = nn-1;
             clearc();
             getLevelReadingList();
             vm.nubcla[vm.page+1] = "active";
             readBooknsp();
             $scope.readBooktx = vm.page+1;
         };
       function getLevelReadingList(){
        if (vm.busy) return;
         vm.busy = true;
         // if (vm.page == 0) {
           var loaderDiv = '<div class="loader"></div>';
           $(loaderDiv).appendTo('body');
         // }
         vm.isClickEnable = false;
         // console.log("vm.filterData", vm.filterData);
         bookServices.getLevelReading(vm.filterData,vm.limit,vm.page).then(function(response){
           var items = response.data;
   
           if (vm.limit!== 0 && vm.page!== 0) {
               if (items.length === 0){ vm.busy = false; vm.prevPage = vm.page;vm.page=++vm.page;$('.loader').remove(); return; }
             for (var i = 0; i < items.length; i++) {
               vm.books.push(items[i]);
             }
           }else{
             if (sessionStorage.progressReadingFilter != null){
               var Keyword = JSON.parse(sessionStorage.progressReadingFilter);
                 if (Keyword[0].searchKeyword != ''){
                   $scope.searchKeyword = Keyword[0].searchKeyword;
                   vm.books = $filter('filter')(response.data, $scope.searchKeyword);
                   $scope.books = items;
                 }
                 else{
                   vm.books = items;
                   $scope.books = items;
                 }
             }
   
           }
   
           if (items.length !== 0) { vm.prevPage = vm.page; vm.page = ++vm.page; }
             sortbooks(vm.books);
   
           $('.loader').remove();

            vm.busy = false;

           vm.isClickEnable = true;

   
         }.bind($scope));
       }
   
       this.isLeftNavActive = function(){
         if(leftNavActive){
           return 'is-active';
         }
       };
   
         function clearc(){
             vm.books = [];
         }
       this.toggleLeftNav = function(){
         leftNavActive = (leftNavActive) ? false : true;
       };
   
       function exitToMain(){
         return $location.path('/');
       }
       function readBook(book){
         $cookies.put('bookOrigin', 'progressReading');
         $state.go('book', {bookId: book.bookId});
       }
         function clearsb(){
             vm.nubcla[vm.page] = "";
             vm.prevPage = vm.page;
         }
       function gotoQuiz(book){
         $cookies.put('bookOrigin', 'progressReading');
         var startQuiz = {
           "bookId":book.bookId,
           "sessionActivity": "QUIZ_ATTEMPT_START"
         };
         bookServices.startQuizTrack(startQuiz).then(function (response) {
         // console.log("Quiz Started: ", response.data);
         sessionStorage.setItem('startQuizTrack', JSON.stringify(response.data));
         });
         $state.go('quiz', {bookId: book.bookId});
       }
       //disable button
       $scope.bookSelected = function(){
           var count = 0;
           angular.forEach(vm.books, function (books) {
               if(books.book.selected) count++;
           });
           return count;
       };
   
       //select all books
       var filter = $filter('filter');
      	$scope.checkAll = function (){
      		if ($scope.selectedAll) {
              $scope.selectedAll = true;
           } else {
              $scope.selectedAll = false;
           }
      		$scope.items = [];
      		for (var i = 0; i < vm.books.length; i++) {
              $scope.items.push(vm.books[i].book);
            }
         	var filtered = filter($scope.items, $scope.searchKeyword);
         	angular.forEach(filtered, function(item) {
            	item.selected = $scope.selectedAll;
         	});
      	};
   
         vm.readBookn = [];
         // vm.booktp = 10;
         var num;
         for(num=1;num<=vm.boottp;num++) vm.readBookn.push(num);
       // book add to myLibrary
       $scope.showModalAddFolder = function () {
       	var loaderDiv = '<div class="loader"></div>';
   		$(loaderDiv).appendTo('body'); //Add Loader
   
         var modalInstance = $uibModal.open({
           "animation": true,
           "templateUrl": 'views/modals/addToFolder.html',
           "controller": "AddToFolderCtrl",
           resolve: {
             items: function () {
               return vm.folders;
             }
           }
         });
         modalInstance.result.then(function (folder) {
           var bookIds = [];
           for (var i = 0; i < vm.books.length; i++) {
             if (vm.books[i].book.selected === true) {
               bookIds.push(vm.books[i].book.bookId);
               vm.books[i].inFolder = true;
             	vm.books[i].book.selected = false;
             	$scope.selectedAll = false;
             }
           }
           bookServices.AddBooksToFolder(folder.id, bookIds).then(function (data) {
             	if (data.data && data.data.message) {
   	        	messageModal(data.data.message);
   	        	$scope.searchKeyword = '';
               	getAllFoldersLists(folder);
             	}
             	$('.loader').remove(); //remove Loader
           }, function (data) {
           	$('.loader').remove(); //remove Loader
              	if (data.data && data.data.message) {
   	         	messageModal(data.data.message.propertyName + ': ' + data.data.message.message);
              	}
           });
         });
       };
   
   
       /*
       //scroll to top
           $(window).scroll(function () {
               if ($(this).scrollTop() > 1000) {
                   $('.scrollup').fadeIn();
               } else {
                   $('.scrollup').fadeOut();
               }
           });
   
           $('.scrollup').click(function () {
               $("html, body").animate({
                   scrollTop: 0
               }, 800);
               return false;
           });
           */
   
       //send message to common modal
         function sortbooks(bks){
             var n = bks.length,i=0;
             for(i=1;i<n;i++){
                 var j=i;
                 while(j>0 && ( (bks[j].readComplete && bks[j].readComplete===true && bks[j-1].readComplete===false) || (bks[j].readComplete===true && bks[j].maxScore && bks[j].maxScore.pass) )){
                     swap(bks,j,(j--)-1);
                 }
             }
             i=0;
             for(i=1;i<n;i++){
                 j=i;
                 while(j>0 && (bks[j].quizAvailable && !bks[j-1].quizAvailable) ){
                     swap(bks,j,(j--)-1);
                 }
             }
         }
       function messageModal(item){
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

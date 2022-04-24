   'use strict';
   
   /**
    * @ngdoc function
    * @name nanhaiMainApp.controller:openReadingCtrl
    * @description
    * # LibraryCtrl
    * Controller of the nanhaiMainApp
    */
   angular.module('nanhaiMainApp')
     .controller('openReadingCtrl', function ($http,bookServices, $scope, $location, $cookies, $filter, $state,
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
   
         vm.nubcla = [];
         initbp();
   // start of search and remove
       $scope.clearAll = function(){
         $scope.searchKeyword = '';
         var Keyword = JSON.parse(sessionStorage.openReadingFilter);
         Keyword[0].searchKeyword = '';
         sessionStorage.setItem("openReadingFilter",JSON.stringify(Keyword));
         clear();
         vm.nubcla = [];
         initbp();
         $scope.readBooktx = vm.page+1;
       };
   
         // vm.showps = false;
         // vm.showpss = function(){
         //     if(vm.showps===true) vm.showps=false;
         //     else vm.showps=true;
         // }
     $scope.removeAll = function(){
       var Keyword = $scope.searchKeyword;
       if (Keyword.length == 0){
         clear();
       }
     };
         function readBooknsp(){
             bookServices.getBookcurbp = vm.page;
         }
     function clear(){
         vm.filterData.query = '';
         vm.page = 0;
         var searchKeyword = JSON.parse(sessionStorage.openReadingFilter);
         searchKeyword[0].searchKeyword = $scope.searchKeyword;
         sessionStorage.setItem("openReadingFilter",JSON.stringify(searchKeyword));
        bookServices.getOpenReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getOpenReadingList();
           $scope.readBooktx = vm.page+1;
         });
         // getOpenReadingList();
         vm.nubcla = [];
         initbp();
         $scope.readBooktx = vm.page+1;
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
         initnsb();
           

        bookServices.getOpenReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           initnsb();
            getOpenReadingList();
           $scope.readBooktx = vm.page+1;
         });

   
         /*get interest level*/
         //vm.interests = [];
         bookServices.getInrestLevel().then(function (response) {
           vm.interests = response.data;
           // console.log("vm.interests",vm.interests);
         });
   
         /*get Text type*/
         bookServices.getTextType().then(function (response) {
           vm.textCategories = response.data;
         });
   
         /*get series */
         bookServices.getSeries().then(function (response) {
           vm.serieses = response.data;
         });
         /*get topics */
         bookServices.getTopics().then(function (response) {
           vm.topics = response.data;
         });
         /*get programTypes */
         bookServices.getProgramTypes().then(function (response) {
           vm.programypes = response.data;
         });
         // get proficiencies
         bookServices.getProficiencyLevel().then(function (response) {
           vm.proficiencies = response.data;
           // console.log("vm.proficiencies",vm.proficiencies);
         });
   
         getAllFoldersLists();
   
         //proficiency for 1-20
         //vm.proficiencies = [];
   
         // for (var i = 0; i < 20; i++) {
         //   var pr = {
         //     proficiency: i + 1
         //   };
         //   vm.proficiencies.push(pr);
         // }
         // Session for search Query KeyWord
         if (sessionStorage.openReadingFilter != null){
           var Keyword = JSON.parse(sessionStorage.openReadingFilter);
           // console.log(Keyword[0].searchKeyword);
             if (Keyword[0].searchKeyword != ''){
               vm.filterData.query = Keyword[0].searchKeyword;
               $scope.searchKeyword = Keyword[0].searchKeyword;
               vm.page = 0;
   
             }
             getOpenReadingList();
         }
   
         // session for proficiencyLevel
         if (sessionStorage.openReadingFilter != null){
           if ((sessionStorage.openReadingFilter).length != 0 ){
             var parsedProficiencyLevel = JSON.parse(sessionStorage.openReadingFilter);
             if (parsedProficiencyLevel[1].proficiencyLevel != ''){
               $scope.selectedProficiency = parsedProficiencyLevel[1].proficiencyLevel;
               vm.filterData.proficiencyLevel = $scope.selectedProficiency;
             }
             getOpenReadingList();
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
             getOpenReadingList();
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
             getOpenReadingList();
           }
         }
   
         // session for series
         if (sessionStorage.openReadingFilter != null){
           if ((sessionStorage.openReadingFilter).length != 0){
             var parsedseries = JSON.parse(sessionStorage.openReadingFilter);
             if (parsedseries[4].series != ''){
               // console.log("Came here to check series", parsedseries[4].series);
               $scope.selectedSeriesArr = parsedseries[4].series;
               for (var i=0;i<parsedseries[4].series.length;i++){
                 $scope.selectedSeries.push(parsedseries[4].series[i].id);
                 vm.filterData.seriesId = $scope.selectedSeries;
               }
             }
             getOpenReadingList();
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
             getOpenReadingList();
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
             getOpenReadingList();
           }
         }
   
       }
   
         initnsb();
       /*init*/
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
       //----------Search text-------------------------
         $scope.count = 0;
         $scope.searchQuery = function() {
           $scope.count++;
           vm.filterData.query = $scope.searchKeyword;
           vm.page = 0;
           var searchKeyword = JSON.parse(sessionStorage.openReadingFilter);
           searchKeyword[0].searchKeyword = $scope.searchKeyword;
           sessionStorage.setItem("openReadingFilter",JSON.stringify(searchKeyword));
           // getOpenReadingList();
        bookServices.getOpenReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getOpenReadingList();
           $scope.readBooktx = vm.page+1;
         });
           vm.nubcla = [];
           initbp();
           $scope.readBooktx = vm.page+1;
         };
   
       // ---------proficiency level filter--------------
   
         function initnsb(){
             vm.page = bookServices.getBookcurbp;
             $scope.readBooktx = vm.page+1;
         }
         $scope.readBookpp = function(nn){
             if(vm.page==1)  return;
             clearsb();
             vm.page = nn-1;
             clearc();
             getOpenReadingList();
             vm.nubcla[vm.page+1] = "active";
             readBooknsp();
             $scope.readBooktx = vm.page+1;
         };
       //$scope.selectedProficiencyArr   = [];
       $scope.setProficiencyFilter = function (item) {
           var pos = $scope.selectedProficiency.indexOf(item.name);
             vm.page = 0;
             vm.isClickEnable = false;
             var proficiencyLevel = JSON.parse(sessionStorage.openReadingFilter);
             vm.nubcla = [];
             initbp();
             $scope.readBooktx = vm.page+1;
           if (pos == -1) {
               var level = item.name;
               $scope.selectedProficiency.push(level);
               vm.filterData.proficiencyLevel = $scope.selectedProficiency;
               proficiencyLevel[1].proficiencyLevel = $scope.selectedProficiency;
               sessionStorage.setItem("openReadingFilter",JSON.stringify(proficiencyLevel));
               // getOpenReadingList();
        bookServices.getOpenReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getOpenReadingList();
           $scope.readBooktx = vm.page+1;
         });
           } else {
             $scope.selectedProficiency.splice(pos, 1);
             proficiencyLevel[1].proficiencyLevel.splice(pos,1);
             sessionStorage.setItem("openReadingFilter",JSON.stringify(proficiencyLevel));
             // getOpenReadingList();
        bookServices.getOpenReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getOpenReadingList();
           $scope.readBooktx = vm.page+1;
         });
           }
       };
       // ---------Interest level filter--------------
   
       $scope.setInterestsFilter = function (item) {
         var pos = $scope.selectedInterestLevel.indexOf(item.displayName);
           //vm.limit = 0;
           vm.page = 0;
           vm.isClickEnable = false;
           var interestLevel = JSON.parse(sessionStorage.openReadingFilter);
           vm.nubcla = [];
           initbp();
           $scope.readBooktx = vm.page+1;
         if (pos == -1) {
           $scope.selectedInterestLevel.push(item.displayName);
           interestLevel[2].interestLevel = $scope.selectedInterestLevel;
           vm.filterData.interestLevel = $scope.selectedInterestLevel;
           sessionStorage.setItem("openReadingFilter",JSON.stringify(interestLevel));
           // getOpenReadingList();
        bookServices.getOpenReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getOpenReadingList();
           $scope.readBooktx = vm.page+1;
         });
         } else {
           $scope.selectedInterestLevel.splice(pos, 1);
           interestLevel[2].interestLevel.splice(pos,1);
           sessionStorage.setItem("openReadingFilter",JSON.stringify(interestLevel));
           // getOpenReadingList();
        bookServices.getOpenReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getOpenReadingList();
           $scope.readBooktx = vm.page+1;
         });
         }
        // console.log('selected: ', $scope.selectedInterestLevel);
       };
         $scope.readBookfp = function(nn){
             if(vm.page===1) return;
             clearsb();
             vm.page = nn-1;
             clearc();
             getOpenReadingList();
             vm.nubcla[vm.page+1] = "active";
             readBooknsp();
             $scope.readBooktx = vm.page+1;
         };
       // ---------Text types filter textType--------------
       $scope.setTextTypeFilter = function (item) {
         var pos = $scope.selectedTextTypes.indexOf(item);
         vm.page = 0;
         vm.isClickEnable = false;
         vm.nubcla = [];
         initbp();
         $scope.readBooktx = vm.page+1;
         var textType = JSON.parse(sessionStorage.openReadingFilter);
         if (pos == -1) {
           $scope.selectedTextTypes.push(item);
           vm.filterData.textType = $scope.selectedTextTypes;
           textType[3].textType = $scope.selectedTextTypes;
           sessionStorage.setItem("openReadingFilter",JSON.stringify(textType));
           // getOpenReadingList();
        bookServices.getOpenReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getOpenReadingList();
           $scope.readBooktx = vm.page+1;
         });
         } else {
           $scope.selectedTextTypes.splice(pos, 1);
           textType[3].textType.splice(pos,1);
           sessionStorage.setItem("openReadingFilter",JSON.stringify(textType));
           // getOpenReadingList();
        bookServices.getOpenReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getOpenReadingList();
           $scope.readBooktx = vm.page+1;
         });
         }
       };
       $scope.checkSubcategoryExist = function (category) {
         return category.subFilter.length > 0 ? true : false;
       };
   
       // ---------series level filter--------------
   
   
         $scope.readBooknp = function(nn){
             if(nn>vm.booktp) return;
             clearsb();
             vm.page = nn-1;
             clearc();
             getOpenReadingList();
             vm.nubcla[vm.page+1] = "active";
             readBooknsp();
             $scope.readBooktx = vm.page+1;
         };
       $scope.setSeriesFilter = function (item) {
           var pos = $scope.selectedSeries.indexOf(item.id);
           //vm.limit = 0;
           vm.page = 0;
           vm.isClickEnable = false;
         var series = JSON.parse(sessionStorage.openReadingFilter);
         vm.nubcla = [];
         initbp();
         $scope.readBooktx = vm.page+1;
           if (pos == -1) {
                 $scope.selectedSeries.push(item.id);
                 $scope.selectedSeriesArr.push(item);
                 vm.filterData.seriesId = $scope.selectedSeries;
                 series[4].series = $scope.selectedSeriesArr;
                 sessionStorage.setItem("openReadingFilter",JSON.stringify(series));
                 // getOpenReadingList();
        bookServices.getOpenReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getOpenReadingList();
           $scope.readBooktx = vm.page+1;
         });
           } else {
               $scope.selectedSeries.splice(pos, 1);
                $scope.selectedSeriesArr.splice(pos, 1);
                series[4].series.splice(pos,1);
                sessionStorage.setItem("openReadingFilter",JSON.stringify(series));
        bookServices.getOpenReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getOpenReadingList();
           $scope.readBooktx = vm.page+1;
         });
                // getOpenReadingList();
           }
   
       };
       // ---------topics level filter--------------
   
         vm.nubcla = [];
         initbp();
       $scope.setTopicsFilter = function (item) {
         //console.log('item',item);
         var pos = $scope.selectedTopics.indexOf(item);
         vm.page = 0;
         vm.isClickEnable = false;
         var topics = JSON.parse(sessionStorage.openReadingFilter);
         vm.nubcla = [];
         initbp();
         $scope.readBooktx = vm.page+1;
         if (pos == -1) {
           $scope.selectedTopics.push(item);
           vm.filterData.topics = $scope.selectedTopics;
           topics[5].topics = $scope.selectedTopics;
           sessionStorage.setItem("openReadingFilter",JSON.stringify(topics));
           // getOpenReadingList();
        bookServices.getOpenReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getOpenReadingList();
           $scope.readBooktx = vm.page+1;
         });
         } else {
           $scope.selectedTopics.splice(pos, 1);
           topics[5].topics.splice(pos,1);
           sessionStorage.setItem("openReadingFilter",JSON.stringify(topics));
           // getOpenReadingList();
        bookServices.getOpenReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getOpenReadingList();
           $scope.readBooktx = vm.page+1;
         });
         }
       };
       // ---------program type filter--------------
   
         $scope.readBooknn = function(nn){
             if(nn===vm.page) return;
             clearsb();
             vm.page = nn-1;
             clearc();
             getOpenReadingList();
             vm.nubcla[vm.page+1] = "active";
             readBooknsp();
             $scope.readBooktx = vm.page+1;
         };
       $scope.setProgramFilter = function (item) {
         //console.log('item',item);
         var pos = $scope.selectedProgram.indexOf(item.displayName);
         //vm.limit = 0;
         vm.page = 0;
         vm.isClickEnable = false;
         var programFilter = JSON.parse(sessionStorage.openReadingFilter);
         vm.nubcla = [];
         initbp();
         $scope.readBooktx = vm.page+1;
         if (pos == -1) {
           $scope.selectedProgram.push(item.displayName);
           vm.filterData.programType = $scope.selectedProgram;
           programFilter[6].programFilter = $scope.selectedProgram;
           sessionStorage.setItem("openReadingFilter",JSON.stringify(programFilter));
           // getOpenReadingList();
        bookServices.getOpenReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getOpenReadingList();
           $scope.readBooktx = vm.page+1;
         });
         } else {
           $scope.selectedProgram.splice(pos, 1);
           programFilter[6].programFilter.splice(pos,1);
           sessionStorage.setItem("openReadingFilter",JSON.stringify(programFilter));
        bookServices.getOpenReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getOpenReadingList();
           $scope.readBooktx = vm.page+1;
         });
           // getOpenReadingList();
         }
   
       };
   
         $scope.readBooklp = function(nn){
             if(nn===vm.page) return;
             clearsb();
             vm.page = nn-1;
             clearc();
             getOpenReadingList();
             vm.nubcla[vm.page+1] = "active";
             readBooknsp();
             $scope.readBooktx = vm.page+1;
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
         // getOpenReadingList();
        bookServices.getOpenReadingC(vm.filterData, vm.limit,vm.page).then(function (response) {
           var items = response.data;
            vm.booktp = Math.ceil(items.count/20);
            vm.readBookn = [];
            // vm.booktp = 10;
            var num;
            for(num=1;num<=vm.booktp;num++) vm.readBookn.push(num);
           // initnsb();
            getOpenReadingList();
           $scope.readBooktx = vm.page+1;
         });
           vm.nubcla = [];
           initbp();
           $scope.readBooktx = vm.page+1;
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
   
         function clearc(){
             vm.books = [];
         }
       function toggleLeftNav() {
         leftNavActive = (leftNavActive) ? false : true;
       }
   
       function exitToMain() {
         return $location.path('/');
       }
   
       function readBook(book) {
         $cookies.put('bookOrigin', 'openReading');
         $state.go('book', {bookId: book.bookId});
       }
   
         function clearsb(){
             vm.nubcla[vm.page] = "";
             vm.prevPage = vm.page;
         }
  
       function gotoQuiz(book) {
       var startQuiz = {
                     "bookId":book.bookId,
                     "sessionActivity": "QUIZ_ATTEMPT_START"
                   };
         bookServices.startQuizTrack(startQuiz).then(function (response) {
             // console.log("Quiz Started: ", response.data);
             sessionStorage.setItem('startQuizTrack', JSON.stringify(response.data));
         });
         // detect browser Disable Back button.
         window.addEventListener('popstate', function(event,data) {
         history.pushState("jibberish", null, null);
         window.onpopstate = function () {
         history.pushState('newjibberish', null, null);
           // disabled Backbutton, user has to click on exit only
             };
         });
         $cookies.put('bookOrigin', 'openReading');
         $state.go('quiz', {bookId: book.bookId});
   
       }
   
       //disable button
       $scope.bookSelected = function () {
         var count = 0;
         angular.forEach(vm.books, function (books) {
           //console.log("books", books);
           if (books.book.selected) count++;
         });
         return count;
       };
   
       //Book add to my library
       $scope.showModalAddFolder = function () {
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
               getAllFoldersLists(folder);
             }
           }, function (data) {
           	// console.log(data);
           });
         });
       };
   
       //page scroll
       $(window).scroll(function() {
       //   //console.log('Reached bottom');
       //    if (vm.limit!== 0 && vm.page!== 0 && $state.current.url == "/openReading") {
       //     //console.log( $(window).scrollTop()+$("#bookList").height(), $(document).height() );
       //     // if($(window).scrollTop() == $(document).height() - $(window).height()) {
       //      if(($(window).scrollTop() + $(window).innerHeight()) >= $(document).height()-100) {
       //              //console.log('Reached bottom-','Prev Page:',vm.prevPage,'Current Page:',vm.page);
       //              if (vm.prevPage !== vm.page) {
       //               getOpenReadingList();
       //               //console.log('call api');
       //             }
   
       //       }
       //    }
   
       //    //scroll top
       //    if ($(this).scrollTop() > 1000) {
       //         $('.scrollup').fadeIn();
       //     } else {
       //         $('.scrollup').fadeOut();
       //     }
        });
       //scroll top on click
       $('.scrollup').click(function () {
           $("html, body").animate({
               scrollTop: 0
           }, 800);
           return false;
       });
   
         $scope.readBookgp = function(nn){
             if(!nn) return;
             if(vm.page===nn) return;
             clearsb();
             vm.page = nn-1;
             clearc();
             getOpenReadingList();
             vm.nubcla[vm.page+1] = "active";
             readBooknsp();
             $scope.readBooktx = vm.page+1;
         };
       function getOpenReadingList() {
        if (vm.busy) return;
         vm.busy = true;
         // if (vm.page == 0) {
           var loaderDiv = '<div class="loader"></div>';
           $(loaderDiv).appendTo('body');
         // }
   
         vm.isClickEnable = false;
         // console.log(vm.filterData);
   
         bookServices.getOpenReading(vm.filterData,vm.limit,vm.page).then(function (response) {
           $scope.selectedAll = false; // Select All unchecked
   
           var items = response.data;
           if (vm.limit!== 0 && vm.page!== 0) {
             if (items.length === 0){ vm.busy = false; vm.prevPage = vm.page;vm.page=++vm.page;$('.loader').remove(); return; }
             for (var i = 0; i < items.length; i++) {
               vm.books.push(items[i]);
             }
           }else{
             vm.books = items;
           }
   
           if (items.length !== 0) { vm.prevPage = vm.page; vm.page = ++vm.page; }
             sortbooks(vm.books);

           $('.loader').remove();
            vm.busy = false;

           vm.isClickEnable = true;
         }.bind($scope));
     };
   
         function sortbooks(bks){
             var n = bks.length,i=0,j=0;
             for(i=1;i<n;i++){
                 j=i;
//                 while(j>0 && ( !(bks[j].readComplete && bks[j].readComplete===true && bks[j-1].readComplete===false) && !(bks[j].readComplete===true && bks[j].maxScore && bks[j].maxScore.pass) )){
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
    	//send message to common modal
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

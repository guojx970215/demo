 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:openReadingCtrl
  * @description
  * # LibraryCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('LibraryCtrl', function (bookServices,profileService, $scope, $location, $uibModal, $cookies, $filter, $state, $timeout) {
 
     var vm = this;
     var leftNavActive = false;
     vm.books = [];
     vm.filterData = {};
     vm.folders = [];
     vm.folderSelected = '';
     vm.isLeftNavActive = isLeftNavActive;
     vm.toggleLeftNav = toggleLeftNav;
     vm.exitToMain = exitToMain;
     vm.readBook = readBook;
     vm.gotoQuiz = gotoQuiz;
     vm.setSelectedFolder = setSelectedFolder;
     vm.setRootFolder = 'Main Folder';
     $scope.selectedProficiency = [];
     $scope.selectedInterestLevel = [];
     $scope.selectedTextTypes = [];
     $scope.selectedSeries     = [];
     $scope.selectedSeriesArr  = [];
     $scope.selectedTopics = [];
     $scope.selectedProgram = [];
     vm.proficiencyLevel = [];
 
     if (sessionStorage.getItem("libraryReadingFilter") == null ){
 
         var libraryReadingFilter = [{'searchKeyword':''},{'proficiencyLevel':''},{'interestLevel':''},
         {'textType':''},{'series':''},{'topics':''},{'programFilter':''},{'folderName':''}];
         sessionStorage.setItem("libraryReadingFilter",JSON.stringify(libraryReadingFilter));
     }
     else{
       $scope.libraryReadingFilter = sessionStorage.libraryReadingFilter;
     }
 
     init();
 
     $scope.clearAll = function(){
       $scope.searchKeyword = '';
       var Keyword = JSON.parse(sessionStorage.libraryReadingFilter);
       Keyword[0].searchKeyword = '';
       sessionStorage.setItem("libraryReadingFilter",JSON.stringify(Keyword));
       clear();
     };
 
   $scope.removeAll = function(){
     var Keyword = $scope.searchKeyword;
     if (Keyword.length == 0){
       clear();
     }
   };
   function clear(){
     vm.books = $filter('filter')($scope.books, '');
     var searchKeyword = JSON.parse(sessionStorage.libraryReadingFilter);
     searchKeyword[0].searchKeyword = $scope.searchKeyword;
     sessionStorage.setItem("libraryReadingFilter",JSON.stringify(searchKeyword));
   }
 
     function init() {
       vm.pagePath = $location.path();
       getAllFoldersLists();
 
       /*get interest level*/
       //vm.interests = [];
       bookServices.getInrestLevel().then(function (response) {
         vm.interests = response.data;
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
       //proficiency for 1-20
       // get proficiencies
       bookServices.getProficiencyLevel().then(function (response) {
         vm.proficiencies = response.data;
         // console.log("vm.proficiencies",vm.proficiencies);
       });
 
       // session for proficiencyLevel
       if (sessionStorage.libraryReadingFilter != null){
         if ((sessionStorage.libraryReadingFilter).length != 0 ){
           var parsedProficiencyLevel = JSON.parse(sessionStorage.libraryReadingFilter);
           if (parsedProficiencyLevel[1].proficiencyLevel != ''){
             $scope.selectedProficiency = parsedProficiencyLevel[1].proficiencyLevel;
             vm.filterData.proficiencyLevel = $scope.selectedProficiency;
           }
           getBooksListsByFolderId();
        }
       }
 
       // session for InterestLevel
       if (sessionStorage.libraryReadingFilter != null){
         if ((sessionStorage.libraryReadingFilter).length != 0){
           var parsedInterestLevel = JSON.parse(sessionStorage.libraryReadingFilter);
           if (parsedInterestLevel[2].interestLevel != ''){
             $scope.selectedInterestLevel = parsedInterestLevel[2].interestLevel;
             vm.filterData.interestLevel = $scope.selectedInterestLevel;
           }
           getBooksListsByFolderId();
         }
       }
 
       // session for textType
       if (sessionStorage.libraryReadingFilter != null){
         if ((sessionStorage.libraryReadingFilter).length != 0){
           var parsedtextType = JSON.parse(sessionStorage.libraryReadingFilter);
           if (parsedtextType[3].textType != ''){
             $scope.selectedTextTypes = parsedInterestLevel[3].textType;
             vm.filterData.textType = $scope.selectedTextTypes;
           }
           getBooksListsByFolderId();
         }
       }
 
       // session for series
       if (sessionStorage.libraryReadingFilter != null){
         if ((sessionStorage.libraryReadingFilter).length != 0){
           var parsedseries = JSON.parse(sessionStorage.libraryReadingFilter);
           if (parsedseries[4].series != ''){
             $scope.selectedSeriesArr = parsedseries[4].series;
             vm.filterData.seriesId = parsedseries[4].series;
             for (var i=0;i<parsedseries[4].series.length;i++){
               $scope.selectedSeries.push(parsedseries[4].series[i].id);
             }
           }
           getBooksListsByFolderId();
         }
       }
 
       // session for topics
       if (sessionStorage.libraryReadingFilter != null){
         if ((sessionStorage.libraryReadingFilter).length != 0){
           var parsedtopics = JSON.parse(sessionStorage.libraryReadingFilter);
           if (parsedtopics[5].topics != ''){
             // console.log(parsedtopics[5].topics);
             $scope.selectedTopics = parsedtopics[5].topics;
             vm.filterData.topics = $scope.selectedTopics;
           }
           getBooksListsByFolderId();
         }
       }
       // session for programFilter
       if (sessionStorage.libraryReadingFilter != null){
         if ((sessionStorage.libraryReadingFilter).length != 0){
           var parsedprogramFilter = JSON.parse(sessionStorage.libraryReadingFilter);
           if (parsedprogramFilter[6].programFilter != ''){
             // console.log(parsedprogramFilter[6].programFilter);
             $scope.selectedProgram = parsedprogramFilter[6].programFilter;
             vm.filterData.programType = $scope.selectedProgram;
           }
           getBooksListsByFolderId();
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
 
     // ---------proficiency level filter--------------
 
     $scope.setProficiencyFilter = function (item) {
       var pos = $scope.selectedProficiency.indexOf(item.proficiency);
       var proficiencyLevel = JSON.parse(sessionStorage.libraryReadingFilter);
       if (pos == -1) {
         $scope.selectedProficiency.push(item.name);
         vm.filterData.proficiencyLevel = $scope.selectedProficiency;
         proficiencyLevel[1].proficiencyLevel = $scope.selectedProficiency;
         sessionStorage.setItem("libraryReadingFilter",JSON.stringify(proficiencyLevel));
         getBooksListsByFolderId();
       } else {
         $scope.selectedProficiency.splice(pos, 1);
         proficiencyLevel[1].proficiencyLevel.splice(pos,1);
         sessionStorage.setItem("libraryReadingFilter",JSON.stringify(proficiencyLevel));
         getBooksListsByFolderId();
       }
      // console.log('selected: ', $scope.selectedProficiency);
     };
     // ---------Interest level filter--------------
 
     $scope.setInterestsFilter = function (item) {
       //console.log('item',item);
       var pos = $scope.selectedInterestLevel.indexOf(item.displayName);
      // console.log('pos ', pos);
      var interestLevel = JSON.parse(sessionStorage.libraryReadingFilter);
       if (pos == -1) {
         $scope.selectedInterestLevel.push(item.displayName);
         vm.filterData.interestLevel = $scope.selectedInterestLevel;
         interestLevel[2].interestLevel = $scope.selectedInterestLevel;
         sessionStorage.setItem("libraryReadingFilter",JSON.stringify(interestLevel));
         getBooksListsByFolderId();
       } else {
         $scope.selectedInterestLevel.splice(pos, 1);
         interestLevel[2].interestLevel.splice(pos,1);
         sessionStorage.setItem("libraryReadingFilter",JSON.stringify(interestLevel));
         getBooksListsByFolderId();
       }
     };
     // ---------Text types filter--------------
 
 
     $scope.setTextTypeFilter = function (item) {
       var pos = $scope.selectedTextTypes.indexOf(item);
       var textType = JSON.parse(sessionStorage.libraryReadingFilter);
       if (pos == -1) {
         $scope.selectedTextTypes.push(item);
         vm.filterData.textType = $scope.selectedTextTypes;
         textType[3].textType = $scope.selectedTextTypes;
         sessionStorage.setItem("libraryReadingFilter",JSON.stringify(textType));
         getBooksListsByFolderId();
       } else {
         $scope.selectedTextTypes.splice(pos, 1);
         textType[3].textType.splice(pos,1);
         sessionStorage.setItem("libraryReadingFilter",JSON.stringify(textType));
         getBooksListsByFolderId();
       }
     };
 
     $scope.checkSubcategoryExist = function (category) {
       return category.subFilter.length > 0 ? true : false;
     };
 
     // ---------series level filter--------------
 
     $scope.setSeriesFilter = function (item) {
         var pos = $scope.selectedSeries.indexOf(item.id);
         var series = JSON.parse(sessionStorage.libraryReadingFilter);
         if (pos == -1) {
               $scope.selectedSeries.push(item.id);
               $scope.selectedSeriesArr.push(item);
               vm.filterData.seriesId = $scope.selectedSeries;
               series[4].series = $scope.selectedSeriesArr;
               sessionStorage.setItem("libraryReadingFilter",JSON.stringify(series));
               getBooksListsByFolderId();
         } else {
             $scope.selectedSeries.splice(pos, 1);
              $scope.selectedSeriesArr.splice(pos, 1);
              series[4].series.splice(pos,1);
              sessionStorage.setItem("libraryReadingFilter",JSON.stringify(series));
              getBooksListsByFolderId();
         }
 
     };
 
     // ---------topics level filter--------------
 
     $scope.setTopicsFilter = function (item) {
       var pos = $scope.selectedTopics.indexOf(item);
       var topics = JSON.parse(sessionStorage.libraryReadingFilter);
       if (pos == -1) {
         $scope.selectedTopics.push(item);
         vm.filterData.topics = $scope.selectedTopics;
         topics[5].topics = $scope.selectedTopics;
         sessionStorage.setItem("libraryReadingFilter",JSON.stringify(topics));
         getBooksListsByFolderId();
       } else {
         $scope.selectedTopics.splice(pos, 1);
         topics[5].topics.splice(pos,1);
         sessionStorage.setItem("libraryReadingFilter",JSON.stringify(topics));
         getBooksListsByFolderId();
       }
     };
 
     // ---------program type filter--------------
 
     $scope.setProgramFilter = function (item) {
       var pos = $scope.selectedProgram.indexOf(item.displayName);
       var programFilter = JSON.parse(sessionStorage.libraryReadingFilter);
       if (pos == -1) {
         $scope.selectedProgram.push(item.displayName);
         vm.filterData.programType = $scope.selectedProgram;
         programFilter[6].programFilter = $scope.selectedProgram;
         sessionStorage.setItem("libraryReadingFilter",JSON.stringify(programFilter));
         getBooksListsByFolderId();
       } else {
         $scope.selectedProgram.splice(pos, 1);
         programFilter[6].programFilter.splice(pos,1);
         sessionStorage.setItem("libraryReadingFilter",JSON.stringify(programFilter));
         getBooksListsByFolderId();
       }
     };
 
     $scope.clearFilter = function (filter, item, origin,key) {
       if(origin == "series"){
         var pos = $scope.selectedSeries.indexOf(item.id);
         var series = JSON.parse(sessionStorage.libraryReadingFilter);
         var position = series[4].series.indexOf(item.id);
         series[4].series.splice(position,1);
         sessionStorage.setItem("libraryReadingFilter",JSON.stringify(series));
         filter.splice(filter.indexOf(item.id), 1);
         $scope.selectedSeries.splice(filter.indexOf(item), 1);
       }else{
         if (key == 'proficiencyLevel'){
           var proficiencyLevel = JSON.parse(sessionStorage.libraryReadingFilter);
           var position = proficiencyLevel[1].proficiencyLevel.indexOf(item);
           proficiencyLevel[1].proficiencyLevel.splice(position,1);
           sessionStorage.setItem("libraryReadingFilter",JSON.stringify(proficiencyLevel));
           filter.splice(filter.indexOf(item), 1);
         }
         if (key == 'interestLevel'){
           var interestLevel = JSON.parse(sessionStorage.libraryReadingFilter);
           var position = interestLevel[2].interestLevel.indexOf(item);
           interestLevel[2].interestLevel.splice(position,1);
           sessionStorage.setItem("libraryReadingFilter",JSON.stringify(interestLevel));
           filter.splice(filter.indexOf(item), 1);
         }
         if (key == 'textType'){
           var textType = JSON.parse(sessionStorage.libraryReadingFilter);
           var position = textType[3].textType.indexOf(item);
           textType[3].textType.splice(position,1);
           sessionStorage.setItem("libraryReadingFilter",JSON.stringify(textType));
           filter.splice(filter.indexOf(item), 1);
         }
         if (key == 'topics'){
           var topics = JSON.parse(sessionStorage.libraryReadingFilter);
           var position = topics[5].topics.indexOf(item);
           topics[5].topics.splice(position,1);
           sessionStorage.setItem("libraryReadingFilter",JSON.stringify(topics));
           filter.splice(filter.indexOf(item), 1);
         }
         if (key == 'programType'){
           var programFilter = JSON.parse(sessionStorage.libraryReadingFilter);
           var position = programFilter[6].programFilter.indexOf(item);
           programFilter[6].programFilter.splice(position,1);
           sessionStorage.setItem("libraryReadingFilter",JSON.stringify(programFilter));
           filter.splice(filter.indexOf(item), 1);
         }
       }
       getBooksListsByFolderId();
     };
 
     /*get all folders */
     function getAllFoldersLists(folder) {
       if (!folder) {
         folder = "";
       }
       bookServices.getAllFolders().then(function (data) {
         if (data.data && data.data.allFolder && data.data.allFolder.length >= 0) {
           vm.folders = data.data.allFolder;
           vm.folders.forEach(function (f, index) {
             if (f.id === "ROOTFOLDER") {
               f.folderName = "Main Folder";
             }
             if (f.id === vm.folderSelected.id) {
               //console.log("came here1");
               vm.folders.splice(index, 1);
               var search = JSON.parse(sessionStorage.libraryReadingFilter);
               search[7].folderName.bookCount = f.bookCount;
               sessionStorage.setItem("libraryReadingFilter",JSON.stringify(search));
             }
 
           });
           if (vm.folderSelected == '') {
             vm.folderSelected = data.data.allFolder[0];
           } else {
             //to get count of moved folder
             for (var i = 0; i < data.data.allFolder.length; i++) {
               if (data.data.allFolder[i].id == folder.id) {
                 vm.folderSelected = data.data.allFolder[i];
               }
             }
           }
 
         } else {
 
         }
         getBooksListsByFolderId();
       });
     }
 
     // librarySearchKeyword
     $scope.librarySearchKeyword = function() {
       // console.log($scope.books);
       // console.log("from search");
       // console.log($scope.searchKeyword);
       vm.books = $filter('filter')($scope.books, $scope.searchKeyword);
       // console.log(vm.books);
       //vm.books = '';
       var searchKeyword = JSON.parse(sessionStorage.libraryReadingFilter);
       searchKeyword[0].searchKeyword = $scope.searchKeyword;
       sessionStorage.setItem("libraryReadingFilter",JSON.stringify(searchKeyword));
 
     };
 
     /*get my library books*/
     function getBooksListsByFolderId() {
       	var loaderDiv = '<div class="loader"></div>';
       	$(loaderDiv).appendTo('body');
 
       	if (vm.folderSelected) {
             if (sessionStorage.libraryReadingFilter != null){
               var search = JSON.parse(sessionStorage.libraryReadingFilter);
               if (  search[7].folderName != ''){
                   $scope.rootFolder = search[7].folderName.folderName;
                   vm.folderSelected =  search[7].folderName;
                   if (search[0].searchKeyword != ''){
                     $scope.searchKeyword =search[0].searchKeyword;
                   }
               }
               else{
                 if (vm.folderSelected.id === 'ROOTFOLDER') {
                     $scope.rootFolder = 'Main Folder';
                 }
              }
           }
         	bookServices.getBooksByFolderId(vm.folderSelected.id, vm.filterData).then(function (response) {
 	        	if(response.status === 200){
 	        		var mainBook = response.data.books;
 		          	vm.books = mainBook;
                 $scope.books = mainBook;
                 if (sessionStorage.libraryReadingFilter != null){
                   var Keyword = JSON.parse(sessionStorage.libraryReadingFilter);
                     if (Keyword[0].searchKeyword != ''){
                       // console.log("if present");
                       $scope.searchKeyword = Keyword[0].searchKeyword;
                       vm.books = $filter('filter')(mainBook, $scope.searchKeyword);
                       $scope.books = mainBook;
                     }
                     else{
                       // console.log("else Part plus vm.books");
                       //vm.books = mainBook;
                       $scope.books = mainBook;
                     }
 		          	if (vm.folderSelected.id != "ROOTFOLDER") {
 		           	 	var selText = vm.folderSelected.folderName + "(" + vm.folderSelected.bookCount + ")";
 		            	$('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
 		          	} else {
                       vm.folderSelected.folderName = 'Main Folder';
                         $scope.books = mainBook;
                       }
 		          	}
 		          	$('.loader').remove();
 	        	} else{
 	        		$('.loader').remove();
 	        	}
         	}, function(){
         		$('.loader').remove();
         	});
       	}else{
       		$('.loader').remove();
       	}
     }
 
 
     function isLeftNavActive() {
       if (leftNavActive) {
         return 'is-active';
       }
     }
 
     function toggleLeftNav() {
       leftNavActive = (leftNavActive) ? false : true;
     }
 
     function exitToMain() {
       return $location.path('/home');
     }
 
     function readBook(book) {
       $cookies.put('bookOrigin', 'myLibrary');
       $state.go('book', {bookId: book.bookId});
     }
 
     function gotoQuiz(book) {
       $cookies.put('bookOrigin', 'myLibrary');
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
 
     //select all books with filter
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
 
 
     //disable button
     $scope.bookSelected = function () {
       var count = 0;
       angular.forEach(vm.books, function (books) {
         if (books.book.selected) count++;
       });
       return count;
     };
 
     function pickFolder(folder) {
       vm.folderSelected = folder;
       getAllFoldersLists(vm.folderSelected);
     };
 
     $scope.isSelectedFolderActive = function (folder) {
       return vm.folderSelected === folder;
     };
 
     function setSelectedFolder(folder) {
       $scope.selectedAll = false;
       var selText = folder.folderName + "(" + folder.bookCount + ")";
       //console.log("seltext", selText);
       $('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
       vm.folderSelected = folder;
       var folderName = JSON.parse(sessionStorage.libraryReadingFilter);
       folderName[7].folderName = folder;
       sessionStorage.setItem("libraryReadingFilter",JSON.stringify(folderName));
       var loaderDiv = '<div class="loader"></div>';
       $(loaderDiv).appendTo('body');
       getAllFoldersLists(vm.folderSelected);
     }
 
 
     //-----------------------------------------FOLDER SECTION ---------------------------------------------------
 
     //Add to folder
     $scope.showModalAddFolder = function () {
     	var loaderDiv = '<div class="loader"></div>';
 	  	$(loaderDiv).appendTo('body'); //Add Loader
 
       var modalInstance = $uibModal.open({
         "animation": true,
         "templateUrl": 'views/modals/addToFolder.html',
         "controller": "AddToFolderMyLibraryCtrl",
         resolve: {
           items: function () {
             return vm.folders;
           },
           items2: function () {
             return vm.folderSelected.id;
           }
         }
       });
       modalInstance.result.then(function (folder) {
         var bookIds = [];
         for (var i = 0; i < vm.books.length; i++) {
           if (vm.books[i].book.selected === true) {
             bookIds.push(vm.books[i].book.bookId);
 
           }
         }
         bookServices.removeBooksFromFolder(vm.folderSelected.id, bookIds).then(function (data) {
           if (data.status == 200) {
             bookServices.AddBooksToFolder(folder.id, bookIds).then(function (data) {
               if (data.status === 200) {
                 messageModal(data.data.message);
                 $scope.selectedAll = false; //unchecked all select
                 $scope.searchKeyword = '';
         
                 getAllFoldersLists(folder);
               }
               $('.loader').remove(); //remove Loader
             }, function (data) {
 				$('.loader').remove(); //remove Loader
             });
           }else{
           	$('.loader').remove(); //remove Loader
           }
         });
       }, function () {
       	$('.loader').remove(); //remove Loader
         // console.log('Modal dismissed at: ' + new Date());
       });
     };
 
     //create folder
     $scope.showModalCreateFolder = function () {
       var modalInstance = $uibModal.open({
         "animation": true,
         "templateUrl": 'views/modals/createFolder.html',
         "controller": "createFolderCtrl",
         resolve: {
           items: function () {
             return [];
           }
         }
       });
       modalInstance.result.then(function (formData) {
         bookServices.createFolder(formData).then(function (data) {
           	if (data){
 	            if (data.status === 422) {
 	              	messageModal(data.data.message.message);
 	            }else if(data.status === 200){
 	            	messageModal(data.data.message);
 	            	getAllFoldersLists();
 	            }
           	}
         }, function (data) {
 
         });
       }, function () {
         // console.log('Modal dismissed at: ' + new Date());
       });
     };
 
     //update folder
     $scope.editFolder = function (folder) {
       var modalInstance = $uibModal.open({
         "animation": true,
         "templateUrl": 'views/modals/editFolder.html',
         "controller": "EditFolderCtrl",
         resolve: {
           items: function () {
             return folder;
           }
         }
       });
       modalInstance.result.then(function (formData) {
         if (formData.type == "EDIT") {
           bookServices.updateFolder(folder.id, formData).then(function (data) {
           	// console.log('folder: ', data);
           	if (data){
 	            if (data.status === 422) {
 	              	messageModal(data.data.message.message);
 	            }else if(data.status === 200){
 	            	messageModal(data.data.message);
 	            	getAllFoldersLists(folder);
 	            }
           	}
           }, function (data) {
           	// console.log('eeee: ', data);
           });
         }
         if (formData.type == "DELETE") {
 	        var modalInstance = $uibModal.open({
 		        "animation": true,
 		        "templateUrl": 'views/modals/yesOrNotModal.html',
 		        "controller": "yesOrNoModalCtrl",
 		        "size": "sm",
 		        resolve: {
 		            items: function () {
 		              return 'Are you sure you want to delete folder ?';
 		            }
 		        }
 	    	});
 	    	modalInstance.result.then(function (data) {
 	    		// console.log('modal: ', data);
 	    		if(data === 'ok'){
 		    		bookServices.deleteFolder(folder.id, formData).then(function (data) {
 		    			// console.log('dd: ', data);
 		            if (data.data.status === 1000) {
 			        	messageModal(data.data.message);
 		              	getAllFoldersLists(folder);
 		            }
 		          }, function (data) {
 		          	// console.log('error: ', data);
 		            if (data.data && data.data.message) {
 			        	messageModal(data.data.message.message);
 		            }
 		          });
 		        }
 	    	}, function () {
 				// console.log('Modal dismissed at: ' + new Date());
 			});
         }
 
       });
     };
 
     //Remove books from folder
     $scope.showModalRemovefromFolder = function () {
       	var loaderDiv = '<div class="loader"></div>';
 	  	$(loaderDiv).appendTo('body'); //Add Loader
 
       	var modalInstance = $uibModal.open({
         	"animation": true,
         	"templateUrl": 'views/modals/confirmModal.html',
         	"controller": "confirmModalCtrl",
         	resolve: {
           		items: function () {
             		return vm.folderSelected;
           		}
         	}
       	});
       	modalInstance.result.then(function (folder) {
 	        $scope.items = [];
 	        for (var i = 0; i < vm.books.length; i++) {
 	          if (vm.books[i].book.selected === true) {
 	            $scope.items.push(vm.books[i].book.bookId);
 	          }
 	        }
 	        if($scope.searchKeyword){
 
 		        var filtered = filter($scope.items, $scope.searchKeyword);
 		      	angular.forEach(filtered, function(item) {
 		         	item.selected = true;
 		      	});
 	        }
 	        bookServices.removeBooksFromFolder(folder.id, $scope.items).then(function (data) {
 	          	if (data.data && data.data.message) {
                 messageModal(data.data.message);
 	          		$scope.selectedAll = false; //unchecked all select
                 $scope.searchKeyword = '';
 
 	          		getAllFoldersLists(folder);
 	          	}
 	          	$('.loader').remove(); //remove Loader
 	        }, function (data) {
         		$('.loader').remove(); //remove Loader
 	          	if (data.data && data.data.message) {
 	            	messageModal(data.data.message.message);
 	          	}
         	});
       	}, function () {
       		$('.loader').remove(); //remove Loader
         	// console.log('Modal dismissed at: ' + new Date());
       });
     };
 
 
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
 //-----------------------------------------MODAL SECTION -----------------------------------------------------
 //Create folder section
 angular.module('nanhaiMainApp').controller('createFolderCtrl', function ($scope, $uibModalInstance, items) {
 
   $scope.items = items;
   //$scope.pattern = '^[a-zA-Z0-9 ._-]+$';  //pattern validation (space, dot, _ and -)
 
   $scope.submitForm = function () {
     var formData = {
       "folderName": $scope.folderName
     };
     //if ($scope.create_teacher_form.$valid) {
     $uibModalInstance.close(formData);
     //}
 
   };
 
   $scope.closeModal = function () {
     $uibModalInstance.dismiss('cancel');
   };
 });
 
 //update folder section
 angular.module('nanhaiMainApp').controller('EditFolderCtrl', function ($scope, $uibModalInstance, items) {
   $scope.folderName = items.folderName;
 
   $scope.submitForm = function () {
     var formData = {
       "folderName": $scope.folderName,
       "type": "EDIT"
     };
     $uibModalInstance.close(formData);
   };
   $scope.deleteFolder = function () {
    // console.log('delete button clicked');
     var formData = {
       "folderName": $scope.folderName,
       "type": "DELETE"
     };
     $uibModalInstance.close(formData);
   };
   $scope.closeModal = function () {
     $uibModalInstance.dismiss('cancel');
   };
 });
 
 
 angular.module('nanhaiMainApp').controller('AddToFolderMyLibraryCtrl', function ($scope, $uibModalInstance, items, items2, bookServices) {
 
   $scope.folders = [];
   $scope.folders = items;
   // console.log('$scope.folders:' , $scope.folders);
   // console.log('items:' , items);
   // console.log('length:' , items.length);
   // console.log('items2:' , items2);
   $scope.selectedFolderInModal = items2;
 
   $scope.setSelected = function (folder) {
     $scope.idSelectedFolder = folder;
   };
   $scope.submitForm = function () {
     $uibModalInstance.close($scope.idSelectedFolder);
   };
   $scope.closeModal = function () {
     $uibModalInstance.dismiss('cancel');
   };
 
 
 
 
 });
 //add book to the library
 angular.module('nanhaiMainApp').controller('AddToFolderCtrl', function ($scope, $uibModalInstance, items, bookServices) {
 
   $scope.folders = [];
   $scope.folders = items;
 
   function getAllFoldersLists() {
       return bookServices.getAllFolders().then(function (data) {
         if (data.data && data.data.allFolder && data.data.allFolder.length >= 0) {
           var folders = data.data.allFolder;
           folders.forEach(function (f, index) {
             if (f.id === "ROOTFOLDER") {
               f.folderName = "Main Folder";
             }
           });
           return folders;
         } else {
           // console.log("no data");
           return null;
         }
       });
     }
 
 
 
   if (!$scope.folders) {
     getAllFoldersLists().then(function (rs) {
       $scope.folders = rs;
       // console.log('items $scope.folders:' , $scope.folders);
     });
   }
 
 
   $scope.$watch('folders', function (newV) {
     if (newV && newV[0].id === "ROOTFOLDER") {
       newV[0].folderName = 'Main Folder';
     }
     $scope.idSelectedFolder = null;
   });
 
   $scope.setSelected = function (folder) {
     $scope.idSelectedFolder = folder;
   };
   $scope.submitForm = function () {
     $uibModalInstance.close($scope.idSelectedFolder);
   };
   $scope.closeModal = function () {
     console.log("came inside to cancel modal");
     $('.loader').remove(); //remove Loader
     $uibModalInstance.dismiss('cancel');
   };
 
   // $scope.pickFolder= function(folder) {
   //   console.log(folder);
   // };
 });
 //delete books from folder
 angular.module('nanhaiMainApp').controller('confirmModalCtrl', function ($scope, $uibModalInstance, items) {
   //console.log(items);
   $scope.submitForm = function () {
     //console.log('Modal submitted');
     $uibModalInstance.close(items);
   };
 
   $scope.closeModal = function () {
     //console.log('Modal dismissed');
     $uibModalInstance.dismiss('cancel');
   };
 });
 
 //-------------------modal controoler--------------
 angular.module('nanhaiMainApp')
 .controller('yesOrNoModalCtrl', function($scope, $uibModalInstance, items) {
 
 	$scope.getItems = items;
 
   	$scope.ok = function() {
     	$uibModalInstance.close('ok');
 	};
 	$scope.cancel = function() {
     	$uibModalInstance.dismiss('cancel');
 	};
 });

 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:AssignmentCtrl
  * @description
  * # AssignmentCtrl
  * Controller of the nanhaiMainApp
  */
 
 angular.module('nanhaiMainApp')
   .controller('AssignmentCtrl', function (classServices, $cookies, $filter, $state, bookServices, $scope,
   																	$location, $stateParams, $uibModal) {
 
     var vm = this;
     var leftNavActive = false;
     vm.books = [];
     vm.allclasses = [];
     vm.classPicked = '';
     vm.assignmentDueDate = '';
     vm.progress = 0;
     vm.isLeftNavActive = isLeftNavActive;
     vm.toggleLeftNav = toggleLeftNav;
     vm.exitToMain = exitToMain;
     vm.readBook = readBook;
     vm.gotoQuiz = gotoQuiz;
 	vm.folderList = [];
 	vm.clickAssignmentFolder = clickAssignmentFolder;
 	vm.assignmentInstructionModal = assignmentInstructionModal;
 	vm.assignmentId = $stateParams.assignmentId;
 	$cookies.put('cookieAssignmentId', vm.assignmentId);
 
 	vm.filterData = {};
   if (sessionStorage.assignmentFilter == null ){
 
       var assignmentFilter = [{'searchKeyword':''},{'assignmentFolderSearchKeyword':''}];
       sessionStorage.setItem("assignmentFilter",JSON.stringify(assignmentFilter));
   }
 
     init();
 
 // Start of search and remove
     $scope.clearAll = function(){
       $scope.searchKeyword = '';
       var Keyword = JSON.parse(sessionStorage.assignmentFilter);
       Keyword[0].searchKeyword = '';
       sessionStorage.setItem("assignmentFilter",JSON.stringify(Keyword));
       clear();
     };
 
   $scope.removeAll = function(){
     // console.log("change search keywords");
     var Keyword = JSON.parse(sessionStorage.assignmentFilter);
     Keyword[0].searchKeyword = '';
       sessionStorage.setItem("assignmentFilter",JSON.stringify(Keyword));
       clear();
   };
   function clear(){
     vm.books= $filter('filter')($scope.books, '');
     var assignmentFolderSearchKeyword = JSON.parse(sessionStorage.assignmentFilter);
     assignmentFolderSearchKeyword[1].assignmentFolderSearchKeyword = $scope.searchKeyword;
     sessionStorage.setItem("assignmentFilter",JSON.stringify(assignmentFolderSearchKeyword));
     getMyLiveAssignmentsList();
   }
 
   // End of search and remove
 
     function init() {
       vm.pagePath = $location.path();
       getClassesList();
 
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
       vm.proficiencies = [];
       for (var i = 0; i < 20; i++) {
         var pr = {
           proficiency: i+1
         };
         vm.proficiencies.push(pr);
       }
 
     }
 
     /*init*/
 
     /*get all my classes*/
     function getClassesList() {
 
       classServices.getClasses().then(function (response) {
         vm.allclasses = response.data;
         //preselect first class
         vm.classPicked = vm.allclasses[0];
         if($cookies.get('cookieClassPicked') == undefined){
           $cookies.put('cookieClassPicked', vm.allclasses[0].classId);
         }
 
         if($cookies.get('cookieClassPicked') != undefined){
           var picked = $cookies.get('cookieClassPicked');
             for (var i = 0; i < vm.allclasses.length; i++) {
                  if(vm.allclasses[i].classId == picked){
                    vm.classPicked = vm.allclasses[i];
                  }
               }
         }
 
 
           if (vm.assignmentId !== undefined && $state.current.url == "/assignment/:assignmentId") {
             // console.log("with assignment Id");
               getMyLiveAssignment();
           }else if($state.current.url == "/assignment") {
             // console.log("without Id");
               getMyLiveAssignmentsList();
           }
       });
     }
 
     //get all my assignment's folder
     function getMyLiveAssignmentsList() {
       // console.log("came here to check live assignment list");
       var loaderDiv = '<div class="loader"></div>';
       $(loaderDiv).appendTo('body');
       if (vm.classPicked) {
         classServices.getAssignmentsByClassId(vm.classPicked.classId).then(function (response) {
           $('.loader').remove();
           if (response.data.length > 0) {
             // Get searchKeyword from sessionStorage
             if (sessionStorage.assignmentFilter != null){
               var Keyword = JSON.parse(sessionStorage.assignmentFilter);
                 if (Keyword[0].searchKeyword != ''){
                   $scope.searchKeyword = Keyword[0].searchKeyword;
                   vm.folderList = $filter('filter')(response.data, $scope.searchKeyword);
                   $scope.folderList = response.data;
                 }
                 else{
                   vm.folderList = response.data;
                   $scope.folderList = vm.folderList;
                   vm.NoAssignment = '';
                 }
             }
           } else {
           	 vm.folderList = [];
              $scope.folderList = [];
           	 vm.NoAssignment = 'Live assignment is not available';
           }
         });
       }
     }
 
 	//pick assignment from folder
 	function clickAssignmentFolder(assignmentFolder) {
     var loaderDiv = '<div class="loader"></div>';
     $(loaderDiv).appendTo('body');
     var id = assignmentFolder.assignment.id;
 		$state.go('folderAssignment', {assignmentId: id});
 	}
 
 	// get my assignment from folder
     function getMyLiveAssignment() {
       // console.log("came here to check live assignment");
       var loaderDiv = '<div class="loader"></div>';
       $(loaderDiv).appendTo('body');
       	if (vm.classPicked && vm.assignmentId) {
      		classServices.getAssignmentBooks(vm.classPicked.classId, vm.assignmentId).then(function (response) {
           // console.log("getAssign",response);
 				if (response.data) {
           $('.loader').remove();
 					//console.log("getAssignmentBooks: ", response.data);
           $cookies.put('assignmentSettings', response.data.assignment.settings.language);
 
 		            vm.noOfBookToBeRead = response.data.assignment.noOfBookToBeRead;
 		            vm.assignmentName = response.data.assignment.name;
                 	vm.instruction = response.data.assignment.instruction;
                 	// console.log('vm.instruction: ', vm.instruction);
                   vm.instructionTrueOrFalse = response.data.assignment.instructionTrueOrFalse;
 		            //vm.assignmentDueDate = $filter('date')(response.data.assignment.endDate, 'M/d/yy');
 		          	vm.assignmentDueDate = response.data.assignment.endDateUtc;
                     vm.progress = response.data.overallProgress;
                     // Check value in session before response comes from API
                     if (sessionStorage.assignmentFilter != null){
                       var Keyword = JSON.parse(sessionStorage.assignmentFilter);
                         if (Keyword[1].assignmentFolderSearchKeyword != ''){
                           $scope.searchKeyword = Keyword[1].assignmentFolderSearchKeyword;
                           vm.books = $filter('filter')(response.data.bookProgress, $scope.searchKeyword);
                           $scope.books = response.data.bookProgress;
                         }
                         else{
                           vm.books = response.data.bookProgress;
                           $scope.books = response.data.bookProgress;
                         }
                     }
                     if(vm.instructionTrueOrFalse == false){
                       vm.instruction = 'No Instructions';
                     }
           		}
         	});
       	}
     }
 
 	 //assignmentInstructionModal
    	function assignmentInstructionModal(instruction) {
       var modalInstance = $uibModal.open({
         "animation": true,
         "templateUrl": 'views/modals/assignmentInstruction.html',
         "controller": "AssignmentInstructionCtrl",
         resolve: {
           items: function () {
             return instruction;
           }
         }
       });
       modalInstance.result.then(function (folder) {
 
       });
     };
 
     // assignmentFolderSearchQuery
     $scope.assignmentFolderSearchQuery = function() {
       vm.books= $filter('filter')($scope.books, $scope.searchKeyword);
       var assignmentFolderSearchKeyword = JSON.parse(sessionStorage.assignmentFilter);
       assignmentFolderSearchKeyword[1].assignmentFolderSearchKeyword = $scope.searchKeyword;
       sessionStorage.setItem("assignmentFilter",JSON.stringify(assignmentFolderSearchKeyword));
     };
 
     $scope.pickClass = function () {
         if($cookies.get('cookieClassPicked') != undefined){
           $cookies.put('cookieClassPicked', vm.classPicked.classId);
         }else{
           $cookies.remove('cookieClassPicked');
           $cookies.put('cookieClassPicked', vm.classPicked.classId);
         }
       	getMyLiveAssignmentsList();
     };
     // SearchKeyword Functioanlity
     $scope.searchQuery = function() {
       // console.log($scope.searchKeyword);
       if ($scope.folderList == ''){
           vm.NoAssignment = '';
       }
       vm.folderList= $filter('filter')($scope.folderList, $scope.searchKeyword);
       var searchKeyword = JSON.parse(sessionStorage.assignmentFilter);
       searchKeyword[0].searchKeyword = $scope.searchKeyword;
       sessionStorage.setItem("assignmentFilter",JSON.stringify(searchKeyword));
     };
 
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
 
          $scope.count = 0;
 
 
       	var filtered = filter($scope.items, $scope.searchKeyword);
       //  console.log($scope.searchKeyword);
       	angular.forEach(filtered, function(item) {
          	item.selected = $scope.selectedAll;
       	});
 
    	};
 
 
     //disable button
     $scope.bookSelected = function () {
       var count = 0;
       angular.forEach(vm.books, function (books) {
         if (books.book.selected) {
           count++;
         }
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
           }
         }
         bookServices.AddBooksToFolder(folder.id, bookIds).then(function (data) {
           if (data.data && data.data.message) {
           	var seccess = data.data.message;
 	        messageModal(seccess);
 
 	        $scope.searchKeyword = '';
             getMyLiveAssignmentsList();
           }
         }, function (data) {
           if (data.data && data.data.message) {
             var error = data.data.message.propertyName + ': ' + data.data.message.message;
 	        messageModal(error);
           }
         });
       });
     };
 
 
    /*
     //Add to library
        $scope.addToMyLibrary = function () {
          var bookIds = [];
          for (var i = 0; i < vm.books.length; i++) {
            if (vm.books[i].book.selected === true) {
              bookIds.push(vm.books[i].book.bookId);
            }
          }
          bookServices.AddBooksToFolder('ROOTFOLDER', bookIds).then(function (data) {
            if (data.data && data.data.message) {
              window.alert(data.data.message);
              getMyLiveAssignmentsList();
            }
          }, function (data) {
            if (data.data && data.data.message) {
              window.alert(data.data.message.propertyName + ': ' + data.data.message.message);
            }
          });
        };*/
 
 
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
       $cookies.put('bookOrigin', 'assignment/' + vm.assignmentId);
       $state.go('book', {bookId: book.bookId});
     }
 
     function gotoQuiz(book) {
       $cookies.put('bookOrigin', 'assignment/' + vm.assignmentId);
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
 
 	 // ---------proficiency level filter--------------
     $scope.selectedProficiency = [];
     $scope.setProficiencyFilter = function (item) {
       var pos = $scope.selectedProficiency.indexOf(item);
       if (pos == -1) {
             $scope.selectedProficiency = [];
             $scope.selectedProficiency.push(item);
             vm.filterData.proficiencyLevel = $scope.selectedProficiency;
             getLevelReadingList();
       } else {
           $scope.selectedProficiency.splice(pos, 1);
           getLevelReadingList();
       }
     };
     // ---------Text types filter--------------
     $scope.selectedTextTypes = [];
     $scope.setTextTypeFilter = function (item) {
         var pos = $scope.selectedTextTypes.indexOf(item);
         if (pos == -1) {
               $scope.selectedTextTypes.push(item);
               vm.filterData.textType = $scope.selectedTextTypes;
               getLevelReadingList();
         } else {
             $scope.selectedTextTypes.splice(pos, 1);
             getLevelReadingList();
         }
     };
     // ---------Interest level filter--------------
     $scope.selectedInterestLevel = [];
     $scope.setInterestsFilter = function (item) {
         var pos = $scope.selectedInterestLevel.indexOf(item);
         if (pos == -1) {
               $scope.selectedInterestLevel.push(item);
               vm.filterData.interestLevel = $scope.selectedInterestLevel;
               getLevelReadingList();
         } else {
             $scope.selectedInterestLevel.splice(pos, 1);
             getLevelReadingList();
         }
     };
     $scope.checkSubcategoryExist = function(category){
       return category.subFilter.length > 0 ? true : false;
     };
     // ---------series level filter--------------
     $scope.selectedSeries     = [];
     $scope.selectedSeriesArr  = [];
     $scope.setSeriesFilter = function (item) {
     		var pos = $scope.selectedSeries.indexOf(item.id);
         if (pos == -1) {
               $scope.selectedSeries.push(item.id);
               $scope.selectedSeriesArr.push(item);
               vm.filterData.seriesId = $scope.selectedSeries;
               getLevelReadingList();
         } else {
             $scope.selectedSeries.splice(pos, 1);
              $scope.selectedSeriesArr.splice(pos, 1);
             getLevelReadingList();
         }
 
     };
     // ---------topics level filter--------------
     $scope.selectedTopics  = [];
     $scope.setTopicsFilter = function (item) {
         var pos = $scope.selectedTopics.indexOf(item);
         if (pos == -1) {
               $scope.selectedTopics.push(item);
               vm.filterData.topics = $scope.selectedTopics;
               getLevelReadingList();
         } else {
             $scope.selectedTopics.splice(pos, 1);
             getLevelReadingList();
         }
     };
     // ---------program type filter--------------
     $scope.selectedProgram  = [];
     $scope.setProgramFilter = function (item) {
         var pos = $scope.selectedProgram.indexOf(item);
         if (pos == -1) {
               $scope.selectedProgram.push(item);
               vm.filterData.programType = $scope.selectedProgram;
               getLevelReadingList();
         } else {
             $scope.selectedProgram.splice(pos, 1);
             getLevelReadingList();
         }
     };
 
     $scope.clearFilter = function (filter, item, origin) {
 
       if(origin == "series"){
         var pos = $scope.selectedSeries.indexOf(item.id);
         filter.splice(filter.indexOf(item.id), 1);
         $scope.selectedSeries.splice(filter.indexOf(item), 1);
       }else{
         filter.splice(filter.indexOf(item), 1);
       }
       getLevelReadingList();
     };
 
 
     /*
     function getLevelReadingList(){
           bookServices.getLevelReading(vm.filterData).then(function(response){
             vm.books = response.data;
           });
         }*/
 
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
 
 
 
 //-------------------modal controoler--------------
 angular.module('nanhaiMainApp')
 .controller('AssignmentInstructionCtrl', function($scope, $uibModalInstance, items) {
 
 	if(items !== null){
 		$scope.getItems = items;
 		$scope.getHeader = 'header';
 		$scope.noItems ='';
 	}else{
 		$scope.noItems = "No Instructions!";
 		$scope.getItems = '';
 		$scope.getHeader = '';
 	}
 
 	$scope.cancel = function() {
     	$uibModalInstance.dismiss('cancel');
 	};
 });

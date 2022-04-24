 'use strict';
 
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:ReportCtrl
  * @description
  * # ReportCtrl
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('ReportCtrl', function ($scope, userServices, profileService, bookServices, classServices, $filter, $cookies,
   												$uibModal, $state, $location) {
 
     window.report = $scope;
     var vm = this;
     vm.currentAssignments = [];
     vm.previousAssignments = [];
     vm.readhistory = [];
     vm.books = [];
     vm.levelbooks = [];
     vm.allclasses = [];
     vm.classPicked = '';
     vm.classRank = '';
     vm.levelPicked = '';
     vm.assignmentPicked = '';
     vm.assignments = [];
     vm.assignmentBooks = [];
     vm.filterData = {};
     vm.readBook = readBook;
 	vm.gotoQuiz = gotoQuiz;
 	vm.pagePath = '';
 	vm.scrollupClick = scrollupClick;
     $scope.currentAvatar = {};
 
     for (var i = 0; i < 1; i++) {
       var book = {
         title: 'Week 1 warm up',
         createdDate: '8/26/2015',
         dueDate: '9/26/2015',
         progress: '50'
       };
       vm.currentAssignments.push(book);
     }
 
     for (var i = 0; i < 5; i++) {
       var book = {
         title: 'Week 1 warm up',
         createdDate: '8/26/2015',
         dueDate: '9/26/2015',
         progress: '50'
       };
       vm.previousAssignments.push(book);
     }
 
     for (var j = 0; j < 5; j++) {
       var book1 = {
         bookTitle: 'Week 1 warm up',
 
       };
       vm.books.push(book1);
     }
 
     init();
 
     function init() {
     	vm.pagePath = $location.path();
     	vm.busy = false;
       	vm.page = 0;
       	vm.prevPage = 0;
       	vm.limit = 20;
     	getUserProfile();
       	getClassesList();
       	getLeaderBoards();
       	// getAvatar();
     }
 
 	//getProfile
 	function getUserProfile() {
     // console.log("Profile Sessionstorage::",profileService.getData('profileData'));
      //vm.profile = profileService.getData('profileData');
     userServices.getProfile().then(function(response){
     	if(response.status === 200){
         vm.profile = response.data;
         // console.log("vm.profile ", vm.profile );
         vm.role  = vm.profile.role[0];
         if (vm.profile.role[0] === 'INDIVIDUAL') {
           $scope.isAssignment = false;
           $('#ProgressReading').addClass('in');
           $('#ProgressReading').addClass('active');
         } else {
             $scope.isAssignment = true;
         }
         // console.log("Profile", vm.profile);
         //Filter current level
         if (vm.profile.level) {
             vm.filterData.proficiencyLevel = [vm.profile.level];
             getLevelReadingBooks();  //get Current Level book
         }
     	}
       }, function (data) {
       	// console.log('error: ', data);
       });
 
 
       	 	/*userServices.getProfile().then(function (response) {
             		if(response.status === 200){
       		        vm.role = response.data.role[0];
       		        vm.profile = response.data;
       		        //console.log("vm.profile:" , vm.profile);
       		        if (vm.profile.role[0] === 'INDIVIDUAL') {
       		          	$scope.isAssignment = false;
       		          	$('#ProgressReading').addClass('in');
       		          	$('#ProgressReading').addClass('active');
       		        } else {
       		          	$scope.isAssignment = true;
       		        }
       		        //Filter current level
       			    if (vm.profile.level) {
       			  	 	vm.filterData.proficiencyLevel = [vm.profile.level];
       			    	getLevelReadingBooks();  //get Current Level book
       				}
       			}else{
       				// console.log('error: ', response);
       			}
       		}, function(data){
       			   // console.log('error: ', data);
             });*/
      }
     vm.profile = profileService.getData('profileData');
     //last read history
     userServices.getReadHistory().then(function (response) {
       vm.readhistory = response.data;
     });
 
     /*get all my classes*/
     function getClassesList() {
       var loaderDiv = '<div class="loader"></div>';
       $(loaderDiv).appendTo('body'); //Add Loader
       classServices.getClasses().then(function (response) {
         vm.allclasses = response.data;
         vm.classPicked = vm.allclasses[0]; //preselect first class
         getMyAssignmentsList();
         LeaderBoardByClassId();
       });
     }
 
 
     function getAvatar() {
       userServices.STORAGE_AVATAR().then(function (response) {
         var currentAvatar = {};
         for (var key in response.data) {
           if (response.data[key].length !== 0) {
             for (var i = 0; i < response.data[key].length; i++) {
               if (response.data[key][i].is_equipped === true) {
                 currentAvatar[key] = response.data[key][i];
               }
             }
           }
         }
         $scope.currentAvatar = currentAvatar;
       });
     };
 
     $scope.pickClass = function () {
       var loaderDiv = '<div class="loader"></div>';
       $(loaderDiv).appendTo('body'); //Add Loader
       	getMyAssignmentsList();
     };
 
     $scope.pickAssignment = function () {
     	var loaderDiv = '<div class="loader"></div>';
 		$(loaderDiv).appendTo('body'); //Add Loader
 
       	getPreviousAssignmentBooks();
     };
 
     /*get all my assignment*/
     function getMyAssignmentsList() {
       	if (vm.classPicked) {
           var loaderDiv = '<div class="loader"></div>';
           $(loaderDiv).appendTo('body'); //Add Loader
         	classServices.getMyAssignmentsByClassId(vm.classPicked.classId).then(function (response) {
             //$('.loader').remove(); //remove Loader
             // console.log('getMyAssignmentsList: ', response.data, "response.data.length ", response.data.length );
             if(response.data.length === 0){
               // console.log("Came here to check assignment length 0");
               vm.assignments = [];
               $('.loader').remove(); //remove Loader
             }
             if(response.data.length !== 0){
               // console.log("Came inside to check assignment length > 0");
               if(response.status === 200){
 		          	if (response.data.length > 0) {
 			            vm.assignmentDueDate = $filter('date')(response.data[0].assignment.endDate, 'M/d/yy');
 			            vm.progress = response.data[0].overallProgress;
                   vm.assignments = response.data;
                   // console.log("Assignment list", vm.assignments);
 
 			          	vm.pastAssignment = [];
 				        for (var i = 0; i < response.data.length; i++) {
 			            	if(response.data[i].assignment.status === 'Completed'){
 			            		vm.pastAssignment.push(response.data[i]);
 			            		vm.assignmentPicked = vm.pastAssignment[0].assignment; // preselect past Assignment book
 			            		vm.selectedAssignment = vm.pastAssignment[0].assignment.name; // preselect past Assignment
 			            	}
                   }
                   // console.log("vm.assignmentPicked", vm.assignmentPicked);
                   if (vm.assignmentPicked !== null && vm.assignmentPicked !== undefined && vm.assignmentPicked.id !== undefined){
                     // console.log("Came inside assignment picked condition");
                     getPreviousAssignmentBooks();
                   }else{
                     // console.log("came to else part");
                     $('.loader').remove(); 
                     return true;
                   }
 
 
 		          	} else {
 		          		vm.selectedAssignment = '';
 	            		vm.assignments = [];
 	            		vm.assignmentBooks = [];
 	            		vm.assignmentDueDate = '';
 	          		}
 	          		//$('.loader').remove(); //remove Loader
 	          	}
             }
             else if(response.status === 500){
                   //$('.loader').remove(); //remove Loader
                   messageModal(response.data.error);
                   vm.assignments = [];
                   vm.assignmentBooks = [];
                   vm.assignmentDueDate = '';
             }else{
               // console.log("came here !!!!");
               messageModal("No Assignments !!");
               $('.loader').remove(); //remove Loader
               vm.pastAssignment = [];
               vm.assignmentBooks = [];
               vm.assignmentPicked = null;
               return true;
             }
          	}, function (data) {
          	//	$('.loader').remove(); //remove Loader
 				// console.log('error: ', data);
 				if (data.status === 500) {
 					messageModal(data.data.error);
 				}else if (data.status === 422) {
 					messageModal(data.data.message);
 				}else{
 					//messageModal('error');
 				}
         	});
       	}else{
       		//$('.loader').remove(); //remove Loader
       	}
     }
 
     //get previousAssignment books
     function getPreviousAssignmentBooks() {
 
       if (vm.assignmentPicked !== null && vm.classPicked !== null) {
         classServices.getAssignmentBooks(vm.classPicked.classId, vm.assignmentPicked.id).then(function (response) {
           // console.log('getAssignmentBooks: ', response.data);
           if (response.data.bookProgress !== undefined && response.data.bookProgress.length > 0) {
             vm.AssignmentStatus = response.data.assignment;
             vm.assignmentBooks = response.data.bookProgress;
             $('.loader').remove(); //remove Loader
           } else {
           	$('.loader').remove(); //remove Loader
             vm.assignmentBooks = [];
             vm.assignmentDueDate = '';
           }
         }, function(data){
         	$('.loader').remove(); //remove Loader
         	// console.log(data);
         	if(data){
 		        if(data.data == '422'){
 		          	messageModal(data.data.message.propertyName + ': ' + data.data.message.message);
 		        }
 		   	}
 	  	});
       	}else if (vm.assignmentPicked === null){
       		$('.loader').remove(); //remove Loader
       		messageModal('No Previous Assignments!!');
      	}else if (vm.classPicked === null){
      		$('.loader').remove(); //remove Loader
       		messageModal('No Class!!');
      	}
     }
 
 
 	//------------------- Progress reading: page scroll --------------------------//
     $(window).scroll(function() {
        	if (vm.limit!== 0 && vm.page!== 0 && $state.current.url == "/report") {  // location path
          	if(($(window).scrollTop() + $(window).innerHeight()) >= $(document).height()-100) {
              	if (vm.prevPage !== vm.page) {
               		getLevelReadingBooks();
             	}
           	}
        	}
        //	scroll top
        	if ($(this).scrollTop() > 1000) {
             $('.scrollup').fadeIn();
        	} else {
             $('.scrollup').fadeOut();
        	}
   	});
 
     //scroll top on click
      function scrollupClick(){
         $("html, body").animate({
             scrollTop: 0
         }, 800);
         return false;
      }
 
 	//Progress reading: Level Reading Books
    	function getLevelReadingBooks(){
      	if (vm.busy) return;
       	vm.busy = true;
      	if (vm.page == 0) {
         	var loaderDiv = '<div class="loader"></div>';
         	$(loaderDiv).appendTo('body');
       	}
       	bookServices.getLevelReading(vm.filterData,vm.limit,vm.page).then(function(response){
       	 	if(response.status === 200){
       	 		$('.loader').remove();
 	        	var items = response.data;
 	        	if (vm.limit!== 0 && vm.page!== 0) {
 		          	if (items.length === 0){
 						vm.busy = false; vm.prevPage = vm.page; return;
 					}
 		          	for (var i = 0; i < items.length; i++) {
 		            	vm.levelbooks.push(items[i]);
 		          	}
 	        	}else{
 	          		vm.levelbooks = items;
 	        	}
 	        	if (items.length !== 0) {
 	        		vm.prevPage = vm.page; vm.page = ++vm.page;
 	        	}
 	        	vm.busy = false;
 
       		}else{
       			$('.loader').remove();
           		//messageModal('error');
     		}
       }.bind($scope));
   	}
 
     $scope.pickClass1 = function () {
       LeaderBoardByClassId();
     };
 
     // leaderboards
     function getLeaderBoards() {
       userServices.getLeaderBoard().then(function (response) {
         if (response.status == 422){
           vm.leaderboardAll = "";
         }
         else{
           vm.leaderboardAll = response.data;
         }
         // console.log('vm.leaderboardAll : ', vm.leaderboardAll);
         LeaderBoardByClassId();
       });
     }
 //console.log("vm.profile", vm.profile);
     $scope.$watch('vm.classPicked', function (newV) {
       //userServices.getProfile().then(function (response) {
         //console.log("vm.profile", vm.profile);
         vm.profile.classResps.forEach(function (el) {
           if (el.classId === newV.classId) {
             vm.classRank = el.rank;
           }
         });
       //});
     }, true);
 
     /*get all my assignment*/
     function LeaderBoardByClassId() {
       // console.log("vm.allclasses", vm.allclasses, "vm.classPicked", vm.classPicked);
       if (vm.classPicked) {
         $cookies.put('cookieClassPicked', vm.classPicked.classId);
         //console.log("ClassId", vm.classPicked.classId);
         var loaderDiv = '<div class="loader"></div>';
         $(loaderDiv).appendTo('body'); //Add Loader
         userServices.getLeaderBoardByClassId(vm.classPicked.classId).then(function (response) {
           // console.log("class Ranking:", response);
           if(response.data.length === 0){
             // console.log("Came here to check assignment length");
             vm.leaderboardById = '';
             $('.loader').remove(); //remove Loader
           }
           if (response.status == 422){
             vm.leaderboardById = '';
             $('.loader').remove(); //remove Loader
           }
           else{
             if (response.data.length > 0) {
               vm.leaderboardById = response.data;
               $('.loader').remove(); //remove Loader
             }
             // } else {
             //   vm.leaderboardById = [];
             // }
           }
         });
       }
     }
 
     //read book
     function readBook(book,origin) {
       $cookies.put('bookOrigin', origin);
       $state.go('book', {bookId: book.bookId});
     }
 
     // got to quiz
     function gotoQuiz(book,origin) {
       $cookies.put('bookOrigin', origin);
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
 
 angular.module('nanhaiMainApp').filter('filterPast', function () {
   return function (input) {
     var data = _.filter(input, function (el) {
       // console.log("el", el);
       return el.assignment.status === 'past';
     });
     return data;
   };
 });

 'use strict';
 
 /**
  * @ngdoc overview
  * @name nanhaiMainApp
  * @description
  * # nanhaiMainApp
  *
  * Main module of the application.
  */
 angular
   .module('nanhaiMainApp', ['ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'ui.bootstrap', 'ui.router', 'sun.scrollable','angular-google-analytics'])
   .config(function ($stateProvider, $urlRouterProvider) {
 
 
     $urlRouterProvider.otherwise('/');
     $stateProvider.state('main', {
       url: '/main',
       views: {
         "": {
           templateUrl: 'views/main.html',
           controller: 'MainCtrl',
           controllerAs: 'main'
         }
       }
     }).state('library', {
       url: '/library',
       views: {
         "": {
           templateUrl: 'views/library.html',
           controller: 'LibraryCtrl',
           controllerAs: 'library'
         }
       }
     }).state('myLibrary', {
       url: '/myLibrary',
       views: {
         "": {
           templateUrl: 'views/library.html',
           controller: 'LibraryCtrl',
           controllerAs: 'vm'
 
         }
       }
     }).state('quiz', {
       url: '/quiz/:bookId',
       views: {
         "": {
           templateUrl: 'views/quiz.html',
           controller: 'QuizCtrl',
           controllerAs: 'vm'
         }
       },
       data: {
         teacherView: false
       },
     }).state('report', {
       url: '/report',
       views: {
         "": {
           templateUrl: 'views/report.html',
           controller: 'ReportCtrl',
           controllerAs: 'vm'
         }
       }
     }).state('book', {
       url: '/book/:bookId',
       views: {
         "": {
           templateUrl: 'views/book.html',
           controller: 'BookCtrl',
           controllerAs: 'vm'
         }
       },
       data: {
         teacherView: false
       },
       data2: {
         parentView: false
       }
     }).state('bookFrame', {
       url: '/bookFrame/:bookId',
       views: {
         "": {
           templateUrl: 'views/bookFrame.html',
           controller: 'BookCtrl',
           controllerAs: 'vm'
         }
       },
       data: {
         teacherView: false
       },
       data2: {
         parentView: false
       }
     }).state('viewBook', {
       url: '/view-book/:bookId',
       views: {
         "": {
           templateUrl: 'views/book.html',
           controller: 'BookCtrl',
           controllerAs: 'vm',
 		}
       },
       data: {
         teacherView: true
       }
     }).state('viewQuiz', {
       url: '/view-quiz/:bookId',
       views: {
         "": {
           templateUrl: 'views/quiz.html',
           controller: 'QuizCtrl',
           controllerAs: 'vm',
 
         }
       },
       data: {
         teacherView: true
       },
       data2: {
         parentView: true
       }
     }).state('announcements', {
       url: '/announcements',
       views: {
         "": {
           templateUrl: 'views/announcements.html',
           controller: 'AnnouncementsCtrl',
           controllerAs: 'announcements'
         }
       }
     }).state('achievement', {
       url: '/achievement',
       views: {
         "": {
           templateUrl: 'views/achievement.html',
           controller: 'AchievementCtrl',
           controllerAs: 'achievement'
         }
       }
     }).state('profile', {
       url: '/profile',
       views: {
         "": {
           templateUrl: 'views/profile.html',
           controller: 'ProfileCtrl',
           controllerAs: 'vm'
         }
       }
     }).state('trialPayment', {
       url: '/trialPayment',
       views: {
         "": {
           templateUrl: 'views/profileTrial.html',
           controller: 'ProfileTrialCtrl',
           controllerAs: 'vm'
         }
       }
     }).state('login', {
       url: '/',
       views: {
         "": {
           templateUrl: 'views/login.html',
           controller: 'LoginCtrl',
           controllerAs: 'vm'
         }
       }
     }).state('home', {
       url: '/home',
       views: {
         "": {
           templateUrl: 'views/landing.html',
           controller: 'LandingCtrl',
           controllerAs: 'vm'
         }
       }
     }).state('assignment', {
       url: '/assignment',
       views: {
         "": {
           templateUrl: 'views/assignmentFolder.html',
           controller: 'AssignmentCtrl',
           controllerAs: 'vm'
         }
       }
     }).state('folderAssignment', {
       url: '/assignment/:assignmentId',
       views: {
         "": {
           templateUrl: 'views/assignment.html',
           controller: 'AssignmentCtrl',
           controllerAs: 'vm'
         }
       }
     }).state('openReading', {
       url: '/openReading',
       views: {
         "": {
           templateUrl: 'views/open-reading.html',
           controller: 'openReadingCtrl',
           controllerAs: 'vm'
         }
 	}
     }).state('progressReading', {
       url: '/progressReading',
       views: {
         "": {
           templateUrl: 'views/progressReading.html',
           controller: 'progressReadingCtrl',
           controllerAs: 'vm'
         }
       }
     }).state('resetpassword', {
       url: '/resetpassword/:token/:username',
       views: {
         "": {
           templateUrl: 'views/forgotPasswordWithMail.html',
           controller: 'forgotPasswordWithemailCtrl',
           controllerAs: 'vm'
         }
       }
     }).state('openLibrary', {
       url: '/libraryAccess/openLibraryBooks',
       views: {
         "": {
           templateUrl: 'openLibrary/views/openLibraryBooks.html',
           controller: 'openLibraryAccessCtrl',
           controllerAs: 'vm'
         }
       }
     }).state('openBookQuiz', {
         url: '/libraryAccess/openQuiz/:bookId',
         views: {
           "": {
             templateUrl: 'openLibrary/views/openQuiz.html',
             controller: 'OpenQuizCtrl',
             controllerAs: 'vm'
           }
         }
       }).state('openBook', {
         url: '/libraryAccess/openBook/:bookId',
         views: {
           "": {
             templateUrl: 'openLibrary/views/openBook.html',
             controller: 'OpenBookCtrl',
             controllerAs: 'vm'
           }
         }
       }).state('openBookFrame', {
         url: '/libraryAccess/openBookFrame/:bookId',
         views: {
           "": {
             templateUrl: 'openLibrary/views/openBookFrame.html',
             controller: 'OpenBookCtrl',
             controllerAs: 'vm'
           }
         }
       });
 
   }).config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }]).config(['AnalyticsProvider', function (AnalyticsProvider) {
     // Add configuration code as desired
     AnalyticsProvider
       .setAccount('UA-89064017-1')//UU-XXXXXXX-X should be your tracking code
       .trackPages(true)
       .setPageEvent('$stateChangeSuccess');
   }]).run(['Analytics', function(Analytics) { }])
    .run(function ($rootScope, userServices, bookServices, $location) {
     $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
         if(toState.url === "/home") bookServices.getBookcurbpp = 0;
       	//console.log('path',toState.url);
         //var checkurl = toState.url;
         if(toState.url === "/home") bookServices.getBookcurbp = 0;
         if(!userServices.isLoggedIn() && toState.url.startsWith('/libraryAccess')){
              // console.log("Library");
              toState.url = '/libraryAccess/openLibraryBooks';
         }else{
           if(toState.url !== '/trialPayment') {
             if ((typeof userServices.isLoggedIn() === 'undefined' || !userServices.isLoggedIn()) && ($location.$$path !== '/'  && toState.url !== "/resetpassword/:token/:username")) {
               // console.log("trialPayment");
                 window.location.assign('/');
             }
           }
         }
 
       });
   });

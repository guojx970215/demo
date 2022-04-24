"use strict";

/**
 * @ngdoc function
 * @name nanhaiMainApp.controller:BookCtrl
 * @description
 * # BookCtrl
 * Controller of the nanhaiMainApp
 */
angular
  .module("nanhaiMainApp")
  .controller("BookCtrl", function(
    bookServices,
    classServices,
    userServices,
    endpoints,
    $sce,
    $state,
    $stateParams,
    $cookies,
    $scope,
    $timeout,
    $uibModal,
    $window
  ) {
    var vm = this;
    $cookies.remove("wordMode");
    vm.bookInfo = {};
    vm.bookRespData = {};
    vm.bookProgressInfo = {};
    vm.bookUrl = "";
    vm.wordMode = "Simplified";
    vm.bilingualLanguage = "Mandarin";
    vm.showQuiz = showQuiz;
    vm.launchQuiz = launchQuiz;
    vm.bookmarkPage = 0;
    // vm.backgroundMusicPlaying = false;
    vm.voices = false;
    vm.autoplay = false;
    vm.dictionary = false;
    vm.pinyin = false;
    vm.leftNavActive = false;
    vm.bookOrigin = $cookies.get("bookOrigin");
    vm.mode = "";
    vm.textToggle = true;
    vm.pinyinShow = false;
    //vm.voicesShow = false;
    vm.dictionaryShow = false;
    vm.backgroundMusicPlayingShow = false;
    vm.autoplayShow = false;
    vm.showSendBtn = false;
    vm.showShareBtn = false;
    vm.audioUrl = "";
    vm.readComplete = false;
    var self = this;
    vm.microphoneShow = true;
    vm.popUp = false;
    vm.openReadPopUp = openReadPopUp;
    vm.disableButton = false;
    $scope.class = "bookContainer";
    vm.toggleReadApi = true;
    vm.role = "STUDENT";
    var bookInfoPopupData;
    var getCookieAssignmentId = $cookies.get("cookieAssignmentId");
    var getNanhaiIndividualUserId = $cookies.get("nanhaiIndividualUserId");
    var getNanhaiIndividualSession = $cookies.get("nanhaiIndividualSession");
    var getNanhaiTeacherUserId = $cookies.get("nanhaiTeacherUserId");
    $scope.intermediateFalse = true;
    vm.bookReadPoints = true;

    // console.log("Value", $state);
    var teacherMode =
      typeof $state.current.data !== "undefined" &&
      $state.current.data.teacherView
        ? true
        : false;
    var parentMode =
      typeof $state.current.data2 !== "undefined" &&
      $state.current.data2.parentView
        ? true
        : false;

    if (teacherMode) {
      getTeacherBookInfo();
    } else {
      getBookInfo();
    }
    var canvas = document.querySelector(".visualizer");
    //var audioCtx = new (window.AudioContext || webkitAudioContext)();
    //var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var AudioContext =
      window.AudioContext || window.webkitAudioContext || false;
    if (AudioContext) {
      // Do whatever you want using the Web Audio API
      var audioCtx = new AudioContext();
      // ...
    } else {
      // Web Audio API is not supported
      //messageModal("Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox for recording feature");
      // console.log("Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox for recording feature");
    }

    var canvasCtx = canvas.getContext("2d");

    function getBookInfo() {
      var fUserData = {
        userId: "041c7a59-b60f-4af8-aab9-c58b3cae1dcd",
        userName: "titanforce",
        email: "dora@nanhai.com",
        firstName: "Titan",
        lastName: "Force",
        role: ["INDIVIDUAL"],
        disabled: false,
        timestampDisabled: null,
        timestampEnabled: null,
        timestampCreated: 1551484707393,
        timestampPasswordChanged: 0,
        profileImageUrl: null,
        settings: {
          id: "70eeaa5b-b25e-4627-94e9-9cbea787a9ec",
          quizAudio: false,
          lang: "Mandarin",
          language: "Simplified",
          audio: false,
          pinyin: true,
          dictionary: false,
          music: false
        },
        deleted: false,
        lastLoggedIn: 0,
        lastLogIn: null,
        accessCode: "BAPYBJIPWQVC",
        worldRank: 3089,
        race: null,
        programType: null,
        gender: null,
        nickName: null,
        birthDay: null,
        dateOfBirth: null,
        parentEmail: null,
        points: 250,
        playerLevel: {
          intermediate: false,
          id: "59fd92ce052eb94e00fe848d",
          name: "level7",
          displayName: "Level 7",
          shortName: "7",
          order: 8,
          levelCode: "7",
          hidden: false,
          color: "#ffe600"
        },
        pointsCollected: 250,
        pointsSpent: 0,
        language: "Mandarin",
        myAchievements: [
          {
            id: "a16f5e26-72eb-449f-a072-05bb0fae75e3",
            achievement: {
              name: "First Time",
              description:
                "Earn this badge once you’ve logged in the first time",
              points: 100,
              image:
                "https://s3-us-west-2.amazonaws.com/moback-content/nanhai/badges/badge_first_time_login.png",
              required: 1
            },
            viewed: true,
            when: 1552584726326,
            current: 0
          }
        ],
        levelProgress: {},
        assessmentProgress: {},
        gameLevel: 1,
        levelPercentage: 0,
        excludeFromLeaderboard: false,
        gameDisable: false,
        numBooks: 1,
        numQuizzes: 0,
        totalLoginTime: 0,
        totalGameTime: 0,
        bookRead30Days: 0,
        bookRead7Days: 0,
        quizTaken30Days: 0,
        quizTaken7Days: 0,
        createDateInDateFormat: null,
        linkTime: 0,
        assessmentShortName: null,
        level: "level7",
        background: null,
        trial: true,
        timestampAccountExpiration: 1569974307393,
        mode: null,
        customerId: null,
        subscriptionId: null,
        phoneNumber: "3108800428",
        verified: true
      };
      vm.userProfileResp = fUserData;
      // console.log("UserProfile: ", response);
      // console.log("vm.bilingual",vm.bilingual);
      //vm.bilingual = true;
      vm.profileBilingual = fUserData.settings.lang;
      if (fUserData.settings.lang !== "") {
        vm.bilingualLanguage = fUserData.settings.lang;
        if (vm.bilingualLanguage !== "No_audio") {
          vm.voices = true;
        } else {
          vm.voices = false;
        }
        addProfileSettings();
      }

      function addProfileSettings() {
        var fBookData = {
          maxScore: null,
          book: {
            level: {
              intermediate: false,
              id: "59fd92ce052eb94e00fe8486",
              name: "level0",
              displayName: "Level 0",
              shortName: "l0",
              order: -1,
              levelCode: "0",
              hidden: true,
              color: ""
            },
            bookId: "705b32d4-0e73-4109-8f27-e487231e3b0c",
            bookTitle: "自我介绍",
            bookImageLink:
              "http://localhost:9000/bookSample/00000A/0.gif",
            bookContentLink:
              "http://localhost:9000/bookSample/content.html",
            description: null,
            createTime: 1555954144329,
            newArival: true,
            textType: [
              {
                category: {
                  id: "56d4d0cbe4b0dd7ccc3ba5de",
                  mainCategory: "Literature"
                },
                subCategory: "Story"
              }
            ],
            series: [
              {
                id: "6e02a3c8-e323-459a-911c-5c9ca9a534b5",
                mainCategory: "大苹果阅读"
              }
            ],
            topics: [
              "Families and Communities/Social Relationships",
              "School life",
              "Health/Body parts/Food"
            ],
            language: "Mandarin",
            bilingual: false,
            teacherResource: false,
            traditionalTitle: "自我介紹",
            programTypes: [
              {
                programName: "IMMERSION",
                displayName: "Immersion",
                orderNumber: 1
              },
              {
                programName: "FOREIGN_LANGUAGE",
                displayName: "Foreign Language",
                orderNumber: 2
              },
              {
                programName: "HERITAGE",
                displayName: "Heritage",
                orderNumber: 3
              }
            ],
            keyword: [
              "第四级",
              "自我介绍",
              "huali",
              "self introduction",
              "country",
              "國家",
              "阅读",
              "xiong huali",
              "reader",
              "大蘋果",
              "nationalities",
              "熊老师",
              "喜欢",
              "熊华丽",
              "大蘋果閱讀",
              "喜歡吃",
              "姓名",
              "第四級",
              "业余爱好",
              "四級",
              "big apple chinese readers level four",
              "likes",
              "level three",
              "like",
              "四级",
              "熊華麗",
              "國籍",
              "countries",
              "like to eat",
              "大苹果阅读",
              "nationality",
              "name",
              "big apple readers level four",
              "hobby",
              "介紹",
              "big apple chinese readers",
              "大苹果阅读第四级",
              "运动",
              "愛好",
              "喜歡",
              "国家",
              "huali xiong",
              "introduction",
              "名字",
              "爱好",
              "miss xiong",
              "stories",
              "big apple readers",
              "sports",
              "介绍",
              "故事",
              "big apple",
              "food",
              "熊老師",
              "singapore",
              "喜欢吃",
              "names",
              "大苹果",
              "readers",
              "hobbies",
              "食物",
              "新加坡",
              "業餘愛好",
              "国籍",
              "運動",
              "sport",
              "閱讀",
              "自我介紹",
              "story",
              "大蘋果閱讀第四級"
            ],
            uploadDate: 1555954608004,
            bookFeatures: {
              bgMusic: false,
              voice: true,
              dictionary: false,
              simplified: true,
              traditional: true,
              pinyin: true
            },
            audio:
              "https://resources.ichinesereader.com/books/APPLE0061/APPLE0061.mp3",
            enabled: true,
            assessment: false,
            teacherAssessment: false,
            interestLevels: [
              {
                interestLevel: "K",
                displayName: "Kindergarden",
                orderNumber: 1
              },
              {
                interestLevel: "G1",
                displayName: "Grade 1",
                orderNumber: 2
              },
              {
                interestLevel: "G2",
                displayName: "Grade 2",
                orderNumber: 3
              },
              {
                interestLevel: "G3",
                displayName: "Grade 3",
                orderNumber: 4
              },
              {
                interestLevel: "G4",
                displayName: "Grade 4",
                orderNumber: 5
              },
              {
                interestLevel: "G5",
                displayName: "Grade 5",
                orderNumber: 6
              },
              {
                interestLevel: "G6",
                displayName: "Grade 6",
                orderNumber: 7
              },
              {
                interestLevel: "G7",
                displayName: "Grade 7",
                orderNumber: 8
              },
              {
                interestLevel: "G8",
                displayName: "Grade 8",
                orderNumber: 9
              },
              {
                interestLevel: "G9",
                displayName: "Grade 9",
                orderNumber: 10
              },
              {
                interestLevel: "G10",
                displayName: "Grade 10",
                orderNumber: 11
              },
              {
                interestLevel: "G11",
                displayName: "Grade 11",
                orderNumber: 12
              },
              {
                interestLevel: "G12",
                displayName: "Grade 12",
                orderNumber: 13
              }
            ],
            bookCode: "APPLE0061",
            englishBookTitle: "Self Introduction",
            startDate: 1555891200000,
            endDate: 0,
            viewMode: "PORTRAIT",
            topBook: true,
            textTypeResps: null,
            assessmentLevel: null,
            quizLinkUrl:
              "https://resources.ichinesereader.com/books/quiz/APPLE0061/quiz.json",
            quiz: true,
            proficiencyLevel: 0
          },
          readProgress: 0,
          readStarted: false,
          readComplete: false,
          readCount: 0,
          quizCount: 0,
          inAudioPlaylist: false,
          inFolder: false,
          folders: null,
          quizAvailable: true,
          lastReadAt: 0,
          programTypes: [
            {
              programName: "IMMERSION",
              displayName: "Immersion",
              orderNumber: 1
            },
            {
              programName: "FOREIGN_LANGUAGE",
              displayName: "Foreign Language",
              orderNumber: 2
            },
            {
              programName: "HERITAGE",
              displayName: "Heritage",
              orderNumber: 3
            }
          ],
          interestLevels: [
            {
              interestLevel: "K",
              displayName: "Kindergarden",
              orderNumber: 1
            },
            { interestLevel: "G1", displayName: "Grade 1", orderNumber: 2 },
            { interestLevel: "G2", displayName: "Grade 2", orderNumber: 3 },
            { interestLevel: "G3", displayName: "Grade 3", orderNumber: 4 },
            { interestLevel: "G4", displayName: "Grade 4", orderNumber: 5 },
            { interestLevel: "G5", displayName: "Grade 5", orderNumber: 6 },
            { interestLevel: "G6", displayName: "Grade 6", orderNumber: 7 },
            { interestLevel: "G7", displayName: "Grade 7", orderNumber: 8 },
            { interestLevel: "G8", displayName: "Grade 8", orderNumber: 9 },
            { interestLevel: "G9", displayName: "Grade 9", orderNumber: 10 },
            {
              interestLevel: "G10",
              displayName: "Grade 10",
              orderNumber: 11
            },
            {
              interestLevel: "G11",
              displayName: "Grade 11",
              orderNumber: 12
            },
            { interestLevel: "G12", displayName: "Grade 12", orderNumber: 13 }
          ]
        };

        var bookId = $stateParams.bookId;
        if (getCookieAssignmentId === undefined) {
            var bookResp = {data: fBookData};
            vm.bookRespData = bookResp.data.book;
            // console.log("bookResp",bookResp.data.book);
            if (
              bookResp.data.teacherAssessment == true &&
              bookResp.data.book.level === null
            ) {
              $scope.intermediateFalse = false;
            } else if (
              !bookResp.data.teacherAssessment &&
              bookResp.data.book.level !== null &&
              bookResp.data.book.level.intermediate === true
            ) {
              $scope.intermediateFalse = true;
            } else {
              $scope.intermediateFalse = false;
            }

            vm.mode = "StudentMode";
            vm.bilingual = bookResp.data.book.bilingual;
            if (vm.bilingual !== true) {
              if (vm.profileBilingual == "Cantonese") {
                vm.bilingualLanguage = "No_audio";
                vm.voices = false;
              } else {
                vm.bilingualLanguage = vm.profileBilingual;
              }
            }

            //vm.bilingualLanguage = bookResp.data.book.language;

            var bookFeatures = bookResp.data.book.bookFeatures;
            vm.pinyinShow = bookFeatures.pinyin;
            //vm.bilingualLanguage = bookFeatures.voice;
            vm.dictionaryShow = bookFeatures.dictionary;
            vm.backgroundMusicPlayingShow = bookFeatures.bgMusic;
            vm.autoplayShow = bookFeatures.voice;
            vm.simplifiedOption = bookFeatures.simplified;
            vm.traditionalOption = bookFeatures.traditional;
            if (
              vm.bookOrigin === "openReading" ||
              vm.bookOrigin === "progressReading" ||
              vm.bookOrigin === "myLibrary" ||
              vm.bookOrigin === "report"
            ) {
              //userServices.getProfile().then(function(response){
              if (vm.userProfileResp) {
                var settings = vm.userProfileResp.settings;
                /*vm.backgroundMusicPlaying = vm.backgroundMusicPlayingShow ? settings.music : false;*/
                vm.pinyin = vm.pinyinShow ? settings.pinyin : false;
                // if (vm.bilingualLanguage !== 'No_audio'){
                //    vm.voices = true;
                // }
                //vm.bilingualLanguage = settings.audio
                //vm.voices     = vm.voicesShow ? settings.audio : false;
                vm.dictionary = vm.dictionaryShow ? settings.dictionary : false;
                // vm.wordMode   = settings.language;

                if (
                  vm.simplifiedOption === false &&
                  vm.traditionalOption === true
                ) {
                  vm.wordMode = "Traditional";
                } else if (
                  vm.traditionalOption === false &&
                  vm.simplifiedOption === true
                ) {
                  vm.wordMode = "Simplified";
                } else if (
                  vm.traditionalOption === false &&
                  vm.simplifiedOption === false
                ) {
                  vm.wordMode = "No text";
                } else {
                  vm.wordMode = settings.language;
                }
                assignBookInfo(bookResp);
              }
              //});
            }
            if (vm.bookOrigin === "assignmentReport") {
              var classId = $cookies.get("cookieClassPicked");
              if (vm.bookOrigin === "assignmentReport") {
                ifReportAssigment(classId, bookResp);
              }
            }
          
        } else {
          bookServices.getBook(bookId).then(function(bookResp) {
            // console.log("Book response", bookResp);
            vm.bookRespData = bookResp.data.book;
            if (bookResp.data.book.level.intermediate === true) {
              $scope.intermediateFalse = true;
            } else {
              $scope.intermediateFalse = false;
            }
          });
          bookServices
            .getBookFromAssignment(getCookieAssignmentId, bookId)
            .then(function(bookResp) {
              // console.log("bookResp", bookResp);
              // console.log("hhhhhhhhhhhhhhhhhhh",vm.bilingualLanguage);
              // console.log("assignmentCookie", getCookieAssignmentId);
              vm.mode = "StudentMode";
              vm.bilingual = bookResp.data.book.bilingual;
              if (vm.bilingual !== true) {
                if (vm.bilingualLanguage == "Cantonese") {
                  vm.bilingualLanguage = "No_audio";
                  vm.voices = true;
                }
                // else{
                //   vm.bilingualLanguage = vm.profileBilingual;
                // }
              }
              vm.benchmarkBook = bookResp.data.book.teacherAssessment;
              var bookFeatures = bookResp.data.book.bookFeatures;
              vm.pinyinShow = bookFeatures.pinyin;
              //vm.bilingualLanguage = bookFeatures.voice;
              vm.dictionaryShow = bookFeatures.dictionary;
              vm.backgroundMusicPlayingShow = bookFeatures.bgMusic;
              vm.autoplayShow = bookFeatures.voice;

              vm.str = vm.bookOrigin;
              vm.res = vm.str.split("/");

              if (vm.res[0] === "assignment") {
                var classId = $cookies.get("cookieClassPicked");
                if (vm.res[0] === "assignment") {
                  ifAssigment(classId, bookResp);
                }
              }
            });
        }
      }
    }

    function ifAssigment(classId, bookResp) {
      classServices
        .getBookByClassId(classId, getCookieAssignmentId)
        .then(function(assResponse) {
          //console.log("assResponse",bookResp);
          var settings = assResponse.data.assignment.settings;
          //vm.bilingual = true;
          // if(settings.lang === null){
          //   vm.bilingualLanguage = 'Mandarin';
          // }else{
          //   vm.bilingualLanguage = settings.lang;
          // }
          /*vm.backgroundMusicPlaying = vm.backgroundMusicPlayingShow ? settings.music : false;*/
          vm.pinyin = vm.pinyinShow ? settings.pinyin : false;
          //vm.bilingualLanguage = settings.audio;
          if (vm.bilingualLanguage !== "No_audio") {
            vm.voices = true;
          } else {
            vm.voices = false;
          }
          //vm.voices     = vm.voicesShow ? settings.audio : false;
          vm.dictionary = vm.dictionaryShow ? settings.dictionary : false;
          // vm.wordMode   = settings.language;
          // console.log('mmmmmmmmmm: ', settings );
          vm.simplifiedOption = bookResp.data.book.bookFeatures.simplified;
          vm.traditionalOption = bookResp.data.book.bookFeatures.traditional;
          // console.log('vm.traditionalOption: ', vm.traditionalOption);
          // console.log('vm.simplifiedOption: ', vm.simplifiedOption);
          vm.bilingualLanguage = settings.lang;
          vm.wordMode = settings.language;

          if (vm.bilingual !== true) {
            if (vm.bilingualLanguage == "Cantonese") {
              vm.bilingualLanguage = "No_audio";
              vm.voices = true;
            }
            // else{
            //   vm.bilingualLanguage = vm.profileBilingual;
            // }
          }

          if (vm.simplifiedOption === false && vm.traditionalOption === true) {
            if (settings.language === "Simplified") {
              vm.wordMode = "Traditional";
            } else if (settings.language === "Traditional") {
              vm.wordMode = "Traditional";
            } else {
              vm.wordMode = "No text";
            }
          } else if (
            vm.simplifiedOption === true &&
            vm.traditionalOption === false
          ) {
            if (settings.language === "Simplified") {
              vm.wordMode = "Simplified";
            } else if (settings.language === "Traditional") {
              vm.wordMode = "Simplified";
            } else {
              vm.wordMode = "No text";
            }
          } else if (
            vm.simplifiedOption === true &&
            vm.traditionalOption === true
          ) {
            if (settings.language === "Simplified") {
              vm.wordMode = "Simplified";
            } else if (settings.language === "Traditional") {
              vm.wordMode = "Traditional";
            } else {
              vm.wordMode = "No text";
            }
          } else if (
            vm.simplifiedOption === false &&
            vm.traditionalOption === false
          ) {
            vm.wordMode = "No text";
          }
          $cookies.put("wordMode", vm.wordMode);
          assignBookInfo(bookResp);
        });
    }
    function ifReportAssigment(classId, bookResp) {
      classServices
        .getMyAssignmentsByClassId(classId)
        .then(function(assResponse) {
          var settings = assResponse.data[0].assignment.settings;
          vm.pinyin = vm.pinyinShow ? settings.pinyin : false;

          if (vm.bilingualLanguage !== "No_audio") {
            vm.voices = true;
          } else {
            vm.voices = false;
          }
          //vm.voices     = vm.voicesShow ? settings.audio : false;
          vm.dictionary = vm.dictionaryShow ? settings.dictionary : false;
          //vm.wordMode   = settings.language;

          vm.simplifiedOption = bookResp.data.book.bookFeatures.simplified;
          vm.traditionalOption = bookResp.data.book.bookFeatures.traditional;
          if (vm.simplifiedOption === false && vm.traditionalOption === true) {
            vm.wordMode = "Traditional";
          } else if (
            vm.traditionalOption === false &&
            vm.simplifiedOption === true
          ) {
            vm.wordMode = "Simplified";
          } else if (
            vm.traditionalOption === false &&
            vm.simplifiedOption === false
          ) {
            vm.wordMode = "No text";
          } else {
            vm.wordMode = settings.language;
          }

          assignBookInfo(bookResp);
        });
    }
    function getTeacherBookInfo() {
      var bookId = $stateParams.bookId;
      bookServices.getTeacherBook(bookId).then(function(response) {
        // console.log("teacher book info", response);
        // console.log("from Teacher portal",vm.bilingualLanguage);
        vm.mode = "TeacherMode";
        vm.bookOrigin = "TeacherMode";
        vm.bilingual = response.data.book.bilingual;
        if (vm.bilingual !== true && vm.bilingualLanguage !== "No_audio") {
          vm.bilingualLanguage = "Mandarin";
          vm.voices = true;
        } else {
          vm.voices = false;
        }
        var settings = response.data.book.bookFeatures;
        //vm.pinyinShow = settings.pinyin;
        //vm.voicesShow = settings.voice;
        //vm.dictionaryShow = settings.dictionary;
        vm.backgroundMusicPlayingShow = settings.bgMusic;
        vm.autoplayShow = settings.voice;

        //vm.backgroundMusicPlaying = settings.bgMusic;
        //vm.pinyin = settings.pinyin;
        vm.voices = settings.voice;
        //vm.dictionary = settings.dictionary;
        var loaderDiv = '<div class="loader"></div>';
        $(loaderDiv).appendTo("body");
        //$('.loader').remove();
        assignBookInfo(response);
      });
      if (getNanhaiTeacherUserId !== "") {
        bookServices
          .getTeacherProfile(getNanhaiTeacherUserId)
          .then(function(response) {
            // console.log("setting",response);
            vm.mode = "TeacherMode";
            vm.bookOrigin = "TeacherMode";
            if (
              vm.bilingual === true &&
              response.data.settings.lang == "Cantonese"
            ) {
              vm.bilingualLanguage = response.data.settings.lang;
            } else {
              vm.bilingualLanguage = response.data.settings.lang;
              if (vm.bilingualLanguage !== "No_audio") {
                vm.voices = true;
              } else {
                vm.voices = false;
              }
              // console.log("settingssss",vm.bilingualLanguage);
            }
            vm.wordMode = response.data.settings.language;
            vm.dictionaryShow = true;
            vm.dictionary = response.data.settings.dictionary;
            vm.pinyinShow = true;
            vm.pinyin = response.data.settings.pinyin;
            // console.log("pinyin", vm.pinyin, "vm.pinyinShow", vm.pinyinShow);
          });
      }
    }

   

    function getBookmark() {
      var iframe = document.getElementById("content-frame");
      var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
      var onPlay = innerDoc.getElementById("play-start");
      var minibook = $cookies.get("miniBook");
      // console.log("minibook",minibook);
      $(onPlay).click(function() {
        var start = {
          bookId: $stateParams.bookId,
          sessionActivity: "BOOK_READ_START"
        };
        if (minibook !== undefined || minibook !== "true") {
          bookServices.startTrack(start).then(function(response) {
            // console.log("Book Reading Started: ", response.data);
            if (response.status === 200) {
              vm.bookReadPoints = true;
              profileCall();
            }
            sessionStorage.setItem("startTrack", JSON.stringify(response.data));
          });
        }
      });
      bookServices.getBookmark($stateParams.bookId).then(function(rs) {
        // console.log("rs",rs);
        vm.bookmarkPage = 0;
        if (rs.data) {
          vm.bookmarkPage = rs.data.page;
          vm.currentPage = rs.data.page;
          // console.log("vm.currentPage ", vm.currentPage, "vm.bookmarkPage", vm.bookmarkPage );
        }
      });
    }

    function profileCall() {
      userServices.getProfile().then(function(res) {
        // console.log("UserProfile: ", res);
        if (res.status === 200) {
          setTimeout(function() {
            profileCall();
          }, 900000);
        }
      });
    }
    function assignBookInfo(response) {
      var bookData = response.data.book;
      vm.bookProgressInfo = response.data;
      delete vm.bookProgressInfo.book;

      vm.bookInfo = bookData;
      //vm.bookInfo.viewMode == 'LANDSCAPE';

      // if (window.location.href.indexOf("localhost") > -1) {
      //
      //   vm.bookUrl = $sce.trustAsResourceUrl('http://localhost:9000/bookSample/00000A/content.html');
      // } else {
      //   vm.bookUrl = $sce.trustAsResourceUrl(bookData.bookContentLink);
      // }
      //var bookUrlIframe = bookData.bookContentLink;
      // console.log("bookUrlIframe",bookData.bookContentLink);
      $.ajax({
        type: "GET",
        url: bookData.bookContentLink,
        contentType: "text/html",
        beforeSend: function(xhr, settings) {
          xhr.setRequestHeader("Access-Control-Request-Headers", "");
          xhr.setRequestHeader("Origin", "*");
        },
        success: function(data) {
          //document.getElementById('iframe').src = "data:text/html;charset=utf-8," + escape(html);
          vm.bookBasePath = bookData.bookContentLink;
          //console.log("bookBasePath",vm.bookBasePath);
          var n = vm.bookBasePath.lastIndexOf("books");
          var s = vm.bookBasePath.substr(0, n);
          var res = data.replace(/\.\.\//g, s + "books/");

          var assetUrl = vm.bookBasePath.lastIndexOf("/");
          var k = vm.bookBasePath.substr(0, assetUrl + 1);
          localStorage.setItem("bookBasePath", k + "assets");
          var reData = res.replace(/\.\//g, k);

          //console.log(reData);
          var iframe = document.getElementById("content-frame");
          var innerDoc = iframe.contentDocument;
          innerDoc.open();
          innerDoc.writeln(reData);
          innerDoc.close();

          setTimeout(function() {
            //$('#content-frame').load(function() {
            var aa = innerDoc.getElementById("play-start");
            $(aa).css("background-image", 'url("/images/play_icon.png")');
            //});
          }, 5000);

          //$("#content-frame").attr('src',data);

          // var str = document.getElementById("main");
          // var inner = str.innerHTML;
          // var res = inner.replace(/..\//gi, "http://");
          // str.innerHTML = res;
          //$("#content-frame").append()
          //$("#output_iframe_id").contents().find('html').html(data);
        }
      });

      //   $.ajax({
      //     type: "GET",
      //     url: bookUrlIframe,
      //     beforeSend: function(xhr, settings){
      //             xhr.setRequestHeader("Origin", 'http://stage.ichinesereader.com');},
      //     success: function(data){
      //       console.log("Bookdata",data);
      //         $("#content-frame").attr('src',"data:text/html;charset=utf-8," + escape(data))
      //     },
      //     error: function(data){
      //       console.log("error",data);
      //     }
      // });
      vm.bookUrl = $sce.trustAsResourceUrl(bookData.bookContentLink);
      //vm.bookUrl = $sce.trustAsResourceUrl('http://localhost:9000/bookSample/content.html'); //use this for localhost testing
      //vm.bookUrl = $sce.trustAsResourceUrl('http://localhost:9000/bookSample/book2/content.html');
      $timeout(function() {
        if (vm.mode === "StudentMode") {
          getBookmark();
        }
      }, 2400);
      $timeout(function() {
        //getBookStats();
        getBookStats();
      }, 5000);
    }

    function getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    function getBookStats() {
      $(".loader").remove();
      // console.log("came to stats",vm.bilingualLanguage);
      vm.role = getCookie("nanhaiRole");

      console.log("Cookie-");
      console.log(vm.role);
      var bookIframe = bookServices.getChildIframe();
      // console.log("vm.currentPage1 ", vm.currentPage, "vm.bookmarkPage1", vm.bookmarkPage );
      if (vm.currentPage !== undefined) {
        bookIframe.gotoPage(vm.currentPage);
      }
      var textDisplay = "s";
      if (vm.wordMode === "Simplified") {
        textDisplay = "s";
      } else if (vm.wordMode === "Traditional") {
        textDisplay = "t";
      } else {
        vm.textToggle = false;
      }

      var LanguageDisplay = "m";
      if (vm.bilingualLanguage === "Mandarin") {
        LanguageDisplay = "m";
        var bookIframe = bookServices.getChildIframe();
        var bookIframe = document.getElementById("content-frame").contentWindow;
        var assetUrl = vm.bookBasePath.lastIndexOf("/");
        var k = vm.bookBasePath.substr(0, assetUrl + 1);
        // console.log("path",k);
        bookIframe.fReadToggle(false, k);
        //bookIframe.fLangToggle("m");
      } else if (vm.bilingualLanguage === "Cantonese") {
        LanguageDisplay = "c";
        var bookIframe = bookServices.getChildIframe();
        var assetUrl = vm.bookBasePath.lastIndexOf("/");
        var k = vm.bookBasePath.substr(0, assetUrl + 1);
        // console.log("path",k);
        bookIframe.fReadToggle(false, k);
        //bookIframe.fLangToggle("c");
      }
      if (vm.bilingualLanguage !== "No_audio") {
        vm.voices = true;
      } else {
        vm.voices = false;
      }

      /*if(self.currentPage > 0 && vm.voices) {
         $('#innerBook').contents().find('#play-overlay').hide();
       }*/
      //initialize book
      bookIframe.init(
        vm.bookInfo.bookTitle, //simplified book title
        vm.bookInfo.bookTitle, //traditional book title
        //vm.backgroundMusicPlaying, //background music
        false,
        vm.voices, //audio voice toggle
        vm.autoplay, //autoplay toggle
        vm.textToggle, //text toggle
        textDisplay, //text display, s or t
        vm.pinyin, //text pinyin
        vm.dictionary, //dictionary toggle
        vm.role
      );

      //console.log("LanguageDisplay", LanguageDisplay);
      //document.body.style.zoom = 0.6;

      vm.currentPage = bookIframe.getPage();

      vm.pageTotal = bookIframe.getTotalPage();
    }

    this.getToggleStatus = function(type) {
      var toggleStatus = false;

      switch (type) {
        /*
         case 'music':
          toggleStatus = vm.backgroundMusicPlaying;
          break;*/

        case "voice":
          toggleStatus = vm.voices;
          break;
        case "pinyin":
          toggleStatus = vm.pinyin;
          break;
        case "autoplay":
          toggleStatus = vm.autoplay;
          break;
        case "dictionary":
          toggleStatus = vm.dictionary;
          break;
        case "autoFit":
          toggleStatus = vm.autoFit;
          break;
      }
      return toggleStatus ? "fa-toggle-on" : "fa-toggle-off";
    };

    this.gotoFirstPage = function() {
      var bookIframe = bookServices.getChildIframe();
      bookIframe.goFirstPage();
    };

    this.gotoLastPage = function() {
      var bookIframe = bookServices.getChildIframe();
      bookIframe.goLastPage();
    };

    this.simplified = function() {
      var bookIframe = bookServices.getChildIframe();
      bookIframe.showText("s");
      vm.wordMode = "Simplified";
    };

    this.traditional = function() {
      var bookIframe = bookServices.getChildIframe();
      bookIframe.showText("t");
      vm.wordMode = "Traditional";
    };

    this.turnOffWords = function() {
      var bookIframe = bookServices.getChildIframe();
      bookIframe.hideText();
      vm.wordMode = "No text";
    };

    this.updateWordMode = function() {
      switch (vm.wordMode) {
        case "Simplified":
          vm.simplified();
          break;
        case "Traditional":
          vm.traditional();
          break;
        case "No text":
          vm.turnOffWords();
          break;
      }
      if (vm.wordMode === "No text") {
        $cookies.put("wordMode", "Simplified");
      } else {
        $cookies.put("wordMode", vm.wordMode);
      }
    };

    this.mandarin = function() {
      var bookIframe = bookServices.getChildIframe();
      bookIframe.fLangToggle("m");
      vm.bilingualLanguage = "Mandarin";
    };

    this.cantonese = function() {
      var bookIframe = bookServices.getChildIframe();
      bookIframe.fLangToggle("c");
      vm.bilingualLanguage = "Cantonese";
    };

    this.updateBilingualLanguage = function() {
      switch (vm.bilingualLanguage) {
        case "Mandarin":
          vm.toggleVoice();
          vm.mandarin();
          break;
        case "Cantonese":
          vm.toggleVoice();
          vm.cantonese();
          break;
        case "No_audio":
          vm.toggleVoice();
          break;
      }
    };

    this.togglePinyin = function() {
      vm.pinyin = vm.pinyin ? false : true;

      var bookIframe = bookServices.getChildIframe();
      if (vm.pinyin) {
        bookIframe.showPinyin();
      } else {
        bookIframe.hidePinyin();
      }
    };

    this.toggleAutoFit = function() {
      vm.autoFit = vm.autoFit ? false : true;
      if (vm.autoFit) {
        $scope.class = "bookContainer autoFit";
        $scope.iframeClass = "iframeClass";
      } else {
        $scope.class = "bookContainer";
        $scope.iframeClass = "";
      }
    };

    this.toggleDictionary = function() {
      vm.dictionary = vm.dictionary ? false : true;

      var bookIframe = bookServices.getChildIframe();
      if (vm.dictionary) {
        bookIframe.showDict();
      } else {
        bookIframe.hideDict();
      }
    };

    this.toggleAutoPlay = function() {
      vm.autoplay = vm.autoplay ? false : true;

      var bookIframe = bookServices.getChildIframe();
      if (vm.autoplay) {
        bookIframe.autoplayOn();
      } else {
        bookIframe.autoplayOff();
      }
    };

    /*
     this.toggleMusic = function () {
           vm.backgroundMusicPlaying = (vm.backgroundMusicPlaying) ? false : true;
           var bookIframe = bookServices.getChildIframe();
           if (vm.backgroundMusicPlaying) {
             bookIframe.bgmOn();
           } else {
             bookIframe.bgmOff();
           }
         };*/

    this.toggleVoice = function() {
      // console.log("vm.bilingualLanguage",vm.bilingualLanguage);
      if (vm.bilingualLanguage !== "No_audio") {
        vm.voices = true;
      } else {
        //console.log("else NoAudio",vm.bilingualLanguage);
        vm.voices = false;
      }
      //vm.bilingualLanguage = 'No_audio';
      //vm.voices = (vm.voices) ? false : true;
      var bookIframe = bookServices.getChildIframe();
      if (vm.voices) {
        //  console.log('bookAudio: ', bookAudio);
        if (bookAudio === true) {
          bookIframe.readOn();
        } else {
          bookIframe.readOff();
        }
      } else {
        bookIframe.readOff();
      }
    };

    this.pageChanged = function() {
      var bookIframe = bookServices.getChildIframe();
      bookIframe.gotoPage(self.currentPage);
    };

    this.gotoNextPage = function() {
      if (self.currentPage < self.pageTotal) {
        self.currentPage++;
        var bookIframe = bookServices.getChildIframe();
        bookIframe.gotoPage(self.currentPage);
      }
    };

    this.gotoPrevPage = function() {
      if (self.currentPage > 1) {
        self.currentPage--;
        var bookIframe = bookServices.getChildIframe();
        bookIframe.gotoPage(self.currentPage);
      }
    };

    this.isLeftNavActive = function() {
      if (vm.leftNavActive) {
        return "is-active";
      }
    };

    this.toggleLeftNav = function() {
      vm.leftNavActive = vm.leftNavActive ? false : true;
    };

    this.exit = function() {
      audioCtx.close().then(function() {
        //console.log("audioCtx closed");

        var loaderDiv = '<div class="loader"></div>';
        $(loaderDiv).appendTo("body");
        //$('.loader').remove();
      });
      if (teacherMode) {
        exitToLibrary();
        return;
      }
      exitToLibrary();

      //only update book progress, when user has not read book yet
      // if (vm.bookProgressInfo.readComplete) {
      // exitToLibrary();
      // } else {
      /*var bookId = $stateParams.bookId;
         var progress = Math.round((vm.currentPage / vm.pageTotal) * 100); //pass percentage reading value to book read api
         if(getCookieAssignmentId === undefined){
           bookServices.readBook(bookId, progress).then(function (response) {
           }).finally(function () {
             exitToLibrary();
           });
         }else{
           bookServices.readProgress(bookId, getCookieAssignmentId, progress).then(function (response) {
             //console.log("progress readProgress: ", progress);
           }).finally(function () {
             exitToLibrary();
           });
         } */
      //}
    };

    function exitToLibrary() {
      var origin = $cookies.get("bookOrigin");
      var minibook = $cookies.get("miniBook");
      // console.log("minibook",minibook);
      if (sessionStorage.startTrack != null) {
        var sessionKey = JSON.parse(sessionStorage.startTrack);
        var stopTrack = {
          sessionActivity: "BOOK_READ_END"
        };
        if (minibook !== undefined || minibook !== "true") {
          bookServices
            .stopTrack(stopTrack, sessionKey)
            .then(function(response) {
              // console.log("Book Reading Ended:", response);
              sessionStorage.removeItem("startTrack");
            });
        }
      }
      // Clear Quiz Track from session
      if (sessionStorage.startQuizTrack != null) {
        var sessionKey = JSON.parse(sessionStorage.startQuizTrack);
        var stopQuizTrack = {
          sessionType: "QUIZ_ATTEMPT_END",
          pass: false,
          percentage: 0
        };
        // console.log(sessionKey);
        bookServices
          .stopQuizTrack(stopQuizTrack, sessionKey)
          .then(function(response) {
            // console.log("Quiz Ended: ", response);
            sessionStorage.removeItem("stopQuizTrack");
          });
      }

      if (teacherMode) {
        window.close();
      } else {
        if (origin) {
          var assnmntId = null;
          var res = vm.bookOrigin.split("/");
          if (res.length > 1) {
            assnmntId = res[1];
            $state.go("folderAssignment", { assignmentId: assnmntId });
            $(".loader").remove();
          } else {
            if (origin === "assignmentReport") origin = "report";
            $state.go(origin);
            $(".loader").remove();
          }
        } else {
          $state.go("assignment");
          $(".loader").remove();
        }
      }
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
      var startQuiz = {
        bookId: bookId,
        sessionActivity: "QUIZ_ATTEMPT_START"
      };
      bookServices.startQuizTrack(startQuiz).then(function(response) {
        // console.log("Quiz Started: ", response.data);
        sessionStorage.setItem("startQuizTrack", JSON.stringify(response.data));
      });

      if (vm.bookProgressInfo.readComplete || vm.readComplete) {
        // console.log(vm.bookProgressInfo); //return false;
        // console.log("cookies",getCookieAssignmentId);
        //       if(getCookieAssignmentId === undefined){
        $state.go("quiz", { bookId: bookId });
        /* On clicking Quiz book read is counting twice, commenting this and redirecting it to Quiz page.
           bookServices.readBook(bookId, 100).then(function (response) {
           }).finally(function () {
             // console.log("called ReadBook API");
               //$state.go('quiz', {bookId: bookId});
           });
           */
        //         }else{
        //console.log("toggleReadAPI[Q] - " + vm.toggleReadApi);
        //           if (vm.toggleReadApi){
        //             bookServices.readProgress(bookId, getCookieAssignmentId, 100).then(function (response) {
        //         }).finally(function () {
        //               $state.go('quiz', {bookId: bookId});
        //           });
        //          }
        //         }
      }
    }

    vm.setBookmark = function(page) {
      bookServices.setBookmark($stateParams.bookId, page).then(function() {
        getBookmark();
        messageModal("Page " + page + " has been bookmarked");
      });
    };

    //setup update page parent listener
    window.updatePage = function(page, total) {
      //console.log("curPage::",page,"Total:",total);
      vm.currentPage = page;
      vm.pageTotal = total;

      if (page === total) {
        vm.popUp = true;
        var bookId = $stateParams.bookId;
        var progress = Math.round((vm.currentPage / vm.pageTotal) * 100); //pass percentage reading value to book read api

        if (vm.toggleReadApi && $cookies.get("miniBook") !== "true") {
          if (getCookieAssignmentId === undefined) {
            //console.log("progress[updatePage]" + progress);
            if (progress === 100 && vm.bookReadPoints == true) {
              var loaderDiv = '<div class="loader"></div>';
              $(loaderDiv).appendTo("body");
              bookServices
                .readBook(bookId, progress)
                .then(function(response) {
                  $(".loader").remove();
                  //console.log("quizExists",response);
                  var quizExists = vm.bookRespData.quiz;
                  // console.log("Book", vm.bookRespData);
                  if (quizExists) {
                    var quizUrl = vm.bookRespData.quizLinkUrl;
                  }
                  bookInfoPopupData = {
                    data: response,
                    bookId: bookId,
                    quiz: quizExists,
                    quizUrl: quizUrl
                  };
                  vm.bookReadPoints = false;
                })
                .finally(function() {
                  //console.log("updated read percentage for non-assignment book");
                  vm.popUp = true;
                  vm.readComplete = true;
                });
            } else {
              vm.bookReadPoints = false;
            }
          } else {
            //console.log("AssignProgress[updatePage] - " + progress);
            var loaderDiv = '<div class="loader"></div>';
            $(loaderDiv).appendTo("body");
            bookServices
              .readProgress(bookId, getCookieAssignmentId, progress)
              .then(function(response) {
                $(".loader").remove();
                //                 vm.toggleReadApi = false;
                //console.log("progressReadProgress: ", progress);
                var quizExists = vm.bookRespData.quiz;
                // console.log("Quiz", quizExists);
                // console.log("Read Book", response);
                if (quizExists) {
                  var quizUrl = vm.bookRespData.quizLinkUrl;
                }
                bookInfoPopupData = {
                  data: response,
                  bookId: bookId,
                  quiz: quizExists,
                  quizUrl: quizUrl
                };
              })
              .finally(function() {
                //console.log("updated read percentage for assignment book");
                vm.popUp = true;
                vm.readComplete = true;
              });
          }
          vm.toggleReadApi = false;
        }
      }

      $scope.$apply();
    };

    function openReadPopUp() {
      // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa",bookInfoPopupData);
      bookPointsModal(bookInfoPopupData);
    }

    //send message to common modal
    function messageModal(item) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "views/modals/okModal.html",
        controller: "okModalCtrl",
        size: "sm",
        resolve: {
          items: function() {
            return item;
          }
        }
      });
      modalInstance.result.then(
        function() {},
        function() {
          // console.log('Modal dismissed at: ' + new Date());
        }
      );
    }

    //Book OpenPopup
    function bookPointsModal(item) {
      // console.log("Book point Item", item);
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "views/modals/bookPoints.html",
        controller: "bookPointsModalCtrl",
        size: "sm",
        resolve: {
          items: function() {
            return item;
          }
        }
      });
      modalInstance.result.then(
        function() {},
        function() {
          // console.log('Modal dismissed at: ' + new Date());
        }
      );
    }

    //Add to folder
    $scope.showModalAddFolder = function() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "views/modals/addToFolder.html",
        controller: "AddToFolderCtrl",
        resolve: {
          items: function() {
            return null;
          }
        }
      });
      modalInstance.result.then(function(folder) {
        var bookIds = [$stateParams.bookId];
        bookServices.AddBooksToFolder(folder.id, bookIds).then(
          function(data) {
            if (data.data && data.data.message) {
              messageModal(data.data.message);
              vm.bookProgressInfo.inFolder = true;
            }
          },
          function(data) {
            if (data.data && data.data.message) {
              messageModal(
                data.data.message.propertyName +
                  ": " +
                  data.data.message.message
              );
            }
          }
        );
      });
    };

    //Add Comments To Book
    this.addComments = function(data) {
      vm.disableButton = true;
      var dataDetails = {};
      dataDetails.text = data;
      dataDetails.id = $stateParams.bookId;
      $(".write_icon").addClass("disabled");

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "views/modals/addCommentsToBook.html",
        controller: "WriteToBookCtrl",
        backdrop: "static",
        resolve: {
          items: function() {
            return dataDetails;
          }
        }
      });
      modalInstance.result.then(
        function(data) {
          // console.log("UserData: ",data);
          if (data.send == 0) {
            var postData = {
              bookId: data.bookId,
              text: data.text
            };
            if (getCookieAssignmentId != undefined) {
              //postData.assignmentId = text.assignmentId;
              postData.assignmentId = getCookieAssignmentId;
            }
            //userId
            if (getNanhaiIndividualUserId != undefined) {
              postData.userId = getNanhaiIndividualUserId;
            }
            //Auth token
            if (getNanhaiIndividualSession != undefined) {
              postData.token = getNanhaiIndividualSession;
            }
            bookServices.writing(postData).then(function(data) {
              // console.log("daaaaaaaaaaaaaaaaa",data);
              if (data.status === 200 && getCookieAssignmentId != undefined) {
                bookServices.share(postData).then(function(data) {
                  if (data.status != 200) {
                    messageModal("error");
                    vm.writeText = data.text;
                  } else {
                    messageModal("Saved");
                    vm.writeText = data.text;
                  }
                });
              } else {
                // console.log("came to sendParent");
                bookServices
                  .shareWritingToParent(postData)
                  .then(function(data) {
                    if (data.status != 200) {
                      messageModal("error");
                      vm.writeText = data.text;
                    } else {
                      messageModal("Writing sent to parent");
                      vm.writeText = data.text;
                    }
                  });
              }
            });
          } else {
            vm.writeText = data.text;
          }
        },
        function(data) {
          // console.log('Modal dismissed at: ' + new Date());
        }
      );
    };

    //Add recording To Book
    $(".record_wrapper").hide();
    var bookAudio = true;
    this.addRecording = function() {
      if (!vm.recordData || !isAudio) {
        if (!vm.isPlay) {
          if (bookAudio === true) {
            //  console.log('iffff: ', bookAudio);
            $(".record_icon").addClass("disabled");
            $(".record_wrapper").fadeIn();

            var bookIframe = bookServices.getChildIframe();
            bookIframe.pauseRead();
            bookAudio = false;
          } else {
            //console.log('elseeeee: ', bookAudio);
            $(".record_wrapper").fadeOut();
            $(".record_icon").removeClass("disabled");

            var bookIframe = bookServices.getChildIframe();
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

    getRecordedAudio(); //call default on book loads
    var mediaRecorder;
    var vm = this;
    var bookId = $stateParams.bookId;
    //var cookieAssignmentId =  $cookies.get('cookieAssignmentId');
    // console.log("getCookieAssignmentId",getCookieAssignmentId);
    if (getCookieAssignmentId != undefined) {
      vm.showSendBtn = true;
    } else {
      vm.showShareBtn = true;
    }

    var recordStart = true,
      isStop = false,
      isAudio = false;
    vm.isPlay = false;
    vm.recordData = "";

    //File upload
    function uploadFile(blob) {
      var reader = new FileReader();
      reader.onload = function(event) {
        var token = $cookies.get("nanhaiIndividualSession");
        var fd = new FormData();
        var fileOfBlob = blob;
        fd.append("file", fileOfBlob);
        fd.append("data", event.target.result);
        $.ajax({
          type: "POST",
          url: endpoints.student + "file",
          data: fd,
          processData: false,
          contentType: false,
          headers: { AuthToken: token }
        }).done(function(data) {
          submitRecord(data.fileId);
        });
      };
      // trigger the read from the reader...
      reader.readAsDataURL(blob);
    }

    // submit recroding
    function submitRecord(location) {
      var postData = {
        bookId: bookId,
        location: location
      };
      if (getCookieAssignmentId != undefined) {
        postData.assignmentId = getCookieAssignmentId;
      }
      bookServices.submitRecording(postData).then(
        function(data) {
          if (data) {
            $(".loader").remove();
            //console.log('submit recording success: ', data);
            getRecordedAudio();
            playBtn.disabled = false;
            newBtn.disabled = false;
            sendBtn.disabled = false;
            stopBtn.disabled = true;
            sendBtn.disabled = false;
            recordBtn.disabled = false;
            audioTimerHidden.html("00:00");
            messageModal("Recorded audio has saved!");
          }
        },
        function(data) {
          // console.log('record error: ', data);
        }
      );
    }

    function sendRecordingToTeacher() {
      // console.log("submit to teacher");

      bookServices
        .sendRecordingToTeacherAPI(
          $cookies.get("nanhaiIndividualUserId"),
          $stateParams.bookId,
          getCookieAssignmentId
        )
        .then(
          function(data) {
            if (data) {
              $(".loader").remove();
              // console.log('submit recording success: ', data);
              playBtn.disabled = false;
              newBtn.disabled = false;
              sendBtn.disabled = true;
              vm.sent = true;
              isUploaded = true;
              messageModal("Recorded audio has sent to teacher!");
            }
          },
          function(data) {
            // console.log('record error: ', data);
          }
        );
    }

    function sendRecordingToParent() {
      // console.log("submit to teacher");

      bookServices
        .sendRecordingToParentAPI(
          $cookies.get("nanhaiIndividualUserId"),
          $stateParams.bookId
        )
        .then(
          function(data) {
            if (data) {
              $(".loader").remove();
              // console.log('submit recording success: ', data);
              playBtn.disabled = false;
              newBtn.disabled = false;
              shareBtn.disabled = true;
              vm.sent = true;
              isUploaded = true;
              messageModal("Recorded audio has sent to Parent!");
            }
          },
          function(data) {
            // console.log('record error: ', data);
          }
        );
    }

    // set up basic variables for app

    var timer = document.getElementById("timer");
    var id;
    var value = "00:00";

    // All button function
    //$(function(){
    // fork getUserMedia for multiple browser versions, for the future
    // when more browsers support MediaRecorder
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    if (!navigator.getUserMedia) {
      //console.log('Native web camera streaming (getUserMedia) not supported in this browser.');
      vm.microphoneShow = false;
    }
    var recordBtn = document.querySelector("#record");
    var pauseBtn = document.querySelector("#pause");
    var playBtn = document.querySelector("#play");
    var stopBtn = document.querySelector("#stop");
    var newBtn = document.querySelector("#new");
    var sendBtn = document.querySelector("#send");
    var shareBtn = document.querySelector("#share");
    //var canvas = document.querySelector('.visualizer');

    playBtn.disabled = true;
    stopBtn.disabled = true;
    pauseBtn.disabled = true;
    recordBtn.disabled = false;
    newBtn.disabled = true;
    sendBtn.disabled = true;
    shareBtn.disabled = true;

    var isPausable = false;
    var isUploaded = false;
    vm.sent = false;
    var newState = false;
    /*timer for 2 min */
    function startTimer(m, s) {
      timer.textContent = m + ":" + s;
      if (s == 0) {
        if (m == 0) {
          //mediaRecorder.stop();
          var blob = new File(vm.recordData, "test.mp3");
          uploadFile(blob); //file upload
          var loaderDiv = '<div class="loader"></div>';
          $(loaderDiv).appendTo("body");
          isUploaded = true;
          isStop = true;
          pauseTimer(); //Pause timer
          //  console.log('recording: ', mediaRecorder.state);
          playBtn.disabled = false;
          stopBtn.disabled = false;
          recordBtn.classList.remove("pause");
          recordBtn.classList.add("record");
          recordBtn.disabled = true;
          newBtn.disabled = false;
          playBtn.disabled = false;
          sendBtn.disabled = false;
          shareBtn.disabled = false;
          $(".disabled_visualizer").removeClass("hide");

          return;
        } else if (m != 0) {
          m = m - 1;
          s = 60;
        }
      }

      s = s - 1;
      id = setTimeout(function() {
        startTimer(m, s);
      }, 1000);
    }

    function pauseTimer() {
      value = timer.textContent;
      clearTimeout(id);
    }

    function resumeTimer() {
      var t = value.split(":");
      startTimer(parseInt(t[0], 10), parseInt(t[1], 10));
    }

    /*timer for audio*/
    vm.prevRecordTime = "00:00";
    var audioTimer = $("#audioTimer");
    var audioTimerHidden = $("#audioTimerHidden");
    var time_out_handle = 0;
    function runAudioTimer() {
      var myTime = audioTimer.html();
      if (audioTimerHidden.html() != "Nil") {
        myTime = audioTimerHidden.html();
      }
      var ss = myTime.split(":");
      var dt = new Date();
      dt.setHours(0);
      dt.setMinutes(ss[0]);
      dt.setSeconds(ss[1]);

      var dt2 = new Date(dt.valueOf() + 1000);
      var temp = dt2.toTimeString().split(" ");
      var ts = temp[0].split(":");
      audioTimer.html(ts[1] + ":" + ts[2]);
      if (audioTimerHidden.html() != "Nil") {
        audioTimerHidden.html(ts[1] + ":" + ts[2]);
      }

      //setTimeout(update, 1000);
      if (ts[1] == "10") {
        //console.log("stop timer");
        clearTimeout(time_out_handle);
        return;
      }
      time_out_handle = setTimeout(function() {
        runAudioTimer();
      }, 1000);
    }

    function pauseAudioTimer() {
      vm.prevRecordTime = audioTimer.html();
      //  console.log("vm.prevRecordTime",vm.prevRecordTime);
      // console.log("paused timer");
      clearTimeout(time_out_handle);
    }

    function resumeAudioTimer() {
      //console.log("resume audio timer");
      time_out_handle = setTimeout(runAudioTimer, 1000);
    }

    function stopAudioTimer() {
      clearTimeout(time_out_handle);
      audioTimer.html("00:00");
    }

    // visualiser setup - create web audio api context and canvas

    //main block for doing the audio recording //audioBitsPerSecond :128000,44100

    var constraints = { audio: true };
    var chunks = [];
    var recordState = false;
    var stream = "";
    var startRecording = function(stream) {
      stream = stream;

      visualize(stream);
      //START RECORDING
      //recordBtn.onclick = function() {
      if (recordBtn.classList.contains("pause")) {
        isPausable = true;
      } else {
        isPausable = false;
      }
      if (isPausable) {
        /*pauseAudioTimer();
             recordBtn.classList.remove("pause");
             recordBtn.classList.add("record");
 
               var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus,vp8' });
               if(!vm.isPlay){
                 mediaRecorder.pause();
                 pauseTimer(); //Pause timer
                 //audioTimerHidden.html("00:00");
 
              }else{
                 document.getElementById("player").pause();
                 vm.isPlay=false;
 
               }
                 playBtn.disabled = false;
                 stopBtn.disabled = false;
                 recordBtn.disabled = false;
                 pauseBtn.disabled = true;
                 newBtn.disabled = false;
                 $('.disabled_visualizer').removeClass('hide');
                 isUploaded = false;*/
      } else {
        recordBtn.classList.remove("record");
        recordBtn.classList.add("pause");

        if (isStop) {
          vm.recordData = "";
          chunks = [];
          isStop = false;
        }
        isAudio = true;
        if (recordStart) {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.start(10);
          newState = false;
          var blob = new Blob(chunks, { type: "audio/ogg; codecs=vorbis" });
          startTimer(10, 0); //Start timer
          //runAudioTimer(); //Start timer
          recordStart = false;
        } else {
          /*mediaRecorder.resume();
                   resumeTimer();
                   resumeAudioTimer();
                   newBtn.disabled = true;*/
        }
        //console.log('recording: ', mediaRecorder.state);
        playBtn.disabled = true;
        stopBtn.disabled = false;
        //recordBtn.disabled = true;
        pauseBtn.disabled = false;
        $(".disabled_visualizer").addClass("hide");
      }

      //}; //START RECORING ENDS

      // PAUSE
      pauseBtn.onclick = function() {};
      //STOP
      // stopBtn.onclick = function() {

      // };
      //PLAY
      // playBtn.onclick = function() {
      //   };
      //NEW
      newBtn.onclick = function() {};
      /*closeRecord.onclick = function() {
           mediaRecorder.stop();
           recordStart = true;
         };*/
      // ON STOP
      mediaRecorder.onstart = function() {
        //    console.log('Started, state = ' + mediaRecorder.state);
        runAudioTimer(); //Start timer
      };
      mediaRecorder.onstop = function(e) {
        // console.log('Stopped, state = ' + mediaRecorder.state);
        var blob = new Blob(["audio/ogg; codecs=vorbis"]);
        recordStart = true;
        vm.recordData = "";
        chunks = [];
      };
      // ON DATA AVAILABLE
      mediaRecorder.ondataavailable = function(e) {
        if (!newState && e.data.size > 0) {
          //console.log("data ready...",e.data,newState);
          //console.log('ondataavailable: ', mediaRecorder.state);
          chunks.push(e.data);
          vm.recordData = chunks;
        }
      };
      mediaRecorder.requestData = function(e) {
        // console.log("requestData",e);
      };
    };

    var onError = function(err) {
      // console.log('The following error occured: ', err);
    };

    var onwarning = function(warning) {
      console.warn("Warning: " + warning);
    };

    //});

    function errorCallback(error) {
      // console.log('navigator.getUserMedia error: ', error);
    }
    this.onBtnRecordClicked = function() {
      // console.log(recordState);
      if (recordBtn.classList.contains("record")) {
        // if button is record
        if (!recordState) {
          // if button is record and record not yet started
          if (typeof MediaRecorder === "undefined" || !navigator.getUserMedia) {
            messageModal(
              "MediaRecorder not supported on your browser, use Firefox 30 or Chrome 49 instead."
            );
          } else {
            navigator.getUserMedia(constraints, startRecording, errorCallback);
            playBtn.disabled = true;
            newBtn.disabled = true;
            stopBtn.disabled = true;
            recordBtn.disabled = false;
            sendBtn.disabled = true;
          }
        } else {
          // if button is record and record already started
          audioTimerHidden.html(vm.prevRecordTime);
          resumeRecording();
        }
      } else {
        // if button is pause
        pauseRecording();
      }
    };
    this.onPlayBtnClicked = function() {
      //visualize(stream);
      //console.log("play");
      var loaderDiv = '<div class="loader"></div>';
      $(loaderDiv).appendTo("body");
      var audioURL = "";
      if (vm.audioUrl == "") {
        audioTimerHidden.html("00:00");
        var blob = new Blob(chunks, { type: "audio/ogg; codecs=vorbis" });
        //console.log('on play..',blob);
        // console.log('on play1..',blob);
        audioURL = window.URL.createObjectURL(blob);
        var a = document.getElementById("player");
        a.src = audioURL;
        //a.play();
        setTimeout(function() {
          $(".loader").remove();
          a.play();
          runAudioTimer();
          stopBtn.disabled = false;
          newBtn.disabled = true;
        }, 3000);
        //console.log("Start: " + a.buffered.start(0) + " End: "  + a.buffered.end(0));
        //document.getElementById('player').setAttribute('src', audioURL);
      } else {
        // console.log('on play2..',blob);
        recordBtn.disabled = true;
        var b = document.getElementById("player");
        setTimeout(function() {
          $(".loader").remove();
          b.play();
          runAudioTimer();
          stopBtn.disabled = false;
          newBtn.disabled = true;
          shareBtn.disabled = true;
        }, 3000);
        //b.play();
        // console.log(b.readyState);
        //console.log("Start: " + b.buffered.start(0) + " End: "  + b.buffered.end(0));
        //document.getElementById('player').setAttribute('src', vm.audioUrl);
      }

      stopBtn.disabled = true;
      playBtn.disabled = true;
      recordBtn.disabled = true;
      pauseBtn.disabled = false;
      newBtn.disabled = true;
      vm.isPlay = true;
      isAudio = true;

      sendBtn.disabled = true;
      vm.isPlayStarted = false;
      document
        .getElementById("player")
        .addEventListener("play", function(data) {
          if (!vm.isPlayStarted) {
            //$('.loader').remove();
            vm.isPlayStarted = true;
            //  console.log("started playing....",data);
            //runAudioTimer(); //Start timer
            $(".disabled_visualizer").addClass("hide");
          }
        });

      document
        .getElementById("player")
        .addEventListener("ended", function(data) {
          //  console.log('Play end event fired',isUploaded,vm.sent);
          vm.isPlay = false;
          isPausable = false;
          newBtn.disabled = false;
          playBtn.disabled = false;
          if (!recordStart) {
            recordBtn.disabled = false;
          }
          pauseBtn.disabled = true;
          sendBtn.disabled = false;
          if (!isUploaded && !vm.sent) {
            sendBtn.disabled = true;
            stopBtn.disabled = false;
            recordBtn.disabled = false;
          }
          if (isUploaded && !vm.sent) {
            stopBtn.disabled = true;
            sendBtn.disabled = false;
            shareBtn.disabled = false;
          }
          if (isUploaded && vm.sent) {
            sendBtn.disabled = true;
            stopBtn.disabled = true;
            // console.log("came here");
          }
          if (vm.audioUrl != "") {
            recordBtn.disabled = true;
          }

          $(".disabled_visualizer").removeClass("hide");
          if (vm.audioUrl != "") {
            stopAudioTimer();
          } else {
            pauseAudioTimer();
          }

          audioTimerHidden.html("Nil");
        });
    };
    this.onStopBtnClicked = function() {
      shareBtn.disabled = false;
      if (!vm.isPlay) {
        //pauseTimer(); //Pause timer
        stopAudioTimer();
        //  console.log('onstop if !vm.isPlay: ', mediaRecorder.state);
        recordBtn.classList.remove("pause");
        recordBtn.classList.add("record");
        recordBtn.disabled = true;
        playBtn.disabled = true;
        newBtn.disabled = true;
        sendBtn.disabled = true;
        stopBtn.disabled = true;
        var blob = new File(vm.recordData, "test.mp3");
        uploadFile(blob); //file upload
        var loaderDiv = '<div class="loader"></div>';
        $(loaderDiv).appendTo("body");
        isUploaded = true;
        recordState = false;
        mediaRecorder.stop();
        isStop = true;
      } else {
        document.getElementById("player").pause();
        document.getElementById("player").currentTime = 0;
        vm.isPlay = false;
        //  console.log('onstop else vm.isPlay: ', isUploaded);
        /*if(!recordStart){
                    recordBtn.disabled = false;
                 }*/
        recordBtn.disabled = false;
        if (isUploaded && !vm.sent) {
          sendBtn.disabled = false;
          recordBtn.disabled = true;
        } else if (isUploaded && vm.sent) {
          //sendBtn.disabled    = false;
          recordBtn.disabled = true;
          shareBtn.disabled = true;
          // console.log("came 123");
        } else {
          sendBtn.disabled = true;
          recordBtn.disabled = false;
          shareBtn.disabled = true;
        }
        if (vm.audioUrl !== "") {
          stopBtn.disabled = true;
        }
        //recordBtn.disabled  = false;
        playBtn.disabled = false;
        newBtn.disabled = false;

        audioTimerHidden.html("Nil");
        stopAudioTimer();
      }

      //playBtn.disabled = false;

      //pauseBtn.disabled = true;
      $(".disabled_visualizer").removeClass("hide");
    };
    function pauseRecording() {
      // console.log("do pause....");
      recordState = true;
      pauseAudioTimer();
      recordBtn.classList.remove("pause");
      recordBtn.classList.add("record");

      var blob = new Blob(chunks, { type: "audio/ogg; codecs=vorbis" });
      if (!vm.isPlay) {
        mediaRecorder.pause();
        pauseTimer(); //Pause timer
        //audioTimerHidden.html("00:00");
      } else {
        document.getElementById("player").pause();
        vm.isPlay = false;
      }
      playBtn.disabled = false;
      stopBtn.disabled = false;
      recordBtn.disabled = false;
      pauseBtn.disabled = true;
      newBtn.disabled = false;
      $(".disabled_visualizer").removeClass("hide");
      isUploaded = false;
    }
    function resumeRecording() {
      //console.log("resume....");
      $(".disabled_visualizer").addClass("hide");
      recordBtn.classList.remove("record");
      recordBtn.classList.add("pause");
      mediaRecorder.resume();
      resumeTimer();
      resumeAudioTimer();
      newBtn.disabled = true;
      playBtn.disabled = true;
      stopBtn.disabled = false;
    }
    this.onBtnNewClicked = function() {
      recordState = false;
      newState = true;
      chunks = [];
      vm.recordData = "";
      vm.audioUrl = "";
      //console.log(chunks);
      if (!recordStart) {
        mediaRecorder.stop();
        isStop = true;
        // console.log("New record clicked...");
      }
      isAudio = false;
      //console.log("start new record");
      newBtn.disabled = true;
      playBtn.disabled = true;
      recordBtn.disabled = false;
      stopBtn.disabled = true;
      sendBtn.disabled = true;
      shareBtn.disabled = true;
      /*isPausable = false;
           recordBtn.classList.remove("pause");
           recordBtn.classList.add("record");*/
      audioTimerHidden.html("00:00");
      //audioTimer.html("00:00");
      stopAudioTimer();
      $(".disabled_visualizer").removeClass("hide");
      document.getElementById("player").pause();
      vm.isPlay = false;
    };

    //close recoring
    this.closeRecording = function() {
      if (vm.isPlay) {
        document.getElementById("player").pause();
        vm.isPlay = false;
      }
      playBtn.disabled = false;
      newBtn.disabled = false;
      stopBtn.disabled = true;
      recordBtn.disabled = true;
      //pauseBtn.disabled = true;

      // if(!vm.recordData || !isAudio){
      //   $('.record_wrapper').hide();
      // }else{
      if (!recordStart) {
        mediaRecorder.stop();
        isStop = true;
      }
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "views/modals/recordSaveConfirm.html",
        controller: "recordSaveConfirmCtrl",
        size: "sm",
        resolve: {
          items: function() {
            return "yes";
          }
        }
      });
      modalInstance.result.then(
        function(data) {
          if (data === "yes") {
            //var blob = new File(vm.recordData, 'test.mp3');
            //uploadFile(blob); //file upload
            sendRecordingToTeacher();
          }
          playBtn.disabled = false;
          newBtn.disabled = false;
          stopBtn.disabled = true;
          recordBtn.disabled = true;
          //$('.record_wrapper').hide();
          //$('.disabled_visualizer').removeClass('hide');
          var loaderDiv = '<div class="loader"></div>';
          $(loaderDiv).appendTo("body");
          vm.recordData = "";
          var bookIframe = bookServices.getChildIframe();
          bookIframe.resumeRead();
        },
        function() {
          //vm.recordData = "";
          //chunks= [];
          playBtn.disabled = false;
          newBtn.disabled = false;
          stopBtn.disabled = true;
          recordBtn.disabled = true;
          //$('.record_wrapper').hide();
          //$('.disabled_visualizer').removeClass('hide');
          // console.log('Modal dismissed at: ' + new Date());
        }
      );
      //}
      $(".record_icon").removeClass("disabled");
      isAudio = false;
    };

    //send recording to Parent
    this.sendToParentRecording = function() {
      if (vm.isPlay) {
        document.getElementById("player").pause();
        vm.isPlay = false;
      }
      playBtn.disabled = false;
      newBtn.disabled = false;
      stopBtn.disabled = true;
      recordBtn.disabled = true;
      //pauseBtn.disabled = true;

      // if(!vm.recordData || !isAudio){
      //   $('.record_wrapper').hide();
      // }else{
      if (!recordStart) {
        mediaRecorder.stop();
        isStop = true;
      }
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "views/modals/recordSaveConfirm.html",
        controller: "recordSaveConfirmCtrl",
        size: "sm",
        resolve: {
          items: function() {
            return "yes";
          }
        }
      });
      modalInstance.result.then(
        function(data) {
          if (data === "yes") {
            //var blob = new File(vm.recordData, 'test.mp3');
            //uploadFile(blob); //file upload
            sendRecordingToParent();
          }
          playBtn.disabled = false;
          newBtn.disabled = false;
          stopBtn.disabled = true;
          recordBtn.disabled = true;
          //$('.record_wrapper').hide();
          //$('.disabled_visualizer').removeClass('hide');
          var loaderDiv = '<div class="loader"></div>';
          $(loaderDiv).appendTo("body");
          vm.recordData = "";
          var bookIframe = bookServices.getChildIframe();
          bookIframe.resumeRead();
        },
        function() {
          //vm.recordData = "";
          //chunks= [];
          playBtn.disabled = false;
          newBtn.disabled = false;
          stopBtn.disabled = true;
          recordBtn.disabled = true;
          //$('.record_wrapper').hide();
          //$('.disabled_visualizer').removeClass('hide');
          // console.log('Modal dismissed at: ' + new Date());
        }
      );
      //}
      $(".record_icon").removeClass("disabled");
      isAudio = false;
    };

    /*----------------visualizer-----------------------------*/
    function visualize(stream) {
      var source = audioCtx.createMediaStreamSource(stream);

      var analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);
      //analyser.connect(audioCtx.destination);

      var WIDTH = canvas.width;
      var HEIGHT = canvas.height;

      draw();

      function draw() {
        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = "rgb(200, 200, 200)";
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(0, 0, 0)";

        canvasCtx.beginPath();

        var sliceWidth = (WIDTH * 1.0) / bufferLength;
        var x = 0;

        for (var i = 0; i < bufferLength; i++) {
          var v = dataArray[i] / 128.0;
          var y = (v * HEIGHT) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      }
    }

    /*-------fetch audio from api on loding book-----------*/
    function getRecordedAudio() {
      if (getCookieAssignmentId != undefined) {
        bookServices
          .getRecordingWithAssignment(
            $cookies.get("nanhaiIndividualUserId"),
            $stateParams.bookId,
            getCookieAssignmentId
          )
          .then(
            function(data) {
              // console.log("Data::",data);
              if (data) {
                // console.log('fetch audio: ', data.data);
                // console.log('fetch audio sent: ', data.data.sent);
                // if(data.data.sent === true){
                //   console.log("ifffffff");
                //   vm.sent             = true;
                //   //sendBtn.disabled    = true;
                // }else{
                //   //sendBtn.disabled    = false;
                //   isUploaded          = false;
                //    vm.sent             = false;
                // }

                if (data.data.location != null && !data.data.sent) {
                  isUploaded = true;
                  vm.sent = false;
                  //sendBtn.disabled = false;
                  if (data.data.expired) {
                    playBtn.disabled = true;
                    recordBtn.disabled = false;
                    newBtn.disabled = true;
                    sendBtn.disabled = true;
                  } else {
                    playBtn.disabled = false;
                    recordBtn.disabled = true;
                    newBtn.disabled = false;
                    sendBtn.disabled = false;
                  }
                } else if (data.data.location != null && data.data.sent) {
                  isUploaded = true;
                  vm.sent = true;
                  sendBtn.disabled = true;
                  shareBtn.disabled = true;
                  if (data.data.expired) {
                    playBtn.disabled = true;
                    recordBtn.disabled = true;
                    newBtn.disabled = true;
                  } else {
                    playBtn.disabled = false;
                    recordBtn.disabled = true;
                    newBtn.disabled = false;
                  }
                } else {
                  isUploaded = false;
                  vm.sent = false;
                  playBtn.disabled = true;
                  recordBtn.disabled = false;
                  newBtn.disabled = true;
                }
                if (data.data.location != null && !data.data.expired) {
                  // isUploaded          = true;
                  // playBtn.disabled    = false;
                  // recordBtn.disabled  = true;
                  // newBtn.disabled     = false;
                  // sendBtn.disabled    = false;

                  //console.log('call download api');
                  bookServices.downloadFile(data.data.location).then(
                    function(resp) {
                      if (resp) {
                        vm.audioUrl = $sce.trustAsResourceUrl(
                          resp.data.location
                        );
                        document
                          .getElementById("player")
                          .setAttribute("src", vm.audioUrl);
                        // console.log('status:',isUploaded,vm.sent);
                      }
                    },
                    function(data) {
                      // console.log('audio error: ', data);
                    }
                  );
                }
              }
            },
            function(data) {
              // console.log('fetch error: ', data);
            }
          );
      } else {
        bookServices
          .getRecording(
            $cookies.get("nanhaiIndividualUserId"),
            $stateParams.bookId
          )
          .then(
            function(data) {
              if (data) {
                // console.log('fetch assignment audio: ', data.data,data.data.sent);
                // if(data.data.sent === true){
                //   console.log("ifffffff");
                //   vm.sent             = true;
                //   //sendBtn.disabled    = true;
                // }else{
                //   //sendBtn.disabled    = false;
                //   isUploaded          = false;
                //    vm.sent             = false;
                // }
                if (data.data.location != null && !data.data.sent) {
                  isUploaded = true;
                  vm.sent = false;
                  if (data.data.expired) {
                    playBtn.disabled = true;
                    recordBtn.disabled = false;
                    newBtn.disabled = true;
                    sendBtn.disabled = true;
                  } else {
                    playBtn.disabled = false;
                    recordBtn.disabled = true;
                    newBtn.disabled = false;
                    sendBtn.disabled = false;
                  }
                } else if (data.data.location != null && data.data.sent) {
                  isUploaded = true;
                  vm.sent = true;
                  sendBtn.disabled = true;

                  //console.log("Check1");
                  if (data.data.expired) {
                    playBtn.disabled = true;
                    recordBtn.disabled = true;
                    newBtn.disabled = true;
                  } else {
                    playBtn.disabled = false;
                    recordBtn.disabled = true;
                    newBtn.disabled = false;
                    shareBtn.disabled = true;
                  }
                } else {
                  isUploaded = false;
                  vm.sent = false;
                  playBtn.disabled = true;
                  recordBtn.disabled = false;
                  newBtn.disabled = true;
                  sendBtn.disabled = true;
                }
                if (data.data.location != null && !data.data.expired) {
                  // isUploaded          = true;
                  // playBtn.disabled    = false;
                  // recordBtn.disabled  = true;
                  // newBtn.disabled     = false;
                  // sendBtn.disabled    = false;
                  //console.log('call download api');
                  bookServices.downloadFile(data.data.location).then(
                    function(resp) {
                      if (resp) {
                        vm.audioUrl = $sce.trustAsResourceUrl(
                          resp.data.location
                        );
                        document
                          .getElementById("player")
                          .setAttribute("src", vm.audioUrl);
                        // console.log('status:',isUploaded,vm.sent);
                      }
                    },
                    function(data) {
                      // console.log('audio error: ', data);
                    }
                  );
                }
              }
            },
            function(data) {
              // console.log('fetch error: ', data);
            }
          );
      } /*get audio*/
    } /*get recorded audio*/

    //Book Autofit
    angular.element(document).ready(function() {
      pageScale();
      //console.log("resize by default");
      $(window).on("resize", function() {
        pageScale();
        //console.log("resize on resize");
      });
    });
    function pageScale() {
      var hScale = $(window).height() / 984;
      hScale = hScale.toFixed(2) - 0.02;
      //console.log('hScale',hScale);
      $(".bookContainer").css("transform", "scale(" + hScale + ")");
      var pageTopFix = (984 * hScale - 984) / 2;
      //console.log('pageTopFix',pageTopFix);
      $(".bookContainer").css("top", pageTopFix - 10);
    }
  });

/* ------------ modal controller -------------*/
// cancel subscription modal
angular
  .module("nanhaiMainApp")
  .controller("recordSaveConfirmCtrl", function(
    $scope,
    $uibModalInstance,
    items
  ) {
    $scope.ok = function() {
      $uibModalInstance.close("yes");
    };
    $scope.cancel = function() {
      $uibModalInstance.dismiss("cancel");
    };

    $("#recSaveModal").on("hidden.bs.modal", function() {
      alert(1);
    });
  });

// The configuration below will disable the close on [ESC / click outside] for all modals.

angular.module("ui.bootstrap").config(function($provide) {
  $provide.decorator("$uibModal", function($delegate) {
    var open = $delegate.open;

    $delegate.open = function(options) {
      options = angular.extend(options || {}, {
        backdrop: "static",
        keyboard: false
      });

      return open(options);
    };
    return $delegate;
  });
});

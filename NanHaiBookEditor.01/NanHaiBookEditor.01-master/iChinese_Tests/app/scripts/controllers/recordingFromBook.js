 'use strict';
 /**
  * @ngdoc function
  * @name nanhaiMainApp.controller:recordingController
  * @description
  * # recordingController
  * Controller of the nanhaiMainApp
  */
 angular.module('nanhaiMainApp')
   .controller('recordingController', function ($location, $scope, bookServices, $cookies, $stateParams,
   											 endpoints, $uibModal) {
 
     var mediaRecorder;
     var vm = this;
     var bookId = $stateParams.bookId;
    	var getCookieAssignmentId =  $cookies.get('cookieAssignmentId');
 	var recordStart = true, isStop=false, isAudio = false;
 	vm.isPlay = false;
     vm.recordData = "";
 
 	//File upload
 	function uploadFile(blob){
 		var reader = new FileReader();
 		reader.onload = function(event){
 			var token = $cookies.get('nanhaiIndividualSession');
 			var fd = new FormData();
 			var fileOfBlob = blob;
 			fd.append("file", fileOfBlob);
 			fd.append('data', event.target.result);
 			$.ajax({
 				type: 'POST',
 				url: endpoints.student + "file",
 				data: fd,
 				processData: false,
 				contentType: false,
 				headers: {'AuthToken' : token}
 			}).done(function(data) {
 				submitRecord(data.fileId);
 			});
 		};
 		// trigger the read from the reader...
 		reader.readAsDataURL(blob);
 	}
 
 
 	// submit recroding
 	function submitRecord(location){
 		var postData = {
 			"bookId": bookId,
       		"location": location
    		};
    		if(getCookieAssignmentId != undefined){
   			postData.assignmentId = getCookieAssignmentId;
   		}
 		bookServices.submitRecording(postData).then(function (data) {
 			if(data){
 				//console.log('submit recording success: ', data);
 			}
 	    }, function (data) {
 	      	// console.log('record error: ', data);
 	    });
 	}
 
 
 
 	// set up basic variables for app
 	var record = document.querySelector('.record');
 	var pause = document.querySelector('.pause');
 	var play = document.querySelector('.play');
 	var stop = document.querySelector('.stop');
 	var closeRecord = document.querySelector('.closeRecord');
 	var canvas = document.querySelector('.visualizer');
 
 	var timer = document.getElementById("timer");
 	var id;
 	var value = "00:00";
 
 	// All button function
 	//$(function(){
 		// fork getUserMedia for multiple browser versions, for the future
 		// when more browsers support MediaRecorder
 		navigator.getUserMedia = ( navigator.getUserMedia ||
 		                       navigator.webkitGetUserMedia ||
 		                       navigator.mozGetUserMedia ||
 		                       navigator.msGetUserMedia);
 
 		// disable stop button while not recording
 		play.disabled = true;
 		stop.disabled = true;
 		pause.disabled = true;
 		record.disabled = false;
 
 		function startTimer(m, s) {
 		    timer.textContent = m + ":" + s;
 		    if (s == 0) {
 		        if (m == 0) {
 		        	mediaRecorder.stop();
 			      	pauseTimer(); //Pause timer
 			      	// console.log('recording: ', mediaRecorder.state);
 				  	play.disabled = false;
 			      	stop.disabled = true;
 			      	record.disabled = false;
 			      	pause.disabled = true;
 			      	$('.disabled_visualizer').removeClass('hide');
 
 		            return;
 		        } else if (m != 0) {
 		            m = m - 1;
 		            s = 60;
 		        }
 		    }
 
 		    s = s - 1;
 		    id = setTimeout(function () {
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
 
 		// visualiser setup - create web audio api context and canvas
 		var audioCtx = new (window.AudioContext || webkitAudioContext)();
 		var canvasCtx = canvas.getContext("2d");
 		// console.log("audioCtx",JSON.stringify(audioCtx));
 
 		if (typeof(Storage) !== "undefined") {
     		// Store
     		//localStorage.setItem("AudioContextStorage", JSON.stringify(audioCtx));
     		// Retrieve
     		var retrievedObject  = localStorage.getItem("AudioContextStorage");
     		// console.log('retrievedObject: ', JSON.parse(retrievedObject));
 		} else {
 		    // console.log("Sorry, your browser does not support Web Storage...");
 		}
 
 
 		//main block for doing the audio recording
 		if (navigator.getUserMedia) {
 		  	// console.log('getUserMedia supported.');
 		  	var constraints = { audio: true };
 		  	var chunks = [];
 
 			var onSuccess = function(stream) {
 		    	mediaRecorder = new MediaRecorder(stream);
 		    	visualize(stream);
           	//START RECORDING
 		   record.onclick = function() {
 		    	if(isStop){
 		    		vm.recordData = "";
 		    		chunks = [];
 		    		isStop=false;
 		    	}
 		    	isAudio = true;
 		    	if(recordStart){
 		    		mediaRecorder.start(1000);
 			        var blob = new Blob(chunks, { 'type' : 'audio/wav; codecs=opus' });
 			        startTimer(2, 0); //Start timer
 					recordStart = false;
 			        // console.log('recording: ', "recording");
 		    	}else{
 		    		mediaRecorder.resume();
 		    		resumeTimer();
           			// console.log('recording: ', "resume");
 		    	}
 		      		//console.log('recording: ', mediaRecorder.state);
 				    play.disabled = true;
 		      		stop.disabled = false;
 		      		record.disabled = true;
 		      		pause.disabled = false;
 		        	$('.disabled_visualizer').addClass('hide');
 		    };
           	// PAUSE
 		    pause.onclick = function() {
         			var blob = new Blob(chunks, { 'type' : 'audio/wav; codecs=opus' });
         		if(!vm.isPlay){
 		      		mediaRecorder.pause();
 		      		pauseTimer(); //Pause timer
 			      	// console.log('recording: ', mediaRecorder.state);
 		     	 }else{
 		      		document.getElementById("player").pause();
 		      		vm.isPlay=false;
 		      	}
 		      		play.disabled = false;
 		      		stop.disabled = true;
 		      		record.disabled = false;
 		      		pause.disabled = true;
 		      		$('.disabled_visualizer').removeClass('hide');
 	    	};
           	//STOP
 		    stop.onclick = function() {
 		    	if(!vm.isPlay){
 			      	mediaRecorder.stop();
 			      	isStop=true;
 			      	pauseTimer(); //Pause timer
 			      	// console.log('recording: ', mediaRecorder.state);
 			      	}else{
 			      	document.getElementById("player").pause();
 			      	vm.isPlay=false;
 		      	}
 		        play.disabled = false;
 		      	stop.disabled = true;
 		      	record.disabled = false;
 		      	pause.disabled = true;
 		      	$('.disabled_visualizer').removeClass('hide');
 		    };
         	//PLAY
 			play.onclick = function() {
 	    		// console.log('play started..');
 	      		var blob = new Blob(chunks, { 'type' : 'audio/wav; codecs=opus' });
         		var audioURL = window.URL.createObjectURL(blob);
           		document.getElementById('player').setAttribute('src', audioURL);
 
 				play.disabled = true;
 		      	stop.disabled = false;
 		      	record.disabled = true;
 		      	pause.disabled = false;
 		      	vm.isPlay=true;
 		      	isAudio = true;
 		      	$('.disabled_visualizer').addClass('hide');
 			  		document.getElementById('player').addEventListener("ended",function(data) {
 	          			// console.log('Play ended.');
 				        vm.isPlay=false;
 			        	play.disabled = false;
 				      	stop.disabled = true;
 				      	record.disabled = false;
 				      	pause.disabled = true;
 				      	$('.disabled_visualizer').removeClass('hide');
 				    });
 	    	};
 
 	    	/*closeRecord.onclick = function() {
 	    		mediaRecorder.stop();
 	    		recordStart = true;
 	    	};*/
           	// ON STOP
 	    	mediaRecorder.onstop = function(e) {
 		      	var blob = new Blob(['audio/wav; codecs=opus']);
 		      	recordStart = true;
 	    	};
           	// ON DATA AVAILABLE
 	    	mediaRecorder.ondataavailable = function(e) {
           	//console.log("data ready...");
 	      		chunks.push(e.data);
 	      		vm.recordData = chunks;
 	    	};
 			};
 
 		  	var onError = function(err) {
 		    	// console.log('The following error occured: ', err);
 		  	};
 
 
 
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
 
 		    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
 		    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
 
 		    canvasCtx.lineWidth = 2;
 		    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
 
 		    canvasCtx.beginPath();
 
 		    var sliceWidth = WIDTH * 1.0 / bufferLength;
 		    var x = 0;
 
 
 		    for(var i = 0; i < bufferLength; i++) {
 
 		      var v = dataArray[i] / 128.0;
 		      var y = v * HEIGHT/2;
 
 		      if(i === 0) {
 		        canvasCtx.moveTo(x, y);
 		      } else {
 		        canvasCtx.lineTo(x, y);
 		      }
 
 		      x += sliceWidth;
 		    }
 
 		    canvasCtx.lineTo(canvas.width, canvas.height/2);
 		    canvasCtx.stroke();
 
 		  	}
 		}
 
 	//});
 
 
 	//close recoring
     this.closeRecording = function () {
 
     	if(vm.isPlay){
     		document.getElementById("player").pause();
     		vm.isPlay=false;
 
 		}
 			play.disabled = true;
       		stop.disabled = true;
       		record.disabled = false;
       		pause.disabled = true;
 
 		if(!vm.recordData || !isAudio){
 			$('.record_wrapper').hide();
 		}else{
 			if(!recordStart){
 					mediaRecorder.stop();
 				    isStop=true;
 			}
 	  		var modalInstance = $uibModal.open({
 		        "animation": true,
 		        "templateUrl": 'views/modals/recordSaveConfirm.html',
 		        "controller": "recordSaveConfirmCtrl",
 		        "size": "sm",
 		        resolve: {
 		            items: function () {
 		              return 'yes';
 		            }
 		        }
 	    	});
 	    	modalInstance.result.then(function (data) {
 	    		if(data === 'yes'){
 	    			var blob = new File(vm.recordData, 'test.mp3');
 				    uploadFile(blob); //file upload
 	    		}
 				play.disabled = true;
 				stop.disabled = true;
 				pause.disabled = true;
 				record.disabled = false;
 				$('.record_wrapper').hide();
 				$('.disabled_visualizer').removeClass('hide');
 				vm.recordData = "";
 				var bookIframe = bookServices.getChildIframe();
 	      	    bookIframe.resumeRead();
 
 	    	}, function () {
 	    		vm.recordData = "";
 	    		chunks= [];
 	    		play.disabled = true;
 	    		$('.record_wrapper').hide();
 				$('.disabled_visualizer').removeClass('hide');
 				// console.log('Modal dismissed at: ' + new Date());
 
 			});
 		}
 		$('.record_icon').removeClass('disabled');
 		isAudio=false;
     };
 
     	navigator.getUserMedia(constraints, onSuccess, onError);
 		} else {
 	   		// console.log('getUserMedia not supported on your browser!');
 		}
 });
 
 
 /* ------------ modal controller -------------*/
 // cancel subscription modal
 angular.module('nanhaiMainApp')
 .controller('recordSaveConfirmCtrl', function($scope, $uibModalInstance, items) {
 
   	$scope.ok = function() {
     	$uibModalInstance.close('yes');
 	};
 	$scope.cancel = function() {
     	$uibModalInstance.dismiss('cancel');
 	};
 
 	$('#recSaveModal').on('hidden.bs.modal', function () {
   		alert(1);
 	})
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

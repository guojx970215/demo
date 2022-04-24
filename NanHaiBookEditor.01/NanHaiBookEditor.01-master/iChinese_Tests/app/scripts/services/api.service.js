 /**
  * @ngdoc service
  * @name fortesuperadminApp.apiService
  * @description
  * # apiService
  * Service in the fortesuperadminApp.
  */
 angular.module('nanhaiMainApp')
   .service('apiService', function ($http, $state, $cookies, $uibModal, endpoints, $cookieStore) {
 	
 	var vm = this;
 	vm.shownModal = false;
 	vm.logout = logout;
 	//var shownModal = false;
 	
 	
 	//Without token
     this.apiCall = function(req){
       return $http(req);
     };
 	
 	//Add User session to request
     this.userAPICall = function(req){
 	     var userSession = $cookies.get('nanhaiIndividualSession');
 	     req.headers = req.headers || {};
 	     req.headers.AuthToken = userSession;
 	     return $http(req).then(function(res) {	 
 	     	//console.log('userAPICall res: ', res);	       	
 	      	return res;
 	     }).catch(function(error) {
 	     	if(error.data){
      			//console.log('userAPICall error: ', error);	     			 	
 		     	if(error.status === 403 && !vm.shownModal){
 		      		sessionExpireAlert(error.data.message[0].message);	      			      		
 		      	}else if(error.status === 404 && !vm.shownModal){
 		      		accountExpireAlert(error.data.message);
 		      	}
 		      	if(error.data.message.message === 'School account is blocked' && !vm.shownModal){ 
 	      			sessionExpireAlert(error.data.message.message); 		
 	      		}
       		}
 	        return error;
 	    });            
     };
     
 	function sessionExpireAlert(item) {
         
 		vm.shownModal = true;
       	var modalInstance = $uibModal.open({
             "animation": true,
             "templateUrl": 'views/modals/okModal.html',
             "backdrop": 'static',
             "controller": "okModalCtrl",
             "size": "sm",
             resolve: {
                 items: function () {
                   return item;
                 }
             }
     	});
         modalInstance.result.then(function (data) {        	        		
 			logout(); //logout	           	
         }, function () {
         	logout(); //logout
             // console.log('Modal dismissed at: ' + new Date());
         });	
 	};
 	
 	function accountExpireAlert(item) {
 		vm.shownModal = true;
       	var modalInstance = $uibModal.open({
             "animation": true,
             "templateUrl": 'views/modals/okModal.html',
             "backdrop": 'static',
             "controller": "okModalCtrl",
             "size": "sm",
             resolve: {
                 items: function () {
                   return item;
                 }
             }
     	});
         modalInstance.result.then(function (data) {        	        		
 			$state.go('trialPayment');           	
         }, function () {
         	$state.go('trialPayment');
             // console.log('Modal dismissed at: ' + new Date());
         });	
 	};
 	
 	function logout() {
 		window.location.assign('/icr'); //redirect to login page
 		
        $cookies.remove('nanhaiIndividualSession', {path: '/'});
   		$cookies.remove('nanhaiIndividualUserId', {path: '/'});
   		$cookies.remove('nanhaiIndividualSession', {path: '/student'});
   		$cookies.remove('nanhaiIndividualUserId', {path: '/student'});
   		$cookieStore.remove('nanhaiRole', {path: '/'});
 	    $cookieStore.remove('nanhaiRole', {path: '/student'});
 	    $cookieStore.remove('cookieClassPicked');
        $cookies.remove('trailUserName', {path: '/'});		
 	}
 
 	
 	// Add Teacher session to request
     this.teacherAPICall = function(req){
       var userSession = $cookies.get('nanhaiTeacherSession');
       req.headers = req.headers || {};
       req.headers.AuthToken = userSession;
       return $http(req);
       /*
        return $http(req).then(function(res) {	       	
                 return res;
             }).catch(function(error) {	    	
                if(error){
                    // console.log('api error student page: ', error.data.message.message);
                                   if(error.data.message === 'Unauthorized access'){
                         $('.loader').remove(); //remove Loader
                         $state.go('login');    			
                     }
                     if(error.data.message.message === 'School account is blocked' && !vm.shownModal){ 
                         messageModal(error.data.message.message);  			
                     }
                 }
               return error;
             });*/
       
     };
 	
 	//Add parent session to request
     this.parentAPICall = function (req) {
       var parentSession = $cookies.get('nanhaiParentSession');
       req.headers = req.headers || {};
       req.headers.AuthToken = parentSession;
       return $http(req);
     };
     
     
     
   });

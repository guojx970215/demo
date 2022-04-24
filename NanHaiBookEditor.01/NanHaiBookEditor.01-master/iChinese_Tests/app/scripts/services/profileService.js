 'use strict';
 
 /**
  * @ngdoc service
  * @name nanhaiMainApp.bookServices
  * @description
  * # profileServices
  * Service in the nanhaiMainApp.
  */
 angular.module('nanhaiMainApp')
   .service('profileService', function (endpoints, $q, $cookies, $state, apiService, $uibModal) {
 
   	function setData(id, value) {
 		if ( typeof value === 'object' ) value= JSON.stringify(value);
     	sessionStorage.setItem(id, value);
 	}
 	function getData(id) {
 		const value = sessionStorage.getItem(id);
 		try {
 		 	return JSON.parse(value);
 		} catch(e) {
 		 	return value; 
 		}
 	}
 
 	return {
 		setData: setData,
 		getData: getData
 	}
 
   });
 
 

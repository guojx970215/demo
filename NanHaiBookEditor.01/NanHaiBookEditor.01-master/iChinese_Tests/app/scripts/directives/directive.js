 'use strict';
 
 /**
  * @ngdoc directive
  * @name nanhaiMainApp.directives
  * @description
  * # fallback image directive
  */
 angular.module('nanhaiMainApp')
   .directive('fallbackSrc', function () {
 	var fallbackSrc = {
 	    link: function postLink(scope, iElement, iAttrs) {
 	      iElement.bind('error', function() {
 	        angular.element(this).attr("src", iAttrs.fallbackSrc);
 	        //iAttrs.$set('src', iAttrs.fallbackSrc); //this will also works
 	      });
 	    }
 	   }
    return fallbackSrc;
 
 });

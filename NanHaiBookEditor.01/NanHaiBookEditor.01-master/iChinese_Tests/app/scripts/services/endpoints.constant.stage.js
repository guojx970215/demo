  /**
   * @ngdoc service
   * @name forteInternalMobilityApp.endpoints
   * @description
   * # endpoints
   * Constant in the nanhaiMainApp.
   */
  angular.module('nanhaiMainApp')
    .constant('endpoints', {
  
      //STAGE -Updated
      
      user: 'http://nanhai-be-stage-1208488131.us-west-1.elb.amazonaws.com:8080/usermanager/',
      admin: 'http://nanhai-be-stage-1208488131.us-west-1.elb.amazonaws.com:8080/superadmin/',
      school: 'http://nanhai-be-stage-1208488131.us-west-1.elb.amazonaws.com:8080/schoolmanager/',
      student: 'http://nanhai-be-stage-1208488131.us-west-1.elb.amazonaws.com:8080/studentmanager/',
      BASE_URL: "http://54.153.94.36:3000/",
      BASE_URL_JAVA: 'http://nanhai-be-stage-1208488131.us-west-1.elb.amazonaws.com:8080/',
      payment: 'http://nanhai-be-stage-1208488131.us-west-1.elb.amazonaws.com:8080/usermanager/payment/',
      projectUrl:'http://stage.ichinesereader.com/'
      
    });
  

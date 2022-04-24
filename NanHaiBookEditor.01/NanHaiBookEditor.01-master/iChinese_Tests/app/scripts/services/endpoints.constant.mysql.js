  /**
   * @ngdoc service
   * @name forteInternalMobilityApp.endpoints
   * @description
   * # endpoints
   * Constant in the nanhaiMainApp.
   */
  angular.module('nanhaiMainApp')
    .constant('endpoints', {
  
      // Pre-Prod after MYSQL Migration
  
      user: 'http://nanhai-migration-be-2043523477.us-east-2.elb.amazonaws.com/usermanager/',
      admin: 'http://nanhai-migration-be-2043523477.us-east-2.elb.amazonaws.com/superadmin/',
      school: 'http://nanhai-migration-be-2043523477.us-east-2.elb.amazonaws.com/schoolmanager/',
      student: 'http://nanhai-migration-be-2043523477.us-east-2.elb.amazonaws.com/studentmanager/',
      BASE_URL: "http://sandbox.ichinesereader.com/",
      BASE_URL_JAVA: 'http://nanhai-migration-be-2043523477.us-east-2.elb.amazonaws.com/',
      payment: 'http://nanhai-migration-be-2043523477.us-east-2.elb.amazonaws.com/usermanager/payment/',
      projectUrl: 'http://nanhai-migration-be-2043523477.us-east-2.elb.amazonaws.com/'
  
    });

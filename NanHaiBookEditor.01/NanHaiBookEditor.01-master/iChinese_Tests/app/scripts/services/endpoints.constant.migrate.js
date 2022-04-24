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

    //Temporary prod build

    // user: 'https://api.migration.ichinesereader.com/usermanager/',
    // admin: 'https://api.migration.ichinesereader.com/superadmin/',
    // school: 'https://api.migration.ichinesereader.com/schoolmanager/',
    // student: 'https://api.migration.ichinesereader.com/studentmanager/',
    // BASE_URL: "https://api.migration.ichinesereader.com/",
    // BASE_URL_JAVA: 'https://api.migration.ichinesereader.com/',
    // payment: 'https://api.migration.ichinesereader.com/usermanager/payment/',
    // projectUrl: 'https://api.migration.ichinesereader.com/'

      // Production

      // user: 'https://api.ichinesereader.com/usermanager/',
      // admin: 'https://api.ichinesereader.com/superadmin/',
      // school: 'https://api.ichinesereader.com/schoolmanager/',
      // student: 'https://api.ichinesereader.com/studentmanager/',
      // BASE_URL: "https://ichinesereader.com/",
      // BASE_URL_JAVA: 'https://api.ichinesereader.com/',
      // payment: 'https://api.ichinesereader.com/usermanager/payment/',
      // projectUrl:'https://api.ichinesereader.com/'



  });

//student is for both student and individual

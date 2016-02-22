/**
 * Angular module for examples component. This component is divided to following logical components:
 *
 *  frontend.examples.about
 *  frontend.examples.author
 *  frontend.examples.book
 *  frontend.examples.chat
 *  frontend.examples.messages
 *
 * Each component has it own configuration for ui-router.
 */
(function() {
  'use strict';

  // Define frontend.admin module
  angular.module('frontend.welcome', [
//      'dependancy'
  ]);

  // Module configuration
  angular.module('frontend.examples.about')
    .config([
      '$stateProvider',
      function($stateProvider) {
        $stateProvider
          .state('welcome', {
            url: '/welcome',
            data: {
              access: 0
            },
            views: {
              'content@': {
                templateUrl: '/frontend/welcome/welcome.html'
              },
              'pageNavigation@': false
            }
          })
        ;
      }
    ])
  ;
}());

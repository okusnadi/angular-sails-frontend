  'use strict';

   /**
   * Configuration for frontend application, this contains following main sections:
   *
   *  4) Set up application routes
   */

  angular.module('frontend')
    .config([
      '$stateProvider', '$urlRouterProvider', 'AccessLevels',
      function config(
        $stateProvider, $urlRouterProvider, AccessLevels
      ) {
        // Routes that needs authenticated user
        $stateProvider
          .state('profile', {
            abstract: true,
            template: '<ui-view/>',
            data: {
              access: AccessLevels.user
            }
          })
          .state('profile.edit', {
            url: '/profile',
            templateUrl: '/frontend/profile/profile.html',
            controller: 'ProfileController'
          })
        ;

        // Main state provider for frontend application
        $stateProvider
          .state('frontend', {
            abstract: true,
            views: {
              header: {
                templateUrl: '/frontend/core/layout/partials/header.html',
                controller: 'HeaderController'
              },
//              footer: {
//                templateUrl: '/frontend/core/layout/partials/footer.html',
//                controller: 'FooterController'
//              }
            }
          })
        ;

        // For any unmatched url, redirect to /about
        $urlRouterProvider.otherwise('/about');
          
      }
    ])
  ;


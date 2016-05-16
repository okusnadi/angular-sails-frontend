/**
 * Client component to wrap all client specified stuff together. This component is divided to following logical components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.admin.userStatus' angular module.
 */
(function() {
  'use strict';

  // Define frontend.admin.userStatus angular module
  angular.module('frontend.admin.userStatus', []);

  // Module configuration
  angular.module('frontend.admin.userStatus')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          // Client list
          .state('admin.userStatus', {
            url: '/admin/userStatus',
            views: {
              'content@': {
                templateUrl: '/frontend/admin/userStatus/userStatus-list.html',
                controller: 'UserStatusListController',
              }
            }
          })

          // Single client
//          .state('admin.client', {
//            resolve: {
//              // current client needed in child states too
//              _client: [
//                '$stateParams',
//                'ClientModel',
//                function resolve(
//                  $stateParams,
//                  ClientModel
//                  ) {
//                  return ClientModel.fetch($stateParams.clientId, {populate: 'campaigns'});
//                }
//              ]
//            },
//            url: '/admin/client/:clientId',
//            views: {
//              'content@': {
//                templateUrl: '/frontend/admin/client/client.html',
//                controller: 'ClientController',
//              }
//            }
//          })

          // Add new client
//          .state('admin.client.add', {
//            url: '/add',
//            data: {
//              access: 2
//            },
//            views: {
//              'content@': {
//                templateUrl: '/frontend/admin/client/client.html',
//                controller: 'ClientAddController',
//              }
//            }
//          })
        ;
      }
    ])
  ;
}());

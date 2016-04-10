/**
 * Client component to wrap all client specified stuff together. This component is divided to following logical components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.admin.client' angular module.
 */
(function() {
  'use strict';

  // Define frontend.admin.client angular module
  angular.module('frontend.admin.client', [
    'frontend.admin.client.campaign'
  ]);

  // Module configuration
  angular.module('frontend.admin.client')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          // Client list
          .state('admin.clients', {
            url: '/admin/clients',
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client/client-list.html',
                controller: 'ClientListController',
              }
            }
          })

          // Single client
          .state('admin.client', {
            resolve: { 
                // current client needed in child states too
                _client: [
                    '$stateParams',
                    'ClientModel',
                    function resolve(
                      $stateParams,
                      ClientModel
                    ) {
                      return ClientModel.fetch($stateParams.clientId, {populate: 'campaigns'});
                    }
                ]
            },
            url: '/admin/client/:clientId',
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client/client.html',
                controller: 'ClientController',
              }
            }
          })

          // Add new client
          .state('admin.client.add', {
            url: '/add',
            data: {
              access: 2
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client/client.html',
                controller: 'ClientAddController',
              }
            }
          })
        ;
      }
    ])
  ;
}());

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
  angular.module('frontend.admin.client', []);

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
                resolve: {
                  _items: [
                    'ListConfig',
                    'ClientModel',
                    function resolve(
                      ListConfig,
                      ClientModel
                    ) {
                      var config = ListConfig.getConfig();

                      var parameters = {
                        populate: 'campaigns',
                        limit: config.itemsPerPage,
                        sort: 'name ASC'
                      };

                      return ClientModel.load(parameters);
                    }
                  ],
                  _count: [
                    'ClientModel',
                    function resolve(ClientModel) {
                      return ClientModel.count();
                    }
                  ],
                  _campaigns: [
                    'CampaignModel',
                    function resolve(CampaignModel) {
                      return CampaignModel.load();
                    }
                  ]
                }
              }
            }
          })

          // Single client
          .state('admin.client', {
            url: '/admin/client/:id',
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client/client.html',
                controller: 'ClientController',
                resolve: {
                  _client: [
                    '$stateParams',
                    'ClientModel',
                    function resolve(
                      $stateParams,
                      ClientModel
                    ) {
                      return ClientModel.fetch($stateParams.id, {populate: 'campaigns'});
                    }
                  ],
                  _campaigns: [
                    'CampaignModel',
                    function resolve(CampaignModel) {
                      return CampaignModel.load();
                    }
                  ]                  
                }
              }
            }
          })

          // Add new client
          .state('admin.client.add', {
            url: '/admin/client/add',
            data: {
              access: 2
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client/client.html',
                controller: 'ClientAddController',
                resolve: {
                  _campaigns: [
                    'CampaignModel',
                    function resolve(CampaignModel) {
                      return CampaignModel.load();
                    }
                  ]
                }
              }
            }
          })
        ;
      }
    ])
  ;
}());

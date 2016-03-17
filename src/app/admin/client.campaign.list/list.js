/**
 * List component to wrap all list specified stuff together. This component is divided to following logical components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.admin.client.list.list' angular module.
 */
(function() {
  'use strict';

  // Define frontend.admin.client.list.list angular module
  angular.module('frontend.admin.client.campaign.list', [
      'textAngular'
  ]);

  // Module configuration
  angular.module('frontend.admin.client.campaign.list')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          // List list
          .state('lists', {
            parent: 'campaign',
            url: '/lists',
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client.campaign.list/list-list.html',
                controller: 'ListListController',
                resolve: {
                  _items: [
                    'ListConfig',
                    'ListModel',
                    '_campaign',
                    function resolve(
                      ListConfig,
                      ListModel,
                      _campaign
                    ) {
                      var config = ListConfig.getConfig();

                      var parameters = {
                        limit: config.itemsPerPage,
                        sort: 'name ASC',
                        where: { 
                            campaign: _campaign.id
                        }
                      };

                      return ListModel.load(parameters);
                    }
                  ],
                  _count: [
                    'ListModel',
                    function resolve(ListModel) {
                      return ListModel.count();
                    }
                  ]
                }
              }
            }
          })

          // Single list
          .state('list', {
            parent: 'campaign',
            url: '/list/:listId',
            resolve: {
                _list: [
                    '$stateParams',
                    'ListModel',
                    function resolve(
                      $stateParams,
                      ListModel
                    ) {
                      return ListModel.fetch($stateParams.listId);
                    }
                  ]
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client.campaign.list/list.html',
                controller: 'ListController',
                resolve: {
                  _lists: [
                    'ListModel',
                    function resolve(ListModel) {
                      return ListModel.load();
                    }
                  ]                  
                }
              }
            }
          })

          // Add new list
          .state('list.add', {
//            parent: 'admin.client',
            url: '/add',
            data: {
              access: 2
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client.campaign.list/list.html',
                controller: 'ListAddController',
                resolve: {
                }
              }
            }
          })
        ;
      }
    ])
  ;
}());

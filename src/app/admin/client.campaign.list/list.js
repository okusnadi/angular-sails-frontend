/**
 * List component to wrap all list specified stuff together. This component is divided to following logical components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.admin.client.list.list' angular module.
 */
(function () {
  'use strict';
  // Define frontend.admin.client.list.list angular module
  angular.module('frontend.admin.client.campaign.list', [
    'frontend.admin.client.campaign.list.prospect',
//    'textAngular'
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
            resolve: {
              _scripts: [
                'ScriptModel', '_campaign',
                function resolve(ScriptModel, _campaign) {
                  return ScriptModel.load({
                    where: {
                      campaign: _campaign.id
                    }
                  });
                }
              ],
              _lists: [
                'ListModel', '_campaign',
                function resolve(ListModel, _campaign) {
                  return ListModel.load({
                    where: {
                      campaign: _campaign.id
                    },
                    populate: 'defaultScript',
                    limit: config.itemsPerPage,
                    sort: 'name ASC'
                  });
                }
              ],
              _count: [
                'ListModel', '_campaign',
                function resolve(ListModel, _campaign) {
                  return ListModel.count({
                    where: {
                      campaign: _campaign.id
                    }
                  });
                }
              ]
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client.campaign.list/list-list.html',
                controller: 'ListListController'
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
                  _scripts: [
                    'ScriptModel', '_campaign',
                    function resolve(ScriptModel, _campaign) {
                      return ScriptModel.load({
                        where: {
                          campaign: _campaign.id
                        }
                      });
                    }
                  ]
                }
              }
            }
          })

          // Add new list
//          .state('list.add', {
//            url: '/add',
//            data: {
//              access: 2
//            },
//            views: {
//              'content@': {
//                templateUrl: '/frontend/admin/client.campaign.list/list.html',
//                controller: 'ListAddController',
//                resolve: {
//                  _scripts: [
//                    'ScriptModel', '_campaign',
//                    function resolve(ScriptModel, _campaign) {
//                      return ScriptModel.load({
//                        where: {
//                          campaign: _campaign.id
//                        }
//                      });
//                    }
//                  ]
//                }
//              }
//            }
//          })
          ;
      }
    ])
    ;
}());

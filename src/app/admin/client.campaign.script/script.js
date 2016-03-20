/**
 * Script component to wrap all script specified stuff together. This component is divided to following logical components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.admin.client.script.script' angular module.
 */
(function() {
  'use strict';

  // Define frontend.admin.client.script.script angular module
  angular.module('frontend.admin.client.campaign.script', [
      'textAngular'
  ]);

  // Module configuration
  angular.module('frontend.admin.client.campaign.script')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          // Script list
          .state('scripts', {
            parent: 'campaign',
            url: '/scripts',
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client.campaign.script/script-list.html',
                controller: 'ScriptListController',
                resolve: {
                  _items: [
                    'ListConfig',
                    'ScriptModel',
                    '_campaign',
                    function resolve(
                      ListConfig,
                      ScriptModel,
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

                      return ScriptModel.load(parameters);
                    }
                  ],
                  _count: [
                    'ScriptModel',
                    function resolve(ScriptModel) {
                      return ScriptModel.count();
                    }
                  ]
                }
              }
            }
          })

          // Single script
          .state('script', {
            parent: 'campaign',
            url: '/script/:scriptId',
            resolve: {
                _script: [
                    '$stateParams',
                    'ScriptModel',
                    function resolve(
                      $stateParams,
                      ScriptModel
                    ) {
                      return ScriptModel.fetch($stateParams.scriptId);
                    }
                  ]
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client.campaign.script/script.html',
                controller: 'ScriptController',
                resolve: {
//                  _lists: [
//                    'ListModel',
//                    function resolve(ListModel) {
//                      return ListModel.load();
//                    }
//                  ]                  
                }
              }
            }
          })

          // Add new script
          .state('script.add', {
//            parent: 'admin.client',
            url: '/add',
            data: {
              access: 2
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client.campaign.script/script.html',
                controller: 'ScriptAddController',
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

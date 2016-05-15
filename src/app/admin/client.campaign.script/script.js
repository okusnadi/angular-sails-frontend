/**
 * Script component to wrap all script specified stuff together. This component is divided to following logical components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.admin.client.script.script' angular module.
 */
(function () {
  'use strict';

  // Define frontend.admin.client.script.script angular module
  angular.module('frontend.admin.client.campaign.script', [
    'frontend.core.formBuilder'
//      'textAngular''
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
                controller: 'ScriptListController'
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
                }
              },
              'pageNavigation@': {
                template: ''
              },
              'header@': {
                templateUrl: '/frontend/core/layout/partials/header-disabled.html',
                controller: 'HeaderController'
              }
            }
          })

          // Single script
          .state('node', {
            parent: 'script',
            url: '/node/:nodeId',
            resolve: {
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client.campaign.script/node-form.html',
                controller: 'ScriptPageController',
                resolve: {
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

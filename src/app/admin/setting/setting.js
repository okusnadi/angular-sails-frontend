/**
 * Setting component to wrap all setting specified stuff together. This component is divided to following logical components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.admin.setting' angular module.
 */
(function () {
  'use strict';

  // Define frontend.admin.setting angular module
  angular.module('frontend.admin.setting', []);

  // Module configuration
  angular.module('frontend.admin.setting')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          // Setting list
          .state('admin.settings', {
            url: '/admin/settings',
            views: {
              'content@': {
                templateUrl: '/frontend/admin/setting/setting-list.html',
//                controller: 'SettingListController',
                resolve: {
                  _settings: [
                    'SettingModel',
                    function resolve(SettingModel) {
                      return SettingModel.load();
                    }
                  ]
                }
              }
            }
          })

          .state('links', {
            parent: 'admin.settings',
            url: '/links',
            data: {
              'selectedTab': 0
            },
            views: {
              'links': {
                controller: 'SettingListController',
              }
            }
          })
          .state('statuses', {
            parent: 'admin.settings',
            url: '/statuses',
            data: {
              'selectedTab': 1
            },
            views: {
              'statuses': {
                controller: 'SettingListController',
              }
            }
          })
          ;
      }
    ])
    ;
}());

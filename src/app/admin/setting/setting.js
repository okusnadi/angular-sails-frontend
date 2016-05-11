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
            resolve: {
              _settings: [
                'SettingModel',
                function resolve(SettingModel) {
                  return SettingModel.load();
                }
              ]
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/setting/setting-main.html',
                controller: ['$scope', '$state', function ($scope, $state) {
                    if ($state.current.name === 'admin.settings') {
                      $state.go('links');
                    }
                  }]
              }
            }
          })

          .state('links', {
            parent: 'admin.settings',
            url: '/links',
            data: {
              'selectedTab':  0,
              'type':         'FIELDS',
              'title':        'Links'
            },
            views: {
              'tabContent': {
                controller: 'SettingListController',
                templateUrl: '/frontend/admin/setting/setting-list.html',
              }
            }
          })
          .state('statuses', {
            parent: 'admin.settings',
            url: '/statuses',
            data: {
              'selectedTab':  1,
              'type':         'STATUSES',
              'title':        'Status list'
            },
            views: {
              'tabContent': {
                controller: 'SettingListController',
                templateUrl: '/frontend/admin/setting/setting-list.html',
              }
            }
          })
          ;
      }
    ])
    ;
}());

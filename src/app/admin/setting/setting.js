/**
 * Setting component to wrap all setting specified stuff together. This component is divided to following logical components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.admin.setting' angular module.
 */
(function() {
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
                controller: 'SettingListController',
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

          // Single setting
          .state('admin.setting', {
            url: '/admin/setting/:id',
            views: {
              'content@': {
                templateUrl: '/frontend/admin/setting/setting.html',
                controller: 'SettingController',
                resolve: {
                  _setting: [
                    '$stateParams',
                    'SettingModel',
                    function resolve(
                      $stateParams,
                      SettingModel
                    ) {
                      return SettingModel.fetch($stateParams.id, {populate: 'roles'});
                    }
                  ],
                  _roles: [
                    'RoleModel',
                    function resolve(RoleModel) {
                      return RoleModel.load();
                    }
                  ]                  
                }
              }
            }
          })

          // Add new setting
          .state('admin.setting.add', {
            url: '/add',
            data: {
              access: 2
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/setting/setting.html',
                controller: 'SettingAddController',
                resolve: {
                  _roles: [
                    'RoleModel',
                    function resolve(RoleModel) {
                      return RoleModel.load();
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

/**
 * User component to wrap all user specified stuff together. This component is divided to following logical components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.admin.user' angular module.
 */
(function() {
  'use strict';

  // Define frontend.admin.user angular module
  angular.module('frontend.admin.user', []);

  // Module configuration
  angular.module('frontend.admin.user')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          // User list
          .state('admin.users', {
            url: '/admin/users',
            views: {
              'content@': {
                templateUrl: '/frontend/admin/user/md-list.html',
                controller: 'UserListController',
                resolve: {
                  _items: [
                    'ListConfig',
                    'UserModel',
                    function resolve(
                      ListConfig,
                      UserModel
                    ) {
                      var config = ListConfig.getConfig();

                      var parameters = {
                        populate: 'roles',
                        limit: config.itemsPerPage,
                        sort: 'username ASC'
                      };

                      return UserModel.load(parameters);
                    }
                  ],
                  _count: [
                    'UserModel',
                    function resolve(UserModel) {
                      return UserModel.count();
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

          // Single user
          .state('admin.user', {
            url: '/admin/user/:id',
            views: {
              'content@': {
                templateUrl: '/frontend/admin/user/user.html',
                controller: 'UserController',
                resolve: {
                  _user: [
                    '$stateParams',
                    'UserModel',
                    function resolve(
                      $stateParams,
                      UserModel
                    ) {
                      return UserModel.fetch($stateParams.id, {populate: 'roles'});
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

          // Add new user
          .state('admin.user.add', {
            url: '/admin/user/add',
            data: {
              access: 2
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/user/user.html',
                controller: 'UserAddController',
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

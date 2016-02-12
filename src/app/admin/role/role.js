/**
 * Role component to wrap all role specified stuff together. This component is divided to following logical
 * components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.admin.role' angular module.
 */
(function() {
  'use strict';

  // Define frontend.admin.role angular module
  angular.module('frontend.admin.role', []);

  // Module configuration
  angular.module('frontend.admin.role')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          // Roles list
          .state('admin.roles', {
            url: '/admin/roles',
            views: {
              'content@': {
                templateUrl: '/frontend/admin/role/list.html',
                controller: 'RoleListController',
                resolve: {
                  _items: [
                    'ListConfig',
                    'RoleModel',
                    function resolve(
                      ListConfig,
                      RoleModel
                    ) {
                      var config = ListConfig.getConfig();

                      var parameters = {
                        populate: 'books',
                        limit: config.itemsPerPage,
                        sort: 'name ASC'
                      };

                      return RoleModel.load(parameters);
                    }
                  ],
                  _count: [
                    'RoleModel',
                    function resolve(RoleModel) {
                      return RoleModel.count();
                    }
                  ]
                }
              }
            }
          })

          // Single role
          .state('admin.role', {
            url: '/admin/role/:id',
            views: {
              'content@': {
                templateUrl: '/frontend/admin/role/role.html',
                controller: 'RoleController',
                resolve: {
                  _role: [
                    '$stateParams',
                    'RoleModel',
                    function resolve(
                      $stateParams,
                      RoleModel
                    ) {
                      return RoleModel.fetch($stateParams.id);
                    }
                  ],
                  _books: [
                    '$stateParams',
                    'BookModel',
                    function resolve(
                      $stateParams,
                      BookModel
                    ) {
                      return BookModel.load({role: $stateParams.id});
                    }
                  ],
                  _booksCount: [
                    '$stateParams',
                    'BookModel',
                    function resolve(
                      $stateParams,
                      BookModel
                    ) {
                      return BookModel.count({role: $stateParams.id});
                    }
                  ]
                }
              }
            }
          })

          // Add new role
          .state('admin.role.add', {
            url: '/admin/role/add',
            data: {
              access: 2
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/role/add.html',
                controller: 'RoleAddController'
              }
            }
          })
        ;
      }
    ])
  ;
}());

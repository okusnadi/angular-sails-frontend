/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.user' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
  'use strict';

  // Controller for new user creation.
  angular.module('frontend.admin.user')
    .controller('UserAddController', [
      '$scope', '$state',
      'MessageService',
      'UserModel',
      '_roles',
      function controller(
        $scope, $state,
        MessageService,
        UserModel,
        _roles
      ) {
        // Store roles
        $scope.roles = _roles;

        // Initialize user model
        $scope.user = {
          title: '',
          description: '',
          role: '',
          releaseDate: new Date()
        };

        /**
         * Scope function to store new user to database. After successfully save user will be redirected
         * to view that new created user.
         */
        $scope.addUser = function addUser() {
          UserModel
            .create(angular.copy($scope.user))
            .then(
              function onSuccess(result) {
                MessageService.success('New user added successfully');

                $state.go('admin.user', {id: result.data.id});
              }
            )
          ;
        };
      }
    ])
  ;

  // Controller to show single user on GUI.
  angular.module('frontend.admin.user')
    .controller('UserController', [
      '$scope', '$state',
      'UserService', 'MessageService',
      'UserModel', 'RoleModel',
      '_user',
      function controller(
        $scope, $state,
        UserService, MessageService,
        UserModel, RoleModel,
        _user
      ) {
        // Set current scope reference to model
        UserModel.setScope($scope, 'user');

        // Initialize scope data
        $scope.currentUser = UserService.user();
        $scope.user = _user;
        $scope.roles = [];
        $scope.selectRole = _user.role ? _user.role.id : null;

        // User delete dialog buttons configuration
        $scope.confirmButtonsDelete = {
          ok: {
            label: 'Delete',
            className: 'btn-danger',
            callback: function callback() {
              $scope.deleteUser();
            }
          },
          cancel: {
            label: 'Cancel',
            className: 'btn-default pull-left'
          }
        };

        /**
         * Scope function to save the modified user. This will send a
         * socket request to the backend server with the modified object.
         */
        $scope.saveUser = function saveUser() {
          var data = angular.copy($scope.user);

          // Set role id to update data
          data.role = $scope.selectRole;

          // Make actual data update
          UserModel
            .update(data.id, data)
            .then(
              function onSuccess() {
                MessageService.success('User "' + $scope.user.title + '" updated successfully');
              }
            )
          ;
        };

        /**
         * Scope function to delete current user. This will send DELETE query to backend via web socket
         * query and after successfully delete redirect user back to user list.
         */
        $scope.deleteUser = function deleteUser() {
          UserModel
            .delete($scope.user.id)
            .then(
              function onSuccess() {
                MessageService.success('User "' + $scope.user.title + '" deleted successfully');

                $state.go('admin.users');
              }
            )
          ;
        };

        /**
         * Scope function to fetch role data when needed, this is triggered whenever user starts to edit
         * current user.
         *
         * @returns {null|promise}
         */
        $scope.loadRoles = function loadRoles() {
          if ($scope.roles.length) {
            return null;
          } else {
            return RoleModel
              .load()
              .then(
                function onSuccess(data) {
                  $scope.roles = data;
                  console.log($scope.roles);
                }
              )
            ;
          }
        };
      }
    ])
  ;

  // Controller which contains all necessary logic for user list GUI on boilerplate application.
  angular.module('frontend.admin.user')
    .controller('UserListController', [
      '$scope', '$q', '$timeout',
      '_',
      'ListConfig', 'SocketHelperService',
      'UserService', 'UserModel', 'RoleModel',
      '_items', '_count', '_roles',
      function controller(
        $scope, $q, $timeout,
        _,
        ListConfig, SocketHelperService,
        UserService, UserModel, RoleModel,
        _items, _count, _roles
      ) {
        // Set current scope reference to models
        UserModel.setScope($scope, false, 'items', 'itemCount');
        RoleModel.setScope($scope, false, 'roles');

        // Add default list configuration variable to current scope
        $scope = angular.extend($scope, angular.copy(ListConfig.getConfig()));

        // Set initial data
        $scope.items = _items;
        $scope.itemCount = _count.count;
        $scope.roles = _roles;
        $scope.currentUser = UserService.user();

        // Initialize used title items
        $scope.titleItems = ListConfig.getTitleItems(UserModel.endpoint);

        // Initialize default sort data
        $scope.sort = {
          column: 'username',
          direction: true
        };

        // Initialize filters
        $scope.filters = {
          searchWord: '',
          columns: $scope.titleItems
        };

        // Function to change sort column / direction on list
        $scope.changeSort = function changeSort(item) {
          var sort = $scope.sort;

          if (sort.column === item.column) {
            sort.direction = !sort.direction;
          } else {
            sort.column = item.column;
            sort.direction = true;
          }

          _triggerFetchData();
        };

        /**
         * Helper function to fetch specified role property.
         *
         * @param   {Number}    roleId        Role id to search
         * @param   {String}    [property]      Property to return, if not given returns whole role object
         * @param   {String}    [defaultValue]  Default value if role or property is not founded
         *
         * @returns {*}
         */
        $scope.getRole = function getRole(roleId, property, defaultValue) {
          defaultValue = defaultValue || 'Unknown';
          property = property || true;

          // Find role
          var role = _.find($scope.roles, function iterator(role) {
            return parseInt(role.id, 10) === parseInt(roleId.toString(), 10);
          });

          return role ? (property === true ? role : role[property]) : defaultValue;
        };

        /**
         * Simple watcher for 'currentPage' scope variable. If this is changed we need to fetch user data
         * from server.
         */
        $scope.$watch('currentPage', function watcher(valueNew, valueOld) {
          if (valueNew !== valueOld) {
            _fetchData();
          }
        });

        /**
         * Simple watcher for 'itemsPerPage' scope variable. If this is changed we need to fetch user data
         * from server.
         */
        $scope.$watch('itemsPerPage', function watcher(valueNew, valueOld) {
          if (valueNew !== valueOld) {
            _triggerFetchData();
          }
        });

        var searchWordTimer;

        /**
         * Watcher for 'filter' scope variable, which contains multiple values that we're interested
         * within actual GUI. This will trigger new data fetch query to server if following conditions
         * have been met:
         *
         *  1) Actual filter variable is different than old one
         *  2) Search word have not been changed in 400ms
         *
         * If those are ok, then watcher will call 'fetchData' function.
         */
        $scope.$watch('filters', function watcher(valueNew, valueOld) {
          if (valueNew !== valueOld) {
            if (searchWordTimer) {
              $timeout.cancel(searchWordTimer);
            }

            searchWordTimer = $timeout(_triggerFetchData, 400);
          }
        }, true);

        /**
         * Helper function to trigger actual data fetch from backend. This will just check current page
         * scope variable and if it is 1 call 'fetchData' function right away. Any other case just set
         * 'currentPage' scope variable to 1, which will trigger watcher to fetch data.
         *
         * @private
         */
        function _triggerFetchData() {
          if ($scope.currentPage === 1) {
            _fetchData();
          } else {
            $scope.currentPage = 1;
          }
        }

        /**
         * Helper function to fetch actual data for GUI from backend server with current parameters:
         *  1) Current page
         *  2) Search word
         *  3) Sort order
         *  4) Items per page
         *
         * Actually this function is doing two request to backend:
         *  1) Data count by given filter parameters
         *  2) Actual data fetch for current page with filter parameters
         *
         * These are fetched via 'UserModel' service with promises.
         *
         * @private
         */
        function _fetchData() {
          $scope.loading = true;

          // Common parameters for count and data query
          var commonParameters = {
            where: SocketHelperService.getWhere($scope.filters)
          };

          // Data query specified parameters
          var parameters = {
            populate: 'roles',
            limit: $scope.itemsPerPage,
            skip: ($scope.currentPage - 1) * $scope.itemsPerPage,
            sort: $scope.sort.column + ' ' + ($scope.sort.direction ? 'ASC' : 'DESC')
          };

          // Fetch data count
          var count = UserModel
            .count(commonParameters)
            .then(
              function onSuccess(response) {
                $scope.itemCount = response.count;
              }
            )
          ;

          // Fetch actual data
          var load = UserModel
            .load(_.merge({}, commonParameters, parameters))
            .then(
              function onSuccess(response) {
                $scope.items = response;
              }
            )
          ;

          // Load all needed data
          $q
            .all([count, load])
            .finally(
              function onFinally() {
                $scope.loaded = true;
                $scope.loading = false;
              }
            )
          ;
        }
      }
    ])
  ;
}());

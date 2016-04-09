/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.user' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
  'use strict';
  
  var UserAddController = function (
        $scope,
        MessageService,
        UserModel, RoleModel, $mdDialog
      ) {
  
        // Initialize user model
        $scope.user = {
            username: '',
            firstName: '',
            lastName: '',
            roles: [], 
            passports: []
        };
        $scope.password = {
            first: '',
            second: ''
        };
        
        // Load roles
        RoleModel.load()
            .then(function(response){
                $scope.roles = response;
            });
                
        $scope.saveUser = function() {
            $scope.user.passports.push(
                {
                    protocol: 'local',
                    password: $scope.password.first
                }                    
            );
            UserModel
            .create(angular.copy($scope.user))
            .then(
              function onSuccess(result) {
                MessageService.success('New user added successfully');
                $mdDialog.hide();
//                $state.go('admin.user', {id: result.data.id});
              }
            )
          ;
        };
        
        $scope.cancelDialog = function(){$mdDialog.cancel();};
        
};


//controller for editing user
var UserEditController =  function (
        $scope,
        $mdDialog,
        UserService, MessageService,
        UserModel, RoleModel, 
        userId
      ) {
        // expose state
//        $scope.$state = $state;
        // Set current scope reference to model
        UserModel.setScope($scope, 'user');

        // Initialize scope data
        $scope.currentUser = UserService.user();
//        $scope.user = _user;
        // Store roles
        RoleModel.load()
                .then(function(response){
                    $scope.roles = response;
                });
        UserModel.fetch(userId, {populate: 'roles'})
                .then(function(response){
                    $scope.user = response;
                    $scope.selectRole = $scope.user.role ? $scope.user.role.id : null;
                });

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

        $scope.cancelDialog = function(){$mdDialog.cancel();};
        /**
         * Scope function to save the modified user. This will send a
         * socket request to the backend server with the modified object.
         */
        $scope.saveUser = function() {
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

//                $state.go('admin.users');
              }
            )
          ;
        };

        $scope.confirmDelete = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Delete user')
                  .textContent('Are you sure you want to delete user '+$scope.user.username+' ?')
                  .ariaLabel('Delete user')
                  .targetEvent(ev)
                  .ok('Yes')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
              $scope.deleteUser();
            }, function() {
                
            });
          };        
      };

  // Controller for new user creation.
  angular.module('frontend.admin.user')
    .controller('UserAddController', [
      '$scope', '$state',
      'MessageService',
      'UserModel', 'RoleModel',
      UserAddController

    ])
  ;

  // Controller to show single user on GUI.
  angular.module('frontend.admin.user')
    .controller('UserController', 
    [
      '$scope', '$state',
      '$mdDialog',
      'UserService', 'MessageService',
      'UserModel', 'RoleModel',
      '_user', '_roles',
      function controller(
        $scope, $state,
        $mdDialog,
        UserService, MessageService,
        UserModel, RoleModel,
        _user, _roles
      ) {
        // expose state
        $scope.$state = $state;
        // Set current scope reference to model
        UserModel.setScope($scope, 'user');

        // Initialize scope data
        $scope.currentUser = UserService.user();
        $scope.user = _user;
        $scope.roles = _roles;
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
        $scope.saveUser = function() {
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

        $scope.confirmDelete = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Delete user')
                  .textContent('Are you sure you want to delete user '+$scope.user.username+' ?')
                  .ariaLabel('Delete user')
                  .targetEvent(ev)
                  .ok('Yes')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
              $scope.deleteUser();
            }, function() {
                
            });
          };        
      }
    ])
  ;

  // Controller which contains all necessary logic for user list GUI on boilerplate application.
  angular.module('frontend.admin.user')
    .controller('UserListController', [
      '$scope', '$q', '$timeout', '$mdDialog', '$state',
      '_',
      'ListConfig', 'SocketHelperService',
      'UserService', 'UserModel', 'RoleModel',
      '_items', '_count', '_roles',
      function controller(
        $scope, $q, $timeout, $mdDialog, $state,
        _,
        ListConfig, SocketHelperService,
        UserService, UserModel, RoleModel,
        _items, _count, _roles
      ) {
        
        // Set current scope reference to models
        UserModel.setScope($scope, false, 'items', 'itemCount');
        RoleModel.setScope($scope, false, 'roles');
        
        //selected array
        $scope.selected = [];
        
        //filter
        $scope.filter = {
            options: {
                debounce: 500
            }
        };
        
        $scope.removeFilter = function () {
            $scope.filter.show = false;
            $scope.query.filter = '';

            if($scope.filter.form.$dirty) {
              $scope.filter.form.$setPristine();
            }
        };

        // Add default list configuration variable to current scope
        $scope = angular.extend($scope, angular.copy(ListConfig.getConfig()));

        // Set initial data
        $scope.items = _items;
        $scope.itemCount = _count.count;
        $scope.roles = _roles;
        $scope.currentUser = UserService.user();
        $scope.query =  {
            order: 'username',
            page: 1,
            limit: $scope.itemsPerPage
        };

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
        
        //alert dialogs
        $scope.showAlert = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#container')))
                .clickOutsideToClose(true)
                .title('This is an alert title')
                .textContent('You can specify some description text in here.')
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                .targetEvent(ev)
            );
          };
        
          
        $scope.addUserDialog = function(ev) {
//            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
              controller: UserAddController,
              templateUrl: '/frontend/admin/user/user.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
//              fullscreen: useFullScreen
            });
        };
        
        $scope.editUserDialog = function(event, item, column ) {
            console.log(event);
//            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
              controller: UserEditController, 
              resolve: {
                  userId: 
                    function() {
                      return item.id;
                    }
                  },
              templateUrl: '/frontend/admin/user/user.html',
              parent: angular.element(document.body),
              targetEvent: event,
              clickOutsideToClose:true,
//              fullscreen: useFullScreen
            });
//          
//            $scope.$watch(function() {
//              return $mdMedia('xs') || $mdMedia('sm');
//            }, function(wantsFullScreen) {
//              $scope.customFullscreen = (wantsFullScreen === true);
//            });
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
        
        /*
         * Method to call when order-by column changed
         */
        $scope.onReorder = function (order) {
            // first char is '-' if direction is ascending
            $scope.sort.direction = order.charAt(0) !== '-';
            if( !$scope.sort.direction ) {
                order = order.substring(1);
            }            
            $scope.sort.column = order;
            _triggerFetchData();
        };
        
        
        $scope.onPaginate = function (currentPage, itemsPerPage) {
            $scope.currentPage = currentPage;
            $scope.itemsPerPage = itemsPerPage;
            _fetchData();
          };

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

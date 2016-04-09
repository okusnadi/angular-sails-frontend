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

        // Set current scope reference to model
        UserModel.setScope($scope, 'user');

        // Initialize scope data
        $scope.currentUser = UserService.user();
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

  // Controller which contains all necessary logic for user list GUI on boilerplate application.
  angular.module('frontend.admin.user')
    .controller('UserListController', [
      '$scope', '$q', '$timeout', '$mdDialog', '$state',
      '_',
      'UserService', 'UserModel', 'RoleModel',
      'DataProvider',
       '_roles',
      function controller(
        $scope, $q, $timeout, $mdDialog, $state,
        _,
        UserService, UserModel, RoleModel,
        DataProvider,
        _roles
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
        
        $scope.roles = _roles;
        $scope.showFilter = false;
  
        $scope.query =  {
            order: 'username',
            searchWord: '',            
            populate: ['roles']
        };
        

        $scope.dataProvider = new DataProvider(UserModel, $scope.query);

        var searchWordTimer;

        $scope.$watch('query.searchWord', function watcher(valueNew, valueOld) {
          if (valueNew !== valueOld) {
            if (searchWordTimer) {
              $timeout.cancel(searchWordTimer);
            }

            searchWordTimer = $timeout($scope.dataProvider.triggerFetchData, 400);
          }
        }, true);
        
        $scope.removeFilter = function () {
            $scope.showFilter = false;
            $scope.query.searchWord = '';

            if($scope.filterForm.$dirty) {
              $scope.filterForm.$setPristine();
            }
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
        
      }
    ])
  ;
    
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

  
}());

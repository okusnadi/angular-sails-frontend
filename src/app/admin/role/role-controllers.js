/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.role' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  // Controller for new role creation.
  var RoleAddController = function (
    $scope, $state,
    MessageService, RoleModel, $mdDialog, dataProvider
    ) {

    // Initialize role model
    $scope.role = {
      name: '',
      description: '',
      accessLevel: 100,
      active: true
    };

    $scope.$state = $state;

    /**
     * Scope function to store new role to database. After successfully save user will be redirected
     * to view that new created role.
     */
    $scope.saveRole = function () {
      RoleModel
        .create(angular.copy($scope.role))
        .then(
          function onSuccess(result) {
            MessageService.success('New role added successfully');
            $mdDialog.hide();
            dataProvider.triggerFetchData();
          }
        );
    };

    $scope.cancelDialog = function () {
      $mdDialog.cancel();
    };

  };

  // Controller for new role creation.
  angular.module('frontend.admin.role')
    .controller('RoleAddController', [
      '$scope', '$state',
      'MessageService', 'RoleModel', '$mdDialog', 'dataProvider',
      RoleAddController]);

  //role edit controller
  // Controller to show single role on GUI.
  var RoleEditController = function controller(
    $scope, $state, $mdDialog,
    UserService, MessageService, RoleModel,
    _role, dataProvider
    ) {
    // Set current scope reference to models
    RoleModel.setScope($scope, 'role');

    // Expose necessary data        
    $scope.$state = $state;
    $scope.currentUser = UserService.user();
    $scope.role = _role;

    // Role delete dialog buttons configuration
    $scope.confirmButtonsDelete = {
      ok: {
        label: 'Delete',
        className: 'btn-danger',
        callback: function callback() {
          $scope.deleteRole();
        }
      },
      cancel: {
        label: 'Cancel',
        className: 'btn-default pull-left'
      }
    };

    $scope.cancelDialog = function () {
      $mdDialog.cancel();
    };

    // Scope function to save modified role.
    $scope.saveRole = function saveRole() {
      var data = angular.copy($scope.role);

      // Make actual data update
      RoleModel
        .update(data.id, data)
        .then(
          function onSuccess() {
            MessageService.success('Role "' + $scope.role.name + '" updated successfully');
            $mdDialog.hide();
            dataProvider.triggerFetchData();
          }
        )
        ;
    };

    // Scope function to delete role
    $scope.deleteRole = function deleteRole() {
      RoleModel
        .delete($scope.role.id)
        .then(
          function onSuccess() {
            MessageService.delete('Role "' + $scope.role.name + '" deleted successfully');

            $state.go('admin.roles');
          }
        )
        ;
    };

    $scope.confirmDelete = function (ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Delete role')
        .textContent('Are you sure you want to delete role ' + $scope.role.name + ' ?')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('Yes!')
        .cancel('Cancel');
      $mdDialog.show(confirm).then(function () {
        $scope.deleteRole();
      }, function () {

      });
    };



  };


  // Controller to show single role on GUI.
  angular.module('frontend.admin.role')
    .controller('RoleController', [
      '$scope', '$state',
      '$mdDialog',
      'UserService', 'MessageService',
      'RoleModel',
      '_role',
      'DataProvider',
      RoleEditController
    ])
    ;

  // Controller which contains all necessary logic for role list GUI on boilerplate application.
  angular.module('frontend.admin.role')
    .controller('RoleListController', [
      '$scope', '$q', '$timeout', '$mdDialog',
      '_',
      'ListConfig', 'RoleModel',
      'DataProvider', 'MessageService',
      function controller(
        $scope, $q, $timeout, $mdDialog,
        _,
        ListConfig, RoleModel,
        DataProvider, MessageService
        ) {
        // Set current scope reference to model
        RoleModel.setScope($scope, false, 'items', 'itemCount');

        $scope.query = {
          order: 'name',
          searchWord: '',
          selected: []
        };

        $scope.dataProvider = new DataProvider(RoleModel, $scope.query);

        var searchWordTimer;

        $scope.$watch('query.searchWord', function watcher(valueNew, valueOld) {
          if (valueNew !== valueOld) {
            if (searchWordTimer) {
              $timeout.cancel(searchWordTimer);
            }

            searchWordTimer = $timeout($scope.dataProvider.triggerFetchData, 400);
          }
        }, true);

        //dialogs
        $scope.addRoleDialog = function (ev) {
          $mdDialog.show({
            controller: [
              '$scope', '$state',
              'MessageService', 'RoleModel', '$mdDialog', 'dataProvider',
              RoleAddController
            ],
            locals: {
              dataProvider: $scope.dataProvider
            },
            resolve: {
              _role:
                function resolve(
                  $stateParams,
                  RoleModel
                  ) {
                  return RoleModel.fetch($stateParams.id);
                }
            },
            templateUrl: '/frontend/admin/role/role.html',
//              parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false
          });
        };

        $scope.editRoleDialog = function (event, item, column) {
          //var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          $mdDialog.show({
            controller: [
              '$scope', '$state', '$mdDialog',
              'UserService', 'MessageService', 'RoleModel',
              '_role', 'DataProvider',
              RoleEditController
            ],
            locals: {
              dataProvider: $scope.dataProvider
            },
            resolve: {
              _role:
                function resolve(
                  RoleModel
                  ) {
                  return RoleModel.fetch(item.id);
                }
            },
            templateUrl: '/frontend/admin/role/role.html',
//              parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false

          });
        };

        //delete Role
        $scope.deleteRole = function deleteRole(role) {
          RoleModel
            .delete(role.id)
            .then(
              function onSuccess() {
                if (--$scope.functionCounter === 0) {
                  MessageService.delete('Role(s) deleted successfully', 'title');
                  $scope.query.selected = [];
                  $scope.dataProvider.triggerFetchData();
                }
              }
            );
        };

        $scope.deleteRoleDialog = function (items) {
          $scope.functionCounter = items.length;
          var confirm = $mdDialog.confirm()
            .title('Careful!')
            .textContent('Are you sure you want to delete role(s)?')
            .ariaLabel('delete role dialog')
            .ok('Yes, delete')
            .cancel('Cancel');
          $mdDialog.show(confirm).then(function () {
            angular.forEach(items, function (item) {
              $scope.deleteRole(item);
            });
          });
        };


        //raToolbarButtons

        $scope.toolbarBtns = [
          {
            btnTooltip: 'Add Role',
            btnIcon: 'add_circle_user',
            btnAction: $scope.addRoleDialog
          }
        ];

        $scope.toolbarSelectedBtns = [
          {
            btnTooltip: 'Delete Role',
            btnIcon: 'delete',
            btnAction: $scope.deleteRoleDialog
          }
        ];

      }
    ])
    ;
}());

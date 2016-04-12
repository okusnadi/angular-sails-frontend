/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.setting' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
    'use strict';

    var SettingAddController = function (
      $scope,
      MessageService,
      SettingModel, RoleModel, $mdDialog,
      dataProvider
      ) {

        // Initialize setting model
        $scope.setting = {
            settingname: '',
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
          .then(function (response) {
              $scope.roles = response;
          });

        $scope.saveSetting = function () {
            $scope.setting.passports.push(
              {
                  protocol: 'local',
                  password: $scope.password.first
              }
            );
            SettingModel
              .create(angular.copy($scope.setting))
              .then(
                function onSuccess(result) {
                    MessageService.success('New setting added successfully');
                    $mdDialog.hide();
                    dataProvider.triggerFetchData();
                }
              )
              ;
        };

        $scope.cancelDialog = function () {
            $mdDialog.cancel();
        };

    };


//controller for editing setting
    var SettingEditController = function (
      $scope,
      $mdDialog,
      SettingService, MessageService,
      SettingModel, RoleModel,
      settingId, dataProvider
      ) {


        // Set current scope reference to model
        SettingModel.setScope($scope, 'setting');

        // Initialize scope data
        $scope.currentSetting = SettingService.setting();


        // Store roles
        RoleModel.load()
          .then(function (response) {
              $scope.roles = response;
          });
        SettingModel.fetch(settingId, {populate: 'roles'})
          .then(function (response) {
              $scope.setting = response;
              $scope.selectRole = $scope.setting.role ? $scope.setting.role.id : null;
          });

        // Setting delete dialog buttons configuration
        $scope.confirmButtonsDelete = {
            ok: {
                label: 'Delete',
                className: 'btn-danger',
                callback: function callback() {
                    $scope.deleteSetting();
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
        /**
         * Scope function to save the modified setting. This will send a
         * socket request to the backend server with the modified object.
         */
        $scope.saveSetting = function () {
            $scope.$emit('dataTableRefresh', [1, 2, 3]);
            var data = angular.copy($scope.setting);

            // Set role id to update data
            data.role = $scope.selectRole;

            // Make actual data update
            SettingModel
              .update(data.id, data)
              .then(
                function onSuccess() {
                    MessageService.success('Setting "' + $scope.setting.title + '" updated successfully');
                    $mdDialog.hide();
                    dataProvider.triggerFetchData();
                }
              )
              ;
        };
    };

    // Controller which contains all necessary logic for setting list GUI on boilerplate application.
    angular.module('frontend.admin.setting')
      .controller('SettingListController', [
          '$scope', '$q', '$timeout', '$mdDialog', '$state',
          '_',
          'UserService', 'SettingModel', 'RoleModel',
          'DataProvider', 'MessageService',
          '_roles',
          function controller(
            $scope, $q, $timeout, $mdDialog, $state,
            _,
            UserService, SettingModel, RoleModel,
            DataProvider, MessageService,
            _roles
            ) {

              // Set current scope reference to models
              SettingModel.setScope($scope, false, 'items', 'itemCount');

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

              $scope.query = {
                  order: 'settingname',
                  searchWord: '',
                  selected: []
              };


              $scope.dataProvider = new DataProvider(SettingModel, $scope.query);

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

                  if ($scope.filterForm.$dirty) {
                      $scope.filterForm.$setPristine();
                  }
              };

              //delete setting 
              $scope.deleteSetting = function deleteSetting(setting) {
                  SettingModel
                    .delete(setting.id)
                    .then(
                      function onSuccess() {
                          if (--$scope.functionCounter === 0) {
                              MessageService.success('Setting(s) deleted successfully');
//                    $scope.showAlert('Success', 'Setting(s) deleted');
                              $scope.dataProvider.triggerFetchData();
                          }
                      },
                      function onError(error) {
//                 console.log('shit' + error);
                      }
                    )
                    ;
              };

              $scope.deleteSettingDialog = function (items) {
//            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
                  $scope.functionCounter = items.length;
                  var confirm = $mdDialog.confirm()
//                .parent(angular.element(document.querySelector('#container')))
                    .title('Careful!')
                    .textContent('Are you sure you want to delete setting(s)?')
                    .ariaLabel('delete setting dialog')
                    .ok('Delete the fucker(s)!')
                    .cancel("Let'em stew a bit.");
                  $mdDialog.show(confirm).then(function () {
                      angular.forEach(items, function (item) {
                          $scope.deleteSetting(item);
                      });
                  });
              };



              //alert dialogs
              $scope.showAlert = function (title, content) {
                  // Appending dialog to document.body to cover sidenav in docs app
                  // Modal dialogs should fully cover application
                  // to prevent interaction outside of dialog
                  $mdDialog.show(
                    $mdDialog.alert()
//                .parent(angular.element(document.querySelector('#container')))
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(content)
                    .ariaLabel('Alert Dialog')
                    .ok('Got it!')
//                .targetEvent(ev)
                    );
              };


              $scope.addSettingDialog = function (ev) {
                  $mdDialog.show({
                      controller: SettingAddController,
                      locals: {
                          dataProvider: $scope.dataProvider
                      },
                      templateUrl: '/frontend/admin/setting/setting.html',
//              parent: angular.element(document.body),
                      targetEvent: ev,
                      clickOutsideToClose: false
                  });
              };

              $scope.editSettingDialog = function (event, item, column) {
//            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
                  $mdDialog.show({
                      controller: SettingEditController,
                      locals: {
                          settingId: item.id,
                          dataProvider: $scope.dataProvider
                      },
                      templateUrl: '/frontend/admin/setting/setting.html',
//              parent: angular.element(document.querySelector('#setting-list-container')),
                      targetEvent: event,
                      clickOutsideToClose: false
//              fullscreen: useFullScreen
                  });
//            $scope.$watch(function() {
//              return $mdMedia('xs') || $mdMedia('sm');
//            }, function(wantsFullScreen) {
//              $scope.customFullscreen = (wantsFullScreen === true);
//            });
              };


              $scope.fetchData = function () {
                  $scope.loading = true;

                  // Common parameters for count and data query
                  var commonParameters = {
                      where: _.merge({},
                        angular.isDefined($scope.query.where) ? $scope.query.where : {},
                        SocketHelperService.getWhere($scope.query))
                  };

                  var order = $scope.query.order;
                  var direction = order.charAt(0) !== '-';
                  if (!direction) {
                      order = order.substring(1);
                  }

                  // Data query specified parameters
                  var parameters = {
                      limit: $scope.query.itemsPerPage,
                      skip: ($scope.query.currentPage - 1) * $scope.query.itemsPerPage,
                      sort: order + ' ' + (direction ? 'ASC' : 'DESC'),
                      populate: angular.isDefined($scope.query.populate) ? $scope.query.populate : {}
                  };

                  // Fetch data count
                  var count = $scope.dataModel
                    .count(commonParameters)
                    .then(
                      function onSuccess(response) {
                          $scope.query.itemCount = response.count;
                      }
                    )
                    ;

                    
                  // Fetch actual data
                   $scope.query.items = $scope.items;

                  // Load all needed data
//                  $q
//                    .all([count, load])
//                    .finally(
//                      function onFinally() {
//                          $scope.loaded = true;
//                          $scope.loading = false;
//                      }
//                    )
//                    ;
              };

          }
      ])
      ;

    // Controller for new setting creation.
    angular.module('frontend.admin.setting')
      .controller('SettingAddController', [
          '$scope', '$state',
          'MessageService',
          'SettingModel', 'RoleModel',
          SettingAddController

      ])
      ;

    // Controller to show single setting on GUI.
    angular.module('frontend.admin.setting')
      .controller('SettingController',
        [
            '$scope', '$state',
            '$mdDialog',
            'SettingService', 'MessageService',
            'SettingModel', 'RoleModel',
            '_setting', '_roles',
            function controller(
              $scope, $state,
              $mdDialog,
              SettingService, MessageService,
              SettingModel, RoleModel,
              _setting, _roles
              ) {
                // expose state
                $scope.$state = $state;
                // Set current scope reference to model
                SettingModel.setScope($scope, 'setting');

                // Initialize scope data
                $scope.currentSetting = SettingService.setting();
                $scope.setting = _setting;
                $scope.roles = _roles;
                $scope.selectRole = _setting.role ? _setting.role.id : null;

                // Setting delete dialog buttons configuration
                $scope.confirmButtonsDelete = {
                    ok: {
                        label: 'Delete',
                        className: 'btn-danger',
                        callback: function callback() {
                            $scope.deleteSetting();
                        }
                    },
                    cancel: {
                        label: 'Cancel',
                        className: 'btn-default pull-left'
                    }
                };

                /**
                 * Scope function to save the modified setting. This will send a
                 * socket request to the backend server with the modified object.
                 */
                $scope.saveSetting = function () {
                    var data = angular.copy($scope.setting);

                    // Set role id to update data
                    data.role = $scope.selectRole;

                    // Make actual data update
                    SettingModel
                      .update(data.id, data)
                      .then(
                        function onSuccess() {
                            MessageService.success('Setting "' + $scope.setting.title + '" updated successfully');

                        }
                      )
                      ;
                };

                /**
                 * Scope function to delete current setting. This will send DELETE query to backend via web socket
                 * query and after successfully delete redirect setting back to setting list.
                 */
                $scope.deleteSetting = function deleteSetting() {
                    SettingModel
                      .delete($scope.setting.id)
                      .then(
                        function onSuccess() {
                            MessageService.success('Setting "' + $scope.setting.title + '" deleted successfully');

                            $state.go('admin.settings');
                        }
                      )
                      ;
                };

                $scope.confirmDelete = function (ev) {
                    // Appending dialog to document.body to cover sidenav in docs app
                    var confirm = $mdDialog.confirm()
                      .title('Delete setting')
                      .textContent('Are you sure you want to delete setting ' + $scope.setting.settingname + ' ?')
                      .ariaLabel('Delete setting')
                      .targetEvent(ev)
                      .ok('Yes')
                      .cancel('Cancel');
                    $mdDialog.show(confirm).then(function () {
                        $scope.deleteSetting();
                    }, function () {

                    });
                };
            }
        ])
      ;


}());

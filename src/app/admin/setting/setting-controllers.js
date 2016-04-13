/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.setting' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
    'use strict';

    var SettingAddController = function( $scope ) {

        $scope.local = {};
        // Initialize setting model
        $scope.local.setting = {
            name: '',
            key: '',
            type: 'string',
            mappedTo: []
        };

        $scope.local.saveSetting = function () {
            $scope.settings.fields.settings.push($scope.local.setting);
            $scope.updateSettings('New setting added successfully');
        };
    };


//controller for editing setting
    var SettingEditController = function( $scope, item ) {

        $scope.local = {
            setting: item
        };

        $scope.local.saveSetting = function () {
            $scope.updateSettings('Setting "' + $scope.local.setting.name + '" updated successfully');
        };        
    };

    // Controller which contains all necessary logic for setting list GUI on boilerplate application.
    angular.module('frontend.admin.setting')
      .controller('SettingListController', [
          '$scope', '$q', '$timeout', '$mdDialog', '$state',
          '_',
          'UserService', 'SettingModel', 'RoleModel',
          'DataProvider', 'MessageService', 'ListConfig',
          '_settings',
          function controller(
            $scope, $q, $timeout, $mdDialog, $state,
            _,
            UserService, SettingModel, RoleModel,
            DataProvider, MessageService, ListConfig,
            _settings
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

              $scope.settings = {
                  fields: _.find(_settings, function (obj) {
                      return obj.type === 'FIELDS';

                  }),
                  config: _.find(_settings, function (obj) {
                      return obj.type === 'CONFIG';

                  })
              };

              $scope.showFilter = false;

              $scope.query = {
                  order: 'name',
                  currentPage: 1,
                  itemsPerPage: 10,
                  searchWord: '',
                  selected: [],
                  columns: ListConfig.getTitleItems('settingFields')
              };



//              $scope.dataProvider = new DataProvider(SettingModel, $scope.query);

              var searchWordTimer;

              $scope.$watch('query.searchWord', function watcher(valueNew, valueOld) {
                  if (valueNew !== valueOld) {
                      if (searchWordTimer) {
                          $timeout.cancel(searchWordTimer);
                      }

                      searchWordTimer = $timeout($scope.triggerFetchData, 400);
                  }
              }, true);

              $scope.removeFilter = function () {
                  $scope.showFilter = false;
                  $scope.query.searchWord = '';

                  if ($scope.filterForm.$dirty) {
                      $scope.filterForm.$setPristine();
                  }
              };

              $scope.updateSettings = function ( message ) {
                  SettingModel
                    .update($scope.settings.fields.id, $scope.settings.fields)
                    .then(
                      function onSuccess(result) {
                          MessageService.success( message );
                          $mdDialog.hide();
                          $scope.triggerFetchData();
                      }
                    );
              };
              
              //delete setting 
              $scope.deleteSetting = function deleteSetting(setting) {
                  SettingModel
                    .delete(setting.id)
                    .then(
                      function onSuccess() {
                          if (--$scope.functionCounter === 0) {
                              MessageService.success('Setting(s) deleted successfully');
                              $scope.dataProvider.triggerFetchData();
                          }
                      },
                      function onError(error) {
                      }
                    )
                    ;
              };

              $scope.cancelDialog = function () {
                  $mdDialog.cancel();
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

              $scope.addSettingDialog = function (ev) {
                  $mdDialog.show({
                      controller: SettingAddController,
                      scope: $scope,
                      preserveScope: true,
                      templateUrl: '/frontend/admin/setting/setting.html',
                      targetEvent: ev,
                      clickOutsideToClose: false
                  });
              };

              $scope.editSettingDialog = function (event, item, column) {
                  $mdDialog.show({
                      controller: SettingEditController,
                      locals: {
                          item: item
                      },
                      scope: $scope,
                      preserveScope: true,
                      templateUrl: '/frontend/admin/setting/setting.html',
                      targetEvent: event,
                      clickOutsideToClose: false
                  });
              };

              $scope.onReorder = function (order) {
                  $scope.query.order = order;
                  $scope.triggerFetchData();
              };

              $scope.onPaginate = function (currentPage, itemsPerPage) {
                  $scope.query.currentPage = currentPage;
                  $scope.query.itemsPerPage = itemsPerPage;
                  $scope.fetchData();
              };

              $scope.triggerFetchData = function () {
                  $scope.query.currentPage = 1;
                  $scope.fetchData();
              };


              $scope.fetchData = function () {

                  // order
                  var order = $scope.query.order;
                  var direction = order.charAt(0) !== '-';
                  if (!direction) {
                      order = order.substring(1);
                  }

                  //sorting
                  var data = _.sortBy($scope.settings.fields.settings, order);
                  if (direction !== true) {
                      data.reverse();
                  }


                  // filetring
                  if ($scope.query.searchWord.length > 0) {
                      var words = _.filter($scope.query.searchWord.split(' '));
                      var columns = _.filter($scope.query.columns, function (column) {
                          return column.inSearch;
                      });

                      data = _.filter(data, function (f) {
                          var result = false;
                          _.forEach(columns, function (column) {
                              _.forEach(words, function iteratorWords(word) {
                                  if (f[column.column].toLowerCase().indexOf(word.toLowerCase()) > -1)
                                      result = true;
                              });
                          });
                          return result;
                      });
                  }
                  // paginating
                  var startFrom = ($scope.query.currentPage - 1) * $scope.query.itemsPerPage;

                  $scope.query.itemCount = data.length;
                  $scope.query.items = data.slice(startFrom, startFrom + $scope.query.itemsPerPage);
              };

              $scope.fetchData();
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

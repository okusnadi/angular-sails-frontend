/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.campaign.campaign.list' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';


  var ListAddController = function (
    $scope, $mdDialog,
    MessageService,
    ListModel,
    _scripts, _campaign,
    dataProvider

    ) {

    // Store parent campaign
    $scope.scripts = _scripts;
    $scope.campaign = _campaign;

    // Initialize list model
    $scope.list = {
      name: '',
      info: '',
      defaultScript: null
    };

    $scope.cancelDialog = function () {
      $mdDialog.cancel();
    };

    $scope.saveList = function () {
      $scope.list.campaign = $scope.campaign;
      ListModel
        .create(angular.copy($scope.list))
        .then(
          function onSuccess() {
            MessageService.success('New list added successfully');
            dataProvider.triggerFetchData();
            $mdDialog.hide();
          }
        )
        ;
    };

  };

  var ListEditController = function (
    $scope,
    $mdDialog,
    MessageService,
    ListModel, 
    _scripts, _list, dataProvider
    ) {

    // Set current scope reference to model
    ListModel.setScope($scope, 'list');

    // Initialize scope data
    $scope.scripts = _scripts;
    $scope.list = _list;

    $scope.cancelDialog = function () {
      $mdDialog.cancel();
    };

    $scope.saveList = function () {
      var data = angular.copy($scope.list);

      // Make actual data update
      ListModel
        .update(data.id, data)
        .then(
          function onSuccess() {
            MessageService.success('List "' + $scope.list.name + '" updated successfully');
            dataProvider.triggerFetchData();
            $mdDialog.hide();
          }
        )
        ;
    };

  };


  var ListImportController = function (
    $scope, $mdDialog,
    MessageService,
    _list, dataProvider
    ) {

    $scope.list = _list;

    $scope.cancelDialog = function () {
      $mdDialog.cancel();
    };

    $scope.onSuccess = function () {

      dataProvider.triggerFetchData();

      io.socket.on('list.import', function (result) {
        io.socket.off('list.import');
        // Handle socket event
        if (result.status && result.status === 'OK') {
          dataProvider.triggerFetchData();
          MessageService.success('Imported ' + result.counter + ' records.');
        } else {
          MessageService.error(result);
        }
      })
        ;
      $mdDialog.hide();
    };

    $scope.onError = function () {
      $mdDialog.hide();
    };

  };

  var ListProspectsController = function (
    $scope, $mdDialog,$timeout,
    ProspectModel,
    DataProvider, MessageService,
    _list, listProvider
    ) {

    // Set current scope reference to model
//    ListModel.setScope($scope, 'list');
    ProspectModel.setScope($scope, 'prospect');

    $scope.list = _list;

    var columns = [];
    angular.forEach( _list.fields, function( field, key) {
      columns.push({
        title: field.column,
        column: [ 'fields', field.column, 'value'],
        sortable: false,
        inSearch: false
      });
    });
    // Initialize query parameters
    $scope.query = {
//            order: "fields->'Name'->>'value'",
      order: 'id',
      searchWord: '',
      selected: [],
      where: {
        list: _list.id
      },
      columns: columns
    };

    $scope.prospectProvider = new DataProvider(ProspectModel, $scope.query);

    var searchWordTimer;

    $scope.$watch('query.searchWord', function watcher(valueNew, valueOld) {
      if (valueNew !== valueOld) {
        if (searchWordTimer) {
          $timeout.cancel(searchWordTimer);
        }

        searchWordTimer = $timeout($scope.prospectProvider.triggerFetchData, 400);
      }
    }, true);

    $scope.removeFilter = function () {
      $scope.showFilter = false;
      $scope.query.searchWord = '';

      if ($scope.filterForm.$dirty) {
        $scope.filterForm.$setPristine();
      }
    };

    $scope.cancelDialog = function () {
      $mdDialog.cancel();
    };

    $scope.onError = function () {
      $mdDialog.hide();
    };

  };


  // Controller which contains all necessary logic for list list GUI on boilerplate application.
  angular.module('frontend.admin.client.campaign.list')
    .controller('ListListController', [
      '$scope', '$q', '$timeout',
      '$mdDialog',
      '_',
      'ListModel',
      'DataProvider', 'MessageService',
      '_campaign', '_lists', '_scripts', '_count',
      function controller(
        $scope, $q, $timeout,
        $mdDialog,
        _,
        ListModel,
        DataProvider, MessageService,
        _campaign, _lists, _scripts, _count
        ) {

        // Set initial data        
        $scope.campaign = _campaign;
        $scope.query = {
          items: _lists,
          itemCount: _count.count,
          order: 'name',
          searchWord: '',
          selected: [],
          where: {
            campaign: _campaign.id
          },
          populate: ['defaultScript']
        };
        // Set current scope reference to models
        ListModel.setScope($scope, false, 'query.items', 'query.itemCount');

        $scope.dataProvider = new DataProvider(ListModel, $scope.query);

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

        //delete list 
        $scope.deleteList = function deleteList(list) {
          ListModel
            .delete(list.id)
            .then(
              function onSuccess() {
                if (--$scope.functionCounter === 0) {
                  MessageService.success('List(s) deleted successfully');
                  $scope.query.selected = [];
                  $scope.dataProvider.triggerFetchData();
                }
              }
            )
            ;
        };


        $scope.addListDialog = function (ev) {
          $mdDialog.show({
            controller: ListAddController,
            locals: {
              dataProvider: $scope.dataProvider,
              _campaign: _campaign,
              _scripts: _scripts
            },
            templateUrl: '/frontend/admin/client.campaign.list/list.html',
            targetEvent: ev,
            clickOutsideToClose: false
          });
        };

        $scope.clickListDialog = function (ev, item, column) {
          switch (column.column) {
            case 'name':
              $scope.editListDialog(ev, item, column);
              break;
            case 'import':
              switch (item.import) {
                case 'NO':
                  $scope.importListDialog(ev, item, column);
                  break;
                case 'DONE':
                  $scope.prospectsListDialog(ev, item, column);
                  break;
              }
              break;
          }
        };

        $scope.prospectsListDialog = function (ev, item, column) {
          $mdDialog.show({
            controller: ListProspectsController,
            locals: {
              listProvider: $scope.dataProvider
            },
            resolve: {
              _list: function () {
                return ListModel.fetch(item.id);
              }
            },
            templateUrl: '/frontend/admin/client.campaign.list/list-prospects.html',
            targetEvent: ev,
            clickOutsideToClose: false
          });
        };

        $scope.importListDialog = function (ev, item, column) {
          $mdDialog.show({
            controller: ListImportController,
            locals: {
              dataProvider: $scope.dataProvider
            },
            resolve: {
              _list: function () {
                return ListModel.fetch(item.id);
              }
            },
            templateUrl: '/frontend/admin/client.campaign.list/list-import.html',
            targetEvent: ev,
            clickOutsideToClose: false
          });
        };

        $scope.editListDialog = function (ev, item, column) {
          $mdDialog.show({
            controller: ListEditController,
            locals: {
              dataProvider: $scope.dataProvider,
              _campaign: _campaign,
              _scripts: _scripts
            },
            resolve: {
              _list: function () {
                return ListModel.fetch(item.id);
              }
            },
            templateUrl: '/frontend/admin/client.campaign.list/list.html',
            targetEvent: ev,
            clickOutsideToClose: false
          });
        };

        $scope.deleteListDialog = function (items) {
          $scope.functionCounter = items.length;
          var confirm = $mdDialog.confirm()
            .title('Careful!')
            .textContent('Are you sure you want to delete list(s)?')
            .ariaLabel('delete list dialog')
            .ok('Yes')
            .cancel('Cancel');
          $mdDialog.show(confirm).then(function () {
            angular.forEach(items, function (item) {
              $scope.deleteList(item);
            });
          });
        };

      }
    ])
    ;

  // Controller for new list creation.
  angular.module('frontend.admin.client.campaign.list')
    .controller('ListAddController', [
      '$scope', '$state',
      'MessageService',
      'ListModel',
      '_scripts',
      '_campaign',
      ListAddController
    ]);

  // Controller to show single list on GUI.
  angular.module('frontend.admin.client.campaign.list')
    .controller('ListController',
      [
        '$scope', '$state',
        '$mdDialog',
        'ListService', 'MessageService',
        'DataProvider',
        'ListModel', 'ProspectModel',
        '_scripts',
        '_campaign',
        '_list',
        ListEditController
      ]);

}());

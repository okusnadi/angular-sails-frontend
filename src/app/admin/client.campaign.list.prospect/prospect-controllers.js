/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.list.list.prospect' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';


  var ProspectAddController = function (
    $scope, $mdDialog,
    MessageService,
    ProspectModel,
    _scripts, _list,
    dataProvider

    ) {

    // Store parent list
    $scope.scripts = _scripts;
    $scope.list = _list;

    // Initialize prospect model
    $scope.prospect = {
      name: '',
      info: '',
      defaultScript: null
    };

    $scope.cancelDialog = function () {
      $mdDialog.cancel();
    };

    $scope.saveProspect = function () {
      $scope.prospect.list = $scope.list;
      ProspectModel
        .create(angular.copy($scope.prospect))
        .then(
          function onSuccess() {
            MessageService.success('New prospect added successfully');
            dataProvider.triggerFetchData();
            $mdDialog.hide();
          }
        )
        ;
    };

  };

  var ProspectEditController = function (
    $scope,
    $mdDialog,
    MessageService,
    ProspectModel,
    _scripts, _prospect, dataProvider
    ) {

    // Set current scope reference to model
    ProspectModel.setScope($scope, 'prospect');

    // Initialize scope data
    $scope.scripts = _scripts;
    $scope.prospect = _prospect;

    $scope.cancelDialog = function () {
      $mdDialog.cancel();
    };

    $scope.saveProspect = function () {
      var data = angular.copy($scope.prospect);

      // Make actual data update
      ProspectModel
        .update(data.id, data)
        .then(
          function onSuccess() {
            MessageService.success('Prospect "' + $scope.prospect.name + '" updated successfully');
            dataProvider.triggerFetchData();
            $mdDialog.hide();
          }
        )
        ;
    };

  };


  var ProspectListController = function (
    $scope, $mdDialog, $timeout,
    ProspectModel,
    DataProvider, MessageService,
    _list, _prospects, _count
    ) {

    // Set current scope reference to model
//    ProspectModel.setScope($scope, 'prospect');
    ProspectModel.setScope($scope, 'prospect');

    $scope.list = _list;

    var columns = [];
    angular.forEach(_list.fields, function (field, key) {
      columns.push({
        title: field.column,
        column: ['fields', field.column, 'value'],
        sortable: false,
        inSearch: false
      });
    });
    // Initialize query parameters
    $scope.query = {
//            order: "fields->'Name'->>'value'",
      order: 'id',
      items: _prospects,
      itemCount: _count.count,
      itemsPerPage: 5,
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


  // Controller which contains all necessary logic for prospect prospect GUI on boilerplate application.
  angular.module('frontend.admin.client.campaign.list.prospect')
    .controller('ProspectListController', 
      ProspectListController
    )
    ;

  // Controller for new prospect creation.
  angular.module('frontend.admin.client.campaign.list.prospect')
    .controller('ProspectAddController', [
      '$scope', '$state',
      'MessageService',
      'ProspectModel',
      '_scripts',
      '_list',
      ProspectAddController
    ]);

  // Controller to show single prospect on GUI.
  angular.module('frontend.admin.client.campaign.list.prospect')
    .controller('ProspectController',
      [
        '$scope', '$state',
        '$mdDialog',
        'ProspectService', 'MessageService',
        'DataProvider',
        'ProspectModel', 'ProspectModel',
        '_scripts',
        '_list',
        '_prospect',
        ProspectEditController
      ]);

}());

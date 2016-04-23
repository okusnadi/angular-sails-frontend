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
    _, $scope, $mdDialog, $timeout,
    ProspectModel, ListModel, SettingModel,
    DataProvider, MessageService,
    _list, _prospects, _count, _globalFields
    ) {

    // Set current scope reference to model
//    ProspectModel.setScope($scope, 'prospect');
    ProspectModel.setScope($scope, 'prospect');
    SettingModel.setScope($scope, 'setting');

    $scope.list = angular.copy(_list);
    $scope.globalFields = _globalFields[0];

//    console.log($scope.globalFields);

    var columns = [];
    angular.forEach(_list.fields, function (field, key) {
      columns.push({
        title: field.column,
        column: ['fields', key, 'value'],
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

    $scope.columnTitle = function (column) {
      var html = column.title;
      return html;
    };

    $scope.cancelButton = function () {
      angular.forEach( _list.fields, function( field, key ){
        if( angular.isDefined(field.mappedTo) ) {
          $scope.list.fields[key].mappedTo = angular.copy(field.mappedTo);
          $scope.list.fields[key].searchText = field.mappedTo.name;
        }
        else {
          $scope.list.fields[key] = angular.copy(field);
        }
      });
      $scope.mappingForm.$setPristine();
    };

    $scope.saveMappings = function () {
      console.log($scope.list);
      var list = angular.copy($scope.list);

      $scope.updateGlobalMappings(list);
      return;
      angular.forEach(list.fields, function(field) {
        delete field.searchText;
        if( angular.isDefined(field.mappedTo)) {
          delete field.mappedTo.mappedTo;          
        }
      });
      
      ListModel
        .update(list.id, list)
        .then(
          function onSuccess() {
            _list = angular.copy($scope.list);
            MessageService.success('Mappings updated successfully');
          }
        )
        ;      
    };

    $scope.onError = function () {
      $mdDialog.hide();
    };
    
    $scope.mappedValidator = function( column ) {
      return {
        required: true
      };
    };

    $scope.updateGlobalMappings = function(list) {
      
      console.log($scope.globalFields);
      
      angular.forEach(list.fields, function(field) {
        if( field.mappedTo ) {
          var mapped = _.filter($scope.globalFields.settings, function (obj) {
            return _.some(obj.mappedTo, {value: field.mappedTo.name});
          });

          if( _.findWhere(mapped[0].mappedTo, { value: field.column }) === undefined) {
            mapped[0].mappedTo.push({value:field.column});
          };          
        }
        if( !field.mappedTo && field.searchText && field.searchText.length > 1 ) {
          $scope.globalFields.settings.push({
            
          });
          console.log('New ',field.searchText);
        }
      });      

      console.log($scope.globalFields);
//      SettingModel
//        .update($scope.globalFields.id, $scope.globalFields)
//        .then(
//          function onSuccess() {
//            MessageService.success('Global settings updated successfully');
//          }
//        )
//        ;      
      
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

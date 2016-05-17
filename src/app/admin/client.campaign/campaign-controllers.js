/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.client.campaign' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  var ceTemplate = [
    '<cc-custom-email ce-item="item"',
    '</cc-custom-email>'
  ].join(' ');

  var CampaignAddController = function CampaignAddController(
    $scope, $state, $mdDialog,
    MessageService, dataProvider,
    CampaignModel, _client
    ) {

    // expose state
    $scope.$state = $state;
    // Store parent client
    $scope.client = _client;

    // Initialize campaign model
    $scope.campaign = {
      name: '',
      contactName: '',
      phone1: '',
      email1: '',
      notes: ''
    };

    $scope.ounits = $scope.client.orgUnits.map(function (ou) {
      return {
        order: ou.order,
        label: ou.value,
        value: ''
      };
    });

    $scope.meTemplate = ceTemplate;

    $scope.saveCampaign = function () {
      $scope.campaign.client = $scope.client;
      $scope.campaign.orgUnits = angular.toJson($scope.ounits);
      CampaignModel
        .create(angular.copy($scope.campaign))
        .then(
          function onSuccess(result) {
            MessageService.success('New campaign added REALLY successfully');
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

  var CampaignEditController = function CampaignEditController(
    $scope, $state, $mdDialog,
    UserService, MessageService, dataProvider,
    CampaignModel, _campaign
    ) {
    // expose state
    $scope.$state = $state;
    // Set current scope reference to model
    CampaignModel.setScope($scope, 'campaign');

    $scope.meTemplate = ceTemplate;

    // Initialize scope data
    $scope.currentUser = UserService.user();
    $scope.campaign = _campaign;
    $scope.selectList = _campaign.list ? _campaign.list.id : null;

    $scope.ounits = angular.fromJson($scope.campaign.orgUnits);

    // Campaign delete dialog buttons configuration
    $scope.confirmButtonsDelete = {
      ok: {
        label: 'Delete',
        className: 'btn-danger',
        callback: function callback() {
          $scope.deleteCampaign();
        }
      },
      cancel: {
        label: 'Cancel',
        className: 'btn-default pull-left'
      }
    };


    /**
     * Scope function to save the modified campaign. This will send a
     * socket request to the backend server with the modified object.
     */
    $scope.saveCampaign = function () {
      $scope.campaign.orgUnits = angular.toJson($scope.ounits);
      var data = angular.copy($scope.campaign);

      // Make actual data update
      CampaignModel
        .update(data.id, data)
        .then(
          function onSuccess() {
            MessageService.success('Campaign "' + $scope.campaign.name + '" updated successfully');
            $mdDialog.hide();
            dataProvider.triggerFetchData();
          }
        )
        ;
    };

    $scope.deleteCampaign = function deleteCampaign() {
      CampaignModel
        .delete($scope.campaign.id)
        .then(
          function onSuccess() {
            MessageService.success('Campaign "' + $scope.campaign.title + '" deleted successfully');

            $state.go('campaigns');
          }
        )
        ;
    };

    $scope.confirmDelete = function (ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Delete campaign')
        .textContent('Are you sure you want to delete campaign ' + $scope.campaign.campaignname + ' ?')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('Yes!')
        .cancel('Cancel');
      $mdDialog.show(confirm).then(function () {
        $scope.deleteCampaign();
      }, function () {

      });
    };

    $scope.cancelDialog = function () {
      $mdDialog.cancel();
    };
  }


  // Controller which contains all necessary logic for campaign list GUI on boilerplate application.
  angular.module('frontend.admin.client.campaign')
    .controller('CampaignListController', [
      '$scope', '$q', '$timeout', '$mdDialog',
      '_',
      'UserService', 'CampaignModel',
      'DataProvider',
      '_client',
      '_campaigns', '_count',
      function controller(
        $scope, $q, $timeout, $mdDialog,
        _,
        UserService, CampaignModel,
        DataProvider,
        _client,
        _campaigns, _count
        ) {

        // Set current scope reference to models
        CampaignModel.setScope($scope, false, 'items', 'itemCount');

        // Initialize query parameters
        $scope.query = {
          items: _campaigns,
          itemCount: _count.count,
          order: 'name',
          searchWord: '',
          populate: ['lists', 'emailTemplates', 'scripts'],
          where: {
            client: _client.id
          }
        };

        $scope.dataProvider = new DataProvider(CampaignModel, $scope.query);


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
        $scope.addCampaignDialog = function (ev) {
          $mdDialog.show({
            controller: [
              '$scope', '$state', '$mdDialog',
              'MessageService', 'dataProvider',
              'CampaignModel', '_client',
              CampaignAddController
            ],
            locals: {
              dataProvider: $scope.dataProvider,
              _client: _client
            },
            templateUrl: '/frontend/admin/client.campaign/campaign.html',
            targetEvent: ev,
            clickOutsideToClose: false
          });
        };

        $scope.editCampaignDialog = function (ev, item, column) {
          $mdDialog.show({
            controller: [
              '$scope', '$state', '$mdDialog',
              'UserService', 'MessageService', 'dataProvider',
              'CampaignModel', '_campaign',
              CampaignEditController],
            locals: {
              dataProvider: $scope.dataProvider,
              _client: _client,
              _campaign: item
            },
            templateUrl: '/frontend/admin/client.campaign/campaign.html',
            targetEvent: ev,
            clickOutsideToClose: false
          });
        };

        $scope.goBack = function (ev) {

        };

        //ra-md-toolbar buttons

        $scope.toolbarBtns = [
          {
            btnTooltip: 'Add Campaign',
            btnIcon: 'playlist_add',
            btnAction: $scope.addCampaignDialog
          }
        ];


      }
    ])
    ;
}());


// Controller for new campaign creation.
//  angular.module('frontend.admin.client.campaign')
//    .controller('CampaignAddController', [
//      '$scope', '$state',
//      'MessageService',
//      'CampaignModel',
//      '_client',
//      '_lists',
//      'dataProvider',
//      '$mdDialog',
//      CampaignAddController
//
//    ])
//    ;


// Controller to show single campaign on GUI.
//  angular.module('frontend.admin.client.campaign')
//    .controller('CampaignController',
//      [
//        '$scope', '$state',
//        'UserService', 'MessageService',
//        'CampaignModel', 'ListModel',
//        '_client',
//        '_campaign', '_lists',
//        '$mdDialog',
//        'dataProvider',
//        CampaignEditController
//      ])
//    ;


/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.client.campaign' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
  'use strict';

  // Controller for new campaign creation.
  angular.module('frontend.admin.client.campaign')
    .controller('CampaignAddController', [
      '$scope', '$state',
      'MessageService',
      'CampaignModel',
      '_client',
      '_lists',
      function controller(
        $scope, $state,
        MessageService,
        CampaignModel,
        _client,
        _lists
      ) {
  
        // expose state
        $scope.$state = $state;
        // Store lists
        $scope.lists = _lists;
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
        
        $scope.ounits = $scope.client.orgUnits.map( function(ou){
            return {
                order: ou.order,
                label: ou.value,
                value: ''
            };
        });
        
        /**
         * Scope function to store new campaign to database. After successfully save campaign will be redirected
         * to view that new created campaign.
         */
        $scope.saveCampaign = function() {
            $scope.campaign.client = $scope.client;
            $scope.campaign.orgUnits = angular.toJson($scope.ounits);
            CampaignModel
            .create(angular.copy($scope.campaign))
            .then(
              function onSuccess(result) {
                MessageService.success('New campaign added successfully');

                $state.go('campaign', {campaignId: result.data.id});
              }
            )
          ;
        };
        
      }
    ])
  ;

  // Controller to show single campaign on GUI.
  angular.module('frontend.admin.client.campaign')
    .controller('CampaignController', 
    [
      '$scope', '$state',
      '$mdDialog',
      'UserService', 'MessageService',
      'CampaignModel', 'ListModel',
      '_client',
      '_campaign', '_lists',
      function controller(
        $scope, $state,
        $mdDialog,
        UserService, MessageService,
        CampaignModel, ListModel,
        _client,
        _campaign, _lists
      ) {
        // expose state
        $scope.$state = $state;
        // Set current scope reference to model
        CampaignModel.setScope($scope, 'campaign');

        // Initialize scope data
        $scope.currentUser = UserService.user();
        $scope.campaign = _campaign;
        $scope.lists = _lists;
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
        $scope.saveCampaign = function() {
          $scope.campaign.orgUnits = angular.toJson($scope.ounits);
          var data = angular.copy($scope.campaign);

          // Make actual data update
          CampaignModel
            .update(data.id, data)
            .then(
              function onSuccess() {
                MessageService.success('Campaign "' + $scope.campaign.name + '" updated successfully');
              }
            )
          ;
        };

        /**
         * Scope function to delete current campaign. This will send DELETE query to backend via web socket
         * query and after successfully delete redirect campaign back to campaign list.
         */
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

        $scope.confirmDelete = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Delete campaign')
                  .textContent('Are you sure you want to delete campaign '+$scope.campaign.campaignname+' ?')
                  .ariaLabel('Lucky day')
                  .targetEvent(ev)
                  .ok('Yes!')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
              $scope.deleteCampaign();
            }, function() {
                
            });
          };        
      }
    ])
  ;

  // Controller which contains all necessary logic for campaign list GUI on boilerplate application.
  angular.module('frontend.admin.client.campaign')
    .controller('CampaignListController', [
      '$scope', '$q', '$timeout',
      '_',
      'ListConfig', 'SocketHelperService',
      'UserService', 'CampaignModel', 'ListModel',
      'DataProvider',
      '_client',
      '_items', '_count', '_lists',
      function controller(
        $scope, $q, $timeout,
        _,
        ListConfig, SocketHelperService,
        UserService, CampaignModel, ListModel,
        DataProvider,
        _client,
        _items, _count, _lists
      ) {
  
        // Set current scope reference to models
        CampaignModel.setScope($scope, false, 'items', 'itemCount');

        // Set initial data
//        $scope.items = _items;
//        $scope.client = _client;
//        $scope.itemCount = _count.count;
//        $scope.lists = _lists;
//        $scope.currentUser = UserService.user();
//        $scope.query =  {
//            order: 'name',
//            page: 1,
//            limit: $scope.itemsPerPage,
//            where: { 
//                client: _client.id
//            }
//        };

        // Initialize query parameters
        $scope.query =  {
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

      }
    ])
  ;
}());

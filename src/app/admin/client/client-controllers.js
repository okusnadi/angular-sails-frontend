/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.client' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
  'use strict';

  // Controller for new client creation.
  angular.module('frontend.admin.client')
    .controller('ClientAddController', [
      '$scope', '$state',
      'MessageService',
      'ClientModel',
      '_campaigns',
      function controller(
        $scope, $state,
        MessageService,
        ClientModel,
        _campaigns
      ) {
  
        // expose state
        $scope.$state = $state;
        // Store campaigns
        $scope.campaigns = _campaigns;

        // Initialize client model
        $scope.client = {
            clientname: '',
            firstName: '',
            lastName: '',
            campaigns: [], 
            passports: []
        };
        $scope.password = {
            first: '',
            second: ''
        };
        
        $scope.check = function($value) {
            console.log($scope.password);
            console.log($value);
        };
        
        /**
         * Scope function to store new client to database. After successfully save client will be redirected
         * to view that new created client.
         */
        $scope.saveClient = function() {
            $scope.client.passports.push(
                {
                    protocol: 'local',
                    password: $scope.password.first
                }                    
            );
            ClientModel
            .create(angular.copy($scope.client))
            .then(
              function onSuccess(result) {
                MessageService.success('New client added successfully');

                $state.go('admin.client', {id: result.data.id});
              }
            )
          ;
        };
        
      }
    ])
  ;

  // Controller to show single client on GUI.
  angular.module('frontend.admin.client')
    .controller('ClientController', 
    [
      '$scope', '$state',
      '$mdDialog',
      'UserService', 'MessageService',
      'ClientModel', 'CampaignModel',
      '_client', '_campaigns',
      function controller(
        $scope, $state,
        $mdDialog,
        UserService, MessageService,
        ClientModel, CampaignModel,
        _client, _campaigns
      ) {
        // expose state
        $scope.$state = $state;
        // Set current scope reference to model
        ClientModel.setScope($scope, 'client');

        // Initialize scope data
        $scope.currentClient = UserService.user();
        $scope.client = _client;
        $scope.campaigns = _campaigns;
        $scope.selectCampaign = _client.campaign ? _client.campaign.id : null;

        // Client delete dialog buttons configuration
        $scope.confirmButtonsDelete = {
          ok: {
            label: 'Delete',
            className: 'btn-danger',
            callback: function callback() {
              $scope.deleteClient();
            }
          },
          cancel: {
            label: 'Cancel',
            className: 'btn-default pull-left'
          }
        };

        /**
         * Scope function to save the modified client. This will send a
         * socket request to the backend server with the modified object.
         */
        $scope.saveClient = function() {
          var data = angular.copy($scope.client);

          // Set campaign id to update data
          data.campaign = $scope.selectCampaign;

          // Make actual data update
          ClientModel
            .update(data.id, data)
            .then(
              function onSuccess() {
                MessageService.success('Client "' + $scope.client.title + '" updated successfully');
              }
            )
          ;
        };

        /**
         * Scope function to delete current client. This will send DELETE query to backend via web socket
         * query and after successfully delete redirect client back to client list.
         */
        $scope.deleteClient = function deleteClient() {
          ClientModel
            .delete($scope.client.id)
            .then(
              function onSuccess() {
                MessageService.success('Client "' + $scope.client.title + '" deleted successfully');

                $state.go('admin.clients');
              }
            )
          ;
        };

        $scope.confirmDelete = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Delete client')
                  .textContent('Are you sure you want to delete client '+$scope.client.clientname+' ?')
                  .ariaLabel('Lucky day')
                  .targetEvent(ev)
                  .ok('Yes!')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
              $scope.deleteClient();
            }, function() {
                
            });
          };        

        /**
         * Scope function to delete current client campaign. 
         * 
         * @param   {Number}    index        Campaign index to remove
         */
//        $scope.removeClientCampaign = function removeClientCampaign(index) {
//            $scope.client.campaigns.splice(index, 1);            
//        };

        /**
         * Scope function to add client's campaign. 
         * 
         */
//        $scope.addClientCampaign = function addClientCampaign() {
//            $scope.client.campaigns.push({id:1});
//        };

      }
    ])
  ;

  // Controller which contains all necessary logic for client list GUI on boilerplate application.
  angular.module('frontend.admin.client')
    .controller('ClientListController', [
      '$scope', '$q', '$timeout',
      '_',
      'ListConfig', 'SocketHelperService',
      'UserService', 'ClientModel', 'CampaignModel',
      '_items', '_count', '_campaigns',
      function controller(
        $scope, $q, $timeout,
        _,
        ListConfig, SocketHelperService,
        UserService, ClientModel, CampaignModel,
        _items, _count, _campaigns
      ) {
        // Set current scope reference to models
        ClientModel.setScope($scope, false, 'items', 'itemCount');
        CampaignModel.setScope($scope, false, 'campaigns');

        // Add default list configuration variable to current scope
        $scope = angular.extend($scope, angular.copy(ListConfig.getConfig()));

        // Set initial data
        $scope.items = _items;
        $scope.itemCount = _count.count;
        $scope.campaigns = _campaigns;
        $scope.currentClient = UserService.user();

        // Initialize used title items
        $scope.titleItems = ListConfig.getTitleItems(ClientModel.endpoint);

        // Initialize default sort data
        $scope.sort = {
          column: 'clientname',
          direction: true
        };

        // Initialize filters
        $scope.filters = {
          searchWord: '',
          columns: $scope.titleItems
        };

        // Function to change sort column / direction on list
        $scope.changeSort = function changeSort(item) {
          var sort = $scope.sort;

          if (sort.column === item.column) {
            sort.direction = !sort.direction;
          } else {
            sort.column = item.column;
            sort.direction = true;
          }

          _triggerFetchData();
        };

        /**
         * Helper function to fetch specified campaign property.
         *
         * @param   {Number}    campaignId        Campaign id to search
         * @param   {String}    [property]      Property to return, if not given returns whole campaign object
         * @param   {String}    [defaultValue]  Default value if campaign or property is not founded
         *
         * @returns {*}
         */
        $scope.getCampaign = function getCampaign(campaignId, property, defaultValue) {
          defaultValue = defaultValue || 'Unknown';
          property = property || true;

          // Find campaign
          var campaign = _.find($scope.campaigns, function iterator(campaign) {
            return parseInt(campaign.id, 10) === parseInt(campaignId.toString(), 10);
          });

          return campaign ? (property === true ? campaign : campaign[property]) : defaultValue;
        };

        /**
         * Simple watcher for 'currentPage' scope variable. If this is changed we need to fetch client data
         * from server.
         */
        $scope.$watch('currentPage', function watcher(valueNew, valueOld) {
          if (valueNew !== valueOld) {
            _fetchData();
          }
        });

        /**
         * Simple watcher for 'itemsPerPage' scope variable. If this is changed we need to fetch client data
         * from server.
         */
        $scope.$watch('itemsPerPage', function watcher(valueNew, valueOld) {
          if (valueNew !== valueOld) {
            _triggerFetchData();
          }
        });

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
         * These are fetched via 'ClientModel' service with promises.
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
            populate: 'campaigns',
            limit: $scope.itemsPerPage,
            skip: ($scope.currentPage - 1) * $scope.itemsPerPage,
            sort: $scope.sort.column + ' ' + ($scope.sort.direction ? 'ASC' : 'DESC')
          };

          // Fetch data count
          var count = ClientModel
            .count(commonParameters)
            .then(
              function onSuccess(response) {
                $scope.itemCount = response.count;
              }
            )
          ;

          // Fetch actual data
          var load = ClientModel
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
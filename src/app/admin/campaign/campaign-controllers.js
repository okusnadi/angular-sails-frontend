/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.campaign' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
  'use strict';

  // Controller for new campaign creation.
  angular.module('frontend.admin.campaign')
    .controller('CampaignAddController', [
      '$scope', '$state',
      'MessageService',
      'CampaignModel',
      '_lists',
      function controller(
        $scope, $state,
        MessageService,
        CampaignModel,
        _lists
      ) {
  
        // expose state
        $scope.$state = $state;
        // Store lists
        $scope.lists = _lists;

        // Initialize campaign model
        $scope.campaign = {
            name: '',
            address1: '',
            address2: '',
            address3: '',
            town: '',
            county: '',
            country: '',
            
            contactName: '',
            phone1: '',
            phone2: '',
            email1: '',
            email2: '',
            notes: ''
        };
        
        
        /**
         * Scope function to store new campaign to database. After successfully save campaign will be redirected
         * to view that new created campaign.
         */
        $scope.saveCampaign = function() {
            CampaignModel
            .create(angular.copy($scope.campaign))
            .then(
              function onSuccess(result) {
                MessageService.success('New campaign added successfully');

                $state.go('admin.campaign', {id: result.data.id});
              }
            )
          ;
        };
        
      }
    ])
  ;

  // Controller to show single campaign on GUI.
  angular.module('frontend.admin.campaign')
    .controller('CampaignController', 
    [
      '$scope', '$state',
      '$mdDialog',
      'UserService', 'MessageService',
      'CampaignModel', 'ListModel',
      '_campaign', '_lists',
      function controller(
        $scope, $state,
        $mdDialog,
        UserService, MessageService,
        CampaignModel, ListModel,
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
          var data = angular.copy($scope.campaign);

          // Set list id to update data
//          data.list = $scope.selectList;

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

                $state.go('admin.campaigns');
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

        /**
         * Scope function to delete current campaign list. 
         * 
         * @param   {Number}    index        List index to remove
         */
//        $scope.removeCampaignList = function removeCampaignList(index) {
//            $scope.campaign.lists.splice(index, 1);            
//        };

        /**
         * Scope function to add campaign's list. 
         * 
         */
//        $scope.addCampaignList = function addCampaignList() {
//            $scope.campaign.lists.push({id:1});
//        };

      }
    ])
  ;

  // Controller which contains all necessary logic for campaign list GUI on boilerplate application.
  angular.module('frontend.admin.campaign')
    .controller('CampaignListController', [
      '$scope', '$q', '$timeout',
      '_',
      'ListConfig', 'SocketHelperService',
      'UserService', 'CampaignModel', 'ListModel',
      '_items', '_count', '_lists',
      function controller(
        $scope, $q, $timeout,
        _,
        ListConfig, SocketHelperService,
        UserService, CampaignModel, ListModel,
        _items, _count, _lists
      ) {
        // Set current scope reference to models
        CampaignModel.setScope($scope, false, 'items', 'itemCount');
        ListModel.setScope($scope, false, 'lists');

        // Add default list configuration variable to current scope
        $scope = angular.extend($scope, angular.copy(ListConfig.getConfig()));

        // Set initial data
        $scope.items = _items;
        $scope.itemCount = _count.count;
        $scope.lists = _lists;
        $scope.currentUser = UserService.user();

        // Initialize used title items
        $scope.titleItems = ListConfig.getTitleItems(CampaignModel.endpoint);

        // Initialize default sort data
        $scope.sort = {
          column: 'campaignname',
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
         * Helper function to fetch specified list property.
         *
         * @param   {Number}    listId        List id to search
         * @param   {String}    [property]      Property to return, if not given returns whole list object
         * @param   {String}    [defaultValue]  Default value if list or property is not founded
         *
         * @returns {*}
         */
        $scope.getList = function getList(listId, property, defaultValue) {
          defaultValue = defaultValue || 'Unknown';
          property = property || true;

          // Find list
          var list = _.find($scope.lists, function iterator(list) {
            return parseInt(list.id, 10) === parseInt(listId.toString(), 10);
          });

          return list ? (property === true ? list : list[property]) : defaultValue;
        };

        /**
         * Simple watcher for 'currentPage' scope variable. If this is changed we need to fetch campaign data
         * from server.
         */
        $scope.$watch('currentPage', function watcher(valueNew, valueOld) {
          if (valueNew !== valueOld) {
            _fetchData();
          }
        });

        /**
         * Simple watcher for 'itemsPerPage' scope variable. If this is changed we need to fetch campaign data
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
         * These are fetched via 'CampaignModel' service with promises.
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
            populate: 'lists',
            limit: $scope.itemsPerPage,
            skip: ($scope.currentPage - 1) * $scope.itemsPerPage,
            sort: $scope.sort.column + ' ' + ($scope.sort.direction ? 'ASC' : 'DESC')
          };

          // Fetch data count
          var count = CampaignModel
            .count(commonParameters)
            .then(
              function onSuccess(response) {
                $scope.itemCount = response.count;
              }
            )
          ;

          // Fetch actual data
          var load = CampaignModel
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
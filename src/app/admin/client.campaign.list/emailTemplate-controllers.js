/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.campaign.campaign.emailTemplate' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
  'use strict';

  // Controller for new emailTemplate creation.
  angular.module('frontend.admin.client.campaign.emailTemplate')
    .controller('EmailTemplateAddController', [
      '$scope', '$state',
      'MessageService',
      'EmailTemplateModel',
      '_client',
      '_campaign', 
      function controller(
        $scope, $state,
        MessageService,
        EmailTemplateModel,
        _client,
        _campaign
      ) {
  
        // expose state
        $scope.$state = $state;
        // Store parent campaign
        $scope.campaign = _campaign;
        $scope.client = _client;

        // Initialize emailTemplate model
        $scope.emailTemplate = {
            name: '',
            
            body: ''
        };
                
        /**
         * Scope function to store new emailTemplate to database. After successfully save emailTemplate will be redirected
         * to view that new created emailTemplate.
         */
        $scope.saveEmailTemplate = function() {
            $scope.emailTemplate.campaign = $scope.campaign;
            EmailTemplateModel
            .create(angular.copy($scope.emailTemplate))
            .then(
              function onSuccess(result) {
                MessageService.success('New emailTemplate added successfully');

                $state.go('emailTemplate', {emailTemplateId: result.data.id});
              }
            )
          ;
        };
        
      }
    ])
  ;

  // Controller to show single emailTemplate on GUI.
  angular.module('frontend.admin.client.campaign.emailTemplate')
    .controller('EmailTemplateController', 
    [
      '$scope', '$state',
      '$mdDialog',
      'UserService', 'MessageService',
      'EmailTemplateModel', 
      '_campaign',
      '_emailTemplate',
      function controller(
        $scope, $state,
        $mdDialog,
        UserService, MessageService,
        EmailTemplateModel, 
        _campaign,
        _emailTemplate
      ) {
        // expose state
        $scope.$state = $state;
        // Set current scope reference to model
        EmailTemplateModel.setScope($scope, 'emailTemplate');

        // Initialize scope data
        $scope.currentUser = UserService.user();
        $scope.emailTemplate = _emailTemplate;
        $scope.selectList = _emailTemplate.list ? _emailTemplate.list.id : null;

        // EmailTemplate delete dialog buttons configuration
        $scope.confirmButtonsDelete = {
          ok: {
            label: 'Delete',
            className: 'btn-danger',
            callback: function callback() {
              $scope.deleteEmailTemplate();
            }
          },
          cancel: {
            label: 'Cancel',
            className: 'btn-default pull-left'
          }
        };

        /**
         * Scope function to save the modified emailTemplate. This will send a
         * socket request to the backend server with the modified object.
         */
        $scope.saveEmailTemplate = function() {
          var data = angular.copy($scope.emailTemplate);

          // Make actual data update
          EmailTemplateModel
            .update(data.id, data)
            .then(
              function onSuccess() {
                MessageService.success('Email template "' + $scope.emailTemplate.name + '" updated successfully');
              }
            )
          ;
        };

        /**
         * Scope function to delete current emailTemplate. This will send DELETE query to backend via web socket
         * query and after successfully delete redirect emailTemplate back to emailTemplate list.
         */
        $scope.deleteEmailTemplate = function deleteEmailTemplate() {
          EmailTemplateModel
            .delete($scope.emailTemplate.id)
            .then(
              function onSuccess() {
                MessageService.success('Email template "' + $scope.emailTemplate.title + '" deleted successfully');

                $state.go('emailTemplates');
              }
            )
          ;
        };

        $scope.confirmDelete = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Delete emailTemplate')
                  .textContent('Are you sure you want to delete email template '+$scope.emailTemplate.name+' ?')
                  .ariaLabel('Lucky day')
                  .targetEvent(ev)
                  .ok('Yes!')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
              $scope.deleteEmailTemplate();
            }, function() {
                
            });
          };        
      }
    ])
  ;

  // Controller which contains all necessary logic for emailTemplate list GUI on boilerplate application.
  angular.module('frontend.admin.client.campaign.emailTemplate')
    .controller('EmailTemplateListController', [
      '$scope', '$q', '$timeout',
      '_',
      'ListConfig', 'SocketHelperService',
      'UserService', 'EmailTemplateModel', 
      '_campaign',
      '_items', '_count', 
      function controller(
        $scope, $q, $timeout,
        _,
        ListConfig, SocketHelperService,
        UserService, EmailTemplateModel, 
        _campaign,
        _items, _count
      ) {
      console.log(_campaign);
  
        // Set current scope reference to models
        EmailTemplateModel.setScope($scope, false, 'items', 'itemCount');

        // Add default list configuration variable to current scope
        $scope = angular.extend($scope, angular.copy(ListConfig.getConfig()));

        // Set initial data
        $scope.items = _items;
        $scope.campaign = _campaign;
        $scope.itemCount = _count.count;
        $scope.currentUser = UserService.user();
        $scope.query =  {
            order: 'name',
            page: 1,
            limit: $scope.itemsPerPage
        };

        // Initialize used title items
        $scope.titleItems = ListConfig.getTitleItems(EmailTemplateModel.endpoint);

        // Initialize default sort data
        $scope.sort = {
          column: 'name',
          direction: true
        };

        // Initialize filters
        $scope.filters = {
          searchWord: '',
          columns: $scope.titleItems
        };

        /**
         * Simple watcher for 'currentPage' scope variable. If this is changed we need to fetch emailTemplate data
         * from server.
         */
        $scope.$watch('currentPage', function watcher(valueNew, valueOld) {
          if (valueNew !== valueOld) {
            _fetchData();
          }
        });

        /**
         * Simple watcher for 'itemsPerPage' scope variable. If this is changed we need to fetch emailTemplate data
         * from server.
         */
        $scope.$watch('itemsPerPage', function watcher(valueNew, valueOld) {
          if (valueNew !== valueOld) {
            _triggerFetchData();
          }
        });

        /*
         * Method to call when order-by column changed
         */
        $scope.onReorder = function (order) {
            // first char is '-' if direction is ascending
            $scope.sort.direction = order.charAt(0) !== '-';
            if( !$scope.sort.direction ) {
                order = order.substring(1);
            }            
            $scope.sort.column = order;
            _triggerFetchData();
        };
        
        
        $scope.onPaginate = function (currentPage, itemsPerPage) {
            $scope.currentPage = currentPage;
            $scope.itemsPerPage = itemsPerPage;
            _fetchData();
          };

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
         * These are fetched via 'EmailTemplateModel' service with promises.
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
            limit: $scope.itemsPerPage,
            skip: ($scope.currentPage - 1) * $scope.itemsPerPage,
            sort: $scope.sort.column + ' ' + ($scope.sort.direction ? 'ASC' : 'DESC')
          };

          // Fetch data count
          var count = EmailTemplateModel
            .count(commonParameters)
            .then(
              function onSuccess(response) {
                $scope.itemCount = response.count;
              }
            )
          ;

          // Fetch actual data
          var load = EmailTemplateModel
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

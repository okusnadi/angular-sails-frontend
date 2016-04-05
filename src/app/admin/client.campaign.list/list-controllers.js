/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.campaign.campaign.list' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
  'use strict';

  // Controller for new list creation.
  angular.module('frontend.admin.client.campaign.list')
    .controller('ListAddController', [
      '$scope', '$state',
      'MessageService',
      'ListModel',
      '_scripts',
      '_campaign', 
      function controller(
        $scope, $state,
        MessageService,
        ListModel,
        _scripts,
        _campaign
      ) {
  
        // expose state
        $scope.$state = $state;
        // Store parent campaign
        $scope.scripts = _scripts;
        $scope.campaign = _campaign;

        // Initialize list model
        $scope.list = {
            name: '',            
            info: '',
            defaultScript: null
        };
                
        /**
         * Scope function to store new list to database. After successfully save list will be redirected
         * to view that new created list.
         */
        $scope.saveList = function() {
            $scope.list.campaign = $scope.campaign;
            ListModel
            .create(angular.copy($scope.list))
            .then(
              function onSuccess(result) {
                MessageService.success('New list added successfully');

                $state.go('list', {listId: result.data.id});
              }
            )
          ;
        };
        
      }
    ])
  ;

  // Controller to show single list on GUI.
  angular.module('frontend.admin.client.campaign.list')
    .controller('ListController', 
    [
      '$scope', '$state',
      '$mdDialog',
      'UserService', 'MessageService',
      'ListModel', 
       '_scripts',
      '_campaign',
      '_list',
      function controller(
        $scope, $state,
        $mdDialog,
        UserService, MessageService,
        ListModel, 
        _scripts,
        _campaign,
        _list
      ) {
        // expose state
        $scope.$state = $state;
        // Set current scope reference to model
        ListModel.setScope($scope, 'list');

        // Initialize scope data
        $scope.currentUser = UserService.user();
        $scope.scripts = _scripts;
        $scope.list = _list;
        $scope.selectList = _list.list ? _list.list.id : null;
        

        // List delete dialog buttons configuration
        $scope.confirmButtonsDelete = {
          ok: {
            label: 'Delete',
            className: 'btn-danger',
            callback: function callback() {
              $scope.deleteList();
            }
          },
          cancel: {
            label: 'Cancel',
            className: 'btn-default pull-left'
          }
        };

        /**
         * Scope function to save the modified list. This will send a
         * socket request to the backend server with the modified object.
         */
        $scope.saveList = function() {
          var data = angular.copy($scope.list);

          // Make actual data update
          ListModel
            .update(data.id, data)
            .then(
              function onSuccess() {
                MessageService.success('Email template "' + $scope.list.name + '" updated successfully');
              }
            )
          ;
        };

        /**
         * Scope function to delete current list. This will send DELETE query to backend via web socket
         * query and after successfully delete redirect list back to list list.
         */
        $scope.deleteList = function deleteList() {
          ListModel
            .delete($scope.list.id)
            .then(
              function onSuccess() {
                MessageService.success('Email template "' + $scope.list.title + '" deleted successfully');

                $state.go('lists');
              }
            )
          ;
        };

        $scope.confirmDelete = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Delete list')
                  .textContent('Are you sure you want to delete email template '+$scope.list.name+' ?')
                  .ariaLabel('Lucky day')
                  .targetEvent(ev)
                  .ok('Yes!')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
              $scope.deleteList();
            }, function() {
                
            });
          };        
      }
    ])
  ;

  // Controller which contains all necessary logic for list list GUI on boilerplate application.
  angular.module('frontend.admin.client.campaign.list')
    .controller('ListListController', [
      '$scope', '$q', '$timeout',
      '_',
      'ListConfig', 'SocketHelperService',
      'UserService', 'ListModel',
      'DataProvider',
      '_campaign',
      '_items', '_count', 
      function controller(
        $scope, $q, $timeout,
        _,
        ListConfig, SocketHelperService,
        UserService, ListModel, 
        DataProvider,
        _campaign,
        _items, _count
      ) {
      
        // Set current scope reference to models
        ListModel.setScope($scope, false, 'items', 'itemCount');

        // Add default list configuration variable to current scope
        $scope.config = ListConfig.getConfig();

        // Set initial data        
        $scope.campaign = _campaign;
        $scope.currentUser = UserService.user();

        // Initialize used title items        
        $scope.query =  {
            items: _items,
            currentPage: 1,
            itemsPerPage: $scope.config.itemsPerPage,
            itemCount: _count.count,
            order: 'name',
            searchWord: '',
            columns: ListConfig.getTitleItems(ListModel.endpoint),
            where: { 
                campaign: _campaign.id
            }
        };
        
        $scope.dataProvider = new DataProvider(ListModel, $scope.query);


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

/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.campaign.campaign.list' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
  'use strict';


var ListAddController = function (
        $scope, $mdDialog,
        MessageService,
        ListModel,
        _scripts,_campaign,
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
                
        $scope.cancelDialog = function(){$mdDialog.cancel();};
        
        $scope.saveList = function() {
            $scope.list.campaign = $scope.campaign;
            ListModel
            .create(angular.copy($scope.list))
            .then(
              function onSuccess(result) {
                MessageService.success('New list added successfully');
                $mdDialog.hide();
                dataProvider.triggerFetchData();
              }
            )
          ;
        };
        
      };

var ListEditController = function (
        $scope, $state,
        $mdDialog,
        UserService, MessageService,
        DataProvider,
        ListModel, ProspectModel,
        _scripts,
        _campaign,
        _list
      ) {
        // expose state
        $scope.$state = $state;
        // Set current scope reference to model
        ListModel.setScope($scope, 'list');
        ProspectModel.setScope($scope, 'prospect');

        // Initialize scope data
        $scope.currentUser = UserService.user();
        $scope.scripts = _scripts;
        $scope.list = _list;
        $scope.selectList = _list.list ? _list.list.id : null;
        
        // Initialize query parameters
        $scope.query =  {
//            order: "fields->'Name'->>'value'",
            order: "id",
            searchWord: '',
            where: { 
                list: _list.id
            }
        };
        
        $scope.dataProvider = new DataProvider(ProspectModel, $scope.query);

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
                MessageService.success('List "' + $scope.list.name + '" updated successfully');
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
                MessageService.success('List "' + $scope.list.title + '" deleted successfully');

                $state.go('lists');
              }
            )
          ;
        };

        $scope.confirmDelete = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Delete list')
                  .textContent('Are you sure you want to delete list '+$scope.list.name+' ?')
                  .ariaLabel('Lucky day')
                  .targetEvent(ev)
                  .ok('Yes!')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
              $scope.deleteList();
            }, function() {
                
            });
          };        
      };
  
  

  // Controller which contains all necessary logic for list list GUI on boilerplate application.
  angular.module('frontend.admin.client.campaign.list')
    .controller('ListListController', [
      '$scope', '$q', '$timeout',
      '$mdDialog',
      '_',
      'ListModel',
      'DataProvider',
      '_campaign', '_scripts',
      function controller(
        $scope, $q, $timeout,
        $mdDialog,
        _,
        ListModel, 
        DataProvider,
        _campaign, _scripts
      ) {
      
        // Set current scope reference to models
        ListModel.setScope($scope, false, 'items', 'itemCount');

        // Set initial data        
        $scope.campaign = _campaign;
        $scope.query =  {
            order: 'name',
            searchWord: '',
            where: { 
                campaign: _campaign.id
            }
        };
        
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
        
        $scope.addListDialog = function(ev) {
            $mdDialog.show({
              controller: ListAddController,
              locals: {
                  dataProvider: $scope.dataProvider,
                  _campaign: _campaign,
                  _scripts: _scripts
              },
              templateUrl: '/frontend/admin/client.campaign.list/list.html',
              targetEvent: ev,
              clickOutsideToClose:false
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
      'UserService', 'MessageService',
      'DataProvider',
      'ListModel', 'ProspectModel',
       '_scripts',
      '_campaign',
      '_list',
      ListEditController
    ]);  
  
}());

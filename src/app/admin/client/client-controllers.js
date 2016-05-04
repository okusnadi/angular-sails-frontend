/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.client' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
  'use strict';

    var organisationalUnits = 'Country, County, Region, Branch, Department';


    var ClientAddController = function controller(
        $scope, $state,
        MessageService,
        ClientModel, $mdDialog, dataProvider
      ) {
  
        // expose state
        $scope.$state = $state;
        // Store campaigns
//        $scope.campaigns = _campaigns;

        // Initialize client model
        $scope.client = {
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
        
        
        $scope.items = [
            { value: '' }
        ];
            
        $scope.suggestions = organisationalUnits;
        
        /**
         * Scope function to store new client to database. After successfully save client will be redirected
         * to view that new created client.
         */
        $scope.saveClient = function() {
            var ounits = $scope.items.map( function( ou, index ) {
                return {
                    order: index,
                    value: ou.value
                };
            });
            $scope.client.orgUnits = angular.toJson(ounits);
            ClientModel
            .create(angular.copy($scope.client))
            .then(
              function onSuccess(result) {
                MessageService.success('New client added successfully');
                $mdDialog.hide();
                dataProvider.triggerFetchData();
              }
            )
          ;
        };
        
        //dialogs
        
        $scope.cancelDialog = function () {
            $mdDialog.cancel();
        };
        
        
      }
  // Controller for new client creation.
  angular.module('frontend.admin.client')
    .controller('ClientAddController', [
      '$scope', '$state',
      'MessageService',
      'ClientModel',
      ClientAddController
    ])
  ;
	
	//edit client controller
	
	var ClientEditController = function controller(
        $scope, $state,
        $mdDialog,
        UserService, MessageService,
        ClientModel, CampaignModel,
        _client, dataProvider
      ) {
				
        // expose state
        $scope.$state = $state;
        // Set current scope reference to model
        ClientModel.setScope($scope, 'client');

        // Initialize scope data
        $scope.currentUser = UserService.user();
        $scope.client = _client;

        $scope.items = angular.fromJson($scope.client.orgUnits);
        $scope.suggestions = organisationalUnits;
                
        /**
         * Scope function to save the modified client. This will send a
         * socket request to the backend server with the modified object.
         */
        $scope.saveClient = function() {
          var data = angular.copy($scope.client);

            var ounits = $scope.items.map( function( ou, index ) {
                return {
                    order: index,
                    value: ou.value
                };
            });
            data.orgUnits = angular.toJson(ounits);

          // Make actual data update
          ClientModel
            .update(data.id, data)
            .then(
              function onSuccess() {
                MessageService.success('Client "' + $scope.client.name + '" updated successfully');
								$mdDialog.hide();
                dataProvider.triggerFetchData();
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
                MessageService.delete('Client "' + $scope.client.name + '" deleted successfully');

                $state.go('admin.clients');
              }
            )
          ;
        };

        $scope.confirmDelete = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Delete client')
                  .textContent('Are you sure you want to delete client '+$scope.client.name+' ?')
                  .ariaLabel('Lucky day')
                  .targetEvent(ev)
                  .ok('Yes!')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
              $scope.deleteClient();
							dataProvider.triggerFetchData();
            }, function() {
                
            });
          };        
					
				$scope.cancelDialog = function () {
            $mdDialog.cancel();
        };

	};
	

  // Controller to show single client on GUI.
  angular.module('frontend.admin.client')
    .controller('ClientController', 
    [
      '$scope', '$state',
      '$mdDialog',
      'UserService', 'MessageService',
      'ClientModel', 'CampaignModel',
      '_client', 
			ClientEditController
    ])
  ;

  // Controller which contains all necessary logic for client list GUI on boilerplate application.
  angular.module('frontend.admin.client')
    .controller('ClientListController',      
      function controller(
        $scope, $q, $timeout, $mdDialog,
        _,
        ListConfig, ClientModel, 
        DataProvider
      ) {
        // Set current scope reference to models
        ClientModel.setScope($scope, false, 'items', 'itemCount');

        $scope.query =  {
            order: 'name',
            searchWord: '',            
            populate: ['campaigns']
        };

        $scope.dataProvider = new DataProvider(ClientModel, $scope.query);

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
        $scope.addClientDialog = function(ev) {
            $mdDialog.show({
            controller: ClientAddController,
            locals: {
              dataProvider: $scope.dataProvider
            },
            resolve: {
                  _role: 
                    function resolve(
                      $stateParams,
                      ClientModel
                    ) {
                      return ClientModel.fetch($stateParams.id);
                    }
            },
            templateUrl: '/frontend/admin/client/client.html',
//              parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false
          });
        };
				
				$scope.editClientDialog = function(ev, item, column) {
					$mdDialog.show ({
						controller: ClientEditController,
						locals: {
							dataProvider: $scope.dataProvider
						},
						resolve: {
							_client:
									function resolve (ClientModel) {
										return ClientModel.fetch(item.id);
									}
						},
						templateUrl: '/frontend/admin/client/client.html',
						targetEvent: ev,
						clickOutsideToClose: false
					});
				};
        
        //raToolbarButtons
        $scope.toolbarBtns = [
            {
                btnTooltip: 'Add Client',
                btnIcon: 'add_circle_user',
                btnAction: $scope.addClientDialog
            }
        ]
        
      }
    )
  ;
}());

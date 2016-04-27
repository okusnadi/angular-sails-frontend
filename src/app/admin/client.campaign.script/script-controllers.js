/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.campaign.campaign.script' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  // Controller for new script creation.
  angular.module('frontend.admin.client.campaign.script')
    .controller('ScriptAddController', [
      '$scope', '$state',
      'MessageService',
      'ScriptModel',
      '_client',
      '_campaign',
      function controller(
        $scope, $state,
        MessageService,
        ScriptModel,
        _client,
        _campaign
        ) {

        // expose state
        $scope.$state = $state;
        // Store parent campaign
        $scope.campaign = _campaign;
        $scope.client = _client;

        // Initialize script model
        $scope.script = {
          name: '',
          info: ''
        };

        $scope.options = {
          height: '600px',
//          clickToUse: true,
          nodes: {
            shape: 'dot',
            shadow: true
          },
          interaction: {
            navigationButtons: true,
            selectConnectedEdges: false,
//            keyboard: true
          },
          manipulation: {
            enabled:          true,
            initiallyActive:  true
          },
          groups: {
            'Start': { 
              shape: 'dot',
              physics: false,
            },
            'End':  {
              shape: 'triangleDown',
              physics: false
            }
          }
        };
        
        var nodes = new vis.DataSet([
          {id: 1, label: 'Start', group: 'Start'},
          {id: 999, label: 'End', group: 'End'},
          {id: 2, label: 'Node 2', group: 1},
          {id: 3, label: 'Node 3', group: 1},
          {id: 4, label: 'Node 4', group: 2},
          {id: 5, label: 'Node 5', group: 2},
          {id: 6, label: 'Just before end', group: 3},
          {id: 7, label: '0', group: 0},
          {id: 8, label: '1', group: 1},
          {id: 9, label: '2', group: 2},
          {id: 10, label: '3', group: 3},
          {id: 11, label: '4', group: 4},
          {id: 12, label: '5', group: 5},
          {id: 13, label: '6', group: 6},
          {id: 14, label: '7', group: 7},
          {id: 15, label: '8', group: 8},
          {id: 16, label: '9', group: 9},
          {id: 17, label: '10', group: 10},
          {id: 18, label: '11', group: 11},
          {id: 19, label: '12', group: 12},
        ]);

        // create an array with edges
        var edges = new vis.DataSet([
          {from: 1, to: 2, arrows: 'to', label: 'first'},
          {from: 2, to: 3},
          {from: 2, to: 4},
          {from: 2, to: 5},
          {from: 4, to: 6},
          {from: 5, to: 6},
          {from: 3, to: 6},
          {from: 6, to: 999, arrows: 'to'}
        ]);

        // create a network
        $scope.data = {
          nodes: nodes,
          edges: edges
        };
        
        $scope.network = null;

        $scope.onClick = function ( params ) {
          console.log(params);
        };
        $scope.onRightClick = function ( params ) {
          console.log(params);
          params.event.preventDefault();
          
          var selection = {
            nodes: params.nodes,
            edges: params.edges,
          };
        };
        
        $scope.beforeDrawing = function ( params ) {
          // make sure canvas is not selectable
          angular.element(params.canvas).attr('tabindex','-1');
        };


        $scope.events = {
          click:          $scope.onClick,
          beforeDrawing:  $scope.beforeDrawing,
          oncontext: $scope.onRightClick,
        };

        /**
         * Scope function to store new script to database. After successfully save script will be redirected
         * to view that new created script.
         */
        $scope.saveScript = function () {
          $scope.script.campaign = $scope.campaign;
          ScriptModel
            .create(angular.copy($scope.script))
            .then(
              function onSuccess(result) {
                MessageService.success('New script added successfully');

                $state.go('script', {scriptId: result.data.id});
              }
            )
            ;
        };

      }
    ])
    ;

  // Controller to show single script on GUI.
  angular.module('frontend.admin.client.campaign.script')
    .controller('ScriptController',
      [
        '$scope', '$state',
        '$mdDialog',
        'UserService', 'MessageService',
        'ScriptModel',
        '_campaign',
        '_script',
        function controller(
          $scope, $state,
          $mdDialog,
          UserService, MessageService,
          ScriptModel,
          _campaign,
          _script
          ) {
          // expose state
          $scope.$state = $state;
          // Set current scope reference to model
          ScriptModel.setScope($scope, 'script');

          // Initialize scope data
          $scope.currentUser = UserService.user();
          $scope.script = _script;
          $scope.selectList = _script.list ? _script.list.id : null;

          // Script delete dialog buttons configuration
          $scope.confirmButtonsDelete = {
            ok: {
              label: 'Delete',
              className: 'btn-danger',
              callback: function callback() {
                $scope.deleteScript();
              }
            },
            cancel: {
              label: 'Cancel',
              className: 'btn-default pull-left'
            }
          };

          /**
           * Scope function to save the modified script. This will send a
           * socket request to the backend server with the modified object.
           */
          $scope.saveScript = function () {
            var data = angular.copy($scope.script);

            // Make actual data update
            ScriptModel
              .update(data.id, data)
              .then(
                function onSuccess() {
                  MessageService.success('Email template "' + $scope.script.name + '" updated successfully');
                }
              )
              ;
          };

          /**
           * Scope function to delete current script. This will send DELETE query to backend via web socket
           * query and after successfully delete redirect script back to script list.
           */
          $scope.deleteScript = function deleteScript() {
            ScriptModel
              .delete($scope.script.id)
              .then(
                function onSuccess() {
                  MessageService.success('Email template "' + $scope.script.title + '" deleted successfully');

                  $state.go('scripts');
                }
              )
              ;
          };

          $scope.confirmDelete = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
              .title('Delete script')
              .textContent('Are you sure you want to delete email template ' + $scope.script.name + ' ?')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Yes!')
              .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
              $scope.deleteScript();
            }, function () {

            });
          };
        }
      ])
    ;

  // Controller which contains all necessary logic for script list GUI on boilerplate application.
  angular.module('frontend.admin.client.campaign.script')
    .controller('ScriptListController', [
      '$scope', '$q', '$timeout',
      '_',
      'ScriptModel',
      'DataProvider',
      '_campaign',
      function controller(
        $scope, $q, $timeout,
        _,
        ScriptModel,
        DataProvider,
        _campaign
        ) {

        // Set current scope reference to models
        ScriptModel.setScope($scope, false, 'items', 'itemCount');

        // Set initial data
        $scope.campaign = _campaign;
        $scope.query = {
          order: 'name',
          searchWord: '',
          where: {
            campaign: _campaign.id
          }
        };

        $scope.dataProvider = new DataProvider(ScriptModel, $scope.query);

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

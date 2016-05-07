/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.campaign.campaign.script' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  var testFormController = function ($scope, $validator, $mdDialog) {

    $scope.input = [];
    $scope.defaultValue = {};

    $scope.submit = function () {
      return $validator.validate($scope, 'default').success(function () {
        return console.log('success');
      }).error(function () {
        return console.log('error');
      });
    };

    $scope.cancelDialog = function () {
      $mdDialog.cancel();
    };

  };

  var scriptPageController = function (
    $mdDialog, $stateParams, $state, $scope, 
    $formBuilder, NetworkProvider, MessageService, _,
    _script
      )
  {
    // don't recreate network on comming back to previous page
    NetworkProvider.preserveState = true;
    
    if(angular.isDefined(NetworkProvider.selected.id)) {
      $scope.node = NetworkProvider.selected;
    };
    if( angular.isUndefined($scope.node) ) {
      $scope.node = _.findWhere(_script.network.nodes, {id: parseInt($stateParams.nodeId)});
    }
    if( angular.isUndefined($scope.node) ) {
      $state.go('^');
      return;
    }
    
    $scope.oldScript = angular.copy($scope.node.script);
    
    if (angular.isUndefined($scope.node.script)) {
      $scope.node.script = [
        {"id": 0, "component": "textInput", "editable": true, "index": 0, "label": "Name", "description": "Your name", "placeholder": "Your name", "options": [], "required": true, "validation": "/.*/"},
        {"id": 1, "component": "checkbox", "editable": true, "index": 1, "label": "Pets", "description": "Do you have any pets?", "placeholder": "placeholder", "options": ["Dog", "Cat"], "required": false, "validation": "/.*/"},
        {"id": 2, "component": "select", "editable": true, "index": 2, "label": "Select", "description": "description", "placeholder": "placeholder", "options": ["value one", "value two"], "required": false, "validation": "/.*/"},
      ];
    }
    
    $formBuilder.registerComponent('sampleInput', {
      group: 'Special elements',
      label: 'Sample',
      description: 'From html template',
      placeholder: 'placeholder',
      required: false,
      validationOptions: [
        {
          label: 'none',
          rule: '/.*/'
        }, {
          label: 'number',
          rule: '[number]'
        }, {
          label: 'email',
          rule: '[email]'
        }, {
          label: 'url',
          rule: '[url]'
        }
      ],
      templateUrl: '/frontend/core/formBuilder/templates/template.html',
      popoverTemplateUrl: '/frontend/core/formBuilder/templates/popoverTemplate.html'
    });

    $formBuilder.forms['default'] = $scope.node.script;
    $scope.form = $formBuilder.forms['default'];
    
    $scope.testForm = function (ev) {
      $mdDialog.show({
        controller: [
          '$scope', '$validator', '$mdDialog',
          testFormController
        ],
        locals: {
        },
        templateUrl: '/frontend/admin/client.campaign.script/script-test.html',
        targetEvent: ev,
        clickOutsideToClose: true
      });
    };

    $scope.saveScript = function (ev) {
      MessageService.info('Form stored locally - please rememember to save!');
      $state.go('^');
    };

    $scope.cancelScript = function (ev) {
    MessageService.info('Form changes cancelled');
    $scope.node.script = angular.copy($scope.oldScript);
      $state.go('^');
    };

  };

  angular.module('frontend.admin.client.campaign.script')
    .controller('ScriptPageController', [
      '$mdDialog', '$stateParams', '$state', '$scope', 
      '$formBuilder', 'NetworkProvider', 'MessageService', '_',
      '_script',
      scriptPageController
    ]);

  // Controller for new script creation.
  angular.module('frontend.admin.client.campaign.script')
    .controller('ScriptAddController', [
      '$scope', '$state',
      'MessageService', 'NetworkProvider',
      'ScriptModel',
      '_client',
      '_campaign',
      function controller(
        $scope, $state,
        MessageService, NetworkProvider,
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

        // create a network
        $scope.options = NetworkProvider.getOptions();
        $scope.events = NetworkProvider.getEvents();
        $scope.np = NetworkProvider;

        // 1 level deep watch for changes in current element form
        $scope.$watchCollection("np.selected", function (nv, ov) {
          if (angular.isDefined(nv.id) && nv.id === ov.id) {
            var set = nv.type === 'node' ? $scope.np.network.body.data.nodes : $scope.np.network.body.data.edges;
            set.update(nv);
          }
        });

        $scope.data = {
          nodes: new vis.DataSet(NetworkProvider.getStartNodes()),
          edges: new vis.DataSet([])
        };

        /**
         * Scope function to store new script to database. After successfully save script will be redirected
         * to view that new created script.
         */
        $scope.saveScript = function () {
          $scope.script.campaign = $scope.campaign;

          NetworkProvider.network.storePositions();
          $scope.script.network = {
            nodes: $scope.data.nodes.get(),
            edges: $scope.data.edges.get()
          };

          ScriptModel
            .create(angular.copy($scope.script))
            .then(
              function onSuccess(result) {
                MessageService.success('New script added successfully');
                $state.go('scripts');
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
        'UserService', 'MessageService', 'NetworkProvider',
        'ScriptModel',
        '_campaign',
        '_script',
        function controller(
          $scope, $state,
          $mdDialog,
          UserService, MessageService, NetworkProvider,
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

          // create a network
          $scope.options = NetworkProvider.getOptions();
          $scope.events = NetworkProvider.getEvents();
          $scope.np = NetworkProvider;

          // 1 level deep watch for changes in current element form
          $scope.$watchCollection("np.selected", function (nv, ov) {
            if (angular.isDefined(nv.id) && nv.id === ov.id) {
              var set = nv.type === 'node' ? $scope.np.network.body.data.nodes : $scope.np.network.body.data.edges;
              set.update(nv);
            }
          });

          var nodes, edges;
          // icheck if we need to recreate network nodes or use ones from previous state
          if(NetworkProvider.network && NetworkProvider.preserveState === true) {
            NetworkProvider.preserveState = false;
            nodes = NetworkProvider.network.body.data.nodes.get();
            edges = NetworkProvider.network.body.data.edges.get();            
          }
          else {
            nodes = $scope.script.network ? $scope.script.network.nodes : NetworkProvider.getStartNodes();
            edges = $scope.script.network ? $scope.script.network.edges : [];
          }
          
          $scope.data = {
            nodes: new vis.DataSet(nodes),
            edges: new vis.DataSet(edges)
          };

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

            NetworkProvider.network.storePositions();
            $scope.script.network = {
              nodes: $scope.data.nodes.get(),
              edges: $scope.data.edges.get()
            };

            var data = angular.copy($scope.script);

            // Make actual data update
            ScriptModel
              .update(data.id, data)
              .then(
                function onSuccess() {
                  MessageService.success('Script "' + $scope.script.name + '" updated successfully');
                  $state.go('scripts');
                }
              )
              ;
          };

          var originatorEv;

          $scope.openMenu = function ($mdOpenMenu, ev) {
            console.log($mdOpenMenu);
            originatorEv = ev;
            $mdOpenMenu(ev);
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
                  MessageService.success('Script "' + $scope.script.title + '" deleted successfully');
                  $state.go('scripts');
                }
              )
              ;
          };

          $scope.confirmDelete = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
              .title('Delete script')
              .textContent('Are you sure you want to delete script ' + $scope.script.name + ' ?')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Yes!')
              .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
              $scope.deleteScript();
            }, function () {

            });
          };
          
//          $scope.editScriptPage = function (ev, node) {
//            $mdDialog.show({
//              controller: [
//              '$mdDialog', '$stateParams',
//              '$scope', '$formBuilder', '$validator', '_',
//                scriptPageController
//              ],
//              locals: {
//                node: node,
//                script: $scope.script
//              },
//              templateUrl: '/frontend/admin/client.campaign.script/script-page.html',
//              targetEvent: ev,
//              clickOutsideToClose: false
//            });
//          };

          
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

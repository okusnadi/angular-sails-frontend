/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.campaign.campaign.script' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';


  var scriptPageController = function ($scope, _script, $formBuilder, $validator) {

    $formBuilder.registerComponent('sampleInput', {
        group: 'from html',
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
      
    var checkbox, textbox;
    textbox = $formBuilder.addFormObject('default', {
      component: 'textInput',
      label: 'Name',
      description: 'Your name',
      placeholder: 'Your name',
      required: true,
      editable: false
    });
    checkbox = $formBuilder.addFormObject('default', {
      component: 'checkbox',
      label: 'Pets',
      description: 'Do you have any pets?',
      options: ['Dog', 'Cat']
    });
    $formBuilder.addFormObject('default', {
      component: 'sampleInput'
    });
    $scope.form = $formBuilder.forms['default'];
    $scope.input = [];
    $scope.defaultValue = {};
//    $scope.defaultValue[textbox.id] = 'default value';
//    $scope.defaultValue[checkbox.id] = [true, true];

    return $scope.submit = function () {
      return $validator.validate($scope, 'default').success(function () {
        return console.log('success');
      }).error(function () {
        return console.log('error');
      });
    };


  };

  angular.module('frontend.admin.client.campaign.script')
    .controller('ScriptPageController', [
      '$scope', '_script', '$formBuilder', '$validator',
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

          var nodes = $scope.script.network ? $scope.script.network.nodes : NetworkProvider.getStartNodes();
          var edges = $scope.script.network ? $scope.script.network.edges : [];
          $scope.data = {
            nodes: new vis.DataSet(nodes),
            edges: new vis.DataSet(edges)
          };

          $scope.editScriptPage = function (ev, node) {
            $mdDialog.show({
              controller: ['$formBuilder', scriptPageController],
              locals: {
                node: node
              },
              templateUrl: '/frontend/admin/client.campaign.script/script-page.html',
//              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose: false
            });
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
                  MessageService.success('Email template "' + $scope.script.name + '" updated successfully');
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

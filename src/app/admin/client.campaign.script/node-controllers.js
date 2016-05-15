/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.campaign.campaign.script' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  var testFormController = function (
    $scope, $validator, $mdDialog
    ) {

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
    $mdDialog, $stateParams, $state, $scope, $formBuilder, 
    NetworkProvider, MessageService, mceService, _,
    _client, _campaign, _script
    )
  {
    
    // don't recreate network on comming back to previous page
    NetworkProvider.preserveState = true;
    mceService.scope.client = _client;
    mceService.scope.campaign = _campaign;

    if (angular.isDefined(NetworkProvider.selected.id)) {
      $scope.node = NetworkProvider.selected;
    }
    ;
    if (angular.isUndefined($scope.node)) {
      $scope.node = _.findWhere(_script.network.nodes, {id: parseInt($stateParams.nodeId)});
    }
    if (angular.isUndefined($scope.node)) {
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
        templateUrl: '/frontend/admin/client.campaign.script/node-form-test.html',
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
      '$mdDialog', '$stateParams', '$state', '$scope', '$formBuilder', 
      'NetworkProvider', 'MessageService', 'mceService', '_',
      '_client', '_campaign', '_script',
      scriptPageController
    ]);

}());

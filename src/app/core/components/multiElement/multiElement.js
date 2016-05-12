
(function () {

  'use strict';

  function MultiElementController() {

    var ctrl = this;
    
    if (angular.isUndefined(ctrl.meItems) || !ctrl.meItems || ctrl.meItems.length < 1) {
      ctrl.meItems = [{}];
    }

    ctrl.addField = function (index) {
      if (angular.isUndefined(ctrl.meMax) || ctrl.meItems.length < ctrl.meMax) {
        ctrl.meItems.splice(index + 1, 0, {value: ''});
      }
    };
    ctrl.deleteField = function (index) {
      if (ctrl.meItems.length > 1) {
        ctrl.meItems.splice(index, 1);
      }
    };
  }

  angular.module('frontend.core.components')
    .component('ccMultiElement', {
      controller: MultiElementController,
      templateUrl: '/frontend/core/components/multiElement/multiElement.html',
      bindings: {
        meItems: '=',
        meMax: '<?',
        meStatic: '<?',
        meTemplate: '<',
        meParams: '=?'
      }
    });

}());
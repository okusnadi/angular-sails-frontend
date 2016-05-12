
(function () {

  'use strict';

  function customEmailController() {

    var ctrl = this;
    
//    if( angular.isUndefined(ctrl.ceItem) ) {
//      ctrl.afAction.form = {};
//    }

  }

  angular.module('frontend.core.components')
    .component('ccCustomEmail', {
      controller: customEmailController,
      templateUrl: '/frontend/admin/client.campaign/customEmail/customEmail.html',
      bindings: {
        ceItem: '='
      }
    });

}());
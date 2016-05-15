
(function () {

  'use strict';

  function ActionFormController() {

    var ctrl = this;
    
    if( angular.isUndefined(ctrl.afAction.form) ) {
      ctrl.afAction.form = {};
    }

  }

  angular.module('frontend.core.components')
    .component('ccActionForm', {
      controller: ActionFormController,
      templateUrl: '/frontend/admin/client.campaign.script/actionForm/actionForm.html',
      bindings: {
        afAction: '=',
        afEmailTemplates: '<',
        afStatuses: '<'
      }
    });

}());
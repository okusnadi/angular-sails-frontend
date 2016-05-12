
(function () {

  'use strict';

  function ActionFormController() {

    var ctrl = this;
    
    console.log('CTRL:', ctrl);
    
    if( angular.isUndefined(ctrl.afAction.form) ) {
      ctrl.afAction.form = {};
    }

//    ctrl.onStatusChange = function statusChange() {
//      console.log(this);
//    };

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
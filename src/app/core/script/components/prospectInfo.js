(function () {

  'use strict';

  function ProspectInfoController(
    ) {

    var ctrl = this;

  }

  angular.module('frontend.core.script')
    .component('ccProspectInfo', {
      controller: [
      ProspectInfoController
    ],
      templateUrl: '/frontend/core/script/components/prospectInfo/prospectInfo.html',
      bindings: {
        piProspect: '='
      }

    });


})();


(function () {

    'use strict';

    function NetworkInfoController(NetworkProvider) {

        var ctrl = this;
        
        ctrl.np = NetworkProvider;
        
    }

    angular.module('frontend.core.components')
      .component('visNetworkInfo', {
          controller: ['NetworkProvider', NetworkInfoController],
          templateUrl: '/frontend/core/components/networkInfo/networkInfo.html',
          bindings: {
              niElement: '='
          }
      });

}());
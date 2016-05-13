
(function () {

  'use strict';

//  angular.module('frontend.core.components', []);

  angular.module('frontend.core.components').component('ccDataLink', {
    templateUrl: '/frontend/core/components/mceEditor/dataLink.html',
    bindings: {
      dtLinks: '<'
    },
    
    controller: function () {
      var ctrl = this;
      console.log(ctrl);
    }
  });
  

}());
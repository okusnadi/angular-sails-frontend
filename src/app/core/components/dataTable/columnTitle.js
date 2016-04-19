
(function () {

    'use strict';

    function ColumnTitleController() {
        
        var ctrl = this;
        console.log('CONTROLLER');
        if( angular.isDefined(ctrl.dtController) ) {
          ctrl.dtController( ctrl );
        }
        
    }

    angular.module('frontend.core.components')
      .component('mdColumnTitle', {
          controller: ColumnTitleController,
//          templateUrl: '/frontend/core/components/dataTable/columnTitle.html',
          templateUrl: function( $element, $attrs) {
            return angular.isDefined($attrs.dtTemplate) ? $attrs.dtTemplate : '/frontend/core/components/dataTable/columnTitle.html';
          },
          bindings: {
              dtColumn: '<',
              dtTemplate: '<?',
              dtController: '&?'
          }
          
      });

}());

(function () {

    'use strict';

    function ColumnTitleController() {
        
        var ctrl = this;
//        console.log(ctrl);
       
        if( angular.isDefined(ctrl.ctController) ) {
          ctrl.ctController( ctrl );
        }
        
    }

    angular.module('frontend.core.components')
      .component('mdColumnTitle', {
          controller: ColumnTitleController,
          templateUrl: function( $element, $attrs) {
            console.log('Template: ', $attrs);
            return angular.isDefined($attrs.ctTemplate) ? $attrs.ctTemplate : '/frontend/core/components/dataTable/columnTitle.html';
          },
          bindings: {
              ctColumn: '<',
              ctTemplate: '<?',
              ctController: '&?'
          }
          
      });

}());
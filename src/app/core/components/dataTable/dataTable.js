
(function () {

    'use strict';

    function DataTableController() {

        var ctrl = this;

        ctrl.isArray = function( value ) {
            return angular.isArray(value)? value.length + ' - View': value;
        };
    }

    angular.module('frontend.core.components')
      .component('mdDataTable', {
          controller: DataTableController,
          templateUrl: '/frontend/core/components/dataTable/dataTable.html',
          bindings: {
              dtItems: '<',
              dtItemCount: '<',
              dtColumns: '<',
              dtPage: '=',
              dtOrder: '=',
              dtLimit: '=',
              dtOnReorder: '&',
              dtOnPaginate: '&'
          }
      });

}());
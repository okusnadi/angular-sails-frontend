
(function () {

    'use strict';

    function DataTableController() {

        var ctrl = this;

        ctrl.getValue = function( item, column ) {
            var value; 
            
            if( angular.isArray(column.column) ) {
                value = item;
                angular.forEach( column.column, function(selector) {
                    value = value[selector];
                });
            }
            else {
                value = item[column.column];
            }
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
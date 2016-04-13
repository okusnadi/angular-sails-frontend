
(function () {

    'use strict';

    function DataTableController() {
        
        var ctrl = this;
        ctrl.event = 1;
        
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

            if( angular.isArray(value) && angular.isDefined(column.arrayColumn) ) {
                var v = '';
                var l = value.length;
                angular.forEach( value, function(item, key) {
                    v += item[column.arrayColumn];
                    if( l-1 > key) { 
                        v+= angular.isDefined(column.columnDelimiter)?column.columnDelimiter:' '; 
                    }
                });
                value = v;
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
              dtOnPaginate: '&',
              dtOnClick: '&?',
              dtSelected: '=?'
          }
          
      });

}());
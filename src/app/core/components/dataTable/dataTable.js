
(function () {

    'use strict';

    function DataTableController() {

        var ctrl = this;
        ctrl.event = 1;

        ctrl.getValue = function( item, column ) {
            console.log(item);
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
                angular.forEach( value, function(item) {
                    v += item[column.arrayColumn] + ' ';
                });
                value = v;
            }
            
            return angular.isArray(value)? value.length + ' - View': value;
        };
        
        ctrl.clicked = function( event, item, column ) {
            console.log( event, item, column );
//            ctrl.dtOnClick( {event:event, item:item, column:column} );
            ctrl.dtClick( {ev:ctrl.event} );
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
              dtOnClick: '&?'
          }
      });

}());
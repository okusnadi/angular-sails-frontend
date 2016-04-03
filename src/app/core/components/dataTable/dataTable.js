
(function () {

    'use strict';

//    function DataTableController($scope, $element, $attrs) {
//
//        var ctrl = this;
//
//        console.log(this);
//    }

    angular.module('frontend.core.components')
      .component('mdDataTable', {
//          controller: DataTableController,
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
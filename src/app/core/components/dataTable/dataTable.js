
(function () {

  'use strict';

  function DataTableController( _ ) {

    var ctrl = this;

    // method to determine if field is clickable
    ctrl.isClickable = function (item, column) {
      return angular.isDefined(column.clickable) ? eval(column.clickable) : false;
    };

    // method to check if spinner needs to be displayed
    ctrl.isSpinner = function (item, column) {
      return angular.isDefined(column.spinner) && angular.isDefined(ctrl.dtSpinner) ? eval(column.spinner) : false;
    };

    // callback to modify column titles
    ctrl.getColumnTitle = function (column) {
      return angular.isDefined(ctrl.dtColumnTitle) ? ctrl.dtColumnTitle({column: column}) : column.title;
    };

    // filter suggestions based on entered text
    ctrl.querySearch = function( query ) {
      if( angular.isUndefined(query) || query.length < 1 ) {
        return ctrl.dtSuggestions;
      }
      return _.filter(ctrl.dtSuggestions, function(element) {
        return angular.lowercase(element.name).indexOf(angular.lowercase(query)) > -1;
      });
    };
    
    ctrl.mappingValidator = function( column ) {
//      console.log(ctrl.dtMappedTo[column.title]);
      return {
        mapped: ctrl.dtMappedTo[column.title].mappedTo,
        empty: !ctrl.dtMappedTo[column.title].searchText,
        new: ctrl.dtMappedTo[column.title].searchText && ctrl.dtMappedTo[column.title].searchText.length > 1 && !ctrl.dtMappedTo[column.title].mappedTo
      };
    };

    // method to display current field value
    ctrl.getValue = function (item, column) {
      var value;

      if (angular.isArray(column.column)) {
        value = item;
        angular.forEach(column.column, function (selector) {
          if (angular.isUndefined(value)) {
            return '';
          }
          value = value[selector];
        });
      } else {
        value = item[column.column];
      }

      if (angular.isArray(value) && angular.isDefined(column.arrayColumn)) {
        var v = '';
        var l = value.length;
        angular.forEach(value, function (item, key) {
          v += item[column.arrayColumn];
          if (l - 1 > key) {
            v += angular.isDefined(column.columnDelimiter) ? column.columnDelimiter : ' ';
          }
        });
        value = v;
      }

      if (angular.isDefined(column.enum)) {
        value = column.enum[value];
      }

      return angular.isArray(value) ? value.length + ' - View' : value;
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
        dtSelected: '=?',
        dtSpinner: '=?',
        // callbacks
        dtOnReorder: '&',
        dtOnPaginate: '&',
        dtOnClick: '&?',

        dtSuggestions: '<?',
        dtMappedTo: '=?',
        dtMappedValidator: '&?'
      }

    });

}());
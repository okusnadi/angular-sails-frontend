
(function () {

  'use strict';

//  angular.module('frontend.core.components', []);

  angular.module('frontend.core.components').component('ccSelectDataLink', {
    templateUrl: '/frontend/core/components/selectDataLink/selectDataLink.html',
    bindings: {
      dtLinks:    '<',
      dtCategory: '=',
      dtField:    '='
    },
    controller: function () {
      var ctrl = this;
      
      ctrl.suggestions = [];

      ctrl.categoryChange = function categoryChange() {
        ctrl.suggestions = ctrl.dtCategory.links;
        ctrl.query = null;
      };

      ctrl.querySearch = function querySearch() {
        var result = ctrl.query ? ctrl.suggestions.filter(createFilterFor(ctrl.query)) : ctrl.suggestions;
        return result;
      };

      function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
          return angular.lowercase(item.label).indexOf(lowercaseQuery) > -1;
        };
      }

    }
  });


}());
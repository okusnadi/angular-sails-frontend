
(function () {

  'use strict';

 function MultiSelectLink(scope, element, attr) {

    element.addClass('current-ms');
    console.log(document.querySelector('.current-ms'));
    element.removeClass('current-ms');
    
    if( angular.isDefined(scope.msTemplate) ) {
      
    }
    
    scope.suggestions = loadAll();

    if (angular.isUndefined(scope.msItems.length) || scope.msItems.length < 1) {
      scope.msItems = [{value: ''}];
    }

    if (angular.isUndefined(scope.msLabelPrefix)) {
      scope.msLabelPrefix = "Level";
    }

    scope.addField = function (index) {
      if (angular.isUndefined(scope.msMax) || scope.msItems.length < scope.msMax) {
        scope.msItems.splice(index + 1, 0, {value: ''});
      }
    };
    scope.deleteField = function (index) {
      if (scope.msItems.length > 1) {
        scope.msItems.splice(index, 1);
      }
    };

    scope.querySearch = function (query, item) {
      var result = query ? scope.suggestions.filter(createFilterFor(query)) : scope.suggestions;
      return result;
    };

    function loadAll() {
      if (angular.isUndefined(scope.msSuggestions)) {
        return [];
      }

      if (typeof (scope.msSuggestions) === 'object') {
        return(scope.msSuggestions);
      }
      return scope.msSuggestions.split(/, +/g).map(function (suggestion) {
        return {
          value: angular.lowercase(suggestion),
          display: suggestion
        };
      });
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
  };

  angular.module('frontend.core.directives')
    .directive('mdMultiSelect', function(){
      return {
        restrict: 'E',
        scope: {
          msItems: '=',
          msSuggestions: '=',
          msMax: '=',
          msStatic: '=',
          msLabelPrefix: '=',
          msTemplate: '=',
          msParams: '='
        },
        link: MultiSelectLink,
        templateUrl: '/frontend/core/directives/multiSelect/multiSelect.html',        
      };
    });

}());
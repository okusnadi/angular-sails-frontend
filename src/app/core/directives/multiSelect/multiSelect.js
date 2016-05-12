
(function () {

  'use strict';

  angular.module('frontend.core.directives')
    .directive('mdMultiSelect', ['$sce',
      function ($sce) {
        return {
          restrict: 'E',
          scope: {
            msItems: '=',
            msSuggestions: '=',
            msMax: '=',
            msStatic: '=',
            msLabelPrefix: '@',
            msTemplate: '@',
            msParams: '='
          },
          templateUrl: '/frontend/core/directives/multiSelect/multiSelect.html',
//          compile: function (element, attrs) {
//            return {
//              pre: function (scope, element, attrs) {
//                console.log('PRE!');
//                console.log(element[0].querySelector('.ms-container'));
//              },
//              post: function MultiSelectLink(scope, element, attr) {
              link: function MultiSelectLink(scope, element, attr) {

                console.log(scope);
                
//                if (angular.isDefined(scope.msTemplate)) {
//                  scope.msTemplate = $sce.trustAsHtml(scope.msTemplate);
//                }

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
              }
              
            };
          }

      ]);

}());
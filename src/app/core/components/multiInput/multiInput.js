
(function () {

    'use strict';

    function MultiInputController($scope, $element, $attrs) {

        var ctrl = this;
        ctrl.suggestions = loadAll();
        
        if( !angular.isDefined(ctrl.miItems.length) || ctrl.miItems.length < 1 ) {
            ctrl.miItems = [{value:''}];
        }

        ctrl.addField = function (index) {
            if (!angular.isDefined(ctrl.miMax) || ctrl.miItems.length < ctrl.miMax) {
                ctrl.miItems.splice(index + 1, 0, {value: ''});
            }
        };
        ctrl.deleteField = function (index) {
            if (ctrl.miItems.length > 1) {
                ctrl.miItems.splice(index, 1);
            }
        };

        ctrl.querySearch = function (query, item) {
            var result = query ? ctrl.suggestions.filter(createFilterFor(query)) : ctrl.suggestions;
            return result;
        };
        
        function loadAll() {
            if( !angular.isDefined(ctrl.miSuggestions) ) {
                return [];
            }
            return ctrl.miSuggestions.split(/, +/g).map(function (suggestion) {
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

    angular.module('frontend.core.components')
            .component('mdMultiInput', {
                controller: MultiInputController,
                templateUrl: '/frontend/core/components/multiInput/multiInput.html',
                bindings: {
                    miItems: '=',
                    miSuggestions: '<?',
                    miMax: '<?',
                    miStatic: '<?'
                }
            });

}());
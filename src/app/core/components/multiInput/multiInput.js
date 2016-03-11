
(function () {

    'use strict';

    function MultiInputController($scope, $element, $attrs) {

        var ctrl = this;
        ctrl.suggestions = loadAll();
        ctrl.searchText = '';

        console.log(this.suggestions);

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

        ctrl.querySearch = function (query) {
            console.log(query);
            var result = query ? ctrl.suggestions.filter(createFilterFor(query)) : ctrl.suggestions;
            console.log(result);
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
//        require: { 
//            parentForm: '^form'
//        },
                bindings: {
                    miItems: '=',
                    miSuggestions: '=?',
                    miMax: '<?'
                }
            });

}());
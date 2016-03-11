

(function() {
  'use strict';

    angular.module('frontend.core.components')
            .component('mdMultiInput', {
        controller: function() {
            console.log(this.parentForm);
        },
        templateUrl: '/frontend/core/components/multiInput/multiInput.html',
        require: { 
            parentForm: '^form'
        },
        bindings: {
            items: '='
        }
    });

}());
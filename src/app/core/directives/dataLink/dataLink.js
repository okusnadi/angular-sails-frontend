
(function () {

  'use strict';

  angular.module('frontend.core.components').directive('ccDataLink', [
    function ccDataLinkController() {
      return {
        restrict: 'E',
        templateUrl: '/frontend/core/directives/dataLink/dataLink.html',
        scope: {
          dlCategory: '@',
          dlField: '@'
        },
        link: function (scope) {
          console.log('DATA LINK!', scope.$parent);
        }
      };

    }]);

}());
// Simple filters to be used in the application
(function () {
  'use strict';

  angular.module('frontend.core.filters')
    .filter('$trustedHtml', function ($sce) {
      return $sce.trustAsHtml;
    })

    .filter('isObjectEmpty', function () {
      var bar;
      return function (obj) {
        for (bar in obj) {
          if (obj.hasOwnProperty(bar)) {
            return false;
          }
        }
        return true;
      };
    })

    ;
}());

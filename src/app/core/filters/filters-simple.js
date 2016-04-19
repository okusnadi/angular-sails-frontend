// Simple filters to be used in the application
(function() {
  'use strict';

  angular.module('frontend.core.filters')
    .filter('$trustedHtml', function($sce) {
      return $sce.trustAsHtml;
  })
  ;
  
}());

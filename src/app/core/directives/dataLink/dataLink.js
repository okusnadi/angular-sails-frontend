
(function () {

  'use strict';

  angular.module('frontend.core.components').directive('ccDataLink', [
    '_', 'mceService',
    function ccDataLinkController(_, mceService) {
      return {
        restrict: 'E',
        templateUrl: '/frontend/core/directives/dataLink/dataLink.html',
        scope: {
          dlCategory: '@',
          dlField: '@'
        },
        link: function (scope) {
          
          var model = _.findWhere(mceService.getDataLinks(),{ label:scope.dlCategory });

          if( angular.isDefined(scope.$parent[model.entity]) ) {
            scope.dataLink = scope.$parent[model.entity][scope.dlField];            
          }
          
          if( !scope.dataLink && angular.isDefined(mceService.scope[model.entity]) ) {
            scope.dataLink = mceService.scope[model.entity][scope.dlField];                        
          }
        }
      };

    }]);

}());
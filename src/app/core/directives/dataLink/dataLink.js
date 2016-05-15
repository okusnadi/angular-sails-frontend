
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
          dlField: '@',
          dlEditable: '@'
        },
        link: function (scope, element, attrs) {
          scope.disabledEdit = true;
          var model = _.findWhere(mceService.getDataLinks(),{ label:scope.dlCategory });

          if( angular.isDefined(scope.$parent[model.entity]) ) {
            scope.dataLink = scope.$parent[model.entity][scope.dlField];            
          }          
          if( !scope.dataLink && angular.isDefined(mceService.scope[model.entity]) ) {
            scope.dataLink = mceService.scope[model.entity][scope.dlField];                        
          }
          if( !scope.dataLink ) {
            scope.dataLink = '[Undefined-' + scope.dlCategory + '.' + scope.dlField+']';
          }          
          scope.editClick = function editClick(event) {
            angular.element(element[0]).find('input').focus();
            scope.disabledEdit = false;
          };
          scope.editBlur = function editBlur(event) {
            console.log('Disabled');
            scope.disabledEdit = true;
          };
        }
      };

    }]);

}());
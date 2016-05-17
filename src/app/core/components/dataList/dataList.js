(function () {

  'use strict';

  function DataListController(
    $element, $attrs, $rootScope
    ) {

    var ctrl = this;
    
    angular.merge(ctrl.dlDataProvider.query, { searchWord: '' });

    ctrl.onRowClick = function onRowClick(event, item) {
      if (angular.isDefined(ctrl.dlSelected)) {
        var hasClassFlag = angular.element(event.currentTarget).hasClass('md-selected');
        angular.element(event.currentTarget).closest('table').find('.md-selected').removeClass('md-selected');
        if( hasClassFlag ) {
          ctrl.dlSelected = null;
        }
        else {
          ctrl.dlSelected = item;
          angular.element(event.currentTarget).addClass('md-selected');
        }
      }
    };

  }

  angular.module('frontend.core.components')
    .component('ccDataList', {
      controller: [
        '$element', '$attrs', '$rootScope',
        DataListController
      ],
      templateUrl: '/frontend/core/components/dataList/dataList.html',
      bindings: {
        dlSelected: '=',
        dlTitle: '<?',
        dlDataProvider: '='
      }

    });


})();

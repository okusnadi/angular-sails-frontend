(function () {

  'use strict';

  function DataListController(
    $element, $attrs, $rootScope, DataProvider
    ) {

    var ctrl = this;

    if (angular.isUndefined(ctrl.dlDataModel)) {
      console.error('Please specify DataModel!');
    }
    ctrl.dlDataModel.setScope($rootScope.$new(), false, 'items', 'itemCount');

    ctrl.query = {
      searchWord: ''
    };
    if (angular.isDefined(ctrl.dlQueryParams)) {
      angular.merge(ctrl.query, ctrl.dlQueryParams);
    }
    ctrl.dataProvider = new DataProvider(ctrl.dlDataModel, ctrl.query);

    ctrl.removeFilter = function () {
      ctrl.showFilter = false;
      ctrl.query.searchWord = '';

      if (ctrl.filterForm.$dirty) {
        ctrl.filterForm.$setPristine();
      }
    };

    ctrl.onRowClick = function onRowClick(event, item) {
      ctrl.dlSelected = item;
      angular.element(event.currentTarget).closest('table').find('.md-selected').removeClass('md-selected');
      angular.element(event.currentTarget).addClass('md-selected');
    };

  }

  angular.module('frontend.core.components')
    .component('ccDataList', {
      controller: [
      '$element', '$attrs', '$rootScope', 'DataProvider',
      DataListController
    ],
      templateUrl: '/frontend/core/components/dataList/dataList.html',
      bindings: {
        dlDataModel: '=',
        dlSelected: '=',
        dlQueryParams: '=?',
        dlTitle: '<?'
      }

    });


})();

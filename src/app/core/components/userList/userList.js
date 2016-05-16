(function () {

    'use strict';

    function UserListController($scope, $element, $attrs, $rootScope, UserModel, DataProvider) {

        var ctrl = this;

        UserModel.setScope($rootScope.$new(), false, 'items', 'itemCount');
        
        ctrl.query = {
          order: 'username',
          searchWord: '',
          selected: []
        };
        ctrl.dataProvider = new DataProvider(UserModel, ctrl.query);

        ctrl.removeFilter = function () {
          ctrl.showFilter = false;
          ctrl.query.searchWord = '';

          if (ctrl.filterForm.$dirty) {
            ctrl.filterForm.$setPristine();
          }
        };
        
        ctrl.onRowClick = function onRowClick( event, item ) {
          console.log('ROW ', event, item);
          var row = angular.element(event.currentTarget);
          console.log(row);
          row.addClass('md-selected');
//            .addClass('md-selected');
        };

    }

    angular.module('frontend.core.components')
      .component('ccUserList', {
          controller: UserListController,
          templateUrl: '/frontend/core/components/userList/userList.html',
          bindings: {
            
          }

      });


})();

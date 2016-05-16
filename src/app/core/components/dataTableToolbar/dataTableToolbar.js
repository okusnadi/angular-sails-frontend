(function () {

    'use strict';
    
    function dataTableToolbar($scope) {
        
        var ctrl =this;
        
        ctrl.showFilter = false;
        
        if (angular.isUndefined(ctrl.searchBar)) {
            ctrl.searchBar = true;
        }
        if (angular.isUndefined(ctrl.toolbarClass)) {
            ctrl.toolbarClass = 'md-default';
        }
        if (angular.isUndefined(ctrl.buttons)) {
            ctrl.buttons = [];
        }
        
        ctrl.onSearchChange = function onSearchChange() {
          if( angular.isDefined(ctrl.ttSearchChange) ) {
            ctrl.ttSearchChange()();
          }
        };
        
        ctrl.startFilter = function(event){
          ctrl.showFilter = true;  
          event.stopPropagation(); setTimeout(function () {
            $('#table-filter').focus();
        }, 200);  
        };
        
        ctrl.removeFilter = function(){
           ctrl.showFilter = false;
           ctrl.query.searchWord = '';
        };
    }

    angular.module('frontend.core.components')
      .component('raDataTableToolbar', {
          controller: dataTableToolbar,
          templateUrl: '/frontend/core/components/dataTableToolbar/dataTableToolbar.html',
          bindings: {
              query:'<',
              tableTitle: '<?',
              toolbarClass: '<?',
              toolbarBtns: '<?', //format [ {btnTitle: value, btnIcon:value,btnTooltip:val, btnAction:value } ]
              toolbarSelectedBtns: '<?', //show when rows are selected. same format as toolBarBtns ]
              searchBar: '<?', //defaults to TRUE
              ttSearchChange: '&?' // called when search box change
          }

      });

})();

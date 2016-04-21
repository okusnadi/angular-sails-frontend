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
        
        ctrl.startFilter = function(event){
          ctrl.showFilter = true;  
          event.stopPropagation(); setTimeout(function () {
            $('#table-filter').focus();
        }, 200);  
        };
        
        ctrl.removeFilter = function(){
           ctrl.showFilter = false;
           ctrl.query.searchWord = '';
           
        }
        
        
        
    }

    angular.module('frontend.core.components')
      .component('raDataTableToolbar', {
          controller: dataTableToolbar,
          templateUrl: '/frontend/core/components/dataTableToolbar/dataTableToolbar.html',
          bindings: {
              option1: '<?',
              option2: '<?',
              tableTitle: '<?',
              toolbarClass: '<?',
              toolbarBtns: '<?', //format [ {btnTitle: value, btnIcon:value,btnTooltip:val, btnAction:value } ]
              toolbarSelectedBtns: '<?', // buttons to show when rows are selected. same format as buttons ]
              searchBar: '<?', //defaults to TRUE
              query:'<'
          }

      });

})();

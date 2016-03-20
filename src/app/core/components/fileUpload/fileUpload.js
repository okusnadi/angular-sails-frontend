( function() {
    
    'use strict';
    
    function FileUploadController( $scope, $element, $attrs, fileUploadService ) {

        var ctrl = this;
        ctrl.file = '';
        
        console.log(fileUploadService);
        
        $element.find('#fileInput').on('change', function(e){
            ctrl.file = angular.isDefined(e.target.files[0])?e.target.files[0].name:null;
        });
        
        ctrl.inputClicked = function() {
            $element.find('#fileInput').click();
        };
        
    }
    
    angular.module('frontend.core.components')
      .component('mdFileUpload', {
            controller: FileUploadController,
            templateUrl: '/frontend/core/components/fileUpload/fileUpload.html'
            
    });
       
    
})();

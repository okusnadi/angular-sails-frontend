(function () {

    'use strict';

    function FileUploadController($scope, $element, $attrs, fileUploadService) {

        var ctrl = this;

        console.log(ctrl.fuAcceptedFiles);
        
        if( angular.isUndefined(ctrl.fuFileName) ) {
            ctrl.fuFileName = 'filesToUpload';
        }
        if( angular.isUndefined(ctrl.fuPayload) ) {
            ctrl.fuPayload = [];
        }
        if( angular.isUndefined(ctrl.fuUploadUrl) ) {
            throw new Error('Please specify fu-upload-url attribute!');
        }

        $element.find('#fileInput').on('change', function (e) {
            ctrl.file = angular.isDefined(e.target.files[0]) ? e.target.files[0] : null;
        });

        ctrl.inputClicked = function () {
            $element.find('#fileInput').click();
        };

        ctrl.uploadClicked = function () {
            fileUploadService.toUrl($element.find('#fileInput')[0].files, ctrl.fuPayload, ctrl.fuFileName, ctrl.fuUploadUrl);
        };
    }

    angular.module('frontend.core.components')
      .component('mdFileUpload', {
          controller: FileUploadController,
          templateUrl: '/frontend/core/components/fileUpload/fileUpload.html',
          bindings: {
              fuFileName: '<?',
              fuPayload: '<?',
              fuAcceptedFiles: '<?',
              fuUploadUrl: '<'
          }

      });


})();

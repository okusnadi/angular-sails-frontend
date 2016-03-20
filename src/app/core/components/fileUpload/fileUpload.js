(function () {

    'use strict';

    function FileUploadController($scope, $element, $attrs, fileUploadService) {

        var ctrl = this;

        if( angular.isUndefined(ctrl.fuFileName) ) {
            ctrl.fuFileName = 'file';
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
            fileUploadService.toUrl(ctrl.file, ctrl.fuFileName, ctrl.fuUploadUrl);
        };
    }

    angular.module('frontend.core.components')
      .component('mdFileUpload', {
          controller: FileUploadController,
          templateUrl: '/frontend/core/components/fileUpload/fileUpload.html',
          bindings: {
              fuFileName: '<?',
              fuUploadUrl: '<'
          }

      });


})();

( function() {
    'use strict';
    angular.module('frontend.core.components')
      .service( 'fileUploadService', [
        '$http',
        function($http){
            this.toUrl = function( files, payload, uploadName, url ) {
                var fd = new FormData();
                angular.forEach(files, function(file) {
                    fd.append( uploadName, file );
                });
                
                angular.forEach(payload, function(value, name) {
                    fd.append( name, value );
                });
                
                return $http.post( url, fd, {
                    transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
                });
//                  .then ( function success(response) {
//                    return response;
//                }, function error(error) {
//                    return error;
//                }
//                  );
            };
        }
      ] 
    );
    
})();


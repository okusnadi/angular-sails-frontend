( function() {
    'use strict';
    angular.module('frontend.core.services')
      .service( 'FileUpload', [
        '$http',
        function($http){
            this.toUrl = function( file, url ) {
                var fd = new FormData();
                fd.append('file', file );
                
                $http.post( url, fd, {
                    transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
                }).then ( function success(response) {
                    return response;
                }, function error(response) {
                    return response;
                }
                  );
            };
        }
      ] 
    );
    
})();


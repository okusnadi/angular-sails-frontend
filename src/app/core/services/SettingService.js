/**
 * This file contains generic model factory that will return a specified model instance for desired endpoint with
 * given event handlers. Basically all of this boilerplate application individual models are using this service to
 * generate real model.
 */
(function () {
    'use strict';

    angular.module('frontend.core.services')
      .service('SettingService', function (
            $log, $q, _
            ) {

            console.log('DUPA!!!');
            var settings = [];
            
            this.getSetting = function getSetting(type) {
            };
            

          });
}());

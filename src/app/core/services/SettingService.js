/**
 * This file contains generic model factory that will return a specified model instance for desired endpoint with
 * given event handlers. Basically all of this boilerplate application individual models are using this service to
 * generate real model.
 */
(function () {
    'use strict';

    angular.module('frontend.core.services')
      .service('SettingService', function (
            $log, $q, _,
            SettingModel
            ) {

            var settings = [];
                        
            this.checkMapping = function getSetting(type) {
              return settings[type];
            };
            
            this.getSetting = function getSetting(type) {
              if( angular.isDefined(settings[type])) {
                return settings[type];
              }
              return SettingModel.load({ where: { type: type } })
                .then( function onSuccess(response) {
                  settings[type] = $q.resolve(response[0]);
                  return settings[type];                  
              });

            };
            
            // get all settings
            this.getAllSettings = function getAllSettings() {
              return settings;
            };
            
            // persist specific type of setting to the backend
            this.persist = function persist(type) {
              return SettingModel.update(settings[type].id, settings[type] );
            };
            

          });
}());

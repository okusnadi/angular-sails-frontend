/**
 * This file contains generic model factory that will return a specified model instance for desired endpoint with
 * given event handlers. Basically all of this boilerplate application individual models are using this service to
 * generate real model.
 */
(function () {
    'use strict';

    angular.module('frontend.core.services')
      .service('UserStatusService', [
            '$q', 'UserStatusModel', 'UserService',
            function (
            $q, UserStatusModel, UserService
            ) {

            // record chamge of current user status
            this.saveStatus = function saveStatus(type) {              
              return UserStatusModel.create( { type:type, user: UserService.user() } );
            };
            

          }]);
}());

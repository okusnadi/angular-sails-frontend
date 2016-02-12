/**
 * This file contains all necessary Angular model definitions for 'frontend.admin.user' module.
 *
 * Note that this file should only contain models and nothing else. Also note that these "models" are just basically
 * services that wraps all things together.
 */
(function () {
  'use strict';

  /**
   * Model for User API, this is used to wrap all User objects specified actions and data change actions.
   */
  angular.module('frontend.admin.user')
    .factory('UserModel', [
      'DataModel',
      function factory(DataModel) {
        return new DataModel('user');
      }
    ])
  ;
}());

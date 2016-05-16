/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.userStatus' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';



  // Controller which contains all necessary logic for client list GUI on boilerplate application.
  angular.module('frontend.admin.userStatus')
    .controller('UserStatusListController', [
      '$scope', '$q', '$timeout', '$mdDialog',
      '_',
      'ListConfig', 'ClientModel',
      'DataProvider',
      function controller(
        $scope, $q, $timeout, $mdDialog,
        _,
        ListConfig, ClientModel,
        DataProvider
        ) {
        // Set current scope reference to models
        ClientModel.setScope($scope, false, 'items', 'itemCount');

        $scope.query = {
          order: 'name',
          searchWord: '',
          populate: ['campaigns']
        };

        $scope.dataProvider = new DataProvider(ClientModel, $scope.query);

        var searchWordTimer;

        $scope.$watch('query.searchWord', function watcher(valueNew, valueOld) {
          if (valueNew !== valueOld) {
            if (searchWordTimer) {
              $timeout.cancel(searchWordTimer);
            }

            searchWordTimer = $timeout($scope.dataProvider.triggerFetchData, 400);
          }
        }, true);

      }
    ])


    // Controller for new client creation.
//  angular.module('frontend.admin.userStatus')
//    .controller('ClientAddController', [
//      '$scope', '$state',
//      'MessageService',
//      'ClientModel',
//      ClientAddController
//    ])
//    ;

    // Controller to show single client on GUI.
//  angular.module('frontend.admin.userStatus')
//    .controller('ClientController',
//      [
//        '$scope', '$state',
//        '$mdDialog',
//        'UserService', 'MessageService',
//        'ClientModel', 'CampaignModel',
//        '_client',
//        ClientEditController
//      ])
//    ;


    ;
}());

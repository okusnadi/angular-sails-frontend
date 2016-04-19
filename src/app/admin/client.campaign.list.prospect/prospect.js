/**
 * Prospect component to wrap all prospect specified stuff together. This component is divided to following logical components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.admin.client.prospect.prospect' angular module.
 */
(function () {
  'use strict';
  // Define frontend.admin.client.prospect.prospect angular module
  angular.module('frontend.admin.client.campaign.list.prospect', [
    'textAngular'
  ]);
  // Module configuration
  angular.module('frontend.admin.client.campaign.list.prospect')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          // Prospect prospect
          .state('prospects', {
            parent: 'list',
            url: '/prospects',
            resolve: {
              _globalFields: function resolve(SettingModel) {
                return SettingModel.load({
                  where: {
                    type: 'FIELDS'
                  }
                });
              },
              _prospects: function resolve(ProspectModel, _list) {
                return ProspectModel.load({
                  where: {
                    list: _list.id
                  },
                  limit: 5
                });
              },
              _count: [
                'ProspectModel', '_list',
                function resolve(ProspectModel, _list) {
                  return ProspectModel.count({
                    where: {
                      list: _list.id
                    }
                  });
                }
              ]
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client.campaign.list.prospect/prospect-list.html',
                controller: 'ProspectListController'
              }
            }
          })
          ;
      }
    ])
    ;
}());

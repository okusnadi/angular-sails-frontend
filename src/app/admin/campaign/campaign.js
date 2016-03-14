/**
 * Campaign component to wrap all campaign specified stuff together. This component is divided to following logical components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.admin.client.campaign' angular module.
 */
(function() {
  'use strict';

  // Define frontend.admin.client.campaign angular module
  angular.module('frontend.admin.client.campaign', []);

  // Module configuration
  angular.module('frontend.admin.client.campaign')
    .config([
      '$stateProvider',
      function config($stateProvider) {
          console.log($stateProvider);
        $stateProvider
          // Campaign list
          .state('admin.client.campaigns', {
            url: '/campaigns',
            views: {
              'content@': {
                templateUrl: '/frontend/admin/campaign/campaign-list.html',
                controller: 'CampaignListController',
                resolve: {
                  _items: [
                    'ListConfig',
                    'CampaignModel',
                    function resolve(
                      ListConfig,
                      CampaignModel
                    ) {
                      var config = ListConfig.getConfig();

                      var parameters = {
                        populate: 'lists',
                        limit: config.itemsPerPage,
                        sort: 'name ASC'
                      };

                      return CampaignModel.load(parameters);
                    }
                  ],
                  _count: [
                    'CampaignModel',
                    function resolve(CampaignModel) {
                      return CampaignModel.count();
                    }
                  ],
                  _lists: [
                    'ListModel',
                    function resolve(ListModel) {
                      return ListModel.load();
                    }
                  ]
                }
              }
            }
          })

          // Single campaign
          .state('admin.client.campaign', {
            url: '/campaign/:id',
            views: {
              'content@': {
                templateUrl: '/frontend/admin/campaign/campaign.html',
                controller: 'CampaignController',
                resolve: {
                  _campaign: [
                    '$stateParams',
                    'CampaignModel',
                    function resolve(
                      $stateParams,
                      CampaignModel
                    ) {
                      return CampaignModel.fetch($stateParams.id, {populate: 'lists'});
                    }
                  ],
                  _lists: [
                    'ListModel',
                    function resolve(ListModel) {
                      return ListModel.load();
                    }
                  ]                  
                }
              }
            }
          })

          // Add new campaign
          .state('admin.client.campaign.add', {
            url: '/add',
            data: {
              access: 2
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/campaign/campaign.html',
                controller: 'CampaignAddController',
                resolve: {
                  _lists: [
                    'ListModel',
                    function resolve(ListModel) {
                      return ListModel.load();
                    }
                  ]
                }
              }
            }
          })
        ;
      }
    ])
  ;
}());

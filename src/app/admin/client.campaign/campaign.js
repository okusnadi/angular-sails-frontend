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
  angular.module('frontend.admin.client.campaign', [
      'frontend.admin.client.campaign.emailTemplate',
      'frontend.admin.client.campaign.script',
      'frontend.admin.client.campaign.list'
  ]);

  // Module configuration
  angular.module('frontend.admin.client.campaign')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          // Campaign list
          .state('campaigns', {
            parent: 'admin.client',
            url: '/campaigns',
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client.campaign/campaign-list.html',
                controller: 'CampaignListController',
                resolve: {
                  _items: [
                    'ListConfig',
                    'CampaignModel',
                    '_client',
                    function resolve(
                      ListConfig,
                      CampaignModel,
                      _client
                    ) {
                      var config = ListConfig.getConfig();

                      var parameters = {
                        populate: ['lists', 'emailTemplates', 'scripts'],
                        limit: config.itemsPerPage,
                        sort: 'name ASC',
                        where: { 
                            client: _client.id
                        }
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
          .state('campaign', {
            parent: 'admin.client',
            url: '/campaign/:campaignId',
            resolve: {
                _campaign: [
                    '$stateParams',
                    'CampaignModel',
                    function resolve(
                      $stateParams,
                      CampaignModel
                    ) {
                      return CampaignModel.fetch($stateParams.campaignId, {populate: 'lists'});
                    }
                  ]
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client.campaign/campaign.html',
                controller: 'CampaignController',
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

          // Add new campaign
          .state('campaign.add', {
//            parent: 'admin.client',
            url: '/add',
            data: {
              access: 2
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client.campaign/campaign.html',
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

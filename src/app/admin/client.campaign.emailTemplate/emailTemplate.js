/**
 * EmailTemplate component to wrap all emailTemplate specified stuff together. This component is divided to following logical components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.admin.client.emailTemplate.emailTemplate' angular module.
 */
(function() {
  'use strict';

  // Define frontend.admin.client.emailTemplate.emailTemplate angular module
  angular.module('frontend.admin.client.campaign.emailTemplate', [
      'textAngular'
  ]);

  // Module configuration
  angular.module('frontend.admin.client.campaign.emailTemplate')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          // EmailTemplate list
          .state('emailTemplates', {
            parent: 'campaign',
            url: '/emailTemplates',
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client.campaign.emailTemplate/emailTemplate-list.html',
                controller: 'EmailTemplateListController',
                resolve: {
                  _items: [
                    'ListConfig',
                    'EmailTemplateModel',
                    '_campaign',
                    function resolve(
                      ListConfig,
                      EmailTemplateModel,
                      _campaign
                    ) {
                      var config = ListConfig.getConfig();

                      var parameters = {
                        limit: config.itemsPerPage,
                        sort: 'name ASC',
                        where: { 
                            campaign: _campaign.id
                        }
                      };

                      return EmailTemplateModel.load(parameters);
                    }
                  ],
                  _count: [
                    'EmailTemplateModel',
                    function resolve(EmailTemplateModel) {
                      return EmailTemplateModel.count();
                    }
                  ]
                }
              }
            }
          })

          // Single emailTemplate
          .state('emailTemplate', {
            parent: 'campaign',
            url: '/emailTemplate/:emailTemplateId',
            resolve: {
                _emailTemplate: [
                    '$stateParams',
                    'EmailTemplateModel',
                    function resolve(
                      $stateParams,
                      EmailTemplateModel
                    ) {
                      return EmailTemplateModel.fetch($stateParams.emailTemplateId);
                    }
                  ]
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client.campaign.emailTemplate/emailTemplate.html',
                controller: 'EmailTemplateController',
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

          // Add new emailTemplate
          .state('emailTemplate.add', {
//            parent: 'admin.client',
            url: '/add',
            data: {
              access: 2
            },
            views: {
              'content@': {
                templateUrl: '/frontend/admin/client.campaign.emailTemplate/emailTemplate.html',
                controller: 'EmailTemplateAddController',
                resolve: {
                }
              }
            }
          })
        ;
      }
    ])
  ;
}());

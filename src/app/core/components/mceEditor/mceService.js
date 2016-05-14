
(function () {

  'use strict';

  angular.module('frontend.core.components')
    .service('mceService', [
      '$compile', '$rootScope', 'SettingService', '_',
      function ($compile, $rootScope, SettingService, _) {

        var self = this;
        self.scope = angular.extend($rootScope.$new(), this);

        SettingService.getSetting('FIELDS')
          .then(
            function onSuccess(response) {
              var globalLinks = {
                label: 'Prospect',
                links: _.map(response.settings, function (obj) {
                  return {
                    label: obj.name,
                    field: obj.key,
                    type: obj.type
                  };
                })
              };
              dataLinks.push(globalLinks);
            });

        this.getDataLinks = function getDataLinks() {
          return dataLinks;
        };

        this.getOptions = function getOptions() {
          return tinymceOptions;
        };

        this.getActiveEditor = function getActiveEditor() {
          return tinymce.EditorManager.activeEditor;
        };

        this.compileElement = function compileElement(element) {
          return $compile(element)(self.scope);
        };

        this.selectField = function () {
          $mdDialog.show({
            controller: [
              function () {

              }
            ],
            locals: {
              node: node,
            },
            resolve: {
              _emailTemplates: ['EmailTemplateModel',
                function resolve(EmailTemplateModel) {
                  return EmailTemplateModel.load({
                    sort: 'name ASC',
                    where: {campaign: self.campaignId}
                  });
                }
              ],
              _statuses: ['SettingModel',
                function resolve(SettingModel) {
                  return SettingModel.load({
                    where: {type: 'STATUSES'}
                  });
                }
              ]
            },
            templateUrl: '/frontend/admin/client.campaign.script/script-action.html',
            targetEvent: event,
            clickOutsideToClose: true
          });

        };

        var tinymceOptions = {
          height: 300,
          plugins: 'link image code example noneditable',
          toolbar: 'example | undo redo | bold italic | alignleft aligncenter alignright | code',
          extended_valid_elements: "cc-data-link[class|dl-category|dl-field]",
          custom_elements: "~cc-data-link"
        };

        var dataLinks = [
          {
            label: 'Client',
            links: [
              {
                label: 'Name',
                field: 'name',
                type: 'string'
              },
              {
                label: 'Primary e-mail',
                field: 'email1',
                type: 'email'
              },
              {
                label: 'Secondary e-mail',
                field: 'email2',
                type: 'email'
              },
              {
                label: 'Primary phone',
                field: 'phone1',
                type: 'string'
              },
              {
                label: 'Secondary phone',
                field: 'phone2',
                type: 'string'
              }
            ]
          },
          {
            label: 'Campaign',
            links: [
              {
                label: 'Name',
                field: 'name',
                type: 'string'
              },
              {
                label: 'E-mails',
                field: ['name', 'email'],
                type: 'array'
              },
              {
                label: 'Org Units',
                field: ['label'],
                type: 'array'
              }
            ]
          },
          {
            label: 'List',
            links: [
              {
                label: 'Name',
                field: 'name',
                type: 'string'
              }
            ]
          },
          {
            label: 'Operator',
            links: [
              {
                label: 'Name',
                field: 'firstName',
                type: 'string'
              }
            ]
          }
        ];

      }]);

// please rememebr to inject mceService into controller using <mce-editor> !!!!
  window.getMceService = function getMceService() {
    return angular.element('mce-editor').scope().mceService;
  };


}());
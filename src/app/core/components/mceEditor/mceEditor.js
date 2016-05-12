
(function () {

  'use strict';

  angular.module('frontend.core.components', []);

  angular.module('frontend.core.components').component('mceEditor', {
    templateUrl: '/frontend/core/mceEditor/mceEditor.html',
    bindings: {
      mceOptions: '=',
      mceModel: '='
    },
    controller: function () {
      var ctrl = this;
      console.log(ctrl);
    }
  });

  angular.module('frontend.core.components').service('mceService',
    function () {
      var customFields = {
        client: {
          name: {
            label: 'Name',
            field: 'name',
            type: 'string'
          },
          email1: {
            label: 'Primary e-mail',
            field: 'email1',
            type: 'email'
          },
          email2: {
            label: 'Secondary e-mail',
            field: 'email2',
            type: 'email'
          },
          phone1: {
            label: 'Primary phone',
            field: 'phone1',
            type: 'string'
          },
          phone2: {
            label: 'Secondary phone',
            field: 'phone2',
            type: 'string'
          }
        },
        campaign: {
          name: {
            label: 'Name',
            field: 'name',
            type: 'string'
          },
          contacts: {
            label: 'E-mails',
            field: ['name', 'email'],
            type: 'array'
          },
          orgUnits: {
            label: 'Org Units',
            field: ['label'],
            type: 'array'
          }
        },
        list: {
          name: {
            label: 'Name',
            field: 'name',
            type: 'string'
          }
        },
        operator: {
          firstName: {
            label: 'Name',
            field: 'firstName',
            type: 'string'
          }
        }
      };

      this.selectField = function () {
        $mdDialog.show({
          controller: [
            function() {
              
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
    });

// please rememebr to inject mceService into controller using <mce-editor> !!!!
  function getMceService() {
    return angular.element('mce-editor').scope().mceService;
  }

//console.log(angular.module('frontend.core.mcePlugins').controller('McePluginController'));

  tinymce.PluginManager.add('example', function (editor, url) {
    // Add a button that opens a window
    editor.addButton('example', {
      text: 'Add custom field',
      icon: false,
      onclick: function () {
        getMceService().getName();
        // Open window
        editor.windowManager.open({
          title: 'Example plugin',
          body: [
            {type: 'textbox', name: 'title', label: 'Title'}
          ],
          onsubmit: function (e) {
            // Insert content when the window form is submitted
            editor.insertContent('Title: ' + e.data.title);
          }
        });
      }
    });

    // Adds a menu item to the tools menu
    editor.addMenuItem('example', {
      text: 'Example plugin',
      context: 'tools',
      onclick: function () {
        // Open window with a specific url
        editor.windowManager.open({
          title: 'TinyMCE site',
          url: 'http://www.tinymce.com',
          width: 800,
          height: 600,
          buttons: [{
              text: 'Close',
              onclick: 'close'
            }]
        });
      }
    });
  });

}());
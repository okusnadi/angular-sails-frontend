
(function () {

  'use strict';

//  angular.module('frontend.core.components', []);

  angular.module('frontend.core.components').component('mceEditor', {
    templateUrl: '/frontend/core/components/mceEditor/mceEditor.html',
    bindings: {
      mceOptions: '=',
      mceModel: '='
    },
    controller: ['mceService', function (mceService) {
      var ctrl = this;
      
      ctrl.dataLinks = mceService.getDataLinks();
      console.log(ctrl);
    }]
  });

  angular.module('frontend.core.components').service('mceService',
    function () {
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

      this.getDataLinks = function getDataLinks() {
        return dataLinks;
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
    });

// please rememebr to inject mceService into controller using <mce-editor> !!!!
  function getMceService() {
    return angular.element('mce-editor').scope().mceService;
  }

//console.log(angular.module('frontend.core.mcePlugins').controller('McePluginController'));

  tinymce.PluginManager.add('example', function (editor, url) {
    // Add a button that opens a window
    editor.addButton('example', {
      type: 'menubutton',
      text: 'Add custom field',
      icon: false,
      menu: [
        {text: 'Menu item 1',
          menu: [
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
            {text: 'Menu item 1'},
          ]
        },
        {text: 'Menu item 2', onclick: function () {
            editor.insertContent('Menu item 2');
          }}
      ],
//      onclick: function () {

      // Open window
//        editor.windowManager.open({
//          title: 'Example plugin',
//          body: [
//            {type: 'textbox', name: 'title', label: 'Title'}
//          ],
//          onsubmit: function (e) {
//            // Insert content when the window form is submitted
//            editor.insertContent('Title: ' + e.data.title);
//          }
//        });
//      }
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
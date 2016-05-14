
(function () {

  'use strict';

//  angular.module('frontend.core.components', []);

  angular.module('frontend.core.components').component('mceEditor', {
    templateUrl: '/frontend/core/components/mceEditor/mceEditor.html',
    bindings: {
      mceOptions: '=',
      mceModel: '='
    },
    controller: ['mceService','$compile', function (mceService, $compile) {
      var ctrl = this;
      
      ctrl.dataLinks = mceService.getDataLinks();
      ctrl.category = null;
      ctrl.field = null;
      
      ctrl.addDataLink = function addDataLink() {
//        console.log(ctrl.category, ctrl.field);
      var element = mceService.compileElement('<md-button>Menu item 2</md-button>');
        console.log(element);
      mceService.getActiveEditor().insertContent('<md-button>Menu item 2</md-button>');
//        tinymce.Editor.insertContent(ctrl.category.name);
      };
    }]
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
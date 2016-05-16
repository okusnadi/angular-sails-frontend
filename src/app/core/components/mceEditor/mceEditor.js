
(function () {

  'use strict';

//  angular.module('frontend.core.components', []);

  angular.module('frontend.core.components').component('mceEditor', {
    templateUrl: '/frontend/core/components/mceEditor/mceEditor.html',
    bindings: {
//      mceOptions: '=',
      mceModel: '='
    },
    controller: ['mceService', function (mceService) {
      var ctrl = this;
      
      ctrl.dataLinks = mceService.getDataLinks();
      ctrl.mceOptions = mceService.getOptions();
      ctrl.category = null;
      ctrl.field = null;
      
      ctrl.addDataLink = function addDataLink() {      
        mceService.getActiveEditor().insertContent(createDataLink());
        ctrl.category = null;
      };
      
      function createDataLink() {
        return '<cc-data-link class="mceNonEditable" dl-category="'+ 
                ctrl.category.label + '" dl-field="' + 
                ctrl.field.field + '">' +
                ctrl.category.label + '.' + ctrl.field.field + 
                '</cc-data-link>';
      }
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
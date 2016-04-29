/**
 * This file contains generic model factory that will return a specified model instance for desired endpoint with
 * given event handlers. Basically all of this boilerplate application individual models are using this service to
 * generate real model.
 */
(function () {
  'use strict';

  angular.module('frontend.core.services')
    .service('NetworkProvider', [
    '$document','$compile', '$rootScope', '$interpolate',
    function ($document, $compile, $rootScope, $interpolate) {

      var self = this;
      self.menu = null;
      self.network = null;

    
      var groupColours = [
        {border: '#2B7CE9', background: '#97C2FC', highlight: {border: '#2B7CE9', background: '#D2E5FF'}, hover: {border: '#2B7CE9', background: '#D2E5FF'}}, // 0: blue
        {border: '#FFA500', background: '#FFFF00', highlight: {border: '#FFA500', background: '#FFFFA3'}, hover: {border: '#FFA500', background: '#FFFFA3'}}, // 1: yellow
        {border: '#FA0A10', background: '#FB7E81', highlight: {border: '#FA0A10', background: '#FFAFB1'}, hover: {border: '#FA0A10', background: '#FFAFB1'}}, // 2: red
        {border: '#41A906', background: '#7BE141', highlight: {border: '#41A906', background: '#A1EC76'}, hover: {border: '#41A906', background: '#A1EC76'}}, // 3: green
        {border: '#E129F0', background: '#EB7DF4', highlight: {border: '#E129F0', background: '#F0B3F5'}, hover: {border: '#E129F0', background: '#F0B3F5'}}, // 4: magenta
        {border: '#7C29F0', background: '#AD85E4', highlight: {border: '#7C29F0', background: '#D3BDF0'}, hover: {border: '#7C29F0', background: '#D3BDF0'}}, // 5: purple
        {border: '#C37F00', background: '#FFA807', highlight: {border: '#C37F00', background: '#FFCA66'}, hover: {border: '#C37F00', background: '#FFCA66'}}, // 6: orange
        {border: '#4220FB', background: '#6E6EFD', highlight: {border: '#4220FB', background: '#9B9BFD'}, hover: {border: '#4220FB', background: '#9B9BFD'}}, // 7: darkblue
        {border: '#FD5A77', background: '#FFC0CB', highlight: {border: '#FD5A77', background: '#FFD1D9'}, hover: {border: '#FD5A77', background: '#FFD1D9'}}, // 8: pink
        {border: '#4AD63A', background: '#C2FABC', highlight: {border: '#4AD63A', background: '#E6FFE3'}, hover: {border: '#4AD63A', background: '#E6FFE3'}}, // 9: mint

        {border: '#990000', background: '#EE0000', highlight: {border: '#BB0000', background: '#FF3333'}, hover: {border: '#BB0000', background: '#FF3333'}}, // 10:bright red

        {border: '#FF6000', background: '#FF6000', highlight: {border: '#FF6000', background: '#FF6000'}, hover: {border: '#FF6000', background: '#FF6000'}}, // 12: real orange
        {border: '#97C2FC', background: '#2B7CE9', highlight: {border: '#D2E5FF', background: '#2B7CE9'}, hover: {border: '#D2E5FF', background: '#2B7CE9'}}, // 13: blue
        {border: '#399605', background: '#255C03', highlight: {border: '#399605', background: '#255C03'}, hover: {border: '#399605', background: '#255C03'}}, // 14: green
        {border: '#B70054', background: '#FF007E', highlight: {border: '#B70054', background: '#FF007E'}, hover: {border: '#B70054', background: '#FF007E'}}, // 15: magenta
        {border: '#AD85E4', background: '#7C29F0', highlight: {border: '#D3BDF0', background: '#7C29F0'}, hover: {border: '#D3BDF0', background: '#7C29F0'}}, // 16: purple
        {border: '#4557FA', background: '#000EA1', highlight: {border: '#6E6EFD', background: '#000EA1'}, hover: {border: '#6E6EFD', background: '#000EA1'}}, // 17: darkblue
        {border: '#FFC0CB', background: '#FD5A77', highlight: {border: '#FFD1D9', background: '#FD5A77'}, hover: {border: '#FFD1D9', background: '#FD5A77'}}, // 18: pink
        {border: '#C2FABC', background: '#74D66A', highlight: {border: '#E6FFE3', background: '#74D66A'}, hover: {border: '#E6FFE3', background: '#74D66A'}}, // 19: mint

        {border: '#EE0000', background: '#990000', highlight: {border: '#FF3333', background: '#BB0000'}, hover: {border: '#FF3333', background: '#BB0000'}} // 20:bright red
      ];

      var options = {
        height: '600px',
        nodes: {
          shape: 'dot',
          shadow: true
        },
        interaction: {
          navigationButtons:    true,
          selectConnectedEdges: false,
          hover:                true,
          hoverConnectedEdges:  false
        },
        manipulation: {
          enabled: true,
          initiallyActive: true
        },
        groups: {
          'Start': {
            shape: 'dot',
            physics: false,
            color: groupColours[3],
          },
          'End': {
            shape: 'triangle',
            physics: false,
            color: groupColours[2],
          },
          'Script': {
            shape: 'square',
            physics: true,
            color: groupColours[4],
          },
          'Decision': {
            shape: 'dot',
            physics: true,
            color: groupColours[0],
          },
          'Option': {
            shape: 'box',
            physics: true,
            color: groupColours[0],
          }
        }
      };

      var startNodes = [
        {id: 1, label: 'Start', group: 'Start', x: -200, y: 100},
        {id: 2, label: 'Script page 1', group: 'Script'},
        {id: 3, label: 'Decison point 1', group: 'Decision'},
        {id: 999, label: 'End', group: 'End', x: 200, y: 100}
      ];

      var contextMenu = [
        '<ul class="menu">',
        '<li>Read Message</li>',
        '<li>Reply to </li>',
        '<li>Delete Message</li>',
        '</ul>'
      ].join(' ');

      var nodeMenu = [
        '<md-menu>',
        '<span ng-click="$mdOpenMenu($event)"></span>',
        '<md-menu-content>',
        '<md-menu-item><md-button ng-click="doSomething()"><md-icon>create</md-icon>Edit node</md-button></md-menu-item>',
        '<md-menu-item>',
        '<md-menu>',
        '<md-button ng-click="$mdOpenMenu($event)">New</md-button>',
        '<md-menu-content>',
        '<md-menu-item><md-button ng-click="doSomething()"><md-icon>create</md-icon>Edit node</md-button></md-menu-item>',
        '</md-menu-content>',
        '</md-menu>',
        '</md-menu-item>',
        '<md-menu-item><md-button ng-click="doSomething()"><md-icon>delete</md-icon>Delete node</md-button></md-menu-item>',
        '</md-menu-content>',
        '</md-menu>',
      ].join(' ');


      self.getOptions = function getOptions() {
        return options;
      };

      self.getEvents = function getEvents() {
        return events;
      };

      self.getStartNodes = function getStartNodes() {
        return startNodes;
      };

      var beforeDrawing = function (params) {
        self.canvas = angular.element(params.canvas);
        // make sure canvas is not selectable
        self.canvas.attr('tabindex', '-1');
      };

      var closeMenu = function closeMenu() {
        $document.off('click', closeMenu);
        self.menu.remove();
        self.menu = null;
        self.scope.$destroy();
      };

      var renderMenu = function renderMenu(event) {
        self.menuPosition = {x: event.clientX, y: event.clientY};
        self.scope = $rootScope.$new();
        var menu = angular.element($compile(nodeMenu)(self.scope));
        $document.find('body').append(menu);
        menu.css({
          position: 'fixed',
          top: 0,
          left: 0,
          transform: $interpolate('translate({{x}}px, {{y}}px)')({
            x: self.menuPosition.x, y: self.menuPosition.y
          })
        });
        menu.find('span').click();
        self.menu = menu;
        $document.on('click', closeMenu);

      };

      var editedElement;
      
      var onClickEditMode = function onCLickEditMode(event) {
        console.log(event);
        var pos = { x:event.offsetX, y:event.offsetY };
        var edge = self.network.getEdgeAt(pos);
        if( editedElement !== edge ) {
          self.network.disableEditMode();
//          $document.off('click', onClickEditMode);
        }
      };

      
      var onClick = function (params) {
        console.log(params);
        var selection = self.network.getSelection();
        if( selection.edges.length === 1 ) {
          editedElement = selection.edges[0];
          self.network.editEdgeMode();
          $document.off('click', onClickEditMode);
          $document.on('click', onClickEditMode);
        }
      };
      
      var onRightClick = function (params) {
        console.log(params);
        params.event.preventDefault();
        var node = self.network.getNodeAt(params.pointer.DOM);
        var edge = self.network.getEdgeAt(params.pointer.DOM);
        var selection = {
          nodes: angular.isDefined(node) ? [node] : [],
          edges: angular.isUndefined(node) && angular.isDefined(edge) ? [edge] : []
        };
        self.network.setSelection(selection);
        
        if( self.menu !== null ) {
          closeMenu();
        }
        if( node || edge ) {
          renderMenu(event);
        }
      };

      var events = {
        click: onClick,
        oncontext: onRightClick,
        beforeDrawing: beforeDrawing,
      };

    }]);
}());

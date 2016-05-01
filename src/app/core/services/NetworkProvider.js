
(function () {
  'use strict';

  angular.module('frontend.core.services')
    .service('NetworkProvider', [
      '$document', '$compile', '$rootScope', '$interpolate',
      function ($document, $compile, $rootScope, $interpolate) {

        var self = this;
        self.menu = null;
        self.network = null;

        var currentElement;

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
            navigationButtons: true,
            selectConnectedEdges: false,
            hover: true,
            hoverConnectedEdges: false
          },
          manipulation: {
            enabled: true,
            initiallyActive: true
          },
          edges: {
            arrows: {
              to: true
            }
          },
          groups: {
            'Start': {
              shape: 'dot',
              physics: false,
              color: groupColours[3],
              extra: { 
                count: {min: 1, max: 1},
                to: {max: 0},
                from: {min: 1, max: 1}
              }
            },
            'End': {
              shape: 'triangle',
              physics: false,
              color: groupColours[2],
              extra: {
                count: {min: 1},
                to: {},
                from: {max: 0}
              }
            },
            'Script': {
              shape: 'square',
              physics: true,
              color: groupColours[4],
              extra: {
                count: {},
                to: {},
                from: {min: 1, max: 1}
              }
            },
            'Decision': {
              shape: 'dot',
              physics: true,
              color: groupColours[0],
              extra: {
                count: {},
                to: {max: 1},
                from: {min: 1}
              }
            },
            'Option': {
              shape: 'box',
              physics: true,
              color: groupColours[0],
              extra: {
                count: {},
                to: {min: 1, max: 1},
                from: {min: 1, max: 1}
              }
            }
          }
        };

        var startNodes = [
          {id: 1, label: 'Start', group: 'Start', x: -200, y: 100},
          {id: 2, label: 'Script page 1', group: 'Script'},
          {id: 3, label: 'Decison point 1', group: 'Decision'},
          {id: 999, label: 'End', group: 'End', x: 200, y: 100}
        ];

        var nodeMenu = [
          '<md-menu>',
          '<md-button ng-click="$mdOpenMenu($event)"></md-button>',
          '<md-menu-content>',
          '<md-menu-item><md-button ng-click="doSomething()"><md-icon>create</md-icon>Edit node</md-button></md-menu-item>',
          '<md-menu-item><md-button ng-click="addEdgeStart($event)"><md-icon>create</md-icon>Connect to node</md-button></md-menu-item>',
          '<md-menu-item>',
          '<md-menu>',
          '<md-button ng-click="$mdOpenMenu($event)">New</md-button>',
          '<md-menu-content>',
          '<md-menu-item><md-button ng-click="doSomething()"><md-icon>create</md-icon>Edit node</md-button></md-menu-item>',
          '</md-menu-content>',
          '</md-menu>',
          '</md-menu-item>',
          '<md-menu-item><md-button ng-click="deleteSelected()"><md-icon>delete</md-icon>Delete node</md-button></md-menu-item>',
          '</md-menu-content>',
          '</md-menu>'
        ].join(' ');

        var canvasMenu = [
          '<md-menu>',
          '<md-button ng-click="$mdOpenMenu($event)"></md-button>',
          '<md-menu-content>',
          '<md-menu-item><md-button ng-click="addNode()"><md-icon>create</md-icon>Add node</md-button></md-menu-item>',
          '<md-menu-item><md-button ng-click="dupa()"><md-icon>delete</md-icon>Add connection</md-button></md-menu-item>',
          '</md-menu-content>',
          '</md-menu>'
        ].join(' ');


        self.getOptions = function getOptions() {
          return options;
        };

        self.getEvents = function getEvents() {
          return events;
        };

        self.getStartNodes = function getStartNodes() {
          var id = new Date().getTime();
          angular.forEach(startNodes, function (node) {
            node.id = id++;
          });
          return startNodes;
        };

        self.deleteSelected = function () {
          self.network.deleteSelected();
        };

/*
 * function to add new not connected node to the network placed under the mouse pointer
 * @returns {undefined}
 */
        self.addNode = function () {
          var newNode = {
            id: new Date().getTime(),
            x: self.canvasPosition.x,
            y: self.canvasPosition.y,
            label: '* new *'
          };
          self.network.body.data.nodes.add(newNode);
          self.network.setSelection({nodes: [newNode.id]});
        };
/*
 *  function to get node info from id + from and to edges + amount of existing nodes of that type
 * @param {type} id - id of node we want to get with info
 * @returns {unresolved} - node info
 */
        var getNodeInfo = function (id) {
          var node = self.network.body.data.nodes.get(id);
          if (node) {
            node.from = self.network.body.data.edges.get({
              filter: function (item) {
                return item.from === id;
              }
            });
            node.to = self.network.body.data.edges.get({
              filter: function (item) {
                return item.to === id;
              }
            });
            node.count = self.network.body.data.nodes.get({
              filter: function (item) {
                return item.group === node.group;
              }
            }).length;
          }
          return node;
        };

/*
 * function to check if new edge can be added between nodes with id1 and id2
 * @param {type} id1
 * @param {type} id2
 * @returns {Boolean}
 */
        var checkAddEdge = function (id1, id2) {

          if ((id1 === id2) || angular.isUndefined(id1) || angular.isUndefined(id2)) {
            return false;
          }          
          var node1 = getNodeInfo(id1);
          var node2 = getNodeInfo(id2);
          if (!node1 || !node2) {
            return false;
          }

          return true;
        };


        var onClickAddEdge = function onClickAddEdge(event) {
          var newEdge = {
            id: new Date().getTime()
          };
          event.preventDefault();
          event.stopPropagation();
          $document.off('click', onClickAddEdge);
          var pos = {x: event.offsetX, y: event.offsetY};
          var endNode = self.network.getNodeAt(pos);
          if (checkAddEdge(currentElement, endNode) === true) {
            newEdge.from = currentElement;
            newEdge.to = endNode;
            self.network.body.data.edges.add(newEdge);
            self.network.setSelection({edges: [newEdge.id]});
          }
        };

/*
 * function to start add new edge process - registers event handler  waiting for click on second node to connect
 * @param {type} $event
 * @returns {undefined}
 */
        self.addEdgeStart = function ($event) {
          $event.stopPropagation();
          var selection = self.network.getSelection();
          currentElement = selection.nodes[0];
          $document.on('click', onClickAddEdge);
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

        var renderMenu = function renderMenu(params, menuTemplate) {
          console.log(params);
          self.menuPosition = {x: params.event.clientX, y: params.event.clientY};
          self.canvasPosition = {x: params.pointer.canvas.x, y: params.pointer.canvas.y};
          self.scope = angular.extend($rootScope.$new(), self);
          var menu = angular.element($compile(menuTemplate)(self.scope));
          $document.find('body').append(menu);
          menu.css({
            position: 'fixed',
            top: 0,
            left: 0,
            transform: $interpolate('translate({{x}}px, {{y}}px)')({
              x: self.menuPosition.x, y: self.menuPosition.y
            })
          });
          self.menu = menu[0];
          angular.element(self.menu).controller('mdMenu').open();
          $document.on('click', closeMenu);

        };

        /*
         *  onClick handler when network is in edit mode and blocks internal click events
         */
        var onClickEditMode = function onCLickEditMode(event) {
          var pos = {x: event.offsetX, y: event.offsetY};
          var edge = self.network.getEdgeAt(pos);
          if (currentElement !== edge) {
            self.network.disableEditMode();
            $document.off('click', onClickEditMode);
          }
        };


        var onClick = function (params) {
//        console.log(params);
          var selection = self.network.getSelection();
          if (selection.edges.length === 1) {
            currentElement = selection.edges[0];
            self.network.editEdgeMode();
            $document.off('click', onClickEditMode);
            $document.on('click', onClickEditMode);
          }
        };

        var onRightClick = function (params) {
          params.event.preventDefault();
          var node = self.network.getNodeAt(params.pointer.DOM);
          var edge = self.network.getEdgeAt(params.pointer.DOM);
          var selection = {
            nodes: angular.isDefined(node) ? [node] : [],
            edges: angular.isUndefined(node) && angular.isDefined(edge) ? [edge] : []
          };
          self.network.setSelection(selection);

          if (self.menu !== null) {
            closeMenu();
          }
          if (node || edge) {
            renderMenu(params, nodeMenu);
          } else {
            renderMenu(params, canvasMenu);
          }
        };

        var events = {
          cl

var globalNet;

(function () {
  'use strict';

  angular.module('frontend.core.directives')
    .service('NetworkProvider', [
      'MessageService', '$document', '$compile', '$rootScope',
      '$interpolate', '$http', '$timeout', '$mdDialog',
      function (MessageService, $document, $compile, $rootScope,
        $interpolate, $http, $timeout, $mdDialog
        ) {

        var self = this;
        self.menu = null;
        self.network = null;

        self.selected = {};

        self.campaignId = null;

        globalNet = self;

        var currentElement;

        var events = {
          click: onClick,
          oncontext: onRightClick,
          beforeDrawing: beforeDrawing
        };

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
            enabled: false,
            initiallyActive: true
          },
          edges: {
            arrows: {
              to: true
            }
          },
          groups: {
            Start: {
              shape: 'dot',
              physics: false,
              color: groupColours[3],
              icon: 'play_circle_outline',
              title: 'Start node',
              validation: {
                count: {min: 1, max: 1},
                to: {max: 0},
                from: {min: 1, max: 1}
              }
            },
            End: {
              shape: 'triangle',
              physics: false,
              color: groupColours[2],
              icon: 'done_all',
              title: 'End node',
              validation: {
                count: {min: 1, max: 3},
                to: {min: 1},
                from: {max: 0}
              }
            },
            Script: {
              shape: 'square',
              physics: true,
              color: groupColours[4],
              icon: 'assignment',
              title: 'Questionnaire',
              edit: {
                sref: 'node({nodeId: $ctrl.niElement.id})'
              },
              validation: {
                count: {},
                to: {min: 1},
                from: {min: 1, max: 1}
              }
            },
            Decision: {
              shape: 'dot',
              physics: true,
              color: groupColours[9],
              icon: 'call_split',
              title: 'Decision point',
              validation: {
                count: {},
                to: {max: 1},
                from: {min: 1}
              }
            },
            Option: {
              shape: 'box',
              physics: true,
              color: groupColours[0],
              icon: 'done',
              title: 'Option',
              validation: {
                count: {},
                to: {min: 1, max: 1},
                from: {min: 1, max: 1}
              }
            },
            Action: {
              shape: 'dot',
              physics: true,
              color: groupColours[6],
              icon: 'trending_up',
              title: 'Action',
              edit: {
                handler: editActionNode
              },
              validation: {
                count: {},
                to: {min: 1, max: 1},
                from: {min: 1, max: 1}
              }
            },
          }
        };

        var actionTypes = [
          {
            value: 'Send Email',
            display: 'Send Email'
          },
          {
            value: 'Set Status',
            display: 'Set Status'
          }
        ];

        var startNodes = [
          {id: 1, label: 'Start', group: 'Start', x: -200, y: 100},
          {id: 2, label: 'Script page 1', group: 'Script'},
          {id: 3, label: 'Decison point 1', group: 'Decision'},
          {id: 4, label: 'Actions', group: 'Action'},
          {id: 999, label: 'End', group: 'End', x: 200, y: 100}
        ];

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

        self.deleteSelected = function deleteSelected() {
          var selection = self.network.getSelection();
          if (selection.nodes.length === 1) {
            var nodeToDelete = self.network.body.data.nodes.get(selection.nodes[0]);
            if (checkDeleteNodeType(nodeToDelete.group) !== true) {
              MessageService.warning('Reached minimum limit of this type of nodes');
              return;
            }
            self.network.body.data.edges.remove(self.network.getConnectedEdges(nodeToDelete.id));
            self.network.body.data.nodes.remove(nodeToDelete.id);
          }
          if (selection.edges.length === 1) {
            var edgeToDelete = self.network.body.data.edges.get(selection.edges[0]);
            self.network.body.data.edges.remove(edgeToDelete.id);
          }
          updateSelectedElement();
        };


        function editActionNodeController(
          $mdDialog, $scope, _, node, 
          _emailTemplates, _statuses
            ) {

          $scope.actionTypes = actionTypes;
          $scope.node = node;
          $scope.emailTemplates = _emailTemplates;
          $scope.statuses = _statuses[0].settings;
          
          $scope.msTemplate = [
            '<cc-action-form af-action="item"',
            'af-email-templates="ccParams.emailTemplates"',
            'af-statuses="ccParams.statuses">',
             '</cc-action-form>'
          ].join(' ');

          $scope.msParams = {
            emailTemplates: _emailTemplates,
            statuses: _statuses[0].settings
          };
          $scope.oldActions = angular.copy($scope.node.actions);
          
//          console.log('Controller!', $scope);
          $scope.cancelDialog = function () {
            $scope.node.actions = $scope.oldActions;
            $mdDialog.cancel();
          };

          $scope.saveAction = function () {
            $mdDialog.hide();
          };

        }


        function editActionNode(event, node) {
          if (angular.isUndefined(node.actions)) {
            node.actions = [
              {value: ''}
            ];
          }
          ;

          $mdDialog.show({
            controller: [
              '$mdDialog', '$scope', '_', 'node', 
              '_emailTemplates', '_statuses',
              editActionNodeController
            ],
            locals: {
              node: node,
            },
            resolve: {
              _emailTemplates: ['EmailTemplateModel',
                function resolve(EmailTemplateModel) {
                  return EmailTemplateModel.load({
                    sort: 'name ASC',
                    where: { campaign: self.campaignId }
                  });
                }
              ],
              _statuses: ['SettingModel',
                function resolve(SettingModel) {
                  return SettingModel.load({
                    where: { type: 'STATUSES' }
                  });
                }
              ]
            },
            templateUrl: '/frontend/admin/client.campaign.script/script-action.html',
            targetEvent: event,
            clickOutsideToClose: true
          });

        }

        function updateSelectedElement() {
          var selection = self.network.getSelection();
          self.selected = {};
          self.selectedType = 'nothing';
          if (selection.edges.length === 1) {
            self.selected = self.network.body.data.edges.get(selection.edges[0]);
            self.selected.type = 'edge';
          }
          if (selection.nodes.length === 1) {
            self.selected = self.network.body.data.nodes.get(selection.nodes[0]);
            self.selected.type = 'node';
          }
          // force angular digest
          $timeout(function () {
            $rootScope.$digest();
          });
        }

        self.getSelected = function getSelected() {
          return self.selected;
        };

        /*
         * function to check if new node of given type can be added (as defined in groups max limit)
         * @param {type} nodeType
         * @returns {Boolean}
         */
        self.checkAddNodeType = function (nodeType) {
          var count = self.network.body.data.nodes.get({
            filter: function (item) {
              return item.group === nodeType;
            }
          }).length;
          var max = angular.isDefined(options.groups[nodeType]) && options.groups[nodeType].validation.count.max;
          if (max && (count >= max)) {
            return false;
          }
          return true;
        };

        /*
         * function to check if node of given type can be deleted (as defined in groups min limit)
         * @param {type} nodeType
         * @returns {Boolean}
         */
        function checkDeleteNodeType(nodeType) {
          var count = self.network.body.data.nodes.get({
            filter: function (item) {
              return item.group === nodeType;
            }
          }).length;
          var min = angular.isDefined(options.groups[nodeType]) && options.groups[nodeType].validation.count.min;
          if (min && (count <= min)) {
            return false;
          }
          return true;
        }

        /*
         *  function to get node info from id + from and to edges + amount of existing nodes of that type
         * @param {type} id - id of node we want to get with info
         * @returns {unresolved} - node info
         */
        function getNodeInfo(id) {
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
        }

        /*
         * function to check if new edge can be added from start node
         * @param {type} id
         * @returns {Boolean}
         */
        function checkAddFromEdge(id) {
          var node = getNodeInfo(id);
          if (!node) {
            return false;
          }
          var max = angular.isDefined(options.groups[node.group]) && options.groups[node.group].validation.from.max;
          if (angular.isDefined(max) && max !== false && node.from.length >= max) {
            return false;
          }
          return true;
        }

        /*
         * function to check if new edge can be added to end node
         * @param {type} id
         * @returns {Boolean}
         */
        function checkAddToEdge(id) {
          var node = getNodeInfo(id);
          if (!node) {
            return false;
          }
          var max = angular.isDefined(options.groups[node.group]) && options.groups[node.group].validation.to.max;
          if (angular.isDefined(max) && max !== false && node.to.length >= max) {
            return false;
          }
          return true;
        }

        /*
         * function to check if new edge can be added between nodes with id1 and id2
         * @param {type} id1
         * @param {type} id2
         * @returns {Boolean}
         */
        function checkAddEdge(id1, id2) {
          if ((id1 === id2) || angular.isUndefined(id1) || angular.isUndefined(id2)) {
            return false;
          }
          if (checkAddFromEdge(id1) !== true) {
            var node = getNodeInfo(id1);
            MessageService.warning('Reached max limit of outcoming connections from ' + node.label);
            return false;
          }
          if (checkAddToEdge(id2) !== true) {
            var node = getNodeInfo(id2);
            MessageService.warning('Reached max limit of incomming connections to ' + node.label);
            return false;
          }
          return true;
        }

        /*
         * function to add new not connected node to the network placed under the mouse pointer
         * @param {type} nodeType
         * @param {boolean} addConnection - tries to also add connection between current and new node
         * @returns {undefined}
         */
        self.addNode = function (nodeType, addConnection) {
          if (self.checkAddNodeType(nodeType) !== true) {
            MessageService.warning('Reached max limit of this type of nodes');
            return;
          }
          var newNode = {
            id: new Date().getTime(),
            x: self.canvasPosition.x,
            y: self.canvasPosition.y,
            label: '* new *',
            group: nodeType
          };
          self.network.body.data.nodes.add(newNode);
          if (addConnection === true) {
            var selection = self.network.getSelection();
            var startNode = selection.nodes[0];
            if (checkAddEdge(startNode, newNode.id) === true) {
              var newEdge = {
                id: newNode.id + 1,
                from: startNode,
                to: newNode.id
              };
              self.network.body.data.edges.add(newEdge);
            }
          }
          self.network.setSelection({nodes: [newNode.id]});
          updateSelectedElement();
        };

        /*
         * 'click' event handler when adding new edge 
         * @param {type} event
         * @returns {undefined}
         */
        function onClickAddEdge(event) {
          var newEdge = {
            id: new Date().getTime()
          };

          event.preventDefault();
          event.stopPropagation();
          $document.off('click', onClickAddEdge);

          var selection = self.network.getSelection();
          var endNode = selection.nodes.length === 1 && selection.nodes[0];
          if (checkAddEdge(currentElement, endNode) === true) {
            newEdge.from = currentElement;
            newEdge.to = endNode;
            self.network.body.data.edges.add(newEdge);
            self.network.setSelection({edges: [newEdge.id]});
            updateSelectedElement();
          }
        }
        ;

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

        function beforeDrawing(params) {
          self.canvas = angular.element(params.canvas);
          // make sure canvas is not selectable
          self.canvas.attr('tabindex', '-1');
        }

        function closeMenu() {
          $document.off('click', closeMenu);
          self.menu.remove();
          self.menu = null;
          self.scope.$destroy();
        }

        /*
         * function to render context menu depends on the target of right click
         * @param {type} params
         * @returns {undefined}
         */
        function renderMenu(params) {
          self.menuPosition = {x: params.event.clientX, y: params.event.clientY};
          self.canvasPosition = {x: params.pointer.canvas.x, y: params.pointer.canvas.y};
          self.scope = angular.extend($rootScope.$new(), self);
          $http.get(params.templateUrl, {cache: true}).then(function then(response) {
            var menu = angular.element($compile(response.data)(self.scope));
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
          });
        }

        /*
         *  onClick handler when network is in edit mode and blocks internal click events
         */
        function onClickEditMode(event) {
          var pos = {x: event.offsetX, y: event.offsetY};
          var edge = self.network.getEdgeAt(pos);
          if (currentElement !== edge) {
            self.network.disableEditMode();
            $document.off('click', onClickEditMode);
          }
        }

        /*
         * 
         * @param {type} event
         * @returns {undefined}
         */
        function onKeyPress(event) {
          $document.off('keypress', onKeyPress);
          switch (event.keyCode) {
            case 127:  // Delete
              self.deleteSelected();
              break;
          }
        }

        /*
         * 
         * @param {type} params
         * @returns {undefined}
         */
        function onClick(params) {
          $document.off('keypress', onKeyPress);
          var selection = self.network.getSelection();
          if (selection.edges.length === 1) {
            currentElement = selection.edges[0];
            self.network.editEdgeMode();
            $document.off('click', onClickEditMode);
            $document.on('click', onClickEditMode);
          }
          if (selection.edges.length || selection.nodes.length) {
            $document.on('keypress', onKeyPress);
          }
          updateSelectedElement();
        }

        /*
         * right click event handler
         */
        function onRightClick(params) {
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
            params.templateUrl = '/core/directives/angularVis/menuNode.html';
          } else {
            params.templateUrl = '/core/directives/angularVis/menuCanvas.html';
          }
          renderMenu(params);
        }

      }]);
}());

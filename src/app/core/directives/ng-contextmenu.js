(function () {
  "use strict";

  angular.module('frontend.core.directives')

    .factory('contextMenu', ['$rootScope', function contextMenuService($rootScope) {

        function cancelAll() {
          $rootScope.$broadcast('context-menu/close');
        }

        return {cancelAll: cancelAll, eventBound: false};

      }])

    .directive('contextMenu', ['$http', '$timeout', '$interpolate', '$compile', 'contextMenu',
      function contextMenuDirective($http, $timeout, $interpolate, $compile, contextMenu) {

        return {
          restrict: 'EA',
          scope: true,
          require: '?ngModel',
          link: function link(scope, element, attributes, model) {

            console.log(attributes);
            if (!contextMenu.eventBound) {

              // Bind to the `document` if we haven't already.
              document.addEventListener('click', function click() {
                contextMenu.cancelAll();
                scope.$apply();
              });

              contextMenu.eventBound = true;

            }

            function closeMenu() {

              if (scope.menu) {
                scope.menu.remove();
                scope.menu = null;
                scope.position = null;
              }

            }

            scope.$on('context-menu/close', closeMenu);

            function getModel() {
              return model ? angular.extend(scope, model.$modelValue) : scope;
            }

            function render(event, strategy) {

              strategy = strategy || 'append';

              if ('preventDefault' in event) {

                contextMenu.cancelAll();
                event.stopPropagation();
                event.preventDefault();
                scope.position = {x: event.clientX, y: event.clientY};

              } else {

                if (!scope.menu) {
                  return;
                }

              }

//              $http.get(attributes.contextMenu, {cache: true}).then(function then(response) {

                var compiled = $compile(attributes.contextMenu)(angular.extend(getModel())),
                  menu = angular.element(compiled);

                // Determine whether to append new, or replace an existing.
                switch (strategy) {
                  case ('append'):
                    element.append(menu);
                    break;
                  default:
                    scope.menu.replaceWith(menu);
                    break;
                }

                menu.css({
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  transform: $interpolate('translate({{x}}px, {{y}}px)')({
                    x: scope.position.x, y: scope.position.y
                  })

                });

                scope.menu = menu;
                scope.menu.bind('click', closeMenu);

//              });

            }

            if (model) {

              var listener = function listener() {
                return model.$modelValue;
              };

              // Listen for updates to the model...
              scope.$watch(listener, function modelChanged() {
                render({}, 'replaceWith');
              }, true);

            }

            element.bind(attributes.contextEvent || 'contextmenu', render);

          }

        };

      }])

    ;

})();

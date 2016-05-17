/**
 * This file contains all necessary Angular directive definitions for 'frontend.core.layout' module.
 *
 * Note that this file should only contain directives and nothing else.
 */
(function() {
  'use strict';

  /**
   * Directive to build file links to information modal about current GUI. Actual files are passed to this directive
   * within modal open function.
   */
  angular.module('frontend.core.layout')
    .directive('pageInfoFiles', function directive() {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          'files': '@'
        },
        templateUrl: '/frontend/core/layout/partials/files.html',
        controller: [
          '$scope',
          function controller($scope) {
            try {
              $scope.filesJson = angular.fromJson($scope.files);
            } catch (error) {
              $scope.filesJson = false;
            }

            $scope.getTooltip = function getTooltip(item) {
              return '<h5 class="title">' + item.title + '</h5>' + item.info;
            };
          }
        ]
      };
    })
		.directive('adoptAbsoluteHeight', ["$document", "$window", function($document, $window) {
				return {
					restrict: "A",
					link: function($scope, element) {
						// Fleg to determine if the directive has loaded before
						var hasLoaded;
						// DOM representation of the Angular element
						var domElement = element[0];
						$scope.$on("$stateChangeSuccess", function() {
							console.log(domElement);
							// Get the computed height of the ui-view and assign it to the directive element
							
							domElement.style.height = angular.element("[data-ui-view=content] .cards-container").outerHeight();
							console.log(angular.element("[data-ui-view=content] .cards-container").outerHeight());
//							domElement.style.height = window.getComputedStyle($document[0].querySelector("[ui-view=content]")).height;
//							domElement.style.height = $window.getPropertyValue("height");
							// After the first height change, add a class to enable animations from now on
							if(!hasLoaded) {
								domElement.classList.add("animate-height");
								hasLoaded = true;
							}
						});
					}
				};
			}]);
  
}());

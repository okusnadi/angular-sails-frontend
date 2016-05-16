/**
 * This file contains all necessary Angular controller definitions for 'frontend.core.layout' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
	'use strict';

	/**
	 * Generic header controller for application layout. this contains all necessary logic which is used on application
	 * header section. Basically this contains following:
	 *
	 *  1) Main navigation
	 *  2) Login / Logout
	 *  3) Profile
	 */

	function findActiveItemIndex(stateName) {

		return _.findIndex($scope.navigationItems, function (item) {

			var stateCheck = item.state;
			if (item.state.substring(item.state.length - 1) === 's') {
				stateCheck = item.state.substring(0, item.state.length - 1);
			}
			return $state.includes(stateCheck) || $state.includes(item.state);

		});
	}


	angular.module('frontend.core.layout')
					.controller('HeaderController', [
						'$scope', '$state',
						'HeaderNavigationItems',
						'UserService', 'AuthService',
						function controller(
										$scope, $state,
										HeaderNavigationItems,
										UserService, AuthService
										) {
							$scope.user = UserService.user;
							$scope.auth = AuthService;
							$scope.navigationItems = HeaderNavigationItems;

							/**
							 * Helper function to determine if menu item needs 'not-active' class or not. This is basically
							 * special case because of 'examples.about' state.
							 *
							 * @param   {layout.menuItem}   item    Menu item object
							 *
							 * @returns {boolean}
							 */
							$scope.isNotActive = function isNotActive(item) {
								return !!(item.state === 'examples' && $state.current.name === 'examples.about');
							};

							/**
							 * Helper function to determine if specified menu item needs 'active' class or not. This is needed
							 * because of reload of page, in this case top level navigation items are not activated without
							 * this helper.
							 *
							 * @param   {layout.menuItem}   item    Menu item object
							 *
							 * @returns {boolean}
							 */
							$scope.isActive = function isActive(item) {
//          var bits = $state.current.name.toString().split('.');
								var stateCheck = item.state;
								if (item.state.substring(item.state.length - 1) === 's') {
									stateCheck = item.state.substring(0, item.state.length - 1);
								}

//          return !!(
//            (item.state === $state.current.name) ||
//            (item.state === bits[0] && $state.current.name !== 'examples.about')
//            );
								return $state.includes(stateCheck) || $state.includes(item.state);
							};

							// Simple helper function which triggers user logout action.
							$scope.logout = function logout() {
								AuthService.logout();
							};
						}
					])
					;

	/**
	 * Generic footer controller for application layout. This contains all necessary logic which is used on application
	 * footer section. Basically this contains following:
	 *
	 *  1) Generic links
	 *  2) Version info parsing (back- and frontend)
	 */
	angular.module('frontend.core.layout')
					.controller('FooterController', [
						function controller() {
							// TODO: add version info parsing
						}
					])
					;

	/**
	 * Generic navigation controller for application layout. This contains all necessary logic for pages sub-navigation
	 * section. Basically this handles following:
	 *
	 *  1) Sub navigation of the page
	 *  2) Opening of information modal
	 */
	angular.module('frontend.core.layout')
					.controller('NavigationController', [
						'$scope', '$state', '$uibModal', '$animate',
						'_items', '_', 'ContentNavigationItems',
						function controller(
										$scope, $state, $modal, $animate,
										_items, _, ContentNavigationItems
										) {
							$scope.navigationItems = _items;

							// Helper function to open information modal about current GUI.
							$scope.openInformation = function openInformation() {
								$modal.open({
									templateUrl: '/frontend/core/layout/partials/help.html',
									controller: 'NavigationModalController',
									size: 'lg',
									resolve: {
										'_title': function resolve() {
											return $state.current.name.toString();
										},
										'_files': [
											'NavigationInfoModalFiles',
											function resolve(NavigationInfoModalFiles) {
												return NavigationInfoModalFiles.get($state.current.name.toString());
											}
										],
										'_template': function resolve() {
											return $state.current.views['content@'].templateUrl.replace('.html', '-info.html');
										}
									}
								});
							};

							//select active tab
							
							$scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
								
								$scope.activeIndex = ContentNavigationItems.getStateIndex(to);
								$scope.lastIndex = ContentNavigationItems.getStateIndex(from);
								var mainPanel = angular.element(document.getElementsByClassName('main-panel')).removeClass().addClass('main-panel');	

								if ( $scope.activeIndex < 0 || $scope.lastIndex < 0) {	
									console.log(to, from);
									
//									console.log('parents (f/t): ' +from.parent + ' ' +to.parent);
//									console.log('name (f/t): '+ from.name + ' ' +to.name); 
									
									
									//going to parent
									if (from.parent !== undefined && to.name !== undefined && to.name.indexOf(from.parent) > -1) {
										console.log('to parent');
										mainPanel.addClass('slidedown');
									}
									//going to child
									if (to.parent !== undefined && from.name !== undefined && from.name.indexOf(to.parent) > -1)  {
										console.log('to child');
										mainPanel.addClass('slideup');
									}
									
									
//									if ( to.name.match(/(lists|campaigns|)/) ){ 
//										console.log('found');
//										mainPanel.addClass('slideup');
//									}
									return;
								}
								
								console.log($scope.activeIndex, $scope.lastIndex);
								console.log(to);
								if ($scope.activeIndex >= $scope.lastIndex) {
										mainPanel.addClass('slide-left');
								} else {
										mainPanel.addClass('slide-right');
								}
							});
							
//							$animate.on('enter', angular.element('body'), function callback(element, phase){
//								if ( element.hasClass('main-panel') && phase === 'close' ) {
//									element.removeClass().addClass('main-panel fade');
//								}
//							});
							
						}
					])
					;

	/**
	 * Controller for navigation info modal. This is used to show GUI specified detailed information about how those
	 * are done (links to sources + generic information / description).
	 */
	angular.module('frontend.core.layout')
					.controller('NavigationModalController', [
						'$scope', '$uibModalInstance',
						'BackendConfig',
						'_title', '_files', '_template',
						function (
										$scope, $modalInstance,
										BackendConfig,
										_title, _files, _template
										) {
							$scope.title = _title;
							$scope.files = _files;
							$scope.template = _template;
							$scope.backendConfig = BackendConfig;

							// Dismiss function for modal
							$scope.dismiss = function dismiss() {
								$modalInstance.dismiss();
							};

						}
					])
					;
}());

'use strict';

/**
 * Configuration for frontend application, this contains following main sections:
 *
 *  1) Configure $httpProvider and $sailsSocketProvider
 *  2) Set necessary HTTP and Socket interceptor(s)
 *  3) Turn on HTML5 mode on application routes
 *  4) Set up application routes
 */
angular.module('frontend')
  .config([
    '$locationProvider', '$httpProvider', '$sailsSocketProvider',
    'cfpLoadingBarProvider', 'toastrConfig', '$mdThemingProvider',
    function config(
      $locationProvider, $httpProvider, $sailsSocketProvider,
      cfpLoadingBarProvider, toastrConfig, $mdThemingProvider
      ) {
      $httpProvider.defaults.useXDomain = true;

      delete $httpProvider.defaults.headers.common['X-Requested-With'];

      // Add interceptors for $httpProvider and $sailsSocketProvider
      $httpProvider.interceptors.push('AuthInterceptor');
      $httpProvider.interceptors.push('ErrorInterceptor');

      // Iterate $httpProvider interceptors and add those to $sailsSocketProvider
      angular.forEach($httpProvider.interceptors, function iterator(interceptor) {
        $sailsSocketProvider.interceptors.push(interceptor);
      });

      // Disable spinner from cfpLoadingBar
      cfpLoadingBarProvider.includeSpinner = false;
      cfpLoadingBarProvider.latencyThreshold = 200;

      // Extend default toastr configuration with application specified configuration
      angular.extend(
        toastrConfig,
        {
          allowHtml: true,
          closeButton: true,
          extendedTimeOut: 3000
        }
      );

      // Yeah we wanna to use HTML5 urls!
      $locationProvider
        .html5Mode({
          enabled: true,
          requireBase: false
        })
        .hashPrefix('!')
        ;

      //theme colours  ==========

      //extend theme to change contrast colour
      var blueThemeEditMap = $mdThemingProvider.extendPalette('light-blue', {
        'contrastDefaultColor': 'light'
      });

      //register theme
      $mdThemingProvider.definePalette('ra-light-blue', blueThemeEditMap);

      //set themes
      $mdThemingProvider.theme('default')
        .primaryPalette('ra-light-blue'
          )
        .accentPalette('orange'
//                , {
//                    'default' : '500'
//                } 
          );

      $mdThemingProvider.theme('toast-yes');
      $mdThemingProvider.theme('toast-no');
    }
  ])
  ;




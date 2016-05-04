/**
 * Simple service to activate noty2 message to GUI. This service can be used every where in application. Generally
 * all $http and $socket queries uses this service to show specified errors to user.
 *
 * Service can be used as in following examples (assuming that you have inject this service to your controller):
 *  Message.success(message, [title], [options]);
 *  Message.error(message, [title], [options]);
 *  Message.message(message, [title], [options]);
 *
 * Feel free to be happy and code some awesome stuff!
 *
 * @todo do we need some queue dismiss?
 */
(function() {
  'use strict';

  angular.module('frontend.core.services')
    .factory('MessageService', [
      'toastr', '_', '$mdToast',
      function factory(toastr, _, $mdToast ) {
        var service = {};

        /**
         * Private helper function to make actual message via toastr component.
         *
         * @param   {string}  message         Message content
         * @param   {string}  title           Message title
         * @param   {{}}      options         Message specified options
         * @param   {{}}      defaultOptions  Default options for current message type
         * @param   {string}  type            Message type
         * @private
         */
        function _makeMessage(message, title, options, defaultOptions, type) {
          title = title || '';
          options = options || {};

          toastr[type](message, title, _.assign(defaultOptions, options));
        }

        /**
         * Method to generate 'success' message.
         *
         * @param   {string}  message   Message content
         * @param   {string}  [title]   Message title
         * @param   {{}}      [options] Message options
         */
        service.success = function success(message, title, options) {
          var defaultOptions = {
            timeOut: 2000
          };

          _makeMessage(message, title, options, defaultOptions, 'success');
        };

        /**
         * Method to generate 'info' message.
         *
         * @param   {string}  message   Message content
         * @param   {string}  [title]   Message title
         * @param   {{}}      [options] Message options
         */
        service.info = function error(message, title, options) {
          var defaultOptions = {
            timeout: 3000
          };

          _makeMessage(message, title, options, defaultOptions, 'info');
        };

        /**
         * Method to generate 'warning' message.
         *
         * @param   {string}  message   Message content
         * @param   {string}  [title]   Message title
         * @param   {{}}      [options] Message options
         */
        service.warning = function error(message, title, options) {
          var defaultOptions = {
            timeout: 3000
          };

          _makeMessage(message, title, options, defaultOptions, 'warning');
        };

        /**
         * Method to generate 'error' message.
         *
         * @param   {string}  message   Message content
         * @param   {string}  [title]   Message title
         * @param   {{}}      [options] Message options
         */
        service.error = function error(message, title, options) {
          var defaultOptions = {
            timeout: 4000
          };

          _makeMessage(message, title, options, defaultOptions, 'error');
        };
				
			//my version
		  //============================================================
				
				function _makeToast(message, options) {
					  //default position
						console.log('ll');
						var toastXy = {
							bottom: false,
							top: true,
							left: false,
							right: true
						};
						
						options = options || {};
						
						//Default options
						var position = options.position || toastXy,
								delay = options.delay || 3000,
								theme = options.theme || '',
								className = options.className || '';
								
						//toast types and icons
						if ( options.type ) {
							var icon;
							className = 'type ' + options.type;
							switch(options.type) {
								case 'success' : icon = 'done'; ; 
									break;  
								case 'warn' : icon = 'warning';
									break;
								case 'info': icon = 'info_outline';
									break;
								case 'delete' : icon ='delete_forever';
							}
						} 
						
						
						
						var toastPosition = Object.keys(position)
										.filter(function(pos) {return position[pos];})
										.join(' ');
						
						console.log( 'message:' + message,  'xy:' + position,  'delay:' + delay, 'theme: ' + theme);
						
//						$mdToast.show(
//										$mdToast.position(
//											{top:true}
//										).showSimple(message)
										
//										);

						var template = [
							'<md-toast class="' + className + '">',
							'<div layout="row">',
							'<div class="icon-box"><md-icon class="toast-icon material-icons">'+ icon + '</md-icon></div>',
							'<span flex>' + message + '</span>',
							'</div>',
							'</md-toast>'
							
						].join(' ');
						
						$mdToast.show(
//									$mdToast.simple()
//									.textContent(message)
//									.parent('body')
//									.position(toastPosition)
//									.hideDelay(999999)
//									.theme(theme)
										{
											template: template,
											hideDelay: delay,
											position: toastPosition,
											theme:theme
										}
						);
		
						
				}
				
				service.toastYes = function toastYes(message,position,delay) {
					_makeToast(message,position,delay,'toast-yes');
				};

        return service;
      }
			

			
    ])
  ;
}());

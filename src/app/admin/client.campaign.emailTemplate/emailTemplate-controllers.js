/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.campaign.campaign.emailTemplate' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
    'use strict';

    // Controller for new emailTemplate creation.
    angular.module('frontend.admin.client.campaign.emailTemplate')
      .controller('EmailTemplateAddController', [
          '$scope', '$state',
          'MessageService',
          'EmailTemplateModel',
          '_client',
          '_campaign',
          function controller(
            $scope, $state,
            MessageService,
            EmailTemplateModel,
            _client,
            _campaign
            ) {

              // expose state
              $scope.$state = $state;
              // Store parent campaign
              $scope.campaign = _campaign;
              $scope.client = _client;

              // Initialize emailTemplate model
              $scope.emailTemplate = {
                  name: '',
                  body: ''
              };
              
              $scope.dropHandler = function(file, insertAction) {
                  
                  console.log( 'DROPPED - ', file, insertAction);
                  
              };


              /**
               * Scope function to store new emailTemplate to database. After successfully save emailTemplate will be redirected
               * to view that new created emailTemplate.
               */
              $scope.saveEmailTemplate = function () {
                  $scope.emailTemplate.campaign = $scope.campaign;
                  EmailTemplateModel
                    .create(angular.copy($scope.emailTemplate))
                    .then(
                      function onSuccess(result) {
                          MessageService.success('New emailTemplate added successfully');

                          $state.go('emailTemplate', {emailTemplateId: result.data.id});
                      }
                    )
                    ;
              };

          }
      ])
      ;

    // Controller to show single emailTemplate on GUI.
    angular.module('frontend.admin.client.campaign.emailTemplate')
      .controller('EmailTemplateController',
        [
            '$scope', '$state',
            '$mdDialog',
            'UserService', 'MessageService',
            'EmailTemplateModel',
            '_campaign',
            '_emailTemplate',
            function controller(
              $scope, $state,
              $mdDialog,
              UserService, MessageService,
              EmailTemplateModel,
              _campaign,
              _emailTemplate
              ) {
                // expose state
                $scope.$state = $state;
                // Set current scope reference to model
                EmailTemplateModel.setScope($scope, 'emailTemplate');

                // Initialize scope data
                $scope.currentUser = UserService.user();
                $scope.emailTemplate = _emailTemplate;
                $scope.selectList = _emailTemplate.list ? _emailTemplate.list.id : null;

                // EmailTemplate delete dialog buttons configuration
                $scope.confirmButtonsDelete = {
                    ok: {
                        label: 'Delete',
                        className: 'btn-danger',
                        callback: function callback() {
                            $scope.deleteEmailTemplate();
                        }
                    },
                    cancel: {
                        label: 'Cancel',
                        className: 'btn-default pull-left'
                    }
                };

                /**
                 * Scope function to save the modified emailTemplate. This will send a
                 * socket request to the backend server with the modified object.
                 */
                $scope.saveEmailTemplate = function () {
                    var data = angular.copy($scope.emailTemplate);

                    // Make actual data update
                    EmailTemplateModel
                      .update(data.id, data)
                      .then(
                        function onSuccess() {
                            MessageService.success('Email template "' + $scope.emailTemplate.name + '" updated successfully');
                        }
                      )
                      ;
                };

                /**
                 * Scope function to delete current emailTemplate. This will send DELETE query to backend via web socket
                 * query and after successfully delete redirect emailTemplate back to emailTemplate list.
                 */
                $scope.deleteEmailTemplate = function deleteEmailTemplate() {
                    EmailTemplateModel
                      .delete($scope.emailTemplate.id)
                      .then(
                        function onSuccess() {
                            MessageService.success('Email template "' + $scope.emailTemplate.title + '" deleted successfully');

                            $state.go('emailTemplates');
                        }
                      )
                      ;
                };

                $scope.confirmDelete = function (ev) {
                    // Appending dialog to document.body to cover sidenav in docs app
                    var confirm = $mdDialog.confirm()
                      .title('Delete emailTemplate')
                      .textContent('Are you sure you want to delete email template ' + $scope.emailTemplate.name + ' ?')
                      .ariaLabel('Lucky day')
                      .targetEvent(ev)
                      .ok('Yes!')
                      .cancel('Cancel');
                    $mdDialog.show(confirm).then(function () {
                        $scope.deleteEmailTemplate();
                    }, function () {

                    });
                };
            }
        ])
      ;

    // Controller which contains all necessary logic for emailTemplate list GUI on boilerplate application.
    angular.module('frontend.admin.client.campaign.emailTemplate')
      .controller('EmailTemplateListController', [
          '$scope', '$q', '$timeout',
          '_',
          'EmailTemplateModel',
          'DataProvider',
          '_campaign',
//      '_items', '_count', 
          function controller(
            $scope, $q, $timeout,
            _,
            EmailTemplateModel,
            DataProvider,
            _campaign
//        _items, _count
            ) {
              // Set current scope reference to models
              EmailTemplateModel.setScope($scope, false, 'items', 'itemCount');

              // Set initial data
              $scope.campaign = _campaign;
              $scope.query = {
                  order: 'name',
                  searchWord: '',
                  where: {
                      campaign: _campaign.id
                  }
              };

              $scope.dataProvider = new DataProvider(EmailTemplateModel, $scope.query);

              var searchWordTimer;

              $scope.$watch('query.searchWord', function watcher(valueNew, valueOld) {
                  if (valueNew !== valueOld) {
                      if (searchWordTimer) {
                          $timeout.cancel(searchWordTimer);
                      }

                      searchWordTimer = $timeout($scope.dataProvider.triggerFetchData, 400);
                  }
              }, true);
          }

      ])
      ;
}());

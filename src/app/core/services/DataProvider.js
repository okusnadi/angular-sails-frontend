/**
 * This file contains generic model factory that will return a specified model instance for desired endpoint with
 * given event handlers. Basically all of this boilerplate application individual models are using this service to
 * generate real model.
 */
(function () {
  'use strict';

  angular.module('frontend.core.services')
    .factory('DataProvider', [
      'SocketHelperService', 'ListConfig',
      '$log', '$q', '_',
      function (
        SocketHelperService, ListConfig,
        $log, $q, _
        ) {

        return function (dataModel, query) {
          var dataModel = dataModel;
          var query = query;

          var config = ListConfig.getConfig();

          query.currentPage = 1;

          if (angular.isUndefined(query.items)) {
            query.items = [];
          }
          if (angular.isUndefined(query.itemCount)) {
            query.itemCount = query.items.length;
          }
          if (angular.isUndefined(query.itemsPerPage)) {
            query.itemsPerPage = config.itemsPerPage;
          }
          if (angular.isUndefined(query.columns)) {
            query.columns = ListConfig.getTitleItems(dataModel.endpoint);
          }

          var onReorder = function (order) {
            query.order = order;
            triggerFetchData();
          };

          var onPaginate = function (currentPage, itemsPerPage) {
            query.currentPage = currentPage;
            query.itemsPerPage = itemsPerPage;
            fetchData();
          };

          var triggerFetchData = function () {
            if (query.currentPage === 1) {
              fetchData();
            } else {
              query.currentPage = 1;
            }
          };

          var fetchData = function () {

            // Common parameters for count and data query
            var commonParameters = {
              where: _.merge({},
                angular.isDefined(query.where) ? query.where : {},
                SocketHelperService.getWhere(query))
            };

            var order = query.order;
            var direction = order.charAt(0) !== '-';
            if (!direction) {
              order = order.substring(1);
            }

            // Data query specified parameters
            var parameters = {
              limit: query.itemsPerPage,
              skip: (query.currentPage - 1) * query.itemsPerPage,
              sort: order + ' ' + (direction ? 'ASC' : 'DESC'),
              populate: angular.isDefined(query.populate) ? query.populate : {}
            };

            // Fetch data count
            var count = dataModel
              .count(commonParameters)
              .then(
                function onSuccess(response) {
                  query.itemCount = response.count;
                }
              )
              ;

            // Fetch actual data
            var load = dataModel
              .load(_.merge({}, commonParameters, parameters))
              .then(
                function onSuccess(response) {
//                              query.items = response;

                  query.items = [];

                  angular.forEach(response, function (value, key) {
                    query.items.push(angular.copy(value));
                  });

                }
              )
              ;

            // Load all needed data
            $q
              .all([count, load])
              .finally(
                function onFinally() {
//                              loaded = true;
//                              loading = false;
                }
              )
              ;
          };

          if (query.items.length < 1) {
            fetchData();
          }

          return {
            query: query,
            onReorder: onReorder,
            onPaginate: onPaginate,
            fetchData: fetchData,
            triggerFetchData: triggerFetchData
          };


        };

      }]);
}());

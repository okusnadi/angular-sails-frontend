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
          '$log', '$q',
          '_',
          function (
            SocketHelperService, ListConfig,
            $log, $q,
            _
            ) {

              var self = this;

              return function (dataModel, query) {
                  self.dataModel = dataModel;
                  self.query = query;
                  
                  var config = ListConfig.getConfig();

                  self.query.items = [];
                  self.query.currentPage = 1;
                  self.query.itemsPerPage = config.itemsPerPage;
                  self.query.itemCount = config.itemsPerPage;
                  self.query.columns = ListConfig.getTitleItems(dataModel.endpoint);

                  var onReorder = function (order) {
                      self.query.order = order;
                      triggerFetchData();
                  };

                  var onPaginate = function (currentPage, itemsPerPage) {
                      self.query.currentPage = currentPage;
                      self.query.itemsPerPage = itemsPerPage;
                      fetchData();
                  };

                  var triggerFetchData = function () {
                      if (self.query.currentPage === 1) {
                          fetchData();
                      } else {
                          self.query.currentPage = 1;
                      }
                  };

                  var fetchData = function () {
                      self.loading = true;

                      // Common parameters for count and data query
                      var commonParameters = {
                          where: _.merge({}, 
                          angular.isDefined(self.query.where) ? self.query.where : {}, 
                          SocketHelperService.getWhere(self.query))
                      };

                      var order = self.query.order;
                      var direction = order.charAt(0) !== '-';
                      if (!direction) {
                          order = order.substring(1);
                      }

                      // Data query specified parameters
                      var parameters = {
                          limit: self.query.itemsPerPage,
                          skip: (self.query.currentPage - 1) * self.query.itemsPerPage,
                          sort: order + ' ' + (direction ? 'ASC' : 'DESC'),
                          populate: angular.isDefined(self.query.populate) ? self.query.populate : {}
                      };

                      // Fetch data count
                      var count = self.dataModel
                        .count(commonParameters)
                        .then(
                          function onSuccess(response) {
                              self.query.itemCount = response.count;
                          }
                        )
                        ;

                      // Fetch actual data
                      var load = self.dataModel
                        .load(_.merge({}, commonParameters, parameters))
                        .then(
                          function onSuccess(response) {
                              self.query.items = response;
                          }
                        )
                        ;

                      // Load all needed data
                      $q
                        .all([count, load])
                        .finally(
                          function onFinally() {
                              self.loaded = true;
                              self.loading = false;
                          }
                        )
                        ;
                  };

                  fetchData();

                  return {
                      query: self.query,
                      onReorder: onReorder,
                      onPaginate: onPaginate,
                      fetchData: fetchData,
                      triggerFetchData: triggerFetchData
                  };


              };

          }]);
}());

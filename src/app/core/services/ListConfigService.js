/**
 * Simple service to return configuration for generic list. This service contains only
 * getter methods that all list views uses in Boilerplate frontend application.
 *
 * So generally you change these getter methods and changes are affected to all list
 * views on application.
 *
 * @todo text translations
 */
(function() {
  'use strict';

  angular.module('frontend.core.services')
    .factory('ListConfig', [
      '_',
      function factory(_) {
        /**
         * List title item configuration.
         *
         * @type  {{
         *          author: *[],
         *          book: *[]
         *        }}
         */
        var titleItems = {
          campaign: [
            {
              title: 'Name',
              column: 'name',
              class: 'col-xs-2',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'OU 1',
              column: 'orgUnit1',
              class: 'col-xs-2',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'OU 2',
              column: 'orgUnit2',
              class: 'col-xs-2',
              searchable: false,
              sortable: false,
              inSearch: false,
              inTitle: false
            },
            {
              title: 'OU 3',
              column: 'orgUnit3',
              class: 'col-xs-2',
              searchable: false,
              sortable: false,
              inSearch: false,
              inTitle: false
            }
          ],
          client: [
            {
              title: 'Name',
              column: 'name',
              class: 'col-xs-2',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'Contact name',
              column: 'contactName',
              class: 'col-xs-2',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'Campaigns',
              column: false,
              class: 'col-xs-2',
              searchable: false,
              sortable: false,
              inSearch: false,
              inTitle: false
            },
            {
              title: 'Active Campaigns',
              column: false,
              class: 'col-xs-2',
              searchable: false,
              sortable: false,
              inSearch: false,
              inTitle: false
            }
          ],
          user: [
            {
              title: 'Username',
              column: 'username',
              class: 'col-xs-2',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'First name',
              column: 'firstName',
              class: 'col-xs-2',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'Last name',
              column: 'lastName',
              class: 'col-xs-2',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'Email',
              column: 'email',
              class: 'col-xs-2',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'Roles',
              column: false,
              class: 'col-xs-2',
              searchable: false,
              sortable: undefined,
              inSearch: false,
              inTitle: false
            }
          ],
          role: [
            {
              title: 'Name',
              column: 'name',
              class: 'col-xs-3',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'Description',
              column: 'description',
              class: 'col-xs-3',
              searchable: false,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'Active',
              column: 'active',
              class: 'col-xs-2',
              searchable: false,
              sortable: true,
              inSearch: false,
              inTitle: true
            },
            {
              title: 'Access Level',
              column: 'accessLevel',
              class: 'col-xs-2',
              searchable: false,
              sortable: true,
              inSearch: false,
              inTitle: true
            },
            {
              title: 'Users',
              column: false,
              class: 'col-xs-2',
              searchable: false,
              sortable: false,
              inSearch: false,
              inTitle: true
            }
          ],
          author: [
            {
              title: 'Author',
              column: 'name',
              class: 'col-xs-11',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'Books',
              column: false,
              class: 'text-right col-xs-1',
              searchable: false,
              sortable: false,
              inSearch: false,
              inTitle: true
            }
          ],
          book: [
            {
              title: 'Title',
              column: 'title',
              class: 'col-xs-8',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'Author',
              column: false,
              class: 'col-xs-3',
              searchable: false,
              sortable: false,
              inSearch: false,
              inTitle: true
            },
            {
              title: 'Year',
              column: 'releaseDate',
              class: 'col-xs-1 text-right',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            }
          ],
          userlogin: [
            {
              title: 'IP-address',
              column: 'ip',
              class: 'col-xs-2',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'Browser',
              column: 'browser',
              class: 'col-xs-2',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'Operating System',
              column: 'os',
              class: 'col-xs-2',
              searchable: true,
              sortable: true,
              inSearch: true,
              inTitle: true
            },
            {
              title: 'Username',
              column: false,
              class: 'col-xs-2',
              searchable: false,
              sortable: false,
              inSearch: false,
              inTitle: true
            },
            {
              title: 'Login time',
              column: 'createdAt',
              class: 'col-xs-4',
              searchable: false,
              sortable: true,
              inSearch: false,
              inTitle: true
            }
          ]
        };

        return {
          /**
           * Getter method for list default settings.
           *
           * @returns {{
           *            itemCount:            Number,
           *            items:                Array,
           *            itemsPerPage:         Number,
           *            itemsPerPageOptions:  Array,
           *            currentPage:          Number,
           *            where:                {},
           *            loading:              Boolean,
           *            loaded:               Boolean
           *          }}
           */
          getConfig: function getConfig() {
            return {
              itemCount: 0,
              items: [],
              itemsPerPage: 10,
              itemsPerPageOptions: [10, 25, 50, 100],
              currentPage: 1,
              where: {},
              loading: true,
              loaded: false
            };
          },

          /**
           * Getter method for lists title items. These are defined in the 'titleItems'
           * variable.
           *
           * @param   {String}    model   Name of the model
           *
           * @returns {Array}
           */
          getTitleItems: function getTitleItems(model) {
            return _.isUndefined(titleItems[model]) ? [] : titleItems[model];
          }
        };
      }
    ])
  ;
}());

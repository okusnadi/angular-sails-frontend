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
          prospect: [
            {
              title: 'Name',
              column: ['fields','Name', 'value'],
              class: 'col-xs-2',
              sortable: false,
              inSearch: false,
            },
            {
              title: 'Year',
              column: ['fields','Year', 'value'],
              class: 'col-xs-2',
              sortable: false,
              inSearch: false,
            },
            {
              title: 'House',
              column: ['fields','House', 'value'],
              class: 'col-xs-2',
              sortable: false,
              inSearch: false,
            }
          ],
          script: [
            {
              title: 'Name',
              column: 'name',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Created',
              column: 'createdAt',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Updated',
              column: 'updatedAt',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
            }
          ],
          list: [
            {
              title: 'Name',
              column: 'name',
              class: 'col-xs-2',
              inSearch: true,
              sortable: true,
              sref: 'list({listId: item.id})'
            },
            {
              title: 'Created',
              column: 'createdAt',
              class: 'col-xs-2',
              inSearch: false,
              sortable: true,
            },
            {
              title: 'Updated',
              column: 'updatedAt',
              class: 'col-xs-2',
              inSearch: false,
              sortable: true,
            }
          ],
          emailTemplate: [
            {
              title: 'Name',
              column: 'name',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Created',
              column: 'createdAt',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Updated',
              column: 'updatedAt',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
            }
          ],
          campaign: [
            {
              title: 'Name',
              column: 'name',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
              sref: 'campaign({campaignId: item.id})'
            },
            {
              title: 'Created',
              column: 'createdAt',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Updated',
              column: 'updatedAt',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Lists',
              column: 'lists',
              class: 'col-xs-2',
              sortable: false,
              inSearch: false,
              sref: 'lists({campaignId: item.id})'
            },
            {
              title: 'Scripts',
              column: 'scripts',
              class: 'col-xs-2',
              sortable: false,
              inSearch: false,
              sref: 'scripts({campaignId: item.id})'
            },
            {
              title: 'Email templates',
              column: 'emailTemplates',
              class: 'col-xs-2',
              sortable: false,
              inSearch: false,
              sref: 'emailTemplates({campaignId: item.id})'
            }
          ],
          client: [
            {
              title: 'Name',
              column: 'name',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Contact name',
              column: 'contactName',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Campaigns',
              column: false,
              class: 'col-xs-2',
              sortable: false,
              inSearch: false,
            },
            {
              title: 'Active Campaigns',
              column: false,
              class: 'col-xs-2',
              sortable: false,
              inSearch: false,
            }
          ],
          user: [
            {
              title: 'Username',
              column: 'username',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
              sref: 'admin.user({id: item.id})'
            },
            {
              title: 'First name',
              column: 'firstName',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Last name',
              column: 'lastName',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Email',
              column: 'email',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Roles',
              column: false,
              class: 'col-xs-2',
              sortable: false,
              inSearch: false,
            }
          ],
          role: [
            {
              title: 'Name',
              column: 'name',
              class: 'col-xs-3',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Description',
              column: 'description',
              class: 'col-xs-3',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Active',
              column: 'active',
              class: 'col-xs-2',
              sortable: true,
              inSearch: false,
            },
            {
              title: 'Access Level',
              column: 'accessLevel',
              class: 'col-xs-2',
              sortable: true,
              inSearch: false,
            },
            {
              title: 'Users',
              column: false,
              class: 'col-xs-2',
              sortable: false,
              inSearch: false,
            }
          ],
          author: [
            {
              title: 'Author',
              column: 'name',
              class: 'col-xs-11',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Books',
              column: false,
              class: 'text-right col-xs-1',
              sortable: false,
              inSearch: false,
            }
          ],
          book: [
            {
              title: 'Title',
              column: 'title',
              class: 'col-xs-8',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Author',
              column: false,
              class: 'col-xs-3',
              sortable: false,
              inSearch: false,
            },
            {
              title: 'Year',
              column: 'releaseDate',
              class: 'col-xs-1 text-right',
              sortable: true,
              inSearch: true,
            }
          ],
          userlogin: [
            {
              title: 'IP-address',
              column: 'ip',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Browser',
              column: 'browser',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Operating System',
              column: 'os',
              class: 'col-xs-2',
              sortable: true,
              inSearch: true,
            },
            {
              title: 'Username',
              column: false,
              class: 'col-xs-2',
              sortable: false,
              inSearch: false,
            },
            {
              title: 'Login time',
              column: 'createdAt',
              class: 'col-xs-4',
              sortable: true,
              inSearch: false,
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

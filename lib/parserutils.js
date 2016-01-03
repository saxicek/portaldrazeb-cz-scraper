/*jslint node: true */
/*jshint node: true */

'use strict';

var moment = require('moment-timezone');

var
    // check that value has specified currency
    isCurrency = function (value, curr) {
        return value.indexOf(curr) > -1;
    },

    // parses amount (integer) from the value
    getAmount = function (value) {
        var amount_string;

        amount_string = value.replace(/[^0-9,]+/g,"").replace(',', '.');
        return parseInt(amount_string);
    },

    // gets title and section from original title
    // assuption is that function gets original title in form "title / section"
    parseTitle = function(orig_title) {
        var title,
            section,
            i;

        i = orig_title.lastIndexOf('/');
        if (i === -1) {
            title = orig_title;
        } else {
            title = orig_title.substring(0, i - 1).trim();
            section = orig_title.substring(i + 1).trim();
        }
        return [title, section];
    },

    parseDate = function(str) {
        return moment.tz(str, 'DD.MM.YYYY HH:mm:ss', 'Europe/Prague');
    },

    parseIdent = function(str) {
        return str.replace('EX:', '').trim().replace(/[\u0020\u00A0]/g, '');
    };

module.exports = {
    isCurrency: isCurrency,
    getAmount: getAmount,
    parseTitle: parseTitle,
    parseDate: parseDate,
    parseIdent: parseIdent
};

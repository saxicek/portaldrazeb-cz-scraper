/*jslint node: true */

'use strict';

var rp = require('request-promise').defaults({jar: true}),
    cheerio = require('cheerio');

var pages_stack = [],
    auction_urls = [],

    query = {
        uri: 'http://www.portaldrazeb.cz/index.php?p=search',
        method: 'POST',
        formData: {
            posted: 1,
            shiden: 1,
            ktg: 1,
            hledej_podle_nazvu: '',
            celep: 1,
            p1: 1,
            p2: 1,
            p3: 1,
            p4: 1,
            p5: 1,
            p6: 1,
            p7: 1,
            p8: 1,
            p9: 1,
            p10: 1,
            p11: 1,
            celacr: 1,
            k14: 1,
            k11: 1,
            k9: 1,
            k1: 1,
            k4: 1,
            k3: 1,
            k7: 1,
            k6: 1,
            k5: 1,
            k12: 1,
            k13: 1,
            k2: 1,
            k10: 1,
            k8: 1,
            celef: 1,
            orderc: 2,
            ordert: 1
        },
        type: 'html'
    },

    parseList = function(response) {
        var $ = cheerio.load(response);

        // add all auction detail pages to be parsed
        $('a.vicezde').each(function(i, elem) {
            auction_urls.push($(this).attr('href'));
        });
    },

    parseFirstList = function(response) {
        var $ = cheerio.load(response),
            last_page = $('a.srch').last().text();

        // enqueue all list pages that should be parsed
        for (var i = 2; i <= last_page; i++) {
            pages_stack.push(i);
        }

        // parse the page
        parseList(response);
    },

    parseAuction = function() {

    };

// set query parameters
rp(query)
    .then(function () {
        return rp('http://www.portaldrazeb.cz/vyhledavani');
    })
    .then(parseFirstList)
    .then(function() {
        console.log(auction_urls);
        console.log(pages_stack);
    });

/*jslint node: true */
/*jshint node: true */

'use strict';

var cheerio = require('cheerio'),
    _ = require('lodash'),
    trim = require('underscore.string/trim'),
    pu = require('./parserutils.js');

var parseAuctionList = function (response) {
        var $ = cheerio.load(response),
            auction_urls = [];

        // add all auction detail pages to be parsed
        $('a.vicezde').each(function () {
            auction_urls.push($(this).attr('href'));
        });

        return auction_urls;
    },

    parseNumberOfPages = function (response) {
        var $ = cheerio.load(response);

        // get numbers of pages that should be parsed
        return parseInt($('a.srch').last().text());
    },

    parseAuctionDetails = function (details) {
        var LOWEST_BID = 'lowestBid',
            AUCTION_DATE = 'auctionDate',
            AUCTION_PLACE = 'auctionPlace',
            COUNTY = 'county',
            ESTIMATED_PRICE = 'estimatedPrice',
            AUCTION_SECURITY = 'auctionSecurity',
            AUCTION_PDF = 'documents.auction',
            AUCTION_NOTICE_PDF = 'documents.auctionNotice',
            result = {
                unknown: [],
                unmapped: []
            },
            curr_pos = 0,
            key_mapping = {
                'Nejnižší podání:': LOWEST_BID,
                'Datum konání dražby:': AUCTION_DATE,
                'Místo konání dražby:': AUCTION_PLACE,
                'Okres:': COUNTY,
                'Cena stanovena znaleckým posudkem:': ESTIMATED_PRICE,
                'Dražební jistota:': AUCTION_SECURITY,
                'PDF - o dražbě:': AUCTION_PDF,
                'PDF - dražební vyhláška': AUCTION_NOTICE_PDF
            },
            raw_key,
            key,
            value,
            curr;

        if (details.length > 0) {
            result.identifier = pu.parseIdent(details.eq(curr_pos).text());

            while (curr_pos < details.length - 1) {
                curr_pos++;
                if (details.eq(curr_pos).hasClass('right_popis_left') && details.eq(curr_pos + 1).hasClass('right_popis_right')) {
                    raw_key = details.eq(curr_pos).text();
                    if (key_mapping.hasOwnProperty(raw_key)) {
                        key = key_mapping[raw_key];
                        // type specific value processing
                        switch (key) {
                            case AUCTION_PDF:
                            case AUCTION_NOTICE_PDF:
                                value = details.eq(curr_pos + 1).find('a').attr('href');
                                break;
                            case LOWEST_BID:
                            case ESTIMATED_PRICE:
                            case AUCTION_SECURITY:
                                value = details.eq(curr_pos + 1).text();
                                if (pu.isCurrency(value, 'Kč')) {
                                    value = pu.getAmount(value);
                                    curr = 'CZK';
                                }
                                break;
                            case AUCTION_PLACE:
                                if (details.eq(curr_pos + 1).find('a')) {
                                    value = details.eq(curr_pos + 1).text().trim();
                                    _.set(result, 'auctionPlaceUrl', details.eq(curr_pos + 1).find('a').attr('href'));
                                }
                                break;
                            case AUCTION_DATE:
                                value = pu.parseDate(details.eq(curr_pos + 1).text()).toDate();
                                break;
                            default:
                                value = details.eq(curr_pos + 1).text().trim();
                        }
                        // set the value
                        _.set(result, key, value);
                    } else if (raw_key.match(/PDF - ostatní .*/)) {
                        key = 'documents.other';
                        value = _.get(result, key) || [];
                        value.push(details.eq(curr_pos + 1).find('a').attr('href'));
                        _.set(result, key, value);
                    } else {
                        result.unmapped.push(details.eq(curr_pos).text() + ' ' + details.eq(curr_pos + 1).text());
                    }
                    curr_pos++;
                } else if(!details.eq(curr_pos).hasClass('clear')) {
                    result.unknown.push(details.eq(curr_pos).text());
                }
            }

            result.currency = curr;
        }

        return result;
    },

    parseAuction = function (response) {
        var $ = cheerio.load(response),
            auction = {},
            details,
            parsed_header;

        parsed_header = pu.parseTitle($('h1.nadpis_2').text());
        auction.header = parsed_header[0];
        auction.section = parsed_header[1];
        auction.description = $('div:not(.work_right_karta) > p:not([class])').text().replace(/[\r\n]/g, '');
        details = parseAuctionDetails($('div.work_right_detail_1').children());
        return _.merge(auction, details);
    };

module.exports = {
    parseAuctionList: parseAuctionList,
    parseNumberOfPages: parseNumberOfPages,
    parseAuction: parseAuction
};

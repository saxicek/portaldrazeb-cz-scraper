/*jslint node: true */
/*jshint node: true */

'use strict';

var
    expect = require('chai').expect,
    moment = require('moment-timezone'),
    pu = require('../lib/parserutils.js');

describe('parserutils', function() {
    describe('isCurrency()', function() {

        it('should expose a function', function() {
            expect(pu.isCurrency).to.be.a('function');
        });

        it('should return true if currency is present', function() {
            expect(pu.isCurrency('1.000,- Kč', 'Kč')).to.be.true;
        });

        it('should return false if currency is not present', function() {
            expect(pu.isCurrency('$1,000.00', 'Kč')).to.be.false;
        });
    });

    describe('getAmount()', function() {

        it('should expose a function', function() {
            expect(pu.getAmount).to.be.a('function');
        });

        it('should parse correct amount', function() {
            expect(pu.getAmount('1.000,- Kč')).to.equal(1000);
        });
    });

    describe('parseTitle()', function() {

        it('should expose a function', function() {
            expect(pu.parseTitle).to.be.a('function');
        });

        it('should parse original title to [title, section]', function() {
            expect(pu.parseTitle('Dražba nemovité věci - pozemky v obci Bílovec / \n        \n\t      pozemek\t    '))
                .to.deep.equal(['Dražba nemovité věci - pozemky v obci Bílovec', 'pozemek']);
        });
    });

    describe('parseDate()', function() {

        it('should expose a function', function() {
            expect(pu.parseDate).to.be.a('function');
        });

        it('should parse given date', function() {
            expect(pu.parseDate('05.10.2015 v 9:00 h.').toDate())
                .to.deep.equal(moment.tz('2015-10-05 09:00', 'Europe/Prague').toDate());
        });
    });

    describe('parseIdent()', function() {

        it('should expose a function', function() {
            expect(pu.parseIdent).to.be.a('function');
        });

        it('should parse given identifier', function() {
            expect(pu.parseIdent('EX:\n\t      091 EX 07411 / 13\t    ')).to.equal('091EX07411/13');
        });
    });
});


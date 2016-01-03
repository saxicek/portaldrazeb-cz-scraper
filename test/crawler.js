/*jslint node: true */
/*jshint node: true */

'use strict';

var
    chai = require('chai'),
    //chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect,
    Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs')),
    http = require('http'),
    url = require('url'),
    crawler = require('../lib/crawler.js')('http://127.0.0.1:4000');

//chai.use(chaiAsPromised);

describe('crawler', function() {

    var server, detail_body, list_body;

    before(function (done) {
        fs.readFileAsync('test/data/portaldrazeb.cz-list.html', 'utf8')
            .then(function (data) {
                list_body = data;
            })
            .then(function () {
                return fs.readFileAsync('test/data/portaldrazeb.cz-detail.html', 'utf8');
            })
            .then(function (data) {
                detail_body = data;
            })
            .then(function () {
                // This creates a local server to test for various status codes. A request to /404 returns a 404, etc
                server = http.createServer(function (request, response) {
                    var path = url.parse(request.url).pathname;
                    if (path === '/vyhledavani') {
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.end(list_body);
                    } else {
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.end(detail_body);
                    }
                });
                server.listen(4000, function () {
                    done();
                });
            });
    });

    after(function () {
        // Wait for all requests to finish since they may produce unhandled errors for tests at the end that don't wait themselves.
        setTimeout(function () {
            server.close();
        }, 20);
    });

    describe('crawlAuctions()', function() {

        it('should expose a function', function() {
            expect(crawler.crawlAuctions).to.be.a('function');
        });

        it('should crawl all auctions', function(done) {
            var auctions = [
                { url: 'http://127.0.0.1:4000/091EX00397/11-084/podil-id-1-6-rodinneho-domu-s-pozemkem-v-obci-kounov-okres-rychnov-nad-kneznou?backsearch=1' },
                { url: 'http://127.0.0.1:4000/091EX07411/13-081/drazba-nemovite-veci-pozemky-v-obci-bilovec?backsearch=1' },
                { url: 'http://127.0.0.1:4000/085EX06444/11-345/rodinny-dum-mrakotin-u-skutce?backsearch=1' }
            ];
            crawler
                .crawlAuctions(auctions)
                .then(
                    function (result) {
                        expect(result).to.have.length(3);
                        expect(result[0]).to.be.an('object');
                        expect(result[0]).to.contain.all.keys(['url', 'identifier']);
                        expect(result[1]).to.be.an('object');
                        expect(result[1]).to.contain.all.keys(['url', 'identifier']);
                        expect(result[2]).to.be.an('object');
                        expect(result[2]).to.contain.all.keys(['url', 'identifier']);
                        done();
                    },
                    function (err) {
                        done(err);
                    }
                );
        });
    });

    describe('crawlPages()', function() {

        it('should expose a function', function() {
            expect(crawler.crawlPages).to.be.a('function');
        });

        it('should crawl all pages and return array of their urls', function(done) {
            crawler.crawlPages(3).then(
                function (result) {
                    expect(result).to.have.length(20);
                    expect(result).to.include('http://www.portaldrazeb.cz/168EX4479/14-39/pozemek-podil-1-2-obec-melnik?backsearch=1');
                    done();
                },
                function (err) {
                    done(err);
                }
            );
        });
    });

    describe('getTotalPages()', function() {

        it('should expose a function', function() {
            expect(crawler.getTotalPages).to.be.a('function');
        });

        it('should return correct number of pages', function(done) {
            return crawler.getTotalPages().then(
                function (result) {
                    expect(result).to.equal(129);
                    done();
                },
                function (err) {
                    done(err);
                }
            );
        });
    });

    describe('getAuctionUrls()', function() {

        it('should expose a function', function() {
            expect(crawler.getAuctionUrls).to.be.a('function');
        });

        it('should return correct number of pages', function(done) {
            return crawler.getAuctionUrls().then(
                function (result) {
                    expect(result).to.have.length(20);
                    expect(result).to.include('http://www.portaldrazeb.cz/168EX4479/14-39/pozemek-podil-1-2-obec-melnik?backsearch=1');
                    done();
                },
                function (err) {
                    done(err);
                }
            );
        });
    });
});

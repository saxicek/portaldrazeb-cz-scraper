/*jslint node: true */
/*jshint node: true */

'use strict';

var
    expect  = require('chai').expect,
    fs      = require('fs'),
    parser  = require('../lib/parser.js');

describe('parser', function() {
    describe('parseAuctionList()', function() {
        var body;

        before(function(done) {
            fs.readFile('test/data/portaldrazeb.cz-list.html', 'utf8', function (err, data) {
                if (err) return console.log(err);
                body = data;
                done();
            });
        });

        it('should expose a function', function() {
            expect(parser.parseAuctionList).to.be.a('function');
        });

        it('should parse auction list', function() {
            expect(parser.parseAuctionList(body)).to.deep.equal([
                'http://www.portaldrazeb.cz/091EX00397/11-084/podil-id-1-6-rodinneho-domu-s-pozemkem-v-obci-kounov-okres-rychnov-nad-kneznou?backsearch=1',
                'http://www.portaldrazeb.cz/091EX07411/13-081/drazba-nemovite-veci-pozemky-v-obci-bilovec?backsearch=1',
                'http://www.portaldrazeb.cz/085EX06444/11-345/rodinny-dum-mrakotin-u-skutce?backsearch=1',
                'http://www.portaldrazeb.cz/085EX08602/12-143/pozemek-o-velikosti-2231-m2-mikulcice?backsearch=1',
                'http://www.portaldrazeb.cz/085EX00884/08-649/byvala-restaurace-vimperk-podil-1-2?backsearch=1',
                'http://www.portaldrazeb.cz/085EX00767/08-134/rodinny-dum-malonty-podil-8-10?backsearch=1',
                'http://www.portaldrazeb.cz/085EX09907/10-300/rodinny-dum-ktis?backsearch=1',
                'http://www.portaldrazeb.cz/085EX18178/13-78/rodinny-dum-krasna-hora-nad-vltavou?backsearch=1',
                'http://www.portaldrazeb.cz/164EX03470/14-51/chata-sazava-u-davle-podil-1-2?backsearch=1',
                'http://www.portaldrazeb.cz/085EX2297/09-339/rodinny-dum-horomerice?backsearch=1',
                'http://www.portaldrazeb.cz/085EX02297/09-339/rodinny-dum-horomerice?backsearch=1',
                'http://www.portaldrazeb.cz/035DR00002/14-24/pozemek-prosec-oboriste-podil-1-32?backsearch=1',
                'http://www.portaldrazeb.cz/168EX1812/14-40/pozemek-ovocny-sad-nedrazi-se-uhrazeno?backsearch=1',
                'http://www.portaldrazeb.cz/168EX98/13-29/pozemek-podil-id-1-4-obec-zbysov?backsearch=1',
                'http://www.portaldrazeb.cz/091EX397/11-085/drazba-nemovite-veci-id-podil-1-3-domu-a-pozemku-v-obci-hejnice?backsearch=1',
                'http://www.portaldrazeb.cz/091EX11145/10-066/drazba-nemovite-veci-id-podil-1-18-domu-a-pozemku-v-obci-bruntal?backsearch=1',
                'http://www.portaldrazeb.cz/091EX1984/09-081/drazba-nemovite-veci-id-podil-1-2-pozemku-v-obci-milonice?backsearch=1',
                'http://www.portaldrazeb.cz/091EX7413/09-089/drazba-nemovite-veci-pozemku-u-obce-cerncice-okres-louny?backsearch=1',
                'http://www.portaldrazeb.cz/168EX4479/14-39/pozemek-podil-1-2-obec-melnik?backsearch=1',
                'http://www.portaldrazeb.cz/168EX1279/12-72/pozemky-obec-olomouc?backsearch=1'
            ]);
        });
    });

    describe('parseNumberOfPages()', function() {
        var body;

        before(function(done) {
            fs.readFile('test/data/portaldrazeb.cz-list.html', 'utf8', function (err, data) {
                if (err) return console.log(err);
                body = data;
                done();
            });
        });

        it('should expose a function', function() {
            expect(parser.parseNumberOfPages).to.be.a('function');
        });

        it('should parse correct number of pages', function() {
            expect(parser.parseNumberOfPages(body)).to.equal(129);
        });
    });

    describe('parseAuction()', function() {
        var body;

        before(function(done) {
            fs.readFile('test/data/portaldrazeb.cz-detail.html', 'utf8', function (err, data) {
                if (err) return console.log(err);
                body = data;
                done();
            });
        });

        it('should expose a function', function() {
            expect(parser.parseAuction).to.be.a('function');
        });

        it('should parse auction detail', function() {
            expect(parser.parseAuction(body)).to.deep.equal({
                identifier: '091EX07411/13',
                header: 'Dražba nemovité věci - pozemky v obci Bílovec',
                section: 'pozemek',
                lowestBid: 158247,
                currency: 'CZK',
                auctionDate: new Date(2015, 9, 5, 9, 0, 0, 0), // 05.10.2015 v 9:00 h.
                auctionPlace: 'OK Dražby',
                auctionPlaceUrl: 'https://www.okdrazby.cz/drazba/23227-drazba-nemovite-veci-pozemky-v-obci-bilovec/?nahled=448ea1e596840cfabdf8e0dcdaee48f3',
                county: 'Nový Jičín',
                estimatedPrice: 237370,
                auctionSecurity: 5000,
                documents: {
                    auction: 'http://www.portaldrazeb.cz/pdf1/105836.pdf',
                    auctionNotice: 'http://www.portaldrazeb.cz/pdf2/105836.pdf',
                    other: [
                        'http://www.portaldrazeb.cz/pdf5/105836.pdf'
                    ]
                },
                description: 'Předmětem dražby jsou pozemky č. 200/8 (orná půda), 234 (lesní pozemek) a 236/18 (orná půda) rozkládající se mezi částmi obce Lubojaty a Lhotkou, navazují na sebe v úzkém pásu a jsou začleněny do zemědělsky obhospodařovaného láno, mimo pozemek parc. č. 234. Tento je součástí půdoochranného břehového porostu s listnatou kmenovinou. Pozemky jsou mírně sklonité, s přístupem ze zpevněné obecní komunikace. Dle územního plánu obce jsou v ploše NS - plochy smíšené nezastavěného území a Z - plochy zemědělské.',
                unknown: [],
                unmapped: []
            });
        });
    });

});

/*jslint node: true */
/*jshint node: true */

'use strict';

var db = require('../db.js').db,
    Promise = require('bluebird'),

    updateDesign = Promise.promisify(function (name, design, cb) {
        db.get(name, function(err, body) {
            // ignore error - design may not be defined
            if (!err) {
                design._rev = body._rev;
            }
            db.insert(design, function(err) {
                if (err) {
                    console.error(err);
                }
                return cb(err);
            });
        });
    });

module.exports = {
    updateDesign: updateDesign
};

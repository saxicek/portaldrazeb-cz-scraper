/*jslint node: true */

"use strict";

var rp = require('request-promise').defaults({jar: true});

var
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
      ordert: 2
    },
    type: 'html'
  };

// set query parameters
rp(query)
  .then(function() {
      return rp('http://www.portaldrazeb.cz/vyhledavani');
  })
  .then(console.log);

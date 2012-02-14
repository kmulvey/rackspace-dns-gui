var dns = require("../dns");
/*
 * GET home page.
 */

exports.index = function(req, res){
  req.session.dns.initialize('kevin', function(err, data) {
    if (err) throw err;
    res.render('index', { title: data[0].toJSON() });
  });
};

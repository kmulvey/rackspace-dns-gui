var db = require('./db');
var rsdb = new db();

rsdb.getKey('kmulvey', function (err, data) {
                if (err) throw err;
                console.log(data);
});


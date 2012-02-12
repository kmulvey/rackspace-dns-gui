var dns = require('./dns');
var rsdns = new dns();

rsdns.initialize('test', function (err, data) {
                if (err) throw err;
                console.log("Data: " + data[0].toJSON());
});
setTimeout( function () {
	console.log("\n");
	rsdns.getSpecificLimit( 'domain_record_limit', function (data) {
		console.log("Data: " + data);
	});
}, 3000);

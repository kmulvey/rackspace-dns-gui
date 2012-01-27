var https = require('https');

var dns = module.exports = function dns() {
	auth_token = '', acct_num = '';
}

dns.prototype.init = function() {
	make_request(null, function(res) {
		var data = JSON.parse(res);	
		this.auth_token = data.auth.token.id;
		var url = data.auth.serviceCatalog.cloudServers[0].publicURL;
		var cut = url.split('/');
		this.acct_num = cut[cut.length - 1];
		make_request('domains', function(res) {
			console.log(res);
		});
	});
}

dns.prototype.getdomains = function() {
	make_request('domains', function(res) {	
		console.log(res);
	});
};

// curl -X GET -H "X-Auth-Token: 56b77346-c977-4523-8c69-94013c6c49d4" -H "Accept: application/xml" https://dns.api.rackspacecloud.com/v1.0/412508/domains

function make_request(path, callback) {
	var options = null;
	var response = null;

	if (path == null || path == '') {
		options = {
			host : 'auth.api.rackspacecloud.com',
			port : 443,
			path : '/v1.1/auth HTTP/1.1/',
			method : 'POST',
			headers : {
				'Accept' : 'application/json'
			}
		};
		var req = https.request(options);
		req.write('{"credentials":{ "username": "kmulvey", "key": "d6cecb77f407e81b58a8dcfa7a33384b"}}');
		var res = req.on('response', function(res) {
			if (200 <= res.statusCode < 300) {
				res.setEncoding('utf8');	
				res.on('data', function(d) {
					callback(d);
				});
			}
		});
		req.on('error', function(e) {
			console.error(e);
		});
		req.end();
	} else {
		options = {
			host : 'dns.api.rackspacecloud.com',
			port : 443,
			path : '/v1.0/' + this.acct_num + '/' + path,
			method : 'GET',
			headers : {
				'X-Auth-Token' : this.auth_token,
				'Accept' : 'application/json'
			}
		};
		console.log(options);
		var req = https.request(options);
		var res = req.on('response', function(res) {
			res.setEncoding('utf8');
			res.on('data', function(d) {
				callback(d);
			});
		});
		req.on('error', function(e) {
			console.error(e);
		});
		req.end();
	}

}

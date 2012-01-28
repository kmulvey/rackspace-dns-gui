var https = require('https');
var Domain = require('./Domain');

var dns = module.exports = function dns() {
	auth_token = '', acct_num = '';
};

dns.prototype.init = function() {
	make_request(null, 'POST', function(res) {
		var data = JSON.parse(res);
		this.auth_token = data.auth.token.id;
		var url = data.auth.serviceCatalog.cloudServers[0].publicURL;
		var cut = url.split('/');
		this.acct_num = cut[cut.length - 1];
	});
};

dns.prototype.getDomains = function() {
	make_request('domains', 'GET', function(res) {
		var data = JSON.parse(res);
		var domains = data.domains;
		var domainArray = [];
		for ( var i = 0; i < domains.length; i++) {
			var domain = new Domain();
			domain.init(domains[i]);
			domainArray.push(domain);
		}
		domainArray[0].toJSON();
	});
};
dns.prototype.getDomain = function(domainName) {
	make_request('/domains/?name=' + domainName, 'GET', function(res) {
		console.log(res);
	});
};
dns.prototype.getSubDomain = function(domainId) {
	make_request('domains/' + domainId + '/subdomains', 'GET', function(res) {
		console.log(res);
	});
};
dns.prototype.getDomainDetails = function(domainId, records, subdomains) {
	if (records != true)
		records = false;
	if (subdomains != true)
		sub = false;

	make_request('/domains/' + domainId + '?showRecords=' + records + '&showSubdomains=' + subdomains, 'GET', function(res) {
		console.log(res);
	});
};
dns.prototype.getDomainChanges = function(domainId, changeDate) {
	var change = new Date(changeDate);
	make_request('/domains/' + domainId + '/chnages?since=' + change, 'GET', function(res) {
		console.log(res);
	});
};
dns.prototype.exportDomain = function(domainId) {
	make_request('/domains/' + domainId + '/export', 'GET', function(res) {
		console.log(res);
	});
};
dns.prototype.removeDomains = function() {
	var args = Array.prototype.slice.call(arguments);
	var uri = '';
	var subdomains = args[1];
	if (subdomains != true)
		subdomains = false;

	for ( var i = 2; i < args.length; i++) {
		uri += '?id=' + args[i];
	}
	uri += '&deleteSubdomains=' + subdomains;
	make_request('/domains' + uri, function(res) {
		console.log(res);
	});
};
dns.prototype.getLimits = function() {
	make_request('/limits', 'GET', function(res) {
		console.log(res);
	});
};
dns.prototype.getLimitTypes = function() {
	make_request('/limits/types', 'GET', function(res) {
		console.log(res);
	});
};
dns.prototype.getSpecificLimit = function(type) {
	make_request('/limits/' + type, 'GET', function(res) {
		console.log(res);
	});
};
dns.prototype.getRecords = function(domainId) {
	make_request('domains/' + domainId + '/records', 'GET', function(res) {
		console.log(res);
	});
};
dns.prototype.getRecordDetails = function(domainId, recordId) {
	make_request('domains/' + domainId + '/records/' + recordId, 'GET', function(res) {
		console.log(res);
	});
};

// --------------------------------------------------------------------------------------------------
// UTILITY FUNCTIONS
// --------------------------------------------------------------------------------------------------
function make_request(path, method, callback) {
	var options = null;
	var res = null;

	if (path == null || path == '') {
		options = {
			host : 'auth.api.rackspacecloud.com',
			port : 443,
			path : '/v1.1/auth HTTP/1.1/',
			method : method,
			headers : {
				'Accept' : 'application/json'
			}
		};
		var req = https.request(options);
		req.write('{"credentials":{ "username": "kmulvey", "key": "d6cecb77f407e81b58a8dcfa7a33384b"}}');
		res = req.on('response', function(res) {
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
			method : method,
			headers : {
				'X-Auth-Token' : this.auth_token,
				'Accept' : 'application/json'
			}
		};
		console.log(options);
		var req = https.request(options);
		res = req.on('response', function(res) {
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

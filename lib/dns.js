var https = require('https');
var routes = require('./routes');
var Step = require('step');

var Domain = require('./Domain');
var Record = require('./Record');
var Limit = require('./Limit');

var dns = module.exports = function dns() {
	user_name = '', key = '', auth_token = '', acct_num = '';
};

// don't really need to use step now, should remove later.
dns.prototype.initialize = Step.fn(function getToken(name, key) {
	dns.user_name = name;
	dns.key = key;
	make_request(null, 'POST', null, this);
}, function parseToken(res) {
	var data = JSON.parse(res);
	if (data.unauthorized)
		return '{ "message" : "Username or api key is invalid" }';
	dns.auth_token = data.auth.token.id;
	var url = data.auth.serviceCatalog.cloudServers[0].publicURL;
	var cut = url.split('/');
	dns.acct_num = cut[cut.length - 1];
	return '{ "auth_token" : "' + dns.auth_token + '",  "acct_num" : "' + dns.acct_num + '" }';
} /*
	 * , function getDomains(err, acctNum) { if (err) throw err; make_request('domains', 'GET', null, this); }, function returnBack(res) { var data = JSON.parse(res); var domains = data.domains; var domainArray = []; for ( var i = 0; i < domains.length; i++) { var domain = new Domain(); domain.init(domains[i]); domainArray.push(domain); } return domainArray; }
	 */
);

// --------------------------------------------------------------------------------------------------
// DOMAINS APIS
// --------------------------------------------------------------------------------------------------

// List all domains manageable by the account specified. Display IDs and names only
dns.prototype.getDomains = function(callback) {
	make_request('domains', 'GET', null, function(res) {
		callback(res);
	});
};

// Filter domains by domain name: list all domains manageable by the account specified that match the name domainName. Display IDs and names only
dns.prototype.getDomain = function(domainName, callback) {
	make_request('domains/?name=' + domainName, 'GET', null, function(res) {
		callback(res);
	});
};

// List domains that are subdomains of the specified domain
dns.prototype.getSubDomain = function(domainId, callback) {
	make_request('domains/' + domainId + '/subdomains', 'GET', null, function(res) {
		callback(res);
	});
};

// List details of the specified domain. Display details, as specified by the showRecords and showSubdomains parameters
dns.prototype.getDomainDetails = function(domainId, records, subdomains, callback) {
	if (records != true)
		records = false;
	if (subdomains != true)
		sub = false;

	make_request('domains/' + domainId + '?showRecords=' + records + '&showSubdomains=' + subdomains, 'GET', null, function(res) {
		callback(res);
	});
};

// Show all changes to the specified domain since the specified date/time
dns.prototype.getDomainChanges = function(domainId, changeDate, callback) {
	var change = new Date(changeDate);
	make_request('domains/' + domainId + '/chnages?since=' + change, 'GET', null, function(res) {
		callback(res);
	});
};

// Export details of the specified domain
dns.prototype.exportDomain = function(domainId, callback) {
	make_request('domains/' + domainId + '/export', 'GET', null, function(res) {
		callback(res);
	});
};

// Create a new domain with the configuration defined by the request
dns.prototype.createDomains = function(domain, callback) {
	make_request('domains', 'POST', domain.toJSON(), function(res) {
		callback(res);
	});
};

// Import a new domain with the configuration specified by the request
dns.prototype.importDomains = function(domain, callback) {
	make_request('domains/import', 'POST', domain.toJSON(), function(res) {
		callback(res);
	});
};

// Modify the configuration of a domain or domains
dns.prototype.modifyDomains = function(domains, callback) {
	var uri = '';
	if (domains.length == 1)
		uri = '/' + domains[0].id;
	make_request('domains' + uri, 'PUT', domains.toJSON(), function(res) {
		callback(res);
	});
};

// Remove a domain or multiple domains and/or its/their subdomains from an account
dns.prototype.removeDomains = function(domains, subdomains, callback) {
	var uri = '';
	if (subdomains != true)
		subdomains = false;

	if (domains.length == 1) {
		uri = '/' + domains[0].id;
		if (subdomains)
			uri += '?deleteSubdomains=true';
	} else {
		for ( var i = 0; i < domains.length; i++) {
			if (i == 0)
				uri += '?id=' + domains[i].id;
			else
				uri += '&id=' + domains[i].id;
		}
		if (subdomains)
			uri += '&deleteSubdomains=true';
	}
	make_request('domains' + uri, 'DELETE', null, function(res) {
		callback(res);
	});
};

// --------------------------------------------------------------------------------------------------
// LIMITS APIS
// --------------------------------------------------------------------------------------------------

// List all applicable limits
dns.prototype.getLimits = function(callback) {
	make_request('limits', 'GET', null, function(res) {
		var data = JSON.parse(res);
		var rates = data.rates.rate;
		var absolute = data.absolute;
		var limitArray = [];
		var limit;
		var rate;
		for ( var i = 0; i < rates.length; i++) {
			rate = rates[i];
			for ( var j = 0; j < rate.limit.length; j++) {
				limit = new Limit();
				limit.init('rates', rate.limit[j], rate.uri, rate.regex);
				limitArray.push(limit);
			}
		}
		for ( var k = 0; k < absolute.limit.length; k++) {
			limit = new Limit();
			limit.init('absolute', absolute.limit[k], '', '');
			limitArray.push(limit);
		}
		callback(limitArray);
	});
};

// List the types of limits
dns.prototype.getLimitTypes = function(callback) {
	make_request('limits/types', 'GET', null, function(res) {
		callback(res);
	});
};

// List assigned limits of the specified type
dns.prototype.getSpecificLimit = function(type, callback) {
	make_request('limits/' + type, 'GET', null, function(res) {
		callback(res);
	});
};

// --------------------------------------------------------------------------------------------------
// RECORDS APIS
// --------------------------------------------------------------------------------------------------

// List all records configured for the specified domain. SOA cannot be modified
dns.prototype.getRecords = function(domainId, callback) {
	make_request('domains/' + domainId + '/records', 'GET', null, function(res) {
		var data = JSON.parse(res);
		var records = data.records;
		var recordArray = [];
		for ( var i = 0; i < records.length; i++) {
			var record = new Record();
			record.init(records[i]);
			recordArray.push(record);
		}
		callback(recordArray);
	});
};

// List details for a specific record in the specified domain
dns.prototype.getRecordDetails = function(domainId, recordId, callback) {
	make_request('domains/' + domainId + '/records/' + recordId, 'GET', null, function(res) {
		var data = JSON.pars(res);
		var record = new Record();
		record.init(data);
		callback(record);
	});
};

// Add new record(s) to the specified domain
dns.prototype.addRecords = function(domainId, records, callback) {
	var uri = '';
	var body = '{ "records" : [ ';
	for ( var i = 0; i < records.length; i++) {
		body = body + records[i].addRequest();
		if ((i + 1) == records.length)
			body = body + ' ] }';
		else
			body = body + ', ';
	}
	callback('hi');
	make_request('domains/' + domainId + '/records', 'POST', body, function(res) {
		callback(res);
	});
};

// Modify the configuration of a record or records in the domain
dns.prototype.modifyRecords = function(domainId, records, callback) {
	var uri = '';
	var body = '';
	if (records.length == 1) {
		uri = '/' + records[0].id;
		body = records[0].addRequest();
	} else {
		body = '{ "records" : [ ';
		for ( var i = 0; i < records.length; i++) {
			body = body + records[i].modifyRequest();
			if ((i + 1) == records.length)
				body = body + ' ] }';
			else
				body = body + ', ';
		}
	}
	callback('hi');
	make_request('domains/' + domainId + '/records' + uri, 'PUT', body, function(res) {
		callback(res);
	});
};

// Remove a record or multiple records from the domain
dns.prototype.removeRecords = function(domainId, records, callback) {
	var uri = '';
	var body = '';
	for ( var i = 0; i < records.length; i++) {
		uri = 'id=' + records[i].id;
	}
	console.log(uri);
	callback('hi');
	//DELETE https://dns.api.rackspacecloud.com/v1.0/1234/domains/2725233/records/?id=A-6817754&id=111111111&id=222222222&id=NS-6251982
	make_request('domains/' + domainId + '/records?' + uri, 'DELETE', body, function(res) {
		callback(res);
	});
};

// --------------------------------------------------------------------------------------------------
// UTILITY FUNCTIONS
// --------------------------------------------------------------------------------------------------
function make_request(path, method, body, callback) {
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
		req.write('{"credentials":{ "username": "' + dns.user_name + '", "key": "' + dns.key + '"}}');
		res = req.on('response', function(res) {
			if (200 <= res.statusCode < 300) {
				res.setEncoding('utf8');
				res.on('data', function(d) {
					callback(d);
				});
			}
		});
		req.on('error', function(e) {
			console.error('Err: ' + e);
		});
		req.end();
	} else {
		options = {
			host : 'dns.api.rackspacecloud.com',
			port : 443,
			path : '/v1.0/' + dns.acct_num + '/' + path,
			method : method,
			headers : {
				'X-Auth-Token' : dns.auth_token,
				'Accept' : 'application/json',
				'Content-Type': 'application/json'
			}
		};
		var req = https.request(options);
		if (body != null && body != '') {
			req.write(body);
		}

		res = req.on('response', function(res) {
			res.on('data', function(d) {
				console.log('res.statusCode: ' + d);
			});

			if (200 <= res.statusCode < 300) {
				res.setEncoding('utf8');
				res.on('data', function(d) {
					callback(d);
				});
			}
		});
		req.on('error', function(e) {
			console.error('Err: ' + e);
		});
		req.end();
	}
}
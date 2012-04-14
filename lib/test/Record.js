var vows = require('vows'), assert = require('assert'), Record = require('../Record');

vows.describe('Record').addBatch({ // Batch
	'A Record' : { // Context
		'init full record' : { // Sub-Context
			topic : function() {
				var arg = {
					name : "mail.test.com",
					id : "1234",
					type : "MX",
					data : "test.stabletransit.com",
					ttl : "3600",
					updated : "2012-04-09 23:19:54.000+0000",
					created : "2012-04-13 01:57:38.000+0000"
				};
				var record = new Record(); // Topic
				record.init(arg);
				return record;
			},

			'well formed JSON' : function(topic) { // Vow
				var correctJSON = JSON.parse('{"name" : "mail.test.com","id" : "1234","type" : "MX","data" : "test.stabletransit.com","ttl" : "3600","updated" : "2012-04-09 23:19:54.000+0000","created" : "2012-04-13 01:57:38.000+0000"}');
				assert.equal(JSON.stringify(JSON.parse(topic.toJSON())), JSON.stringify(correctJSON));
			},
			'modify record' : function(topic) { // Vow
				var correctJSON = JSON.parse('{ "name" : "mail.test.com", "id" : "1234", "data" : "test.stabletransit.com", "ttl" : "3600" }');
				assert.equal(JSON.stringify(JSON.parse(topic.modifyRequest())), JSON.stringify(correctJSON));
			}
		},
		'init new record' : { // Sub-Context
			topic : function() {
				var record = new Record(); // Topic
				record.initAdd("mail.test.com", "MX", "test.stabletransit.com", "3600");
				return record;
			},

			'well formed JSON' : function(topic) { // Vow
				var correctJSON = JSON.parse('{"name": "mail.test.com","type": "MX","data": "test.stabletransit.com","ttl": "3600"}');
				assert.equal(JSON.stringify(JSON.parse(topic.toJSON())), JSON.stringify(correctJSON));
			},
			'add record' : function(topic) { // Vow
				var correctJSON = JSON.parse('{ "name" : "mail.test.com", "type" : "MX", "data" : "test.stabletransit.com", "ttl" : "3600" }');
				assert.equal(JSON.stringify(JSON.parse(topic.addRequest())), JSON.stringify(correctJSON));
			}
		},
		'init delete record' : { // Sub-Context
			topic : function() {
				var record = new Record(); // Topic
				record.initDel("1234");
				return record;
			},

			'well formed JSON' : function(topic) { // Vow
				var correctJSON = JSON.parse('{"id": "1234"}');
				assert.equal(JSON.stringify(JSON.parse(topic.toJSON())), JSON.stringify(correctJSON));
			}
		}

	}
}).export(module);
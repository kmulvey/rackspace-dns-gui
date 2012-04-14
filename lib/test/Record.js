var vows = require('vows'), assert = require('assert'), Record = require('../Record');

vows.describe('Record').addBatch({ // Batch
	'A Record' : { // Context
		'init new record' : { // Sub-Context
			topic : function() {
				var record = new Record(); // Topic
				record.initAdd("mail.test.com", "MX", "test.stabletransit.com", "3600");
				return record;
			},

			'well formed JSON' : function(topic) { // Vow
				assert.equal(topic.toJSON(), '{"name": "mail.test.com","type": "MX","data": "test.stabletransit.com","ttl": "3600}');
			}
		}
	}
}).export(module);
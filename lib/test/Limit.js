var vows = require('vows'), assert = require('assert'), Limit = require('../Limit');

vows.describe('Limit').addBatch({ // Batch
	'A Limit' : { // Context
		'init Limit' : { // Sub-Context
			topic : function() {
				var limit = new Limit(); // Topic
				var lim = {
					name : 'idk',
					value : '5',
					verb : 'GET',
					unit : 'SECOND'
				};
				limit.init("rates", lim, "*/status/*", ".*/v\d+\.\d+/(\d+/status).*");
				return limit;
			},

			'well formed JSON' : function(topic) { // Vow
				var correctJSON = JSON.parse('{"type":"rates","uri":"*/status/*","name":"idk","value":"5","verb":"GET","unit":"SECOND","regex":".*/vd+.d+/(d+/status).*"}');
				assert.equal(JSON.stringify(JSON.parse(topic.toJSON())), JSON.stringify(correctJSON));
			}
		}
	}
}).export(module);
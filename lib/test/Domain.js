var vows = require('vows'), assert = require('assert'), Domain = require('../Domain');

vows.describe('Domain').addBatch({ // Batch
	'A Domain' : { // Context
		'init full domain' : { // Sub-Context
			topic : function() {
				var arg = {
					name : "mail.test.com",
					id : "1234",
					comment : "MX",
					accountId : "abc123",
					ttl : "3600",
					emailAddress: "test@test.com",
					updated : "2012-04-09 23:19:54.000+0000",
					created : "2012-04-13 01:57:38.000+0000"
				};
				var domain = new Domain(); // Topic
				domain.init(arg);
				return domain;
			},

			'well formed JSON' : function(topic) { // Vow
				var correctJSON = JSON.parse('{"name":"mail.test.com","id":"1234","comment":"MX","accountId":"abc123","ttl":"3600","emailAddress":"test@test.com","updated":"2012-04-09 23:19:54.000+0000","created":"2012-04-13 01:57:38.000+0000"}');
				assert.equal(JSON.stringify(JSON.parse(topic.toJSON())), JSON.stringify(correctJSON));
			},
			'modify domain' : function(topic) { // Vow
				var correctJSON = JSON.parse('{"id":"1234","comment":"MX","ttl":"3600","emailAddress":"test@test.com"}');
				assert.equal(JSON.stringify(JSON.parse(topic.modifyRequest())), JSON.stringify(correctJSON));
			},
			'add domain' : function(topic) { // Vow
				var correctJSON = JSON.parse('{"name":"mail.test.com","comment":"MX","ttl":"3600","emailAddress":"test@test.com"}');
				assert.equal(JSON.stringify(JSON.parse(topic.addRequest())), JSON.stringify(correctJSON));
			},
			'modify domain' : function(topic) { // Vow
				var correctJSON = JSON.parse('{"comment":"MX","ttl":"3600","emailAddress":"test@test.com"}');
				assert.equal(JSON.stringify(JSON.parse(topic.modifyRequestNoId())), JSON.stringify(correctJSON));
			}
		},
		'init all domain' : { // Sub-Context
			topic : function() {
				//name, id, comment, accountId, ttl, emailAddress, updated, created
				var domain = new Domain(); // Topic
				domain.initAll("mail.test.com", "1234", "comment", "abc123", "3600", "test@test.com", "2012-04-09 23:19:54.000+0000","2012-04-13 01:57:38.000+0000");
				return domain;
			},
			'well formed JSON' : function(topic) { // Vow
				var correctJSON = JSON.parse('{"name":"mail.test.com","id":"1234","comment":"comment","accountId":"abc123","ttl":"3600","emailAddress":"test@test.com","updated":"2012-04-09 23:19:54.000+0000","created":"2012-04-13 01:57:38.000+0000"}');
				assert.equal(JSON.stringify(JSON.parse(topic.toJSON())), JSON.stringify(correctJSON));
			},
			'modify domain' : function(topic) { // Vow
				var correctJSON = JSON.parse('{"id":"1234","comment":"comment","ttl":"3600","emailAddress":"test@test.com"}');
				assert.equal(JSON.stringify(JSON.parse(topic.modifyRequest())), JSON.stringify(correctJSON));
			},
			'add domain' : function(topic) { // Vow
				var correctJSON = JSON.parse('{"name":"mail.test.com","comment":"comment","ttl":"3600","emailAddress":"test@test.com"}');
				assert.equal(JSON.stringify(JSON.parse(topic.addRequest())), JSON.stringify(correctJSON));
			},
			'modify domain' : function(topic) { // Vow
				var correctJSON = JSON.parse('{"comment":"comment","ttl":"3600","emailAddress":"test@test.com"}');
				assert.equal(JSON.stringify(JSON.parse(topic.modifyRequestNoId())), JSON.stringify(correctJSON));
			}
		},
		'init add domain' : { // Sub-Context
			topic : function() {
				var domain = new Domain(); // Topic
				domain.initAdd("mail.test.com", "comment", "3600", "test@test.com");
				return domain;
			},
			'well formed JSON' : function(topic) { // Vow
				var correctJSON = JSON.parse('{"name":"mail.test.com","comment":"comment","ttl":"3600","emailAddress":"test@test.com"}');
				assert.equal(JSON.stringify(JSON.parse(topic.toJSON())), JSON.stringify(correctJSON));
			},
			'add domain' : function(topic) { // Vow
				var correctJSON = JSON.parse('{"name":"mail.test.com","comment":"comment","ttl":"3600","emailAddress":"test@test.com"}');
				assert.equal(JSON.stringify(JSON.parse(topic.addRequest())), JSON.stringify(correctJSON));
			}
		},
		'init delete domain' : { // Sub-Context
			topic : function() {
				var domain = new Domain(); // Topic
				domain.initDel("1234");
				return domain;
			},
			'well formed JSON' : function(topic) { // Vow
				var correctJSON = JSON.parse('{"id":"1234"}');
				assert.equal(JSON.stringify(JSON.parse(topic.toJSON())), JSON.stringify(correctJSON));
			}
		}
	}
}).export(module);
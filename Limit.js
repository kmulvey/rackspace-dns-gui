var Limit = module.exports = function Limit() {
	type = '', uri = '', name = '', value = '', verb = '', unit = '', regex = '';
};

Limit.prototype.init = function(type, limit, uri, regex) {
	this.type = type;
	this.uri = uri;
	this.name = limit.name;
	this.value = limit.value;
	this.verb = limit.verb;
	this.unit = limit.unit;
	this.regex = regex;
}

Limit.prototype.toJSON = function() {
	var output = '{ "type" : "' + this.type + '", "uri" : "' + this.uri + '", "name" : "' + this.name + '", ';
	output = output + '"value" : "' + this.value + '", "verb" : "' + this.verb + '", ';
	output = output + '"unit" : "' + this.unit + '", "regex" : "' + this.regex + '" }';
	return output;
}

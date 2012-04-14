var Limit = module.exports = function Limit() {
	var type = '', uri = '', name = '', value = '', verb = '', unit = '', regex = '';
};

Limit.prototype.init = function(type, limit, uri, regex) {
	this.type = type;
	this.uri = uri;
	this.name = limit.name;
	this.value = limit.value;
	this.verb = limit.verb;
	this.unit = limit.unit;
	this.regex = regex;
};

Limit.prototype.toJSON = function() {
	var output = '{';
	for ( var key in this) {
		if (typeof this[key] !== 'function' && this[key] !== undefined && this[key] !== null) {
			console.log(key + ' is ' + typeof this[key] + ' = ' + this[key]);
			output += '"' + key + '": "' + this[key] + '",';
		}
	}
	output = output.substring(0, output.length - 2);
	output += '}';
	return output;
};

var Record = module.exports = function Record() {
	name = '', id = '', type = '', data = '', ttl = '', updated = '', created = '';
};

Record.prototype.init = function(arg) {
	this.name = arg.name;
	this.id = arg.id;
	this.type = arg.type;
	this.data = arg.data;
	this.ttl = arg.ttl;
	this.updated = arg.updated;
	this.created = arg.created;
};
<<<<<<< HEAD:lib/Record.js
Record.prototype.initAdd = function(name, type, data, ttl) {
=======
Record.prototype.initAll = function(name, type, data, ttl) {
>>>>>>> github:Record.js
	this.name = name;
	this.type = type;
	this.data = data;
	this.ttl = ttl;
};
Record.prototype.initAll = function(name, id, type, data, ttl, updated, created) {
	this.name = name;
	this.id = id;
	this.type = type;
	this.data = data;
	this.ttl = ttl;
	this.updated = updated;
	this.created = created;
};
Record.prototype.toJSON = function() {
	var output = '{';
	for ( var key in this) {
		if (typeof this[key] != 'function' && this[key] != undefined && this[key] != null) {
<<<<<<< HEAD:lib/Record.js
			//console.log(key + ' is ' + typeof this[key] + ' = ' + this[key]);
=======
			console.log(key + ' is ' + typeof this[key] + ' = ' + this[key]);
>>>>>>> github:Record.js
			output += '"' + key + '": "' + this[key] + '",';
		}
	}
	output = output.substring(0, output.length - 2);
	output += '}';
	return output;
};

Record.prototype.addRequest = function() {
<<<<<<< HEAD:lib/Record.js
	var output = '{ "name" : "' + this.name + '", "type" : "' + this.type + '", "data" : "' + this.data + '", "ttl" : "' + this.ttl + '" }';
=======
	var output = '{ "name" : "' + this.name + '", "data" : "' + this.data + '", "ttl" : "' + this.ttl + '" }';
>>>>>>> github:Record.js
	return output;
};

Record.prototype.modifyRequest = function() {
	var output = '{ "name" : "' + this.name + '", "id" : "' + this.id + '", ';
	output = output + '"data" : "' + this.data + '", "ttl" : "' + this.ttl + '" }';
	return output;
};

var Record = module.exports = function Record() {
        name = '', id = '', type = '', data = '', ttl = '', updated = '', created = '';
};

Domain.prototype.init = function(arg) {
	this.name = arg.name;
	this.id = arg.id;
	this.type = arg.type;
	this.data = arg.data;
	this.ttl = arg.ttl;
	this.updated = arg.updated;
	this.created = arg.created;
};

Domain.prototype.toJSON = function () {
	var output = '{ "name" : "' + this.name + '", "id" : "' + this.id + '", "type" : "' + this.type + '", ';
	output = output + '"data" : "' + this.data + '", "ttl" : "' + this.ttl + '", ';
	output = output + '"updated" : "' + this.updated + '", "created" : "' + this.created + '" }';
	console.log(output);
};

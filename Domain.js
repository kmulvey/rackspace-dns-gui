var Domain = module.exports = function Domain() {
        name = '', id = '', comment = '', accountId = '', ttl = '', emailAddress = '', updated = '', created = '';
};

Domain.prototype.init = function(arg) {
	this.name = arg.name;
	this.id = arg.id;
	this.comment = arg.comment;
	this.accountId = arg.accountId;
	this.ttl = arg.ttl;
	this.emailAddress = arg.emailAddress;
	this.updated = arg.updated;
	this.created = arg.created;
}

Domain.prototype.toJSON = function () {
	var output = '{ "name" : "' + this.name + '", "id" : "' + this.id + '", "comment" : "' + this.comment + '", ';
	output = output + '"accountId" : "' + this.accountId + '", "ttl" : "' + this.ttl + '", "emailAddress" : "' + this.emailAddress + '", ';
	output = output + '"updated" : "' + this.updated + '", "created" : "' + this.created + '" }';
	console.log(output);
}

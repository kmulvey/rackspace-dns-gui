var Domain = module.exports = function Domain() {
	var name = '', id = '', comment = '', accountId = '', ttl = '', emailAddress = '', updated = '', created = '';
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
};
Domain.prototype.initAdd = function(name, comment, ttl, emailAddress) {
	this.name = name;
        this.comment = comment;
        this.ttl = ttl;
        this.emailAddress = emailAddress;
};
Domain.prototype.initDel = function(id) {
        this.id = id;
};
Domain.prototype.initAll = function(name, id, comment, accountId, ttl, emailAddress, updated, created) {
        this.name = name;
        this.id = id;
        this.comment = comment;
        this.accountId = accountId;
        this.ttl = ttl;
	this.emailAddress = emailAddress;
        this.updated = updated;
        this.created = created;
};
Domain.prototype.toJSON = function() {
	var output = '{';
        for ( var key in this) {
                if (typeof this[key] !== 'function' && this[key] !== undefined && this[key] !== null) {
                        //console.log(key + ' is ' + typeof this[key] + ' = ' + this[key]);
                        output += '"' + key + '": "' + this[key] + '",';
                }
        }
        output = output.substring(0, output.length - 2);
        output += '}';
        return output;
};
Domain.prototype.addRequest = function() {
        var output = '{ "name" : "' + this.name + '", "comment" : "' + this.comment + '", "ttl" : "' + this.ttl + '", "emailAddress" : "' + this.emailAddress + '" }';
        return output;
};
Domain.prototype.modifyRequest = function() {
        var output = '{ "id" : "' + this.id + '", "comment" : "' + this.comment + '", ';
        output = output + '"ttl" : "' + this.ttl + '", "emailAddress" : "' + this.emailAddress + '" }';
        return output;
};
Domain.prototype.modifyRequestNoId = function() {
        var output = '{ "comment" : "' + this.comment + '", ';
        output = output + '"ttl" : "' + this.ttl + '", "emailAddress" : "' + this.emailAddress + '" }';
        return output;
};



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

Domain.prototype.toJSON = function() {
	var output = '{';
        for ( var key in this) {
                if (typeof this[key] != 'function' && this[key] != undefined && this[key] != null) {
                        console.log(key + ' is ' + typeof this[key] + ' = ' + this[key]);
                        output += '"' + key + '": "' + this[key] + '",';
                }
        }
        output = output.substring(0, output.length - 2);
        output += '}';
        return output;
}

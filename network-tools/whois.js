var util = require('util'), spawn = require('child_process').spawn, dig = spawn('whois', [ '-v', 'theorywednesday.com' ]);

dig.stdout.on('data', function(data) {
	console.log('' + data);
});

dig.stderr.on('data', function(data) {
	console.log('ERROR: ' + data);
});

dig.on('exit', function(code) {
	console.log('child process exited with code ' + code);
});
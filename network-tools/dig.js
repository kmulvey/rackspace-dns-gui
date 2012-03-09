var util = require('util'), spawn = require('child_process').spawn, dig = spawn('dig', [ 'A', '+trace', 'theorywednesday.com' ]);

dig.stdout.on('data', function(data) {
	console.log('' + data);
});

dig.stderr.on('data', function(data) {
	console.log('ERROR: ' + data);
});

dig.on('exit', function(code) {
	console.log('child process exited with code ' + code);
});
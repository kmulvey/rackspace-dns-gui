#!/bin/sh

lint: 
	./node_modules/.bin/jshint  --config jshint.json --reporter lint_reporter.js lib/*.js
lint-package-json: 
	./node_modules/.bin/jshint  --config jshint.json --reporter lint_reporter.js ./package.json

lint-routes:
	./node_modules/.bin/jshint  --config jshint.json --reporter lint_reporter.js ./lib/routes/*.js

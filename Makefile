#!/bin/sh

lint: 
	./node_modules/.bin/jshint ./lib/*.js --config jshint.json

lint-package-json: 
	./node_modules/.bin/jshint ./package.json

lint-routes:
	./node_modules/.bin/jshint ./lib/routes/*.js --config jshint.json

run:
	node ./bin/app.js

js:
	browserify lib/public/main.js > lib/public/bundled.js

.PHONY: run

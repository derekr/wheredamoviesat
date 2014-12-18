build:
	npm install
	make js

run:
	node ./bin/app.js

js:
	node_modules/.bin/browserify lib/public/main.js > lib/public/bundled.js

css:
	cp node_modules/mapbox.js/theme/style.css lib/public/mapbox.css

images:
	cp -r node_modules/mapbox.js/theme/images lib/public/images

.PHONY: run build

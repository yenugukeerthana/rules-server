set-node-version:
	. ${NVM_DIR}/nvm.sh && nvm use

clean:
	rm -rf node_modules

deps: set-node-version
	npm install

start: set-node-version
	npm start
	#ENV='UTC' npm start

test: set-node-version
	npm test

zip-app:
	npm install
	make zip-app-only

zip-app-only:
	-rm rules-server.tgz
	tar -czvf rules-server.tgz  -C ../rules-server .


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

check-node-v:
ifneq ($(shell node -v),$(shell cat .nvmrc))
	@echo -e '\nPlease run `nvm use` in your terminal to change node version\n'
	@exit 1
endif
	@node -v

clean:
	rm -rf node_modules

deps: check-node-v
	npm install

start: check-node-v
	npm start

test: check-node-v
	npm test

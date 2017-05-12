/* eslint-disable no-console, max-len, max-nested-callbacks*/

const chrome = require('chrome-remote-interface');
const { ChromeLauncher } = require('lighthouse/lighthouse-cli/chrome-launcher');

const launchChrome = (headless = true) => {
	const launcher = new ChromeLauncher({
		port: 9222,
		autoSelectChrome: true,
		additionalFlags: [
			'--window-size=412,732',
			'--disable-gpu',
			headless ? '--headless' : ''
		]
	});

	return launcher.run().then(() => launcher)
		.catch(err => {
			return launcher.kill().then(() => {
				throw err;
			}, console.error);
		});
};

const loadEventFired = function(Runtime, client, launcher) {
	this.onPageLoad(Runtime).then(() => {
		client.close();
		launcher.kill();
	}).catch(error => {
		launcher.kill();
		console.log(error);
	});
};

class Chrome {
	constructor(url, onPageLoad) {
		this.onPageLoad = onPageLoad;
		this.url = url;
	}

	init() {
		launchChrome().then(launcher => {
			chrome((client) => {
				const { Page, Runtime, DOM } = client;

				Promise.all([
					Page.enable(),
					Runtime.enable(),
					DOM.enable()
					
				]).then(() => {
					Page.navigate({ url: this.url });
					Page.loadEventFired(loadEventFired.bind(this, Runtime, client, launcher));
				});
				
			}).on('error', (err) => {
				console.error(err);
			});
		});
	}
}

module.exports = Chrome;





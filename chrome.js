/* eslint-disable no-console, max-len, max-nested-callbacks*/

const chrome = require('chrome-remote-interface');
const { ChromeLauncher } = require('lighthouse/lighthouse-cli/chrome-launcher');

function launchChrome(headless = true) {
	const launcher = new ChromeLauncher({
		port: 9222,
		autoSelectChrome: true, // False to manually select which Chrome install.
		additionalFlags: [
			'--window-size=412,732',
			'--disable-gpu',
			headless ? '--headless' : ''
		]
	});

	return launcher.run().then(() => launcher)
		.catch(err => {
			return launcher.kill().then(() => { // Kill Chrome if there's an error.
				throw err;
			}, console.error);
		});
}

class Chrome {
	constructor(url, onPageLoad) {
		this.onPageLoad = onPageLoad;
		this.url = url;
	}

	init() {
		launchChrome().then(launcher => {
			chrome((client) => {
				// extract domains
				const { Page, Runtime } = client;
				// setup handlers

				// enable events then start!
				Promise.all([
					Page.enable(),
					Runtime.enable()
				]).then(() => {
					Page.navigate({ url: this.url });

					Page.loadEventFired(() => {
						this.onPageLoad(Runtime).then(() => {
							client.close();
							launcher.kill(); // Kill Chrome.
						}).catch(error => {
							launcher.kill();
							console.log(error);
						});
					});
				});
				
			}).on('error', (err) => {
				// cannot connect to the remote endpoint
				console.error(err);
			});
		});
	}
}

module.exports = Chrome;





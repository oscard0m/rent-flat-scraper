/* eslint-disable no-console, max-len*/

const Chrome = require('./chrome.js');
const ZONE_LES_CORTS = 'https://www.idealista.com/alquiler-viviendas/barcelona/les-corts/les-corts/con-precio-hasta_1300,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,publicado_ultimas-24-horas/';

function onPageLoad(Runtime) {
	return Runtime.evaluate({ expression: 'document.querySelectorAll(".item")[0].innerText' }).then(result => {
		console.log(result.result.value);
	});
}

const chrome = new Chrome(ZONE_LES_CORTS, onPageLoad);

chrome.init();






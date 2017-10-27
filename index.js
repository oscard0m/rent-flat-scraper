/* eslint-disable */
const Nightmare = require('nightmare');

var URLS_IDEALISTA = {
    ZONE_CIUTAT_VELLA: "https://www.idealista.com/alquiler-viviendas/barcelona/ciutat-vella/con-precio-hasta_1300,metros-cuadrados-mas-de_80,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,publicado_ultimas-24-horas/",
	ZONE_EIXAMPLE: "https://www.idealista.com/alquiler-viviendas/barcelona/eixample/con-precio-hasta_1300,metros-cuadrados-mas-de_80,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,publicado_ultimas-24-horas/",
    ZONE_GRACIA: "https://www.idealista.com/alquiler-viviendas/barcelona/gracia/vila-de-gracia/con-precio-hasta_1300,metros-cuadrados-mas-de_80,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,amueblado_amueblados,publicado_ultimas-24-horas/",
    ZONE_LES_CORTS: "https://www.idealista.com/alquiler-viviendas/barcelona/les-corts/les-corts/con-precio-hasta_1300,metros-cuadrados-mas-de_80,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,publicado_ultimas-24-horas/",
    ZONE_SANTS: "https://www.idealista.com/alquiler-viviendas/barcelona/sants-montjuic/con-precio-hasta_1300,metros-cuadrados-mas-de_80,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,amueblado_amueblados,publicado_ultimas-24-horas/",
};

var URLS_FOTOCASA = {
    ZONE_CIUTAT_VELLA: "http://www.fotocasa.es/es/alquiler/casas/barcelona-capital/ciutat-vella/amueblado/l?latitude=41.3854&longitude=2.1775&maxPrice=1250&minRooms=2&minSurface=80&combinedLocationIds=724,9,8,232,376,8019,0,1152,0",
    ZONE_EIXAMPLE: "http://www.fotocasa.es/es/alquiler/casas/barcelona-capital/eixample/amueblado/l?latitude=41.3854&longitude=2.1775&maxPrice=1250&minRooms=2&minSurface=80&combinedLocationIds=724,9,8,232,376,8019,0,1151,0",
    ZONE_GRACIA: "http://www.fotocasa.es/es/alquiler/casas/barcelona-capital/vila-de-gracia/amueblado/l?latitude=41.3854&longitude=2.1775&maxPrice=1250&minRooms=2&combinedLocationIds=724,9,8,232,376,8019,0,1150,342",
    ZONE_SANTS: "http://www.fotocasa.es/es/alquiler/casas/barcelona-capital/sants-montjuic/amueblado/l?latitude=41.3854&longitude=2.1775&maxPrice=1250&minRooms=2&minSurface=80&combinedLocationIds=724,9,8,232,376,8019,0,1144,0",
    ZONE_LESCORTS: "http://www.fotocasa.es/es/alquiler/casas/barcelona-capital/les-corts/amueblado/l?latitude=41.3854&longitude=2.1775&maxPrice=1250&minRooms=2&minSurface=80&combinedLocationIds=724,9,8,232,376,8019,0,1148,0",
};

const getFlats = async url => {
	const nightmare = new Nightmare({ show: false });

	try {
		const flats = await nightmare
				.goto(url)
				.wait('.item')
				.evaluate(() => {
					const flats = [...document.querySelectorAll('.item')].map((flat) => ({
						apartment: flat.querySelector(".item-link").textContent,
						price: flat.querySelector(".price-row").textContent,
						redText: (flat.querySelector(".txt-highlight-red") && flat.querySelector(".txt-highlight-red").textContent) || 'Time not available',
						url: `https://www.idealista.com${flat.querySelector(".item-link").href}`
					}));
					
					return flats;
				})
				.end();
		
		return flats && flats.length || 'No new apartments';
	} catch (e) {
		console.error(e);
		return 'No new apartments';
	}
}

Object.keys(URLS_IDEALISTA).forEach(async (zone) => {
	const result = await getFlats(URLS_IDEALISTA[zone]);
	console.log(`
####################################
###### ${zone} #######
####################################
	`);
	console.log(result);
})







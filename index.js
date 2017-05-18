/* eslint-disable */
var page = require('webpage').create();
var system = require('system');
var args = system.args;

var URLS_IDEALISTA = {
    ZONE_CIUTAT_VELLA: "https://www.idealista.com/alquiler-viviendas/barcelona/ciutat-vella/con-precio-hasta_1300,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,publicado_ultimas-24-horas/",
    ZONE_EIXAMPLE: "https://www.idealista.com/alquiler-viviendas/barcelona/eixample/con-precio-hasta_1300,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,publicado_ultimas-24-horas/",
    ZONE_GRACIA: "https://www.idealista.com/alquiler-viviendas/barcelona/gracia/vila-de-gracia/con-precio-hasta_1300,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,amueblado_amueblados,publicado_ultimas-24-horas/",
    ZONE_LES_CORTS: "https://www.idealista.com/alquiler-viviendas/barcelona/les-corts/les-corts/con-precio-hasta_1300,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,publicado_ultimas-24-horas/",
    ZONE_SANTS: "https://www.idealista.com/alquiler-viviendas/barcelona/sants-montjuic/con-precio-hasta_1300,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,amueblado_amueblados,publicado_ultimas-24-horas/",
};

var URLS_FOTOCASA = {
    ZONE_CIUTAT_VELLA: "http://www.fotocasa.es/es/alquiler/casas/barcelona-capital/ciutat-vella/amueblado/l?latitude=41.3854&longitude=2.1775&maxPrice=1250&minRooms=2&combinedLocationIds=724,9,8,232,376,8019,0,1152,0",
    ZONE_EIXAMPLE: "http://www.fotocasa.es/es/alquiler/casas/barcelona-capital/eixample/amueblado/l?latitude=41.3854&longitude=2.1775&maxPrice=1250&minRooms=2&combinedLocationIds=724,9,8,232,376,8019,0,1151,0",
    ZONE_GRACIA: "http://www.fotocasa.es/es/alquiler/casas/barcelona-capital/vila-de-gracia/amueblado/l?latitude=41.3854&longitude=2.1775&maxPrice=1250&minRooms=2&combinedLocationIds=724,9,8,232,376,8019,0,1150,342",
    ZONE_LESCORTS: "http://www.fotocasa.es/es/alquiler/casas/barcelona-capital/les-corts/amueblado/l?latitude=41.3854&longitude=2.1775&maxPrice=1250&minRooms=2&combinedLocationIds=724,9,8,232,376,8019,0,1148,0",
    ZONE_SANTS: "http://www.fotocasa.es/es/alquiler/casas/barcelona-capital/sants-montjuic/amueblado/l?latitude=41.3854&longitude=2.1775&maxPrice=1250&minRooms=2&combinedLocationIds=724,9,8,232,376,8019,0,1144,0",
};

var isFotocasa = args.indexOf("--fotocasa") >= 0; 

var ZONE_URLS = isFotocasa? URLS_FOTOCASA : URLS_IDEALISTA;

var ZONES = [
    { 
        name: "CIUTAT VELLA", 
        url: ZONE_URLS.ZONE_CIUTAT_VELLA,
        param: "--ciutat-vella",
    },
    { 
        name: "EIXAMPLE", 
        url: ZONE_URLS.ZONE_EIXAMPLE,
        param: "--eixample",
    },
    { 
        name: "GRACIA", 
        url: ZONE_URLS.ZONE_GRACIA,
        param: "--gracia",
    },
    { 
        name: "LES CORTS", 
        url: ZONE_URLS.ZONE_LES_CORTS,
        param: "--les-corts",
    },
    { 
        name: "SANTS", 
        url: ZONE_URLS.ZONE_SANTS,
        param: "--sants",
    }
];

if(!isFotocasa && args.length >= 2) {
    ZONES = ZONES.filter(function(zone) {
        return args.indexOf(zone.param) >= 0;
    })
}

var numOpenedPages = 0;

if(isFotocasa) {
    printTitle("FOTOCASA");
} else {
    printTitle("IDEALISTA");
}

page.open(ZONES[numOpenedPages].url, scrapPage);


function scrapPage(status) {
    printTitle(ZONES[numOpenedPages].name);
    // console.log("****Status: " + status + "****\n");
    if(status === "success") {
        var recentApartments = isFotocasa? page.evaluate(getDataApartmentsFotocasa) : page.evaluate(getDataApartmentsIdealista);

        recentApartments.forEach(function(recentApartment) {
            if(recentApartment.time !== '' && recentApartment.time.indexOf("día") < 0) {
                console.log(recentApartment.title);
                console.log(recentApartment.price);
                console.log(recentApartment.time);
                console.log(recentApartment.url);
                console.log("\n");
            }
        })

        numOpenedPages++;
        if(numOpenedPages === ZONES.length) {
            phantom.exit(0);
        } else {
            page.open(ZONES[numOpenedPages].url, scrapPage);
        }
    }
}

function getDataApartmentsFotocasa() {
    var items = document.querySelectorAll(".re-Searchresult-itemRow");
    var recentApartments = [];
    for(var i = 0; i < items.length; i++) {
        var apartment = items[i].querySelector(".re-Card-title");
        var price = items[i].querySelector(".re-Card-priceComposite");
        var redText = items[i].querySelector(".re-Card-timeago");
        var url = items[i].querySelector(".re-Card-title");
        
        recentApartments.push({
            title: apartment && apartment.textContent,
            price: price && price.textContent,
            time: redText && redText.textContent,
            url: apartment && apartment.href
        });
    }
    return recentApartments;
}

function getDataApartmentsIdealista() {
    var items = document.querySelectorAll(".item");
    var recentApartments = [];
    for(var i = 0; i < items.length; i++) {
        var apartment = items[i].querySelector(".item-link");
        var price = items[i].querySelector(".price-row");
        var redText = items[i].querySelector(".txt-highlight-red");
        var url = items[i].querySelector(".txt-highlight-red");
        
        recentApartments.push({
            title: apartment && apartment.textContent,
            price: price && price.textContent,
            time: redText && redText.textContent,
            url: apartment && apartment.href
        });
    }
    return recentApartments;
}

function printTitle(title) {
    console.log("\n-------------------------------------------------------------------");
    console.log("              " + title + "                  ");
    console.log("-------------------------------------------------------------------\n");
}



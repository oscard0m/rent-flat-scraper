/* eslint-disable */
var page = require('webpage').create();

var ZONE_LES_CORTS = "https://www.idealista.com/alquiler-viviendas/barcelona/les-corts/les-corts/con-precio-hasta_1300,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,publicado_ultimas-24-horas/";
var ZONE_EIXAMPLE = "https://www.idealista.com/alquiler-viviendas/barcelona/eixample/con-precio-hasta_1300,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,publicado_ultimas-24-horas/";
var ZONE_CIUTAT_VELLA = "https://www.idealista.com/alquiler-viviendas/barcelona/ciutat-vella/con-precio-hasta_1300,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,publicado_ultimas-24-horas/";
var ZONE_GRACIA = "https://www.idealista.com/alquiler-viviendas/barcelona/gracia/con-precio-hasta_1300,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,publicado_ultimas-24-horas/";
var ZONE_SANTS = "https://www.idealista.com/alquiler-viviendas/barcelona/sants-montjuic/con-precio-hasta_1300,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,amueblado_amueblados,publicado_ultimas-24-horas/";

var ZONES_IDEALISTA = [
    { 
        name: "LES CORTS", 
        url: ZONE_LES_CORTS,
    },
    { 
        name: "EIXAMPLE", 
        url: ZONE_EIXAMPLE,
    },
    { 
        name: "CIUTAT VELLA", 
        url: ZONE_CIUTAT_VELLA,
    },
    { 
        name: "GRACIA", 
        url: ZONE_GRACIA,
    },
    { 
        name: "SANTS", 
        url: ZONE_SANTS,
    }
];

var numOpenedPages = 0;

page.open(ZONES_IDEALISTA[numOpenedPages].url, scrapPage);

function scrapPage(status) {
    console.log("\n-------------------------------------------------------------------");
    console.log("              " + ZONES_IDEALISTA[numOpenedPages].name + "                  ");
    console.log("-------------------------------------------------------------------\n");
    // console.log("****Status: " + status + "****\n");
    if(status === "success") {
        // page.render('idealista.png');
        var recentApartments = page.evaluate(function() {
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
        });

        recentApartments.forEach(function(recentApartment) {
            if(recentApartment.time !== '') {
                console.log(recentApartment.title);
                console.log(recentApartment.price);
                console.log(recentApartment.time);
                console.log(recentApartment.url);
                console.log("\n");
            }
        })

        numOpenedPages++;
        if(numOpenedPages === ZONES_IDEALISTA.length) phantom.exit(0);
        else {
            page.open(ZONES_IDEALISTA[numOpenedPages].url, scrapPage);
        }
    }
}



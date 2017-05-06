/* eslint-disable */
var page = require('webpage').create();

var ZONES_IDEALISTA = [
    "https://www.idealista.com/alquiler-viviendas/barcelona/les-corts/les-corts/con-precio-hasta_1300,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,publicado_ultimas-24-horas/",
    "https://www.idealista.com/alquiler-viviendas/barcelona/eixample/con-precio-hasta_1300,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,publicado_ultimas-24-horas/",
];

// ZONES_IDEALISTA.forEach(function(zone) {
    page.open(ZONES_IDEALISTA[1], function(status) {
        console.log("Status: " + status);
        if(status === "success") {
            page.render('idealista.png');
            var recentApartments = page.evaluate(function() {
                console.log(document.title);
                console.log("----------------------------------------");
                var items = document.querySelectorAll(".item");
                var recentApartments = [];
                for(var i = 0; i < items.length; i++) {
                    var apartment = items[i].querySelector(".item-link");
                    var price = items[i].querySelector(".price-row");
                    var redText = items[i].querySelector(".txt-highlight-red");
                    
                    recentApartments.push({
                        title: apartment && apartment.textContent,
                        price: price && price.textContent,
                        time: redText && redText.textContent
                    });
                }
                return recentApartments;
            });

            recentApartments.forEach(function(recentApartment) {
                console.log(recentApartment.title);
                console.log(recentApartment.price);
                console.log(recentApartment.time);
                console.log("\n");
            })
        }
        // phantom.exit();
    });
// });





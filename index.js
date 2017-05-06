/* eslint-disable */
var page = require('webpage').create();

var IDELALISTA_URL_LESCORTS = "https://www.idealista.com/alquiler-viviendas/barcelona/les-corts/les-corts/con-precio-hasta_1300,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,publicado_ultimas-24-horas/";
var IDELALISTA_URL_EIXAMPLE = "https://www.idealista.com/alquiler-viviendas/barcelona/eixample/con-precio-hasta_1300,de-dos-dormitorios,de-tres-dormitorios,de-cuatro-cinco-habitaciones-o-mas,publicado_ultimas-24-horas/";

page.open(IDELALISTA_URL_EIXAMPLE, function(status) {
  console.log("Status: " + status);
  if(status === "success") {
    page.render('idealista.png');
    var recentApartments = page.evaluate(function() {
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
  phantom.exit();
});



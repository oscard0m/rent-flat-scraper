/* eslint-disable */
var page = require('webpage').create();
var system = require('system');
var IDEALISTA = require('./src/providers/idealista/data/zones.json');
var FOTOCASA = require('./src/providers/fotocasa/data/zones.json');
var args = system.args;

var isFotocasa = args.indexOf("--fotocasa") >= 0;

var ZONES = isFotocasa ? FOTOCASA.ZONES : IDEALISTA.ZONES;

if(args.length >= 3) {
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

page.onError = function(msg, trace) {
    console.error(msg);
};

function scrapPage(status) {
    console.log("****Status: " + status + "****\n");
    var neightbourhood = ZONES[numOpenedPages].name;
    if(status === "success") {
        var recentApartments = isFotocasa? page.evaluate(getDataApartmentsFotocasa) : page.evaluate(getDataApartmentsIdealista);

        if(!recentApartments || !recentApartments.length) neightbourhood += ": No new apartments";
        printTitle(neightbourhood);

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
    } else {
        console.error('Error extracting ' + neightbourhood);
        phantom.exit(0);
    }
}

function getDataApartmentsFotocasa() {
    var items = document.querySelectorAll(".re-Searchresult-item");
    var recentApartments = [];
    for(var i = 0; i < items.length; i++) {
        var item = items[i];
        if(item.className.indexOf("re-Searchresult-ad") < 0) {
            var apartment = item.querySelector(".re-Card-title");
            var price = item.querySelector(".re-Card-priceComposite");
            var redText = item.querySelector(".re-Card-timeago");
            var url = item.querySelector(".re-Card-link");

            recentApartments.push({
                title: apartment && apartment.textContent,
                price: price && price.textContent,
                time: redText && redText.textContent,
                url: url && url.href
            });
        }
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



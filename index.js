/* eslint-disable */
var page = require('webpage').create();
var system = require('system');
var IDEALISTA = require('./src/providers/idealista/data/zones.json');
var FOTOCASA = require('./src/providers/fotocasa/data/zones.json');
var fotocasaSpider = require('./src/providers/fotocasa/spider');
var idealistaSpider = require('./src/providers/idealista/spider');
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
        var recentApartments = isFotocasa? page.evaluate(fotocasaSpider.getApartments) : page.evaluate(idealistaSpider.getApartments);

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

function printTitle(title) {
    console.log("\n-------------------------------------------------------------------");
    console.log("              " + title + "                  ");
    console.log("-------------------------------------------------------------------\n");
}



exports.getApartments = function () {
    var items = document.querySelectorAll('.item');
    var recentApartments = [];
    for(var i = 0; i < items.length; i++) {
        var apartment = items[i].querySelector('.item-link');
        var price = items[i].querySelector('.price-row');
        var redText = items[i].querySelector('.txt-highlight-red');
        var url = items[i].querySelector('.txt-highlight-red');

        recentApartments.push({
            title: apartment && apartment.textContent,
            price: price && price.textContent,
            time: redText && redText.textContent,
            url: apartment && apartment.href
        });
    }
    return recentApartments;
};

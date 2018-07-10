exports.getApartments = function () {
	var items = document.querySelectorAll('.re-Searchresult-item');
	var recentApartments = [];
	for(var i = 0; i < items.length; i++) {
		var item = items[i];
		if(item.className.indexOf('re-Searchresult-ad') < 0) {
			var apartment = item.querySelector('.re-Card-title');
			var price = item.querySelector('.re-Card-priceComposite');
			var redText = item.querySelector('.re-Card-timeago');
			var url = item.querySelector('.re-Card-link');

			recentApartments.push({
				title: apartment && apartment.textContent,
				price: price && price.textContent,
				time: redText && redText.textContent,
				url: url && url.href
			});
		}
	}

	return recentApartments;
};

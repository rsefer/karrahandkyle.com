[].forEach.call(document.querySelectorAll('nav a[href*="#"]'), function(el) {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    var targetSection = el.getAttribute('href').substring(1);
    document.querySelector('[data-section="' + targetSection + '"]').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

[].forEach.call(document.querySelectorAll('.party-member:not(.filler)'), function(el) {
  el.addEventListener('click', function(e) {
    var popup = document.getElementById('member-popup');
    if (popup) {
      popup.parentElement.removeChild(popup);
    }
    popup = document.createElement('div');
    document.body.classList.add('popup-active');
    popup.setAttribute('id', 'member-popup');
    popup.classList.add('member-popup');
    var popupImageSource = el.getElementsByClassName('cropped')[0].src;
    if (el.getElementsByClassName('full').length > 0) {
      popupImageSource = el.getElementsByClassName('full')[0].dataset.src;
    }
    popup.innerHTML = '<div class="popup-inner"><div class="popup-inner-wrap"><div id="popup-close" class="popup-close">&times;</div><div class="party-member-inner"><img src="' + popupImageSource + '"><div class="popup-content">' + el.getElementsByClassName('party-member-inner')[0].innerHTML + '</div></div></div></div>';
    document.getElementsByTagName('body')[0].appendChild(popup);
    document.getElementById('popup-close').addEventListener('click', function(e) {
      document.body.classList.remove('popup-active');
    });
    document.getElementById('member-popup').addEventListener('click', function(e) {
      document.body.classList.remove('popup-active');
    });
  });
});

var scroll = new SmoothScroll('a[href*="#"]', {
	speed: 400
});

var mapContainer = document.getElementById('map');
if (mapContainer) {
	mapboxgl.accessToken = 'pk.eyJ1Ijoic2VmZXJkZXNpZ24iLCJhIjoiY2pocDZ4ZHlxNDVocDM2bTc5OW05Z3h4YSJ9.Ofd0_UrlAyYYU9kRJVWdRQ';
	var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/seferdesign/cjivw5f7u91qu2rln7z5sn9ms',
		zoom: 14,
		maxZoom: 15,
		center: [-64.814360, 18.331685],
		attributionControl: false,
		interactive: false
	});

	map.on('load', function() {

		var markers = {
			"type": "FeatureCollection",
			"features": [
				{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [-64.967917, 18.337222]
					},
					"properties": {
						"title": "Cyril E. King Airport",
						"icon": "plane-solid"
					}
				},
				{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [-64.772633, 18.342743]
					},
					"properties": {
						"title": "Susanaberg Ruins (Ceremony)",
						"icon": "crown-solid"
					}
				},
				{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [-64.712499, 18.348248]
					},
					"properties": {
						"title": "Rhumb Lines (Reception)",
						"icon": "amusement-park"
					}
				},
				{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [-64.788595, 18.328315]
					},
					"properties": {
						"title": "The Hills Hotel",
						"icon": "lodging"
					}
				},
				{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [-64.794722, 18.330650]
					},
					"properties": {
						"title": "Cruz Bay Boutique Hotel",
						"icon": "lodging"
					}
				},
				{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [-64.797018, 18.327687]
					},
					"properties": {
						"title": "Coconut Coast Villas",
						"icon": "lodging"
					}
				}
			]
		};

		markers.features.forEach(function(marker) {
			var el = document.createElement('div');
			el.className = 'marker marker-' + marker.properties.icon;
			el.dataset.title = marker.properties.title;
			new mapboxgl.Marker({
				element: el,
				anchor: 'top',
				offset: [0, -50]
			})
				.setLngLat(marker.geometry.coordinates)
				.addTo(map);
		});

		var bounds = new mapboxgl.LngLatBounds();
		markers.features.forEach(function(feature) {
			bounds.extend(feature.geometry.coordinates);
		});

		var mapPadding = 50;
		if (window.innerWidth >= 768) {
			mapPadding = 100;
		}
		map.fitBounds(bounds, {
			padding: mapPadding
		});

	});
}

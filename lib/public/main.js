var hq     = require('hyperquest');
var qs     = require('querystring');
var concat = require('concat-stream');

navigator.geolocation.getCurrentPosition(initMap);

function initMap (pos) {
    var center = new L.LatLng(pos.coords.latitude, pos.coords.longitude);

    var map = L.mapbox.map('map', 'examples.map-4l7djmvo', {
        detectRetina: true,
        retinaVersion: 'examples.map-zswgei2n'
    }).setView([center.lat, center.lng], 13);

    var theaterCategoryId = '4bf58dd8d48988d17f941735';
    var search = { 
        ll:       center.lat + ',' + center.lng, 
        categoryId: theaterCategoryId 
    }

    hq('/fours/venues/search?' + qs.stringify(search))
    .pipe(concat(function (data) {
        placeVenues(map, JSON.parse(data).response.venues);
    }));
}

function placeVenues (map, venues) {
    venues.forEach(function (venue, i) {
        var marker = L.marker([venue.location.lat, venue.location.lng]).addTo(map);
        var content = venue.name + ' - ' + '<a href="' + venue.url + '">' + venue.url + '</a>';
        marker.bindPopup(content);  
    });
}

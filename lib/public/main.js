var hq     = require('hyperquest');
var qs     = require('querystring');
var concat = require('concat-stream');

navigator.geolocation.getCurrentPosition(initMap);

function initMap (pos) {
    var center = new L.LatLng(pos.coords.latitude, pos.coords.longitude);

    var map = L.mapbox.map('map', 'examples.map-4l7djmvo').setView([center.lat, center.lng], 15);

    var theaterCategoryId = '4bf58dd8d48988d17f941735';
    var search = { 
        ll:         center.lat + ',' + center.lng,
        radius:     '1000',
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
        marker.on('click', function (e) {
            fetchEvents(venue.id, function (movies) {

            });
        });
        var content = venue.name + ' - ' + '<a href="' + venue.url + '">' + venue.url + '</a><div class="movies-wrapper"></div>';
        marker.bindPopup(content);  
    });
}

function fetchEvents(venueId, callback) {
    hq('/fours/venues/' + venueId + '/events?')
    .pipe(concat(function (data) {
        console.log(JSON.parse(data).response);
        callback(map, JSON.parse(data).response.events);
    }));
}

var hq     = require('hyperquest');
var qs     = require('querystring');
var concat = require('concat-stream');

var theaterCategoryId = '4bf58dd8d48988d17f941735';

navigator.geolocation.getCurrentPosition(initMap);

function initMap (pos) {
    var center = new L.LatLng(pos.coords.latitude, pos.coords.longitude);

    var map = L.mapbox.map('map', 'examples.map-4l7djmvo').setView([center.lat, center.lng], 15);

    map.on('dragend', function (e) {
        fetchVenues(map.getCenter(), function (venues) {
            placeVenues(map, venues);
        });
    });

    fetchVenues(center, function (venues) {
        placeVenues(map, venues);
    });
}

function placeVenues (map, venues) {
    venues.forEach(function (venue, i) {
        fetchEvents(venue.id, function (events) {
            if (events.length > 0) {
                cosnole.log(events);
                var marker = L.marker([venue.location.lat, venue.location.lng]).addTo(map);
                var id = 'venue-' + venue.id;
                var content = '<div id="' + id + '">' + venue.name + ' - ' + '<a href="' + venue.url + '">' + venue.url + '</a><div class="movies-wrapper" data-events-loaded="false">Loading movies...</div></div>';
                marker.bindPopup(content);
            }
        });
    });
}

function fetchVenues (center, callback) {
    var search = { 
        ll:         center.lat + ',' + center.lng,
        radius:     '1000',
        categoryId: theaterCategoryId
    }

    hq('/fours/venues/search?' + qs.stringify(search))
    .pipe(concat(function (data) {
        console.log(JSON.parse(data));
        callback(JSON.parse(data).response.venues);
    }));
}

function fetchEvents (venueId, callback) {
    hq('/fours/venues/' + venueId + '/events?')
    .pipe(concat(function (data) {
        callback(JSON.parse(data).response.events.items);
    }));
}

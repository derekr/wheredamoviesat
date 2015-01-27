var hq     = require('hyperquest');
var qs     = require('querystring');
var concat = require('concat-stream');
var riot = require('riot');
var location = require('../stores/location');
var venues = require('../stores/venues');
require('../tags/map.tag');

var loc = location();
var vens = venues();
riot.mount('movie-map', {
    location: loc,
    venues: vens
});

var VenuesWithEvents = require('./util/venues-with-events');

var theaterCategoryId = '4bf58dd8d48988d17f941735';

function filterVenues (venues) {
    // placeVenues(map, venues);
    var venuesWithEvents = new VenuesWithEvents();
    venuesWithEvents.filter(venues);
    return venuesWithEvents;
}

navigator.geolocation.getCurrentPosition(initMap);

function initMap (pos) {
    loc.trigger('updateLocation', {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
    });
}

loc.on('locationChanged', function (pos) {
    fetchVenues(pos, function (venues) {
        console.log('fetched venues');
        filterVenues(venues).on('venue', function (venue, events) {
            console.dir('filtered');
            vens.trigger('addVenue', {
                id: venue.id,
                name: venue.name,
                location: venue.location
            });
        });
    });
});

// function placeVenues (map, venues) {
//     console.dir(venues);
//     venues.forEach(function (venue, i) {
//         fetchEvents(venue.id, function (events) {
//             console.dir(events);
//             if (events.length > 0) {
//                 console.dir(events);
//                 var marker = L.marker([venue.location.lat, venue.location.lng]).addTo(map);
//                 var id = 'venue-' + venue.id;
//                 var content = '<div id="' + id + '">' + venue.name + ' - ' + '<a href="' + venue.url + '">' + venue.url + '</a><div class="movies-wrapper" data-events-loaded="false">Loading movies...</div></div>';
//                 marker.bindPopup(content);
//             }
//         });
//     });
// }

function fetchVenues (center, callback) {
    var search = {
        ll:         center.lat + ',' + center.lng,
        radius:     '1000',
        categoryId: theaterCategoryId
    }

    hq('/fours/venues/search?' + qs.stringify(search))
    .pipe(concat(function (data) {
        callback(JSON.parse(data).response.venues);
    }));
}

require('mapbox.js');
var hq     = require('hyperquest');
var qs     = require('querystring');
var concat = require('concat-stream');

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
    var center = new L.LatLng(pos.coords.latitude, pos.coords.longitude);

    L.mapbox.accessToken = 'pk.eyJ1IjoiZHJrIiwiYSI6IlFUU05JNGsifQ.EIbLVgaV2wbCuOJs1FnApQ';
    var map = L.mapbox.map('map', 'examples.map-zr0njcqy').setView([center.lat, center.lng], 15);

    map.on('dragend', function (e) {
        fetchVenues(map.getCenter(), function (venues) {
            filterVenues(venues).on('venue', function (venue, events) {
                console.log(events.map(function (e) {
                    console.log(e.name);
                    return e.name;
                }).sort().join('\n'));
            });
        });
    });

    fetchVenues(center, function (venues) {
        filterVenues(venues).on('venue', function (venue, events) {
            console.dir(events);
        });
    });
}

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

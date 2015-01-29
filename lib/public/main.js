var hq     = require('hyperquest');
var qs     = require('querystring');
var concat = require('concat-stream');
var riot = require('riot');
var riotControl = require('../util/riot-control');
var location = require('../stores/location');
var venues = require('../stores/venues');
var movies = require('../stores/movies');
require('../tags/map.tag');
require('../tags/movie-list.tag');

var loc = location();
var vens = venues();
var mov = movies();

riotControl.addStore(loc);
riotControl.addStore(vens);
riotControl.addStore(mov);

riot.mount('movie-map');

riot.mount('movie-list');

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
        filterVenues(venues).on('venue', function (venue, events) {
            vens.trigger('addVenue', {
                id: venue.id,
                name: venue.name,
                location: venue.location
            });

            var movies = events.map(function (event) {
                return {
                    id: event.id,
                    name: event.name,
                    venues: [venue.id]
                };
            });

            mov.trigger('addMovies', movies);
        });
    });
});

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

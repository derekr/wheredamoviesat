<movie-map>
    <div id="map-container" class="map-container"></div>

    var _L = require('mapbox.js');
    _L.label = require('leaflet.label');

    var riotControl = require('../util/riot-control');
    var diff = require('amp-difference');
    var intersection = require('array-intersection');

    this._markers = [];
    this._ids = [];
    this._layer = new L.featureGroup();

    var self = this;

    this.on('mount', function () {
        L.mapbox.accessToken = 'pk.eyJ1IjoiZHJrIiwiYSI6IlFUU05JNGsifQ.EIbLVgaV2wbCuOJs1FnApQ';

        var map = L.mapbox.map(this['map-container'], 'examples.map-zr0njcqy');
        self._layer.addTo(map);

        riotControl.on('locationChanged', function (pos) {
            var center = new L.LatLng(pos.lat, pos.lng);
            map.setView([center.lat, center.lng]);
        });

        function createMarker (venue) {
            return L.marker(
                [venue.location.lat, venue.location.lng],
                { riseOnHover: true }
            ).bindLabel(venue.name, { direction: 'auto' });
        }

        riotControl.on('venuesChanged', function (venues) {
            var newIds = venues.map(function (v) {
                return v.id;
            });

            var removeIds = diff(self._ids, newIds);

            removeIds.forEach(function (id) {
                var i = self._ids.indexOf(id);
                map.removeLayer(self._markers[i]);
            });

            var existing = intersection(self._ids, newIds);

            var newMarkers = venues.filter(function (v) {
                return (existing.indexOf(v.id) === -1);
            }).map(createMarker);

            newMarkers.forEach(function (m) {
                m.addTo(self._layer);
            });

            map.fitBounds(self._layer.getBounds());

            self._markers = existing.map(function (id) {
                var i = self._ids.indexOf(id);
                return self._markers[i];
            }).concat(newMarkers);
            self._ids = newIds;
        });

        map.on('dragend', function (e) {
            var c = map.getCenter();
            riotControl.trigger('updateLocation', {
                lat: c.lat,
                lng: c.lng
            });
        });
    });
</movie-map>

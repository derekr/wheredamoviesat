<movie-map>
    <div id="map-container" class="map-container"></div>

    var _L = require('mapbox.js');

    this._markers = [];
    this._ids = [];

    var self = this;

    this.on('mount', function () {
        console.log('mounted');

        L.mapbox.accessToken = 'pk.eyJ1IjoiZHJrIiwiYSI6IlFUU05JNGsifQ.EIbLVgaV2wbCuOJs1FnApQ';

        var map = L.mapbox.map(this['map-container'], 'examples.map-zr0njcqy');

        opts.location.on('locationChanged', function (pos) {
            var center = new L.LatLng(pos.lat, pos.lng);
            console.log('set view', pos);
            map.setView([center.lat, center.lng], map.getZoom());
        });

        opts.venues.on('venueAdded', function (venue) {
            if (self._ids.indexOf(venue.id) > -1) return;

            var marker = L.marker([venue.location.lat, venue.location.lng]).addTo(map);
            var i = self._ids.push(venue.id);
            self._markers[i] = marker;
        });

        map.on('dragend', function (e) {

            var c = map.getCenter();
            self.opts.location.trigger('updateLocation', {
                lat: c.lat,
                lng: c.lng
            });
        });
    });
</movie-map>

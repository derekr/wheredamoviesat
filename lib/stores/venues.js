var riot = require('riot');

module.exports = Venues;

function Venues () {
    if (!(this instanceof Venues)) return new Venues();

    riot.observable(this);

    var self = this;

    self.venues = [];
    self._ids = [];

    self.on('addVenue', function (venue) {
        if (self._ids.indexOf(venue.id) > -1) return;

        self._ids.push(venue.id);
        self.venues.push(venue);
        self.trigger('venueAdded', venue);
        self.trigger('venuesChanged', self.venues);
    });

    self.on('filterVenues', function (venues) {
        var filtered = self.venues.filter(function (venue) {
            return (venues.indexOf(venue.id) > -1);
        });

        self.trigger('venuesChanged', filtered);
    });

    self.on('clearFilter', function () {
        self.trigger('venuesChanged', self.venues);
    });
};

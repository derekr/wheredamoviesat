var riot = require('riot');

module.exports = Location;

function Location () {
    if (!(this instanceof Location)) return new Location();

    riot.observable(this);

    var self = this;

    self.location = { lat: 0, lng: 0 };

    self.on('updateLocation', function (loc) {
        console.log('updating location');
        self.loc = loc;
        self.trigger('locationChanged', self.loc);
    })
};

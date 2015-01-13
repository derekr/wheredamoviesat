var util = require('util');
var events = require('events');
var hq     = require('hyperquest');
var concat = require('concat-stream');
var each = require('async-each');

function fetchEvents (venueId, callback) {
    hq('/fours/venues/' + venueId + '/events?')
    .pipe(concat(function (data) {
        callback(null, JSON.parse(data).response.events.items);
    }))
    .on('error', function (err) {
        callback(err);
    });
}

function VenuesWithEvents () {};

util.inherits(VenuesWithEvents, events.EventEmitter);

VenuesWithEvents.prototype.filter = function (venues, callback) {
    var me = this;

    each(venues, function (v, callback) {
        fetchEvents(v.id, function (err, events) {
            if (err) return callback(err);

            if (events.length <= 0) return callback(null);

            me.emit('venue', v, events);
        });
    }, callback);
};

module.exports = VenuesWithEvents;

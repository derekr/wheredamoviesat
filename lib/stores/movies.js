var riot = require('riot');
var diff = require('amp-difference');

module.exports = Movies;

function Movies () {
    if (!(this instanceof Movies)) return new Movies();

    riot.observable(this);

    var self = this;

    self.movies = [];
    self._names = [];

    function addMovie (movie) {
        var i = self._names.indexOf(movie.name);
        if (i > -1) {
            var _v = self.movies[i].venues;
            self.movies[i].venues = _v.concat(diff(movie.venues, _v));
            return
        };

        self._names.push(movie.name);
        self.movies.push(movie);
    }

    self.on('addMovies', function (movies) {
        movies.forEach(addMovie);
        self.trigger('moviesChanged', self.movies);
    });

    self.on('movieSelected', function (movie) {
        for (i = 0; i < self.movies.length; i++) {
            self.movies[i].isSelected = false;
        }

        var i = self._names.indexOf(movie.name);
        self.movies[i].isSelected = true;

        self.trigger('moviesChanged', self.movies);
    });

    self.on('venueSelected', function (v) {
        var movies = self.movies.filter(function (m) {
            return (m.venues.indexOf(v) > -1);
        });

        self.trigger('moviesChanged', movies);
    });
};

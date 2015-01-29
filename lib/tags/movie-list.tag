<movie-list>
    <div class="movie-stats">{ movieLabel(movies.length) }</div>
    <ul class="movie-list">
        <li each={ movies } onclick={ parent.selected } class={ 'is-selected': isSelected }>
            <div class="list-item-wrapper">
                <span>{ name }</span>
                <span class="list-item-secondary-text">{ parent.theaterLabel(venues.length) }</span>
            </div>
        </li>
    </ul>

    var sort = require('sort-on');
    var plural = require('plural');

    var riotControl = require('../util/riot-control');

    this.movies = [];

    var self = this;

    riotControl.on('moviesChanged', function (movies) {
        self.movies = sort(movies, 'name');
        self.update();
    });

    this.movieLabel = function (count) {
        return count + ' ' + plural('movie', count);
    }

    this.theaterLabel = function (count) {
        return count + ' ' + plural('theater', count);
    }

    selected(e) {
        riotControl.trigger('filterVenues', e.item.venues);
        riotControl.trigger('movieSelected', e.item);
    }
</movie-list>

<movie-panel>
    <div class="panel { 'is-loading': loading }">
        <movie-list></movie-list>
    </div>

    this.loading = true;

    var riotControl = require('../util/riot-control');

    var self = this;

    riotControl.on('moviesChanged', function () {
        self.loading = false;
        self.update();
    });
</movie-panel>

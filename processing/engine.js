var engine = {
    firstTick: 0,
    previousTick: 0,
    currentTick: 0,
    tickLength: 0,

    xMax: 0,
    yMax: 0,

    mouseX: 0,
    mouseY: 0,
    clicked: false,

    keys: {
        W: false,
        A: false,
        S: false,
        D: false
    },

    objects: [],

    install: function() {
        return {
        }
    }

    createObject: function() {
        return {
        }
    }
}

function boot(game) = {
    return {
        init: function(processing) {
            var now = game._now();
            engine.firstTick = now;
            engine.currentTick = now;

            engine.xMax = document.body.clientWidth;
            engine.yMax = document.body.clientHeight;

            game.player.position.x = processing.width / 2;
            game.player.position.y = processing.height / 2;
            game.player.health = 100;
            game.player.lives = 3;
        },

        tick: function(processing) {
        },

        _reportStatistics: function() {
        },

        _now: function() {
            var date = new Date();
            return date.getTime();
        }
};

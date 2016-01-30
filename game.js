var game = {
    constants: {
    },

    engine: {
        lastTick: 0,

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
        }
    },

    init: function(processing) {
        game.engine.lastTick = game._now();

        game.engine.xMax = document.body.clientWidth;
        game.engine.yMax = document.body.clientHeight;

        game.player.positionX = processing.width / 2;
        game.player.positionY = processing.height / 2;
        game.player.health = 100;
        game.player.lives = 3;

        game.engine.lastTick = game._now();
    },

    tick: function(processing) {
    },

    _now: function() {
        var date = new Date();
        return date.getTime();
    }
};

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

        game.engine.lastTick = game._now();
    },

    tick: function(processing) {
    },

    _now: function() {
        var date = new Date();
        return date.getTime();
    }
};

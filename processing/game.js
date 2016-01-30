var game = {
    constants: {
    },

    engine: {
      player: {
          xMax: 0,
          yMax: 0,
          x: 0,
          y 0,
        }
      }
        lastTick: 0,
        firstTick: 0,
        interval: 0,

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
        game.engine.firstTick =game._now();

        game.engine.xMax = document.body.clientWidth;
        game.engine.yMax = document.body.clientHeight;
        game.engine.player.x = game.engine.player.xMax / 2
        game.engine.player.y = game.engine.player.yMax / 2

    },

    tick: function(processing) {
      game.clearScreen(processing);
      processing.stroke(50, 200, 50);
      processing.fill(60, 80, 90)
      processing.triangle(30, 75, 58, 20, 86, 75);

    },

    clearScreen: function(processing) {
      processing.background(100, 100, 200);
    },

    _now: function() {
        var date = new Date();
        return date.getTime();
    }
};

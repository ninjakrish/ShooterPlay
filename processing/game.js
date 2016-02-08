var game = {
    constants: {
    },
    engine: {
       objects: {
          player: {
          xMax: 0,
          yMax: 0,
          x: 0,
          y: 0,

    },
  },


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
        },
    },

    init: function(processing) {
        game.engine.lastTick = game._now();
        game.engine.firstTick =game._now();

        game.engine.objects.player.xMax = document.body.clientWidth;
        game.engine.objects.player.yMax = document.body.clientHeight;
        game.engine.objects.player.x = game.engine.objects.player.xMax / 2
        game.engine.objects.player.y = game.engine.objects.player.yMax / 2

    },

    tick: function(processing) {
      game.clearScreen(processing);

      if(game.engine.keys.W == true) {
          game.engine.objects.player.y = game.engine.objects.player.y - 1;
      }
      if(game.engine.keys.A == true) {
          game.engine.objects.player.x = game.engine.objects.player.x - 1;
      }
      if(game.engine.keys.S == true) {
        game.engine.objects.player.y = game.engine.objects.player.y + 1;
      }
      if(game.engine.keys.D == true) {
          game.engine.objects.player.x = game.engine.objects.player.x + 1;
      }
      processing.stroke(50, 200, 50);
      processing.fill(60, 80, 90);
      processing.rect(game.engine.objects.player.x, game.engine.objects.player.y, 55, 55);
      // check for object hitting the wall
      game.engine.objects.player.x != game.engine.objects.player.xMax;
      game.engine.objects.player.y != game.engine.objects.player.yMax;

  },

    WASD: function(processing)  {
// copy for all 4 keys
    },

    clearScreen: function(processing) {
      processing.background(100, 100, 200);
    },

    _now: function() {
        var date = new Date();
        return date.getTime();
    }
};

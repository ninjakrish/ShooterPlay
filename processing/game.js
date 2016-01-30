var game = {
    constants: {
    },

    objects: {
        player: {
            radius: 20,

            speed: {
                x: 0.1,
                y: -0.1
            },
            x: 0,
            y: 0
        }
    },

    engine: {
        lastTick: 0,
        currentTick: 0,
        interval: 0,

        xMax: 0,
        yMax: 0,
        xMin: 0,
        yMin: 0,

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
        processing.smooth();
        processing.ellipseMode(processing.CENTER);

        game.engine.currentTick = game._now();

        game.engine.xMax = document.body.clientWidth;
        game.engine.yMax = document.body.clientHeight;

        game.objects.player.x = game.engine.xMax / 2;
        game.objects.player.y = game.engine.yMax / 2;

    },

    tick: function(processing) {
        game.engine.lastTick = game.engine.currentTick;
        game.engine.currentTick = game._now();
        game.engine.interval = game.engine.currentTick - game.engine.lastTick;

        game.clearScreen(processing);
        game.drawPlayer(processing, game.engine.counter, 400);

    },

    drawPlayer: function(processing) {
        var deltaX = game.engine.interval * game.objects.player.speed.x;
        var deltaY = game.engine.interval * game.objects.player.speed.y;

        var newX = game.objects.player.x + deltaX;
        var newY = game.objects.player.y + deltaY;
        var radius = game.objects.player.radius;

        if (newY - radius < game.engine.yMin || newY + radius > game.engine.yMax) {
            game.objects.player.speed.y = game.objects.player.speed.y * -1;
        }
        if (newX - radius < game.engine.xMin || newX + radius > game.engine.xMax) {
            game.objects.player.speed.x = game.objects.player.speed.x * -1;
        }
        game.objects.player.x = newX;
        game.objects.player.y = newY;

        processing.stroke(255, 30, 0);
        processing.fill(100, 80, 70);
        processing.ellipse(game.objects.player.x, game.objects.player.y, game.objects.player.radius * 2, game.objects.player.radius * 2);
    },

    clearScreen: function(processing) {
        processing.background(40);
    },

    _now: function() {
        var date = new Date();
        return date.getTime();
    }
};

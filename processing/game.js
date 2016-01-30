var game = {
    constants: {
    },

    objects: {
        player: {
            bounceAcceleration: 1.3,

            spinSpeed: 0.003,
            spinDirection: false,
            theta: 0,
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
        firstTick: 0,
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
        drawPlayer: 0,
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
        processing.colorMode(processing.RGB, 256);

        game.engine.firstTick = game._now();
        game.engine.currentTick = game._now();

        game.engine.xMax = document.body.clientWidth;
        game.engine.yMax = document.body.clientHeight;

        game.objects.player.x = game.engine.xMax / 2;
        game.objects.player.y = game.engine.yMax / 2;

    },

    tick: function(processing) {
        if (game.engine.currentTick - game.engine.firstTick < 10000) {
            game.engine.lastTick = game.engine.currentTick;
            game.engine.currentTick = game._now();
            game.engine.interval = game.engine.currentTick - game.engine.lastTick;

            game.clearScreen(processing);
            game.drawPlayer(processing, game.engine.counter, 400);
        }
    },

    fixTheta: function(theta) {
        if (theta < 0) {
            return game.fixTheta(theta + 2 * Math.PI);
        } else if (theta > 2 * Math.PI) {
            return game.fixTheta(theta - 2 * Math.PI);
        } else {
            return theta;
        }
    },

    drawPlayer: function(processing) {
        var player = game.objects.player;

        var deltaX = game.engine.interval * player.speed.x;
        var deltaY = game.engine.interval * player.speed.y;

        var newX = player.x + deltaX;
        var newY = player.y + deltaY;
        var radius = player.radius;

        if (newY - radius < game.engine.yMin || newY + radius > game.engine.yMax) {
            player.speed.y = player.speed.y * -1.0 * player.bounceAcceleration;
            player.speed.x = player.speed.x * player.bounceAcceleration;
            player.spinSpeed = player.spinSpeed * player.bounceAcceleration;
            player.spinDirection = !player.spinDirection;
        }
        if (newX - radius < game.engine.xMin || newX + radius > game.engine.xMax) {
            player.speed.x = player.speed.x * -1.0 * player.bounceAcceleration;
            player.speed.y = player.speed.y * player.bounceAcceleration;
            player.spinSpeed = player.spinSpeed * player.bounceAcceleration;
            player.spinDirection = !player.spinDirection;
        }

        player.x = newX;
        player.y = newY;

        processing.stroke(255, 30, 0);
        processing.fill(100, 80, 70);

        if (game.engine.clicked) {
            processing.ellipse(player.x, player.y, radius * 2, radius * 2);
        }

        player.theta = game.fixTheta(player.theta + (player.spinDirection ? -1.0 : 1.0) * player.spinSpeed * game.engine.interval);

        var thetas = [player.theta,
                      player.theta + Math.PI/3,
                      player.theta + Math.PI/3 * 2,
                      player.theta + Math.PI,
                      player.theta + Math.PI/3 * 4,
                      player.theta + Math.PI/3 * 5];

        processing.fill(255, 255, 255);

        processing.colorMode(processing.HSB, 1.0);
        for (var i = 0; i < thetas.length; i = i + 1) {
            var theta = game.fixTheta(thetas[i]);

            var angle = theta / (2 * Math.PI)

            processing.stroke(angle, 1.0, 1.0);

            processing.ellipse(player.x + Math.cos(theta) * radius * 2,
                               player.y + Math.sin(theta) * radius * 2,
                               radius * 0.2, radius * 0.2);
        }
        processing.colorMode(processing.RGB, 256);
    },

    clearScreen: function(processing) {
        processing.background(40);
    },

    _now: function() {
        var date = new Date();
        return date.getTime();
    }
};

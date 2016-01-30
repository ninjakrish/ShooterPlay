var game = {
    constants: {
        hypotenuse45: 0.70710,

        enemySize: 20,

        playerSize: 30,
        playerSpeed: 0.2,

        reticleFiringSize: 5,
        reticleSize: 4,

        enemySpawnFrequency: 0.005,

        machineGunBulletSpread: 0.05,
        machineGunBulletSpeed: 0.7,
        machineGunBulletSize: 3
    },

    player: {
        positionX: 0,
        positionY: 0,
        lives: 0,
        health: 0
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

    state: {
        positionX: 0,
        positionY: 0,
        lives: 0,
        health: 0
    },

    objects: {
        enemies: [],
        bullets: []
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
        game._processChanges();

        game._drawScene(processing);
    },

    _processChanges: function() {
        var now = game._now();
        var tickLength = now - game.engine.lastTick;
        game.engine.lastTick = now;

        game._spawnEnemies();

        game._handleBullets(tickLength);

        game._calculatePlayerLocation(tickLength);
    },

    _spawnEnemies: function() {
        var random = Math.random();
        if (random < game.constants.enemySpawnFrequency) {
            var positionX = Math.random() * game.engine.xMax;
            var positionY = Math.random() * game.engine.yMax;

            var newEnemy = {
                positionX: positionX,
                positionY: positionY
            };

            game.objects.enemies.push(newEnemy);
        }
    },

    _handleBullets: function(tickLength) {
        game._collisionDetect(tickLength);
        game._moveBullets(tickLength);
        game._removeBullets();

        if (game.engine.clicked) {
            game._fireBullet();
        }
    },

    _collisionDetect: function() {
        _.each(game.objects.bullets, function(bullet) {
            _.each(game.objects.enemies, function(bullet) {
                bullet.positionX += tickLength * bullet.velocityX;
                bullet.positionY += tickLength * bullet.velocityY;
            });
        });
    },

    _removeBullets: function() {
        game.objects.bullets = _.filter(game.objects.bullets, function(bullet) {
            return bullet.positionX >= 0 || bullet.positionX <= game.engine.xMax ||
                   bullet.positionY >= 0 || bullet.positionY <= game.engine.yMax;
        });
    },

    _moveBullets: function(tickLength) {
        _.each(game.objects.bullets, function(bullet) {
            bullet.positionX += tickLength * bullet.velocityX;
            bullet.positionY += tickLength * bullet.velocityY;
        });
    },

    _fireBullet: function() {
        var speed = game.constants.machineGunBulletSpeed;

        var dx = game.engine.mouseX - game.player.positionX;
        var dy = game.engine.mouseY - game.player.positionY;

        var random = Math.random() * Math.random();
        var negated = Math.random() < 0.5;
        if (negated) {
            random *= -1;
        }
        var perturbAngle = random * game.constants.machineGunBulletSpread;
        var angle = Math.atan(dy/dx) + perturbAngle;

        var slope = Math.tan(angle);
        var rayLength = Math.sqrt(slope * slope + 1.0);

        var xLength = 1.0 / rayLength;
        var yLength = slope / rayLength;

        var dxAbs = Math.abs(dx);
        var dyAbs = Math.abs(dy);

        // TODO: fix this hack -- not sure how else to do this math, b/c of the perturbAngle.
        if (dxAbs > dyAbs) {
            if (dx > 0 && xLength < 0) {
                xLength *= -1;
                yLength *= -1;
            }
            if (dx < 0 && xLength > 0) {
                xLength *= -1;
                yLength *= -1;
            }
        } else {
            if (dy > 0 && yLength < 0) {
                xLength *= -1;
                yLength *= -1;
            }
            if (dy < 0 && yLength > 0) {
                xLength *= -1;
                yLength *= -1;
            }
        }

        var velocityX = speed * xLength;
        var velocityY = speed * yLength;

        var positionX = game.player.positionX + (game.constants.playerSize * xLength);
        var positionY = game.player.positionY + (game.constants.playerSize * yLength);

        var newBullet = {
            positionX: positionX,
            positionY: positionY,

            velocityX: velocityX,
            velocityY: velocityY
        }

        game.objects.bullets.push(newBullet);
    },

    _calculatePlayerLocation: function(tickLength) {
        var xDir = 0;
        var yDir = 0;
        var expectedMovement = game.constants.playerSpeed * tickLength;

        if (game.engine.keys.W) {
            yDir -= expectedMovement;
        }
        if (game.engine.keys.S) {
            yDir += expectedMovement;
        }

        if (game.engine.keys.A) {
            xDir -= expectedMovement;
        }
        if (game.engine.keys.D) {
            xDir += expectedMovement;
        }

        if (xDir != 0 && yDir != 0) {
            xDir *= game.constants.hypotenuse45;
            yDir *= game.constants.hypotenuse45;
        }

        game.player.positionX += xDir;
        game.player.positionX = Math.max(game.constants.playerSize/2, Math.min(game.engine.xMax - game.constants.playerSize/2, game.player.positionX));

        game.player.positionY += yDir;
        game.player.positionY = Math.max(game.constants.playerSize/2, Math.min(game.engine.yMax - game.constants.playerSize/2, game.player.positionY));
    },

    _drawScene: function(processing) {
        game._drawBackground(processing);

        game._drawEnemies(processing);
        game._drawBullets(processing);
        game._drawPlayer(processing);
        game._drawReticle(processing);
    },

    _drawBackground: function(processing) {
        processing.background(20);
    },

    _drawEnemies: function(processing) {
        processing.noStroke();
        processing.fill(0, 102, 200);

        var size = game.constants.enemySize;

        _.each(game.objects.enemies, function(enemy) {
            processing.ellipse(enemy.positionX, enemy.positionY, size, size);
        });
    },

    _drawBullets: function(processing) {
        processing.noStroke();
        processing.fill(200);

        var size = game.constants.machineGunBulletSize;

        _.each(game.objects.bullets, function(bullet) {
            processing.ellipse(bullet.positionX, bullet.positionY, size, size);
        });
    },

    _drawPlayer: function(processing) {
        processing.stroke(100, 0, 0);
        processing.fill(204, 102, 0);

        var size = game.constants.playerSize;

        processing.ellipse(game.player.positionX, game.player.positionY, size, size);
    },

    _drawReticle: function(processing) {
        processing.stroke(200, 0, 0);
        processing.fill(200, 0, 0);
        var size;
        if (game.engine.clicked) {
            size = game.constants.reticleFiringSize;
        } else {
            size = game.constants.reticleSize;
        }
        processing.ellipse(game.engine.mouseX, game.engine.mouseY, size, size);
    },

    _now: function() {
        var date = new Date();
        return date.getTime();
    }
};
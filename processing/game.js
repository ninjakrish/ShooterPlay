// TODO: use lodash
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
        position: {
            x: 0,
            y: 0
        },
        lives: 0,
        health: 0
    },

    engine: {
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
    },

    objects: {
        enemies: [],
        bullets: []
    },

    init: function(processing) {
        var now = game._now();
        game.engine.firstTick = now;
        game.engine.currentTick = now;

        game.engine.xMax = document.body.clientWidth;
        game.engine.yMax = document.body.clientHeight;

        game.player.position.x = processing.width / 2;
        game.player.position.y = processing.height / 2;
        game.player.health = 100;
        game.player.lives = 3;
    },

    tick: function(processing) {
        game._processChanges();

        game._drawScene(processing);

        game._reportStatistics();
    },

    _reportStatistics: function() {
    },

    _processChanges: function() {
        var now = game._now();
        game.engine.now = now;
        game.engine.previousTick = game.engine.currentTick;
        game.engine.currentTick = now;
        game.engine.tickLength = now - game.engine.previousTick;

        game._spawnEnemies();

        game._handleBullets();

        game._calculatePlayerLocation();
    },

    _spawnEnemies: function() {
        var random = Math.random();
        if (random < game.constants.enemySpawnFrequency) {
            var x = Math.random() * game.engine.xMax;
            var y = Math.random() * game.engine.yMax;

            var newEnemy = {
                velocity: { x: 0, y: 0 }
                position: {
                    x: newX,
                    y: newY,
                    old: { newX, newY }
                }
            };

            game.objects.enemies.push(newEnemy);
        }
    },

    _handleBullets: function() {
        game._collisionDetect();
        game._moveBullets();
        game._removeBullets();

        if (game.engine.clicked) {
            game._fireBullet();
        }
    },

    _collisionDetect: function() {
        var doCollide = function(bullet, enemy) {
            return false;
        }

        game.objects.bullets = _.filter(game.objects.bullets, function(bullet) {
            var lives = true;
            game.objects.enemies = _.filter(game.objects.enemies, function(enemy) {
                lives = !doCollide(bullet, enemy);
                return lives;
            });
            return lives;
        });
    },

    _removeBullets: function() {
        game.objects.bullets = _.filter(game.objects.bullets, function(bullet) {
            return bullet.position.x >= 0 || bullet.position.x <= game.engine.xMax ||
                   bullet.position.y >= 0 || bullet.position.y <= game.engine.yMax;
        });
    },

    _moveBullets: function() {
        _.each(game.objects.bullets, function(bullet) {
            bullet.position.x += game.engine.tickLength * bullet.velocity.x;
            bullet.position.y += game.engine.tickLength * bullet.velocity.y;
        });
    },

    _fireBullet: function() {
        var speed = game.constants.machineGunBulletSpeed;

        var dx = game.engine.mouseX - game.player.position.x;
        var dy = game.engine.mouseY - game.player.position.y;

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

        var velocity.x = speed * xLength;
        var velocity.y = speed * yLength;

        var position.x = game.player.position.x + (game.constants.playerSize * xLength);
        var position.y = game.player.position.y + (game.constants.playerSize * yLength);

        var newBullet = {
            position: {
                x: position.x,
                y: position.y
                old: {
                    x: game.player.position.x,
                    y: game.player.position.y
                }
            }

            velocity: {
                x: velocity.x,
                y: velocity.y
            }
        }

        game.objects.bullets.push(newBullet);
    },

    _calculatePlayerLocation: function() {
        var xDir = 0;
        var yDir = 0;
        var expectedMovement = game.constants.playerSpeed * game.engine.tickLength;

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

        game.player.position.x += xDir;
        game.player.position.x = Math.max(game.constants.playerSize/2, Math.min(game.engine.xMax - game.constants.playerSize/2, game.player.position.x));

        game.player.position.y += yDir;
        game.player.position.y = Math.max(game.constants.playerSize/2, Math.min(game.engine.yMax - game.constants.playerSize/2, game.player.position.y));
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
            processing.ellipse(enemy.position.x, enemy.position.y, size, size);
        });
    },

    _drawBullets: function(processing) {
        processing.noStroke();
        processing.fill(200);

        var size = game.constants.machineGunBulletSize;

        _.each(game.objects.bullets, function(bullet) {
            processing.ellipse(bullet.position.x, bullet.position.y, size, size);
        });
    },

    _drawPlayer: function(processing) {
        processing.stroke(100, 0, 0);
        processing.fill(204, 102, 0);

        var size = game.constants.playerSize;

        processing.ellipse(game.player.position.x, game.player.position.y, size, size);
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

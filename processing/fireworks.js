function fireworks() {
    var all = [
        first
    ];

    var first = {
        startingTime: 1000,
        angle: 90,
        speed: 10,
        color: {
            r: 100,
            g: 100,
            b: 100
        },
        timer: 3000,
        onInit: function(self, factory) {
            self.variable = true;
        },
        onTick: function(self, factory) {
            console.log("variable: " + first.variable);
            if (self.color.r > 0) {
                self.color.r = first.color.r - 1;
            }
            if (self.color.g > 0) {
                self.color.g = first.color.g - 1;
            }
            if (self.color.b > 0) {
                self.color.b = first.color.b - 1;
            }
        },
        onExplode: function(self, factory) {
            factory.projectile(self, [
                {
                    angles: 12,
                    speed: 1.0,
                    color: {
                        r: 100,
                        g: 0,
                        b: 0
                    },
                    onTick: function(inner_self, time) {
                        if (inner_self.color.r > 0) {
                            inner_self.color.r = inner_self.color.r - 1;
                        }
                    }
                }
            ]);
        }
    };

    return all;
}

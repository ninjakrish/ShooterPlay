function fireworks() {
    return [
        {
            startingTime: 1.0,
            color: {
                r: 100,
                g: 100,
                b: 100
            },
            timer: 3.0,
            onExplode: function(factory) {
                factory.addFirework({

                });
            }
        }
    ];
}

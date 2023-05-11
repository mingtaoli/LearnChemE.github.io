require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
    include_friction: false,
    inlet_pressure: 100, // mmH2O
    outer_diameter: 20, // mm
    inner_diameter: 12, // mm
    flow_velocity: 0.25, // m/s
    v2: 0, // m/s
    manometer_1_pressure: 100, // mmH2O
    manometer_2_pressure: 100, // mmH2O
    manometer_3_pressure: 100, // mmH2O
    manometer_4_pressure: 100, // mmH2O
    manometer_5_pressure: 100, // mmH2O
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 530);
        p.noLoop();
        gvs.p = p;
        gvs.calcAll = require("./js/calcs.js");
        gvs.drawAll = require("./js/draw.js");
        require("./js/inputs.js");
        
        p.windowResized = function() {

        }
    };

    p.draw = function() {
        p.background(253);
        gvs.calcAll();
        gvs.drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);
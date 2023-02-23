require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT

window.gvs = {
    yA : function(xA) {return 1},
    volume_A : 5,
    MW_A : undefined,
    MW_B : undefined,
    density_A : undefined,
    density_B : undefined,
    molar_density_A : undefined,
    molar_density_B : undefined,
    xA_flask : undefined,
    volume_A_remaining : 100,
    volume_B_remaining : 100,
    yA_sample : NaN,
    temperature_flask : undefined,
    not_enough_liquid : false,
    submission_stage : 1,
};

require("./js/initialize.js");

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 530);
        p.noLoop();
        gvs.p = p;
        gvs.drawAll = require("./js/draw.js");
        const { SVG_Graph } = require("./js/svg-graph-library.js");
        gvs.SVG_Graph = SVG_Graph;
        require("./js/plot.js");
        require("./js/inputs.js");
        
        p.windowResized = function() {

        }
    };

    p.draw = function() {
        p.background(253);
        gvs.drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);
require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:


// GLOBAL VARIABLES OBJECT
window.gvs = {
  piston_mode : "constant-p", // Option selected using the drop-down menu
  piston_height : 0.35, // Fraction of height the piston is up the cylinder, value between 0 and 1
  heat_added : 0, // Heat added, J
  T : 273, // Internal temperature, K
  P : 101325, // Internal pressure, Pa
  V : 0.0224, // Volume of the piston/cylinder, m^3
  n : 1, // Number of moles in the cylinder
  R : 8.3144598, // Ideal gas constant, J/mol
  Cp : 29.1006093, // Constant-pressure heat capacity, J/mol
  Cv : 20.7861495, // Constant-volume heat capacity, J/mol
};

// Handle sliders
require("./js/inputs.js");

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

  p.setup = function () {
    p.createCanvas(800, 530);
    p.noLoop();
    gvs.p = p;
    p.textSize(17);
    gvs.calcAll = require("./js/calcs.js");
    gvs.drawAll = require("./js/draw.js");
    document.getElementById("loading").style.display = "none";
  };

  p.draw = function () {
    p.background(253);
    gvs.calcAll();
    gvs.drawAll(p);
  };

};

const P5 = new p5(sketch, containerElement);
const PISTON = 0;
const BAR = 1;

const BENZ_ANT_A = 4.72583;
const BENZ_ANT_B = 1660.652;
const BENZ_ANT_C = -1.461;
const WATER_ANT_A = 3.55959;
const WATER_ANT_B = 643.748;
const WATER_ANT_C = -198.043;

window.g = {
    cnv: undefined,
    width: 800,
    height: 480,

    orange: [230, 100, 0],
    blue: [0, 0, 255],
    green: [0, 150, 0],

    display: PISTON,
    temp: 122,
    x_b: .25,
    pistonHeight: 10,
    labels: false,

    pistonHeightMax: 60,
    Pb: 3,
    Pw: 2,

    vap: 0,
    yb: 0,
}

function preload() {
    font = loadFont('assets/Ubuntu-R.ttf');
}

function setup() {
    g.cnv = createCanvas(g.width, g.height, WEBGL);
    g.cnv.parent("graphics-wrapper");
}

const graph = new P5_Graph(g.width, g.height, {
    padding: [
        [60, 40],
        [300, 80]
    ],
    xLabelPrecision: 1,
    yLabelPrecision: 1,
    xTitle: 'benzene mole fraction',
    yTitle: 'pressure (bar)',

    yTickCount: 35,
}, [0, 1], [0, 7])

function draw() {
    push();
    translate(-400, -240);
    textFont(font);
    graph.on_draw();
    drawExtraGraphLabels();
    drawEqm();
    pop();

    drawPiston();
}

const tempSlider = document.getElementById("temp-slider");
const tempLabel = document.getElementById("temp-slider-label");

const pistSlider = document.getElementById("piston-slider");

tempSlider.addEventListener("input", function () {
    tmp = Number(tempSlider.value);
    g.temp = tmp;
    tempLabel.innerHTML = `${tmp}`;
})

pistSlider.addEventListener("input", function () {
    g.pistonHeight = Number(pistSlider.value);
})

function liqLine() {
    // return [(g.temp - 125) / 20 * 2.5 + 5.75, 0];
    return [g.Pb + g.Pw, 0]
}

function eqmCurve(x) {
    // let y;
    // let s = (g.temp - 105) / 20;
    // if (x <= .6) {
    //     y = 4 + 2 * (x - 2) + 6.22 * x ** 2; // 6.31
    // }
    // else {
    //     y = 1.14 + 3 * (1 - x) + 6.875 * (1 - x) ** 2; // 3.45
    // }
    // return y * (s * .4 + .60) + 1.11 * s + 1.2;


    return Math.min(g.Pw / (1 - x), g.Pb / x);
}

function getPressure() {
    return .1507 * (g.temp + 273) / g.pistonHeight;
}
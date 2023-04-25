window.g = {
    cnv: undefined,

    // Element graphs being shown for
    element: "n-hexane",

    // Variable that holds vectors for the chosen element and the curve coefficients of upper line
    vec: [],

    // Graph edges
    lx: 75,
    rx: 675,
    ty: 50,
    by: 450,

    // For manipulating the dot
    radius: 5,
    points: [],
    nP: 1,
    dragPoint: null,
    lowerTest: false,
    higherTest: false,

    // Color to be used repeatedly
    blue: [0, 0, 200],

    // Tr value
    Tr: 0,
    shift: 0,

}

function setup() {
    g.cnv = createCanvas(700, 500);
    g.cnv.parent("graphics-wrapper");
    document.getElementsByTagName("main")[0].remove();
    defineVecs();
    g.points.push(createVector(320, 240));
}

function draw() {
    boundaryTest(); // Checks where mouse/dot is to make sure staying within bounds
    background(250);
    frameDraw(); // Draws graph labels and axes
    curveDraw(); // Draws the various curve representations for the Tr values
    currentComp(); // Line that shows Z vs Pr for current dot position
    legs(); // Draws the lines from dot to Z and Pr axes



    push();
    fill(0);
    temp = g.points[0];
    ellipse(temp.x, temp.y, 2 * g.radius);
    pop();
}


const element = document.getElementById("element").children;
for (let i = 0; i < element.length; i++) {
    element[i].addEventListener("click", function () {
        for (let j = 0; j < element.length; j++) {
            element[j].classList.remove("selected");
        };
        element[i].classList.add("selected");
        g.element = element[i].value;
        defineVecs();
        g.points[0].x = 320;
        g.points[0].y = 240;
    });
};

// For manipulating the position of dot within the triangle
function mousePressed() {
    for (let i = g.points.length - 1; i >= 0; i--) {
        const isPressed = inCircle(g.points[i], g.radius);
        if (isPressed) {
            g.dragPoint = g.points.splice(i, 1)[0];
            g.points.push(g.dragPoint);

        }
    }
}

function mouseDragged() {

    if (g.dragPoint) {
        if (g.lowerTest && g.higherTest && mouseX >= g.lx && mouseX <= g.rx) {
            g.dragPoint.x = mouseX;
            g.dragPoint.y = mouseY;
        } else if (!g.lowerTest && g.higherTest && mouseX >= g.lx && mouseX <= g.rx) {
            g.dragPoint.x = mouseX;
            let Pr = map(mouseX, g.lx, g.rx, 0, 5);
            let Z = find2D(Pr, Z10);
            g.dragPoint.y = map(Z, 0, 1.1, g.by, g.ty);
        } else if (g.lowerTest && !g.higherTest && mouseX >= g.lx && mouseX <= g.rx) {
            g.dragPoint.x = mouseX;
            let Pr = map(mouseX, g.lx, g.rx, 0, 5);
            let Z = find2D(Pr, g.vec[g.vec.length - 1]);
            g.dragPoint.y = map(Z, 0, 1.1, g.by, g.ty);
        }
    }
}

function mouseReleased() {
    g.dragPoint = null;
}

function inCircle(pos, radius) {
    return dist(mouseX, mouseY, pos.x, pos.y) < radius;
}
/* jshint esversion: 6 */

var html = document.getElementsByTagName('html')[0];
let rem = parseInt(window.getComputedStyle(html).fontSize);

let basePlot2D;
let xAxisLimit = 4;
let yAxisLimit = 4;
let xyMin;
let xyMax;

let pts = [[100, 200], [200, 100]]; // Default location of coordinates. Note that this is px, not coordinate
let ptCoords = []; // Their corresponding coordinates (solved for in the program)
let n = pts.length; // number of points
let vSum = [0, 0];
let vSumCoords = [[100, 200], [200, 100]];

let rolloverPt = [false, 1]; // Is the mouse over the circle, if so, which circle?
let rolloverLine = [false, 1]; // Is the mouse over the line, if so, which line?
let draggingPt = [false, 1]; // Is a point being dragged, if so, which point?
let draggingLine = [false, 1]; // Is the line being dragged, if so, which line?
let mouseOffset = [0, 0]; // Mouseclick offset
let r = 10; // // radius of the dragged points (pixels)

let graphicsOffset = [[1, 1], [1, 1], [1, 1]]; // Quadrants for graphics offset. [1, 1] is top-right, [-1, 1] is top left, etc. Used to prevent graphics from overlapping.
let offset = [];

let i = 1; // iterator variables (comes in handy, since p5.js is a looping library)
let j = 1;

let iHat; // 70*153 original size
let jHat; // 85*196 original size
let kHat; // 121*206 original size

let selectOptions;
let newVectorButton;
let sumVectorButton;
let sumPressed = false;
let removeVectorButton;
let resetVectorsButton;
let crossVectorCheckbox;
let normPlaneCheckbox;
let arrowsCheckbox;
let coordsCheckbox;

let drawArrows = [false, false, false, false, false, false, false];
let drawCoords = false;
let drawCross = false;
let drawNormalPlane = false;

let ops;
let pageSelection = sessionStorage.getItem("pageVal");
let page;

if (sessionStorage.getItem("pageVal")) {page = pageSelection;} else {page = "vector addition";}

let twoDimension = true;

var x1 = 1;
var y1 = 0;
var z1 = 0;
var x2 = 0;
var y2 = 1;
var z2 = 0;

let aspRatio = 0.8;
let margins = 120;
let pageWidth = window.innerWidth - margins;
let pageHeight = pageWidth * aspRatio;

let myFont;

function preload() {
  iHat = loadImage('../../media/iHatWhite.png');
  jHat = loadImage('../../media/jHatWhite.png');
  kHat = loadImage('../../media/kHatWhite.png');
  myFont = loadFont('Helvetica.otf');
}

class options {
  constructor(gPlot) {
    this.gPlot = gPlot;
  }
  
  defaultPlot() {
    this.gPlot.setPos(0, 0); // sets the top-left corner of the plot at the top-left corner of base canvas
    this.gPlot.setOuterDim(width-100, height); // sets the plot dimensions, pixels

    // axes range, labels
    this.gPlot.setXLim(-xAxisLimit, xAxisLimit); // x limits
    this.gPlot.setYLim(-yAxisLimit, xAxisLimit); // y limits
    this.gPlot.getXAxis().getAxisLabel().setText("x - axis"); // x-axis label
    this.gPlot.getYAxis().getAxisLabel().setText("y - axis"); // y-axis label
    this.gPlot.getXAxis().setFontSize(1*rem);
    this.gPlot.getYAxis().setFontSize(1*rem);
    this.gPlot.getXAxis().getAxisLabel().setFontSize(1*rem);
    this.gPlot.getYAxis().getAxisLabel().setFontSize(1*rem);

    this.gPlot.getTitle().setText("Learn About Vectors"); // title
    this.gPlot.getTitle().setFontSize(1.2*rem);
  }

  static defaultSidebar() {
    if (newVectorButton === undefined) {
    newVectorButton = createButton('insert vector');
    newVectorButton.position(width-100, 40);
    newVectorButton.mousePressed(newVector);
  
    sumVectorButton = createButton('sum vectors');
    sumVectorButton.position(width-100, 90);
    sumVectorButton.mousePressed(sumVector);

    removeVectorButton = createButton('remove vector');
    removeVectorButton.position(width-100, 140);
    removeVectorButton.mousePressed(removeVector);

    resetVectorsButton = createButton('reset');
    resetVectorsButton.position(width-100, 180);
    resetVectorsButton.mousePressed(reset);

    crossVectorCheckbox = createCheckbox('show cross product', false);
    crossVectorCheckbox.position(width-100, 10);
    crossVectorCheckbox.changed(mySelectEvent);

    normPlaneCheckbox = createCheckbox('show normal plane', false);
    normPlaneCheckbox.position(width-100, 50);
    normPlaneCheckbox.changed(mySelectEvent);

    selectOptions = createSelect();
    selectOptions.position(width-100, 220);
    selectOptions.option('vector addition');
    selectOptions.option('scalar multiplication');
    selectOptions.option('dot product');
    selectOptions.option('cross product');
    selectOptions.value(page);
    selectOptions.changed(reInitialize);
    }
  }

  static drawAxes3D() {
    background(200);
    ambientLight(160, 160, 160);
    pointLight(255, 255, 255, 20, 20, 200);
    orbitControl(5, 5);
    
    
    //let phi = 0;
    let v0 = createVector(0, 1, 0);
    let x = p5.Vector.cross(v0, createVector(1, 0, 0));
    let y = p5.Vector.cross(v0, createVector(0, 1, 0));
    let z = p5.Vector.cross(v0, createVector(0, 0, 1));
    
    let trans = [-180, 0, 180];
    let axisLength = 200;
    let axisThickness = 0.5;
    let RGB = [0, 0, 0];
    // x-axis
    push();
      ambientMaterial.apply(this, RGB);
      translate(trans[0], trans[1], trans[2]);
      rotate(PI/2, x);
      translate(0, axisLength / 2, 0);
      cylinder(axisThickness, axisLength);
      translate(0, axisLength / 2 + 2, 0);
      cone(4, 10);
    pop();
    // y-axis
    push();
      ambientMaterial.apply(this, RGB);
      translate(trans[0], trans[1], trans[2]);
      rotateX(PI);
      translate(0, axisLength / 2, 0);
      cylinder(axisThickness, axisLength);
      translate(0, axisLength / 2 + 2, 0);
      cone(4, 10);
    pop();
    // z-axis
    push();
      ambientMaterial.apply(this, RGB);
      translate(trans[0], trans[1], trans[2]);
      rotate(-PI/2, z);
      translate(0, axisLength / 2, 0);
      cylinder(axisThickness, axisLength);
      translate(0, axisLength / 2 + 2, 0);
      cone(4, 10);
    pop();

    let camX = window._renderer._curCamera.eyeX;
    let camY = window._renderer._curCamera.eyeY;
    let camZ = window._renderer._curCamera.eyeZ;
    let camVec = createVector(camX, camY, camZ);
    let theta = atan2(camX, camZ);
    let phi = -atan2(camY, camVec.mag());
    textAlign(CENTER);

    push();
      fill(0);
      translate(trans[0], trans[1], trans[2]);
      translate(axisLength+30, 10, 0);
      rotate(theta, v0);
      rotateX(phi);
      // BUG????? needed to add this extra character or nothing works????? halp
      text('_x', 0, 0);
    pop();

    push();
      fill(0);
      translate(trans[0], trans[1], trans[2]);
      translate(0, - axisLength - 40, 0);
      rotate(theta, v0);
      rotateX(phi);
      text('y', 0, 0);
    pop();

    push();
      fill(0);
      translate(trans[0], trans[1], trans[2]);
      translate(0, 10, -axisLength - 40);
      rotate(theta, v0);
      rotateX(phi);
      text('z', 0, 0);
    pop();
  }
}

class drawing {
  constructor(gPlot) {
    this.gPlot = gPlot;
  }

  drawMethod2D() {
  this.gPlot.beginDraw(); // draws the plot
  this.gPlot.drawBackground();
  this.gPlot.drawBox();
  this.gPlot.setHorizontalAxesNTicks(8);
  this.gPlot.setVerticalAxesNTicks(8);
  this.gPlot.drawGridLines(GPlot.BOTH);
  this.gPlot.drawXAxis();
  this.gPlot.drawYAxis();
  this.gPlot.drawTitle();
  this.gPlot.endDraw();
  }
}

function setup() {
  if(page != "cross product") {
    createCanvas(pageWidth, pageHeight, P2D); // Add base canvas, x-pixels by y-pixels

    basePlot2D = new GPlot(this); // see "grafica.js" library for info on GPlots
    
    ops = new options();
    ops.gPlot = basePlot2D;
    ops.defaultPlot();

    extraCanvas = createGraphics(pageWidth, pageHeight); // adds a second canvas on top of the first. this will be transparent, and where the points will be drawn onto.
    
    background(220); // background color of main canvas to RGB(220, 220, 220) "lighter gray"

    plotdraw2D = new drawing();
    plotdraw2D.gPlot = basePlot2D;
    options.defaultSidebar();
    crossVectorCheckbox.hide();
    normPlaneCheckbox.hide();

    xyMin = getCoords(-xAxisLimit, -yAxisLimit, basePlot2D);
    xyMax = getCoords(xAxisLimit, yAxisLimit, basePlot2D);

    /* doesn't do anything yet ...
    switch(page) {
      case "vector addition":
        break;
      case "scalar multiplication":
        break;
      case "dot product":
        break;
      default:
        break;
    }*/
  }
  else {
    createCanvas(pageWidth, pageHeight, WEBGL);
    options.defaultSidebar();
    resizeCanvas(pageWidth-100, pageHeight);
    textFont(myFont);
    textSize(rem*2);

    newVectorButton.hide();
    sumVectorButton.hide();
    removeVectorButton.hide();
    resetVectorsButton.hide();
    normPlaneCheckbox.show();
    selectOptions.position(width + 10, 90);

    normalMaterial();
    ambientMaterial(39, 235, 91);
    camera(100, -200, (height/2.0) / tan(PI*30.0 / 180.0), 0, 0, 0, 0, 1, 0);

    gui = createGui('plot controls', width + 10, 140);
    gui.newSlider("x1", -4, 4, 1, 0.1, "vector 1 x-component", " i");
    gui.newSlider("y1", -4, 4, 1, 0.1, "vector 1 y-component", " j");
    gui.newSlider("z1", -4, 4, 1, 0.1, "vector 1 z-component", " k");
    gui.newSlider("x2", -4, 4, 1, 0.1, "vector 2 x-component", " i");
    gui.newSlider("y2", -4, 4, 1, 0.1, "vector 2 y-component", " j");
    gui.newSlider("z2", -4, 4, 1, 0.1, "vector 2 z-component", " k");


    LaTexCross();

    loop();
  }
}

function reInitialize() {
  /**
   * re-initializes the canvas when user switches to a different section
   */
  sessionStorage.setItem("pageVal", selectOptions.value());
  if (page == "cross product") {location.reload();}
  page = selectOptions.value();
  if (page == "cross product") {
    twoDimension = false;
    newVectorButton.hide();
    sumVectorButton.hide();
    crossVectorCheckbox.show();
    setup();
    selectOptions.value("cross product");
  }
}

function reset() {
  switch(page) {
    case "vector addition":
      while(n > 2) {
        pts.pop();
        n--;
      }
      vSum[0]=0;
      vSum[1]=0;
      sumPressed = false;
      break;
    case "scalar multiplication":
      break;
    case "dot product":
      break;
    case "cross product":
      break;
    default:
      break;
  }
}

function mySelectEvent() {
  drawCross = crossVectorCheckbox.checked();
  drawNormalPlane = normPlaneCheckbox.checked();
  mouseReleased();
}

function newVector() {
  if(n < 5 && !sumPressed) {
    pts.push([random(xyMin[0],xyMax[0]), random(xyMin[1],xyMax[1])]);
    // if the new random point is too close to other vertices, it looks for a new random spot on the canvas until it finds an empty spot.
    let dist = new Array(n).fill(0);
    let tooClose = true;
    let k=0;
    while(tooClose) {
    tooClose = false;
      for(i=0;i<n;i++){
        dist[i] = abs(Math.sqrt(Math.pow(pts[i][0]-pts[n][0],2)+Math.pow(pts[i][1]-pts[n][1],2)));
        if(dist[i]<200){
          pts[n]=[random(xyMin[0],xyMax[0]), random(xyMin[1],xyMax[1])];
          tooClose = true;
          break;}
        }
      if(k>10){break;}
      k++;
    }

    graphicsOffset.push([1, 1]);
    n += 1;
  }
}

function sumVector() {
  if(n > 2 && !sumPressed) {
    // finds coordinates for sum vector arrow
    vSumCoords[0] = pts[0];
    vSumCoords[1] = pts[n - 1];
    // sums the vectors
    for (i=0;i<n-1;i++) {vSum[0]+=Number((ptCoords[i+1][0]-ptCoords[i][0]).toFixed(1));vSum[1]+=Number((ptCoords[i+1][1]-ptCoords[i][1]).toFixed(1));}
    sumPressed = true;
  }
}

function removeVector() {
  if(!sumPressed && n > 2) {
    pts.pop();
    graphicsOffset.pop();
    n += -1;
  }
}

// a quick function to get the plot coordinates (x, y) at pixels (xPix, yPix). gPlot is the ID of your GPlot.
function loc(xPix, yPix, gPlot) {
  return gPlot.getValueAt(xPix, yPix);
}

// this does the opposite of loc(x, y, gPlot) but with coordinates to pixels
function getCoords(x, y, gPlot) {
  return gPlot.getScreenPosAtValue(x, y);
}

function DrawArrows(parentLayer) {
  for (j = 0; j < n - 1; j++) {
    if (drawArrows[j+1]) {
      //i-hat arrow
      this.parentLayer = parentLayer;
      this.parentLayer.push();
      this.parentLayer.strokeWeight(3);
      this.parentLayer.stroke(255, 30, 30);
      this.parentLayer.line(pts[j][0]-10*graphicsOffset[j][0], pts[j][1], pts[j+1][0]+2*graphicsOffset[j][0], pts[j][1]);
      this.parentLayer.fill(255, 30, 30);
      this.parentLayer.triangle(pts[j+1][0]+2*graphicsOffset[j][0], pts[j][1],  pts[j+1][0]+8*graphicsOffset[j][0], pts[j][1]+3,  pts[j+1][0]+8*graphicsOffset[j][0], pts[j][1]-3);
      this.parentLayer.tint(255, 50, 50);
      this.parentLayer.image(iHat, 0.5*pts[j][0]+0.5*pts[j+1][0]-30, pts[j][1]-20-30*graphicsOffset[j][1], 0.09*iHat.width, 0.12*iHat.height);
      this.parentLayer.fill(255, 30, 30);
      this.parentLayer.textSize(1*rem);
      this.parentLayer.noStroke();
      this.parentLayer.textAlign(LEFT);
      this.parentLayer.text("= ".concat((ptCoords[j+1][0]-ptCoords[j][0]).toFixed(1)), 0.5*pts[j][0]+0.5*pts[j+1][0]-30+0.2*iHat.width, pts[j][1]-20-30*graphicsOffset[j][1]+0.12*iHat.height);
      this.parentLayer.pop();

      //j-hat arrow
      this.parentLayer.push();
      this.parentLayer.strokeWeight(3);
      this.parentLayer.stroke(30, 30, 255);
      this.parentLayer.line(pts[j+1][0], pts[j][1] + 4*graphicsOffset[j][1], pts[j+1][0], pts[j+1][1] - 6*graphicsOffset[j][1]);
      this.parentLayer.fill(30, 30, 255);
      this.parentLayer.triangle(pts[j+1][0], pts[j+1][1] - 4*graphicsOffset[j][1],  pts[j+1][0] + 3, pts[j+1][1] - 10*graphicsOffset[j][1],  pts[j+1][0] - 3, pts[j+1][1] - 10*graphicsOffset[j][1]);
      this.parentLayer.tint(50, 50, 255);
      this.parentLayer.image(jHat, pts[j+1][0]-35-50*graphicsOffset[j][0], 0.5*pts[j][1]+0.5*pts[j+1][1], 0.11*jHat.width, 0.12*jHat.height)
      this.parentLayer.fill(30, 30, 255)
      this.parentLayer.textAlign(LEFT);
      this.parentLayer.textSize(1*rem);
      this.parentLayer.noStroke();
      this.parentLayer.text("= ".concat((ptCoords[j+1][1]-ptCoords[j][1]).toFixed(1)), pts[j+1][0]-35-50*graphicsOffset[j][0]+0.2*jHat.width, 0.5*pts[j][1]+0.5*pts[j+1][1]+0.1*jHat.height);
      this.parentLayer.pop();
    }
  }
  if (sumPressed && drawArrows[n+1]) {
    this.parentLayer = parentLayer;
      this.parentLayer.push();
      this.parentLayer.strokeWeight(3);
      this.parentLayer.stroke(255, 30, 30);
      this.parentLayer.line(pts[0][0]-10*graphicsOffset[n][0], pts[0][1], pts[n-1][0]+2*graphicsOffset[n][0], pts[0][1]);
      this.parentLayer.fill(255, 30, 30);
      this.parentLayer.triangle(pts[n-1][0]+2*graphicsOffset[n][0], pts[0][1],  pts[n-1][0]+8*graphicsOffset[n][0], pts[0][1]+3,  pts[n-1][0]+8*graphicsOffset[n][0], pts[0][1]-3);
      this.parentLayer.tint(255, 50, 50);
      this.parentLayer.image(iHat, 0.5*pts[0][0]+0.5*pts[n-1][0]-30, pts[0][1]-20-30*graphicsOffset[n][1], 0.09*iHat.width, 0.12*iHat.height);
      this.parentLayer.fill(255, 30, 30);
      this.parentLayer.textSize(1*rem);
      this.parentLayer.noStroke();
      this.parentLayer.textAlign(LEFT);
      this.parentLayer.text("= ".concat((ptCoords[n-1][0]-ptCoords[0][0]).toFixed(1)), 0.5*pts[0][0]+0.5*pts[n-1][0]-30+0.2*iHat.width, pts[0][1]-20-30*graphicsOffset[n][1]+0.12*iHat.height);
      this.parentLayer.pop();

      //j-hat arrow
      this.parentLayer.push();
      this.parentLayer.strokeWeight(3);
      this.parentLayer.stroke(30, 30, 255);
      this.parentLayer.line(pts[n-1][0], pts[0][1] + 4*graphicsOffset[n][1], pts[n-1][0], pts[n-1][1] - 6*graphicsOffset[n][1]);
      this.parentLayer.fill(30, 30, 255);
      this.parentLayer.triangle(pts[n-1][0], pts[n-1][1] - 4*graphicsOffset[n][1],  pts[n-1][0] + 3, pts[n-1][1] - 10*graphicsOffset[n][1],  pts[n-1][0] - 3, pts[n-1][1] - 10*graphicsOffset[n][1]);
      this.parentLayer.tint(50, 50, 255);
      this.parentLayer.image(jHat, pts[n-1][0]-35-50*graphicsOffset[n][0], 0.5*pts[0][1]+0.5*pts[n-1][1], 0.11*jHat.width, 0.12*jHat.height)
      this.parentLayer.fill(30, 30, 255)
      this.parentLayer.textAlign(LEFT);
      this.parentLayer.textSize(1*rem);
      this.parentLayer.noStroke();
      this.parentLayer.text("= ".concat((ptCoords[n-1][1]-ptCoords[0][1]).toFixed(1)), pts[n-1][0]-35-50*graphicsOffset[n][0]+0.2*jHat.width, 0.5*pts[0][1]+0.5*pts[n-1][1]+0.1*jHat.height);
      this.parentLayer.pop();
  }
}

function DrawCoords(parentLayer) {
  this.parentLayer = parentLayer;
  for (j = 0; j < n; j++) {
    //text
    this.parentLayer.push();
    if (j == 0) {
      let angle = atan2(pts[j][1]-pts[j+1][1], pts[j][0]-pts[j+1][0]);
      if (typeof offset[j] == "undefined")
        {offset.push(p5.Vector.fromAngle(angle, 50))}
      else if (typeof offset[j] == "object") {
        offset[j] = p5.Vector.fromAngle(angle, 50)
      };
    }
    else if (j < n - 1) {
      let midpointX = (pts[j+1][0]+pts[j-1][0])/2;
      let midpointY = (pts[j+1][1]+pts[j-1][1])/2;
      let angle = atan2(pts[j][1]-midpointY, pts[j][0]-midpointX);
      if (typeof offset[j] == "undefined")
        {offset.push(p5.Vector.fromAngle(angle, 50))}
      else if (typeof offset[j] == "object") {
        offset[j] = p5.Vector.fromAngle(angle, 50)
      };
    }
    else if (j == n - 1) {
      let angle = atan2(pts[j][1]-pts[j-1][1], pts[j][0]-pts[j-1][0]);
      if (typeof offset[j] == "undefined")
        {offset.push(p5.Vector.fromAngle(angle, 50))}
      else if (typeof offset[j] == "object") {
        offset[j] = p5.Vector.fromAngle(angle, 50)
      };
    }
    if (rolloverPt[0] && rolloverPt[1] == j || draggingPt[0] && draggingPt[1] == j ) {
      this.parentLayer.textAlign(CENTER);
      this.parentLayer.textSize(1*rem);
      this.parentLayer.noStroke();
      this.parentLayer.fill(0);
      this.parentLayer.text("(".concat(ptCoords[j][0].toFixed(1),", ", ptCoords[j][1].toFixed(1),")"), pts[j][0] + offset[j].x, pts[j][1] + offset[j].y);
      /*if (j == n - 1) {//the for loop is 1 shorter than the number of points
        this.parentLayer.text("(".concat(ptCoords[j+1][0].toFixed(1),", ", ptCoords[j+1][1].toFixed(1),")"), pts[j+1][0]-50*graphicsOffset[j][0], pts[j+1][1]-10);
      }*/
      this.parentLayer.pop();
    }
  }
}

function DrawVectorText(parentLayer) {
  this.parentLayer = parentLayer;
  for (j = 0; j < n - 1; j++) {
    let angle = atan2(pts[j][1]-pts[j+1][1], pts[j][0]-pts[j+1][0]);
    if (angle > PI / 2 || angle < - PI / 2) {angle += -PI;}
    this.parentLayer.push();
    this.parentLayer.textAlign(CENTER);
    this.parentLayer.textSize(1*rem);
    this.parentLayer.noStroke();
    this.parentLayer.fill(0);
    this.parentLayer.translate((pts[j][0] + pts[j+1][0])/2, (pts[j][1] + pts[j+1][1])/2);
    this.parentLayer.rotate(angle);
    let jSign;
    if(ptCoords[j+1][1]-ptCoords[j][1] > 0) {jSign = "+ ";} else {jSign = "- ";}
    this.parentLayer.text("".concat((ptCoords[j+1][0]-ptCoords[j][0]).toFixed(1), " i ", jSign, abs(ptCoords[j+1][1]-ptCoords[j][1]).toFixed(1), " j"), 0, -10);
    this.parentLayer.pop();
  }
  if (sumPressed) {
    let angle = atan2(vSum[1], -vSum[0]);
    if (angle > PI / 2 || angle < - PI / 2) {angle += -PI;}
    this.parentLayer.push();
    this.parentLayer.textAlign(CENTER);
    this.parentLayer.textSize(1*rem);
    this.parentLayer.noStroke();
    this.parentLayer.fill(0);
    this.parentLayer.translate((pts[0][0] + pts[n-1][0])/2, (pts[0][1] + pts[n-1][1])/2);
    this.parentLayer.rotate(angle);
    let jSign;
    if(vSum[0] > 0) {jSign = "+ ";} else {jSign = "- ";}
    this.parentLayer.text("".concat(vSum[0].toFixed(1), " i ", jSign, abs(vSum[1]).toFixed(1), " j"), 0, -10);
    
    this.parentLayer.pop();
  }
}

// iteratively checks to see if the mouse is over any points. if so, sets rollover to "true" and sets the rollover ID to the point ID.
function MovePoints(parentLayer) {
  this.parentLayer = parentLayer;
  rolloverPt[0] = false;
  rolloverLine[0] = false;
  let adjX = 0;
  let adjY = 0;
  if(!sumPressed){
    for (j = 0; j < n; j++) {
      if (j == 0) {adjX = 0; adjY = 0;} else {
        adjX = -10*(pts[j][0] - pts[j-1][0])/Math.sqrt(Math.pow(pts[j][0] - pts[j-1][0],2) + Math.pow(pts[j][1] - pts[j-1][1],2));
        adjY = -10*(pts[j][1] - pts[j-1][1])/Math.sqrt(Math.pow(pts[j][0] - pts[j-1][0],2) + Math.pow(pts[j][1] - pts[j-1][1],2));
      }
      if (mouseX > pts[j][0] + adjX - r &&
        mouseX < pts[j][0] + adjX + r &&
          mouseY > pts[j][1] + adjY - r &&
          mouseY < pts[j][1] + adjY + r) 
          {rolloverPt[0] = true; rolloverPt[1] = j;}
      
      if (j > 0) {
        // Collision mechanics for whether the mouse is within 10 pixels of a vector to draw "vector arrows".
        // Does not draw them if one is moving a vector or if the mouse is also over a vertex
        // The "Between" function just spits out a true/false for if the cursor is over a vector. Also does some other neat stuff.
        let lineX = new Between(mouseX, pts[j][0], pts[j-1][0]);
        let lineY = new Between(mouseY, pts[j][1], pts[j-1][1]);
        if(abs(lineX.diff()) > abs(lineY.diff())) {
          lineX.isBetween && abs(mouseY - lineY.a - lineX.interp()*lineY.diff()) < 10  && !rolloverPt[0] && !draggingPt[0] ? drawArrows[j] = true : drawArrows[j] = false;
        } else {
          lineY.isBetween && abs(mouseX - lineX.a - lineY.interp()*lineX.diff()) < 10  && !rolloverPt[0] && !draggingPt[0] ? drawArrows[j] = true : drawArrows[j] = false;
        }
      }

      ptCoords[j] = loc(pts[j][0], pts[j][1], basePlot2D);
      
      // put text to the right or left? above or below? helps with graphics placement
      if (j > 0) {
        if (pts[j-1][0] < pts[j][0]) {graphicsOffset[j-1][0] = -1} else {graphicsOffset[j-1][0] = 1}
        if (pts[j-1][1] < pts[j][1]) {graphicsOffset[j-1][1] = 1} else {graphicsOffset[j-1][1] = -1}
      }

      if (j == n - 1) {
        if (pts[j][0] > pts[j-1][0]) {graphicsOffset[j][0] = 1} else {graphicsOffset[j][0] = -1}
        if (pts[j][1] > pts[j-1][1]) {graphicsOffset[j][1] = 1} else {graphicsOffset[j][1] = -1}
      }
    }
  } else {
    let lineX = new Between(mouseX, pts[n-1][0], pts[0][0]);
    let lineY = new Between(mouseY, pts[n-1][1], pts[0][1]);
    if(abs(lineX.diff()) > abs(lineY.diff())) {
      lineX.isBetween && abs(mouseY - lineY.a - lineX.interp()*lineY.diff()) < 10  ? drawArrows[n+1] = true : drawArrows[n+1] = false;
    } else {
      lineY.isBetween && abs(mouseX - lineX.a - lineY.interp()*lineX.diff()) < 10  ? drawArrows[n+1] = true : drawArrows[n+1] = false;
    }
    if (pts[0][0] < pts[n-1][0]) {graphicsOffset[n][0] = -1;} else {graphicsOffset[n][0] = 1;}
    if (pts[0][1] < pts[n-1][1]) {graphicsOffset[n][1] = 1;} else {graphicsOffset[n][1] = -1;}
  }
  if (draggingPt[0])
    {
      pts[draggingPt[1]] = [mouseX + mouseOffset[0], mouseY + mouseOffset[1]];
      pts[draggingPt[1]][0] = Math.max(pts[draggingPt[1]][0], xyMin[0]);
      pts[draggingPt[1]][0] = Math.min(pts[draggingPt[1]][0], xyMax[0]);
      pts[draggingPt[1]][1] = Math.min(pts[draggingPt[1]][1], xyMin[1]);
      pts[draggingPt[1]][1] = Math.max(pts[draggingPt[1]][1], xyMax[1]);
    }
}

function DrawVectors(parentLayer) {
  this.parentLayer = parentLayer;
  
  function fillColor(x) {
    this.x = x;
    //if statement changes color of the dots if the mouse is over the dot, and another color if the mouse is held as well
    if (sumPressed) {this.parentLayer.fill(50, 20);}
    else if (draggingPt[0] && draggingPt[1] == this.x) {this.parentLayer.fill(50);}
    else if (rolloverPt[0] && rolloverPt[1] == this.x) {this.parentLayer.fill(100);}
    else {this.parentLayer.fill(175, 100);}
  }

  if(sumPressed) {this.parentLayer.stroke(0, 50);}
  
  for (j = 0; j < n - 1; j++) {
    this.parentLayer.push();
    this.parentLayer.strokeWeight(5);
    this.parentLayer.translate(pts[j][0], pts[j][1]);
    this.parentLayer.rotate(atan2(pts[j+1][0] - pts[j][0], pts[j][1] - pts[j+1][1]));
    this.parentLayer.line(0, 0, 0, -Math.sqrt(Math.pow(pts[j+1][0] - pts[j][0],2) + Math.pow(pts[j+1][1] - pts[j][1],2)) + 22);
    this.parentLayer.pop();

    this.parentLayer.push();
    fillColor(j+1);
    this.parentLayer.translate(pts[j+1][0], pts[j+1][1]);
    this.parentLayer.rotate(atan2(pts[j+1][0] - pts[j][0], pts[j][1] - pts[j+1][1]));
    this.parentLayer.strokeWeight(3);
    this.parentLayer.triangle(0, 0, 7, 20, -7, 20);
    this.parentLayer.pop();
  }

  this.parentLayer.push();
  fillColor(0);
  this.parentLayer.circle(pts[0][0], pts[0][1], r);
  this.parentLayer.pop();

  if(sumPressed) {
    this.parentLayer.push();
    this.parentLayer.stroke(0);
    this.parentLayer.strokeWeight(5);
    this.parentLayer.translate(vSumCoords[0][0], vSumCoords[0][1]);
    this.parentLayer.rotate(atan2(vSumCoords[1][0] - vSumCoords[0][0], vSumCoords[0][1] - vSumCoords[1][1]));
    this.parentLayer.line(0, 0, 0, -Math.sqrt(Math.pow(vSumCoords[1][0] - vSumCoords[0][0],2) + Math.pow(vSumCoords[1][1] - vSumCoords[0][1],2)) + 22);
    this.parentLayer.pop();

    this.parentLayer.push();
    this.parentLayer.stroke(0);
    this.parentLayer.fill(200);
    this.parentLayer.translate(vSumCoords[1][0], vSumCoords[1][1]);
    this.parentLayer.rotate(atan2(vSumCoords[1][0] - vSumCoords[0][0], vSumCoords[0][1] - vSumCoords[1][1]));
    this.parentLayer.strokeWeight(3);
    this.parentLayer.triangle(0, 0, 7, 20, -7, 20);
    this.parentLayer.pop();
  }
}

class vector3D {
  constructor(x, y, z) {
    this.x = x;
    this.y = -y;
    this.z = -z;
    let phi = 0;

    //This calculates the rotation matrix for the cylinder we will draw
    let v0 = createVector(0, 1, 0);
    let v1 = createVector(this.x, this.y, this.z);
    let crossProd = p5.Vector.cross(v0, v1);

    push();

    //Necessary for vectors with only an i-component
    if(crossProd.x != 0 || crossProd.y != 0 || crossProd.z != 0) {
      phi = Math.acos(this.y / v1.mag());
      rotate(phi, crossProd);
    } else if (this.y <= 0) {rotateX(PI);}

    //Only draws vectors with magnitude greater than 0
    if(this.x != 0 || this.y !=0 || this.z != 0) {
      translate(0, v1.mag()*40 / 2, 0);
      cylinder(2, 40 * v1.mag());
      translate(0, v1.mag()*40 / 2 + 2, 0);
      cone(5, 15);
    }

    pop();
  }

  //static method that draws the cross-product of two vectors
  static cross(X1, Y1, Z1, X2, Y2, Z2) {
    let v0 = createVector(X1, Y1, Z1);
    let v1 = createVector(X2, Y2, Z2);
    let crossProd = p5.Vector.cross(v0, v1);
    new vector3D(crossProd.x, crossProd.y, crossProd.z);
  }

  //static method that calculates the cross-product of two vectors, returns as array
  static cross2(X1, Y1, Z1, X2, Y2, Z2) {
    let v0 = createVector(X1, Y1, Z1);
    let v1 = createVector(X2, Y2, Z2);
    let crossProd = p5.Vector.cross(v0, v1);
    return [crossProd.x, crossProd.y, crossProd.z];
  }

  static normPlane(X1, Y1, Z1, X2, Y2, Z2) {
    let normVector = vector3D.cross2(X1, Y1, Z1, X2, Y2, Z2);
    let x = normVector[0];let y = -normVector[1];let z = -normVector[2];

    let v0 = createVector(0, 1, 0);
    let v1 = createVector(x, y, z);
    let crossProd = p5.Vector.cross(v0, v1);

    push();
      let phi = Math.acos(y / v1.mag());
      rotate(phi, crossProd);
      rotateX(-PI/2);
      shininess(10);
      specularMaterial(250, 50);
      box(300, 300, 2);
      //plane(300, 300);
    pop();
  }
}

function draw() {
  // when everything is evaluated and it starts drawing, update the LaTex text. Happens once.
  if(frameCount == 10) {mouseReleased();}

  background(255); // draws light gray background every frame

  switch(page) {
    case "vector addition":
      plotdraw2D.drawMethod2D();
      image(extraCanvas, 0, 0);
      extraCanvas.background(255);
      extraCanvas.clear();
      extraCanvas.fill(255);
      extraCanvas.stroke(0);

      MovePoints(extraCanvas)  
      DrawArrows(extraCanvas);
      DrawCoords(extraCanvas);
      DrawVectors(extraCanvas);
      DrawVectorText(extraCanvas);
      break;
    case "cross product":
      options.drawAxes3D();
      ambientMaterial(135, 91, 209);
      new vector3D(x1, y1, z1);
      ambientMaterial(135, 191, 109);
      new vector3D(x2, y2, z2);
      if(drawCross) {
        vector3D.cross(x1, y1, z1, x2, y2, z2);
      }
      if (drawNormalPlane) {
        vector3D.normPlane(x1, y1, z1, x2, y2, z2);
      }

      break;
  }
  i++;
}

//note to self: make a "dragging function" that occurs if you drag the line instead of either dot.

function mousePressed() {
// Did I click on the point?
  for (j = 0; j < n; j++) {
    if (rolloverPt[0])  {
      draggingPt[0] = true;
      draggingPt[1] = rolloverPt[1];
      // If so, keep track of relative location of click to corner of rectangle
      mouseOffset = [pts[draggingPt[1]][0]-mouseX, pts[draggingPt[1]][1]-mouseY];
    }
  }
}

function mouseReleased() {
  // Quit dragging
  draggingPt[0] = false;

  switch(page) {
   case "vector addition":
      LaTexAddition();
      break;
    case "cross product":
      LaTexCross();
      break;
  }
}

function LaTexAddition() {
  let vecEqn = `\\vec{v} = `;
    for (j = 0; j<n-1; j++) {
      vecEqn+=`\\begin{bmatrix}${(ptCoords[j+1][0]-ptCoords[j][0]).toFixed(1)} \\\\ ${(ptCoords[j+1][1]-ptCoords[j][1]).toFixed(1)}\\end{bmatrix}`;
      if (j+2<n) {vecEqn+=`+`;}
    }
    if (n>2&&sumPressed) {vecEqn+=`= \\begin{bmatrix}${vSum[0].toFixed(1)} \\\\ ${vSum[1].toFixed(1)}\\end{bmatrix}`}
    let math = MathJax.Hub.getAllJax("vectorLATEX")[0];
    MathJax.Hub.Queue(["Text",math, vecEqn]);
}

function LaTexCross() {
  let vecEqn = `\\vec{u}\\times \\vec{v} = `;
    vecEqn+=`\\begin{bmatrix}${(x1).toFixed(1)} \\\\ ${(y1).toFixed(1)} \\\\ ${(z1).toFixed(1)}\\end{bmatrix}`;
    vecEqn+=`\\times`;
    vecEqn+=`\\begin{bmatrix}${(x2).toFixed(1)} \\\\ ${(y2).toFixed(1)} \\\\ ${(z2).toFixed(1)}\\end{bmatrix}`;
    if (drawCross) {
      let crossProd = vector3D.cross2(x1, y1, z1, x2, y2, z2);
      vecEqn+=`= \\begin{bmatrix}${(crossProd[0]).toFixed(1)} \\\\ ${(crossProd[1]).toFixed(1)} \\\\ ${(crossProd[2]).toFixed(1)}\\end{bmatrix}`}
    let math = MathJax.Hub.getAllJax("vectorLATEX")[0];
    MathJax.Hub.Queue(["Text",math, vecEqn]);
}
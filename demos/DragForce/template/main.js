// This is the main program.  I just threw all of the functions not related to initializing the plot in here

// These are some elements you can find in "index.html"
const ball = document.getElementById("ball");
const startButton = document.getElementById("start-button");

let yPosition = 0; // Initial position of the ball
let isRunning = false; // Animation is initially not running
let start = Date.now(); // This is the time value when the animation starts - it is updated once when the animation begins
let now = Date.now(); // This is the time value during the animation - it is updated every animation frame
let elapsed = now - start; // This is the time elapsed - the difference between "now" and "start"
let graphData = [[0, 0]]; // This is the "graph data" variable that we will update then put into the graph
let index = 0; // This is just a number that increments every animation frame. You may find it useful for something

// This function updates the Plot with a two-dimensional array of coordinates, e.g. [[0, 0], [5, 2], [3, 1], ...]
// See some examples of live updating at http://www.flotcharts.org/flot/examples/ . You can view the source code of the examples in the index.html file of each example page on this website.
function updateGraph(array) {
  Plot.setData([array]);
  Plot.setupGrid(true);
  Plot.draw();
}

// This function is called once every animation frame.
function animationFunction() {
  yPosition++; // Increment the ball position by 1
  index++; // Increment our arbitrary "index" variable by 1
  graphData.push([elapsed / 1000, yPosition]); // Add new data to the "graphData" variable 
  updateGraph(graphData);
  ball.style.top = `${yPosition}px`; // Change the css property "top" of the ball to make it move
}

// This is an implementation based on https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
// This function just increments the "now" variable to the current time, calls animationFunction(), then calls itself until 5000 ms have elapsed
function step() {
  now = Date.now();
  elapsed = now - start;
  animationFunction();

  if (elapsed < 5000 && isRunning) { // Stop the animation after 5 seconds
    window.requestAnimationFrame(step);
  } else {
    isRunning = false
    window.cancelAnimationFrame(step);
  }
}

// This is the function that is called when you click the "start" button
// We do not want it to be called if the simulation is already running, hence the "isRunning" variable
function startAnimation() {
  if (!isRunning) {
    isRunning = true;
    index = 0;
    graphData = [[0, 0]];
    start = Date.now();
    yPosition = 0;
    window.requestAnimationFrame(step);
  }
}

// Instruct the start button to call the startAnimation() function when we click it
startButton.addEventListener("click", startAnimation);
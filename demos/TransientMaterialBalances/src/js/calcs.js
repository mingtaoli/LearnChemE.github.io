function vOut(h) {
  // h is height of the liquid relative to the exit hole (m)
  // derivation of this equation here https://www.youtube.com/watch?v=PWZRoEQaEs4
  const g = 9.80665; // acceleration of gravity (m/s^2)
  return Math.sqrt( 2 * g * h )
}

function init() {
  gvs.V = gvs.V0;
}

function dt() {

}

function calcAll() {
  if(gvs.is_running === false) {
    init();
  } else {
    dt();
  }
}

module.exports = calcAll;
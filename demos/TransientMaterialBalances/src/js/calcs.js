function vOut(h) {
  // h is height of the liquid relative to the exit hole (m)
  // derivation of this equation here https://www.youtube.com/watch?v=PWZRoEQaEs4
  const g = 9.80665; // acceleration of gravity (m/s^2)
  const velocity = Math.sqrt( 2 * g * h );
  return velocity * gvs.Aout * 1000; // outlet volumetric flow rate (L/s)
}

function init() {
  gvs.t = 0;
  gvs.V = gvs.V0;
  gvs.CA = 1.0;
  gvs.v = 0;
  gvs.N = gvs.V0 * gvs.CA;
  gvs.V_array = [[0, gvs.V], [0.01, gvs.V]];
  gvs.CA_array = [[0, gvs.CA], [0.01, gvs.CA]];
  gvs.h_array = [[0, gvs.h], [0.01, gvs.h]];
  gvs.v_array = [[0, gvs.v], [0.01, gvs.v]];
}

function advance() {
  const dt = gvs.speed / gvs.p.frameRate();
  gvs.t += dt;
  gvs.v = vOut(gvs.h);
  gvs.V += dt * gvs.v0 - dt * gvs.v;
  gvs.N += dt * gvs.v0 * gvs.CA0 - dt * gvs.v * gvs.CA;
  gvs.CA = gvs.N / gvs.V;
  gvs.h = (gvs.V / 1000) / gvs.A; // height of liquid (m)

  gvs.V_array.push([gvs.t, gvs.V]);
  gvs.CA_array.push([gvs.t, gvs.CA]);
  gvs.h_array.push([gvs.t, gvs.h]);
  gvs.v_array.push([gvs.t, gvs.v]);

  if(gvs.V_array.length <= 4) {
    gvs.V_array[0] = [0, gvs.V];
    gvs.V_array[1] = [0.001, gvs.V];
  }
  if(gvs.CA_array.length <= 4) {
    gvs.CA_array[0] = [0, gvs.CA];
    gvs.CA_array[1] = [0.001, gvs.CA];
  }
  if(gvs.h_array.length <= 4) {
    gvs.h_array[0] = [0, gvs.h];
    gvs.h_array[1] = [0.001, gvs.h];
  }
  if(gvs.v_array.length <= 4) {
    gvs.v_array[0] = [0, gvs.v];
    gvs.v_array[1] = [0.001, gvs.v];
  }

  if(gvs.V_array.length > 20000) {
    gvs.V_array.shift();
  }
  if(gvs.CA_array.length > 20000) {
    gvs.CA_array.shift();
  }
  if(gvs.h_array.length > 20000) {
    gvs.h_array.shift();
  }
  if(gvs.v_array.length > 20000) {
    gvs.v_array.shift();
  }
}

function calcAll() {
  if(gvs.is_running === false) {
    init();
  } else {
    advance();
  }
}

module.exports = calcAll;
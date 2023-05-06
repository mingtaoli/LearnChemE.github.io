gvs.generate_random_conditions = function() {
  gvs.hA = 50 + Math.round(Math.random() * 10);
  gvs.hB = gvs.hA >= 55 ? 50 + Math.round(Math.random() * 3) : 57 + Math.round(Math.random() * 3);
  gvs.sA = 50 + Math.round(Math.random() * 10);
  gvs.sB = gvs.sA >= 55 ? 50 + Math.round(Math.random() * 3) : 57 + Math.round(Math.random() * 3);
  gvs.cp = Math.round(5 + Math.random() * 5) / 100;
  gvs.HS = Math.random() > 0.5 ? "enthalpy" : "entropy";
  gvs.randx = Math.round(35 + Math.random() * 30) / 100;
  gvs.choice = Math.random() > 0.5 ? 1 : 2;
  gvs.alpha = Math.round(45 + 15 * Math.random());
  gvs.alpha = Math.random() > 0.5 ? -1 * gvs.alpha : gvs.alpha;
  let randChoice = Math.random(); randChoice = randChoice < 0.33 ? 0.2 : randChoice < 0.67 ? 0.3 : 0.35;
  let randChoice2 = Math.random(); randChoice2 = randChoice2 < 0.33 ? 0.2 : randChoice2 < 0.67 ? 0.3 : 0.35;
  gvs.molarS = function(x) {return -8.314 * (x * Math.log(x) + (1 - x) * Math.log(1 - x)) + x * gvs.sA + (1 - x) * gvs.sB}
  gvs.molarS2 = function(x) {
    if(gvs.choice === 1) {
      return (1 - randChoice) * (x * gvs.sA + (1 - x) * gvs.sB) + gvs.molarS(x) * randChoice2;
    } else {
      return -0.3 * (x * gvs.sA + (1 - x) * gvs.sB) + 1.3 * gvs.molarS(x);
    }
  }
  gvs.Scurve = function(x) {return gvs.molarS2(x)}
  gvs.dS = -1 * gvs.molarS(gvs.randx) + gvs.molarS2(gvs.randx);
  gvs.molarH = function(x) {return x * gvs.hA + (1 - x) * gvs.hB + gvs.alpha * x * (1 - x)}
  gvs.dMolarH = function(x) {
    const x1 = x - 0.001;
    const x2 = x + 0.001;
    const y1 = gvs.molarH(x1);
    const y2 = gvs.molarH(x2);
    return (y2 - y1) / (x2 - x1)
  }
  gvs.dMolarS = function(x) {
    const x1 = x - 0.001;
    const x2 = x + 0.001;
    const y1 = gvs.molarS(x1);
    const y2 = gvs.molarS(x2);
    return (y2 - y1) / (x2 - x1)
  }
  gvs.partMolarH = function(x) {
    return gvs.dMolarH(gvs.randx) * (x - gvs.randx) + gvs.molarH(gvs.randx);
  }
  gvs.partMolarS = function(x) {
    return gvs.dMolarS(gvs.randx) * (x - gvs.randx) + gvs.molarS(gvs.randx);
  }
  if(gvs.HS === "enthalpy") {
    gvs.plot.labels[0][0] = "molar enthalpy (kJ/mol)";
    gvs.plot.range = [30, 90, 10, 2];
  } else {
    gvs.plot.labels[0][0] = "molar entropy [J/(mol K)]";
    gvs.plot.range = [45, 75, 5, 1];
  }
}

gvs.generate_random_conditions();
gvs.startX = 20;
gvs.endX = 580;
gvs.startY = 40;
gvs.endY = 460;
gvs.XRange = [-0.5, 2.5];
gvs.YRange = [-0.12, 0.12];
gvs.resX = 0.1;
gvs.resY = 0.01;

gvs.numberOfTicksX = (gvs.XRange[1] - gvs.XRange[0]) / gvs.resX;
gvs.numberOfTicksY = (gvs.YRange[1] - gvs.YRange[0]) / gvs.resY;

gvs.coordToPixel = function(x, y) {
  const left = gvs.startX + (( x - gvs.XRange[0] ) / ( gvs.XRange[1] - gvs.XRange[0] )) * (gvs.endX - gvs.startX);
  const top = gvs.startY + (( y - gvs.YRange[0] ) / ( gvs.YRange[1] - gvs.YRange[0] )) * (gvs.endY - gvs.startY);
  return [left, top]
}

gvs.zeroLocation = gvs.coordToPixel(0, 0);

const functions = {
  
  drawPlates: function(p) {
    p.push();
    p.noStroke();
    p.fill(180);
    p.rectMode(p.CORNERS);
    p.rect(gvs.startX, gvs.coordToPixel(0, -0.1)[1] - 10, gvs.endX, gvs.coordToPixel(0, -0.1)[1]);
    p.rect(gvs.startX, gvs.coordToPixel(0, 0.1)[1], gvs.endX, gvs.coordToPixel(0, 0.1)[1] + 10)

    p.pop();
  },
  
  drawAxis: function(p) {
    p.push();

    p.strokeWeight(0.5);

    p.line(gvs.startX, gvs.zeroLocation[1], gvs.endX, gvs.zeroLocation[1]); // x-axis
    p.line(gvs.zeroLocation[0], gvs.startY, gvs.zeroLocation[0], gvs.endY); // y-axis

    for(let i = 0; i < gvs.numberOfTicksX; i++) {
      const currentCoordX = gvs.XRange[0] + i * gvs.resX;
      const pixels = gvs.coordToPixel(currentCoordX, 0);
      const tickBottom = gvs.zeroLocation[1];
      let tickTop;
      if ( i % 5 == 0 && currentCoordX != 0) {
        tickTop = tickBottom - 6;
        p.text(`${Number(currentCoordX).toFixed(1)}`, pixels[0] - 5, tickBottom + 15);
      } else {
        tickTop = tickBottom - 3;
      }

      p.line(pixels[0], tickTop, pixels[0], tickBottom);
    }

    for(let i = 0; i < gvs.numberOfTicksY; i++) {
      const currentCoordY = gvs.YRange[0] + i * gvs.resY;
      const pixels = gvs.coordToPixel(0, currentCoordY);
      const tickLeft = gvs.zeroLocation[0];
      let tickRight;
      if ( i % 5 == 2 && currentCoordY != 0) {
        tickRight = tickLeft + 6;
        p.text(`${Number(currentCoordY).toFixed(2)}`, tickLeft - 33, pixels[1] + 5);
      } else {
        tickRight = tickLeft + 3;
      }

      p.line(tickLeft, pixels[1], tickRight, pixels[1]);
    }

    p.text("x", gvs.endX + 5, gvs.zeroLocation[1] + 5);
    p.text("y", gvs.zeroLocation[0] - 5, gvs.startY - 10);

    p.pop();
  },

  drawText: function(p) {
    p.push();

    p.pop();
  }

}

module.exports = functions;
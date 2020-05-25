function setup(sk, speed) {
  window.graphics = {
    TempColor: 'rgb(255, 0, 0)',
    PowerColor: 'rgb(0, 0, 255)',
    LevelColor: 'rgb(255, 0, 0)',
    FlowrateColor: 'rgb(0, 0, 255)',
    PressureColor: 'rgb(255, 0, 0)',
    LiftColor: 'rgb(0, 0, 255)'
  }

  sk.setup = () => {
    graphics.cnv = sk.createCanvas(1, 1);
    graphics.cnv.hide();
    let plotWidth = 350;
    let plotHeight = 240;
    graphics.bottomLeft = sk.createGraphics(plotWidth, plotHeight);
    graphics.bottomRight = sk.createGraphics(plotWidth, plotHeight);
    graphics.topRight = sk.createGraphics(plotWidth, plotHeight);
    graphics.bottomLeft.id('TPlot');
    graphics.bottomRight.id('LPlot');
    graphics.topRight.id('PPlot');
    ['TPlot', 'LPlot', 'PPlot'].forEach((id) => {
      document.getElementById("main-application-wrapper").appendChild(document.getElementById(id));
    });
    graphics.bottomLeft.show();
    graphics.bottomRight.show();
    graphics.topRight.show();

    // Initialize Each Plot
    graphics.TPlot = new PlotCanvas(graphics.bottomLeft, document.getElementById("TPlot"));
    const TPlot = graphics.TPlot;
    TPlot.xLims = [-1000, 0];
    TPlot.yLims = [400, 600];
    TPlot.rightLims = [400, 600];
    TPlot.xAxisLabel = "time (s)";
    TPlot.yAxisLabel = "temperature (K)";
    TPlot.rightAxisLabel = "power consumption (kW)"
    TPlot.plotTitle = "";
    TPlot.yAxisColor = graphics.TempColor;
    TPlot.rightAxisColor = graphics.PowerColor;
    TPlot.plotSetup();

    graphics.PPlot = new PlotCanvas(graphics.topRight, document.getElementById("PPlot"));
    const PPlot = graphics.PPlot;
    PPlot.xLims = [-1000, 0];
    PPlot.yLims = [0, 120];
    PPlot.rightLims = [0.4, 0.6];
    PPlot.xAxisLabel = "time (s)";
    PPlot.yAxisLabel = "pressure (kPa)";
    PPlot.rightAxisLabel = "lift"
    PPlot.plotTitle = "";
    PPlot.yAxisColor = graphics.PressureColor;
    PPlot.rightAxisColor = graphics.LiftColor;
    PPlot.plotSetup();

    graphics.LPlot = new PlotCanvas(graphics.bottomRight, document.getElementById("LPlot"));
    const LPlot = graphics.LPlot;
    LPlot.xLims = [-1000, 0];
    LPlot.yLims = [0, 100];
    LPlot.rightLims = [0.5, 0.7];
    LPlot.xAxisLabel = "time (s)";
    LPlot.yAxisLabel = "liquid level (%)";
    LPlot.rightAxisLabel = "flow rate (L/s)"
    LPlot.plotTitle = "";
    LPlot.yAxisColor = graphics.LevelColor;
    LPlot.rightAxisColor = graphics.FlowrateColor;
    LPlot.plotSetup();

    const TemperatureArray = new ArrayPlot(separator.temperatureCoords);
    const PowerArray = new ArrayPlot(separator.powerCoords);
    const PressureArray = new ArrayPlot(separator.pressureCoords);
    const LiftArray = new ArrayPlot(separator.liftCoords);
    const LevelArray = new ArrayPlot(separator.liquidLevelCoords);
    const FlowrateArray = new ArrayPlot(separator.flowRatesOutCoords);

    TemperatureArray.lineColor = graphics.TempColor;
    PowerArray.lineColor = graphics.PowerColor;
    PressureArray.lineColor = graphics.PressureColor;
    LiftArray.lineColor = graphics.LiftColor;
    LevelArray.lineColor = graphics.LevelColor;
    FlowrateArray.lineColor = graphics.FlowrateColor;

    TPlot.addFuncs(TemperatureArray, PowerArray);
    PPlot.addFuncs(PressureArray, LiftArray);
    LPlot.addFuncs(LevelArray, FlowrateArray);

    separator.createCoords();

    sk.frameRate(speed);
  }
}

module.exports = setup;
let yTicks;
// Draws overall graph frame
function graphDraw(){
    yTicks = [];
    rect(120,50,650,450); // Overall frame
    // These variables are for graph edges to make drawing easier
    let lx = 120; // left x
    let rx = 770; // right x
    let by = 500; // bottom y
    let ty = 50; // top y

    let xLabels = ['200','300','400','500','600'];
    let counter = 0;

    push(); textSize(25);
    for(let i = 0; i < 24; i++){
        if(i%5 == 0){
            line(lx+(rx-lx)/25*(i+1),by,lx+(rx-lx)/25*(i+1),by-7);
            line(lx+(rx-lx)/25*(i+1),ty,lx+(rx-lx)/25*(i+1),ty+7);
            text(xLabels[counter],lx+(rx-lx)/25*(i+1)-20,by+30);
            counter++;
            // REMOVE THIS BEFORE YOU FINISH
            push();
            stroke(0,20);
            line(lx+(rx-lx)/25*(i+1),by,lx+(rx-lx)/25*(i+1),ty);
            pop();
        } else{
            line(lx+(rx-lx)/25*(i+1),by,lx+(rx-lx)/25*(i+1),by-4);
            line(lx+(rx-lx)/25*(i+1),ty,lx+(rx-lx)/25*(i+1),ty+4);
            // REMOVE THIS BEFORE YOU FINISH
            push();
            stroke(0,20);
            line(lx+(rx-lx)/25*(i+1),by,lx+(rx-lx)/25*(i+1),ty);
            pop();
        }
    }
    text('Temperature (K)',width/2-40,570);

    for(let i = 1; i < 9; i++){
        if(i%3 == 0){
            line(lx,by-(by-ty)/9*i,lx+7,by-(by-ty)/9*i);
            yTicks.push(by-(by-ty)/9*i);
            // REMOVE THIS BEFORE YOU FINISH
            push();
            stroke(0,20);
            line(lx,by-(by-ty)/9*i,rx,by-(by-ty)/9*i);
            pop();
        } else {
            line(lx,by-(by-ty)/9*i,lx+4,by-(by-ty)/9*i);
            yTicks.push(by-(by-ty)/9*i);
            // REMOVE THIS BEFORE YOU FINISH
            push();
            stroke(0,20);
            line(lx,by-(by-ty)/9*i,rx,by-(by-ty)/9*i);
            pop();
        }
    }

    // Adding bottom and top of the graph to yTicks array (for use in logarithmic plotting)
    yTicks.splice(0,0,500);
    yTicks.splice(yTicks.length,0,50);

    // y-axis labels
    text('100',lx-45,ty+10);
    text('0.1',lx-38,ty+158);
    text('10',lx-48,ty+310);
    text('10',lx-48,ty+460);
    push();
    textSize(17);
    text('-4',lx-20,ty+297); // Superscripts
    text('-7',lx-20,ty+447);
    pop();
    translate(50,height/2+60);
    rotate(radians(-90));
    text('Pressure (MPa)',0,0);

    pop();
}

// Draws graph for relative amounts of present states
function subGraphDraw(){
    push();
    fill(255);
    rect(420,250,330,200);
    let lx = 420; let rx = 750; // left and right graph edges
    let by = 450; let ty = 250; // bottom and top graph edges
    let yLabels = ['0.0','0.2','0.4','0.6','0.8','1.0','1.2'];
    let xLabels = ['solid','liquid','vapor'];
    pop();

    push();
    let counter = 1; textSize(19);
    for(let i = 1; i < 24; i++){
        if(i%4 == 0){
            line(lx,by-(by-ty)/24*i,lx+5,by-(by-ty)/24*i);
            line(rx,by-(by-ty)/24*i,rx-5,by-(by-ty)/24*i);
            text(yLabels[counter],lx-30,by-(by-ty)/24*i+7);
            counter++;
        } else {
            line(lx,by-(by-ty)/24*i,lx+3,by-(by-ty)/24*i);
            line(rx,by-(by-ty)/24*i,rx-3,by-(by-ty)/24*i);
        }
    }
    text(yLabels[0],lx-30,by+7);
    text(yLabels[yLabels.length-1],lx-30,ty+7);
    textSize(23);
    translate(380,by-20);
    rotate(radians(-90));
    text('relative amount',0,0);
    pop();
    for(let i = 1; i < 4; i++){
        line(lx+(rx-lx)/4*i,by,lx+(rx-lx)/4*i,by-5);
        line(lx+(rx-lx)/4*i,ty,lx+(rx-lx)/4*i,ty+5);
    }

    // Filling the relative amounts based on global variable g.comp
    push();
    stroke(0); strokeWeight(.5); textSize(25);
    let max = 283.333; // px location of 1.0
    let height;
    for(let i = 0; i < 3; i++){
        if(i == 0){
            fill(0,255,0,90); // solid color (green)
        } else if (i == 1){
            fill(255,0,0,90); // liquid color (red)
        } else {
            fill(0,0,255,90); // vapor color (blue)
        }
        height = map(g.comp[i],0,1,by,max); // Solving the height based on relative composition
        height = by - height; // Adjusting the height value to account for bottom of the graph
        rect(lx+(rx-lx)/4*(i+1)-35,by,70,-height); // Plotting relative amount
       
        push();
        fill(0); noStroke();
        let shift = 28; // shift for placing text 
        if (i != 0){
            shift = 30; // slight adjustment for liquid and vapor text
        }
        text(xLabels[i],lx+(rx-lx)/4*(i+1)-shift,by-height-5);
        pop();
    

    }
    pop();
}

// Draws curves
function curveDraw(){
    // Clausius curve below
    // 0.101325*exp(-5268*(1/T - 1/373))
    let lx = 120; // left x
    let rx = 770; // right x
    let by = 500; // bottom y
    let ty = 50; // top y

    let x, y, ytemp;
    let yStorage = [];
    push();
    noFill(); strokeWeight(2);
    beginShape(); 
    for(let i = 200; i < 647; i++){
        x = map(i,200,680,lx+(rx-lx)/25,rx);
        ytemp = 0.101325*Math.exp(-5268.134*(1/i - 1/373));
        y = yPlotting(ytemp);
        vertex(x,y);
        yStorage.push(ytemp);
    
        if(i == 646){
            // plot 647.096
            x = map(647.096,200,680,lx+(rx-lx)/25,rx);
            ytemp = 0.101325*Math.exp(-5268.134*(1/647.096 - 1/373));
            y = yPlotting(ytemp);
            vertex(x,y);
        }
    }
    endShape();

    push();
    noStroke(); fill(100);
    ellipse(x,y,14);
    pop();

    // Ice curve below here
    let iceInfo = [[252., 203.5357], [253., 195.8644], [254., 188.1245], [255., 180.3019], [256., 172.3814], [257., 164.3468], [258., 156.1811], [259., 147.866], [260., 139.3821], [261., 130.7087], [262., 121.8238], [263., 112.7041], [264., 103.3243], [265., 93.6579], [266., 83.6765], [267., 73.3496], [268.,62.645], [269., 51.5281], [270., 39.962], [271., 27.90750], [272., 15.32260], [273., 2.1627], [273.1, 1.], [273.16, 0.0006117]];
    
    beginShape();
    for(let i = 0; i < iceInfo.length; i++){
        x = map(iceInfo[i][0],200,680,lx+(rx-lx)/25,rx);
        y = yPlotting(iceInfo[i][1]);
        if(y != ty){
            vertex(x,y);
        }
    }
    endShape();
    pop();

    push();
    noStroke(); fill(100);
    ellipse(x,y,12);
    x = map(273.15,200,680,lx+(rx-lx)/25,rx);
    ytemp = 0.101325*Math.exp(-5268*(1/273.15 - 1/373));
    y = yPlotting(ytemp);
    ellipse(x,y,14);
    pop();
}

// Displays Gibbs phase rule
function gibbsPhase(){

}

// For plotting the points on logarithmic y-axis
function yPlotting(y){
    let pxUpper; // Upper pixel limit in each section
    let temp;
    let output; // for returning pixel value

    if(y <= Math.pow(10,-6)){
        pxUpper = yTicks[1];
        temp = -(Math.log10(y) + 6); // +6, +5, ... are for correcting the base number of temp, where temp is used to determine the correct y-axis point
        output = pxUpper + temp*50; // temp scaled by 50 px (the spacing between the y-axis ticks)
    } else if(y <= Math.pow(10,-5)){
        pxUpper = yTicks[2];
        temp = -(Math.log10(y) + 5);
        output = pxUpper + temp*50;
    } else if(y <= Math.pow(10,-4)){
        pxUpper = yTicks[3];
        temp = -(Math.log10(y) + 4);
        output = pxUpper + temp*50;
    } else if(y <= Math.pow(10,-3)){
        pxUpper = yTicks[4];
        temp = -(Math.log10(y) + 3);
        output = pxUpper + temp*50;
    } else if(y <= Math.pow(10,-2)){
        pxUpper = yTicks[5];
        temp = -(Math.log10(y) + 2);
        output = pxUpper + temp*50;
    } else if(y <= 0.1){
        pxUpper = yTicks[6];
        temp = -(Math.log10(y) + 1);
        output = pxUpper + temp*50;
    } else if(y <= 1){
        pxUpper = yTicks[7];
        temp = -(Math.log10(y));
        output = pxUpper + temp*50;
    } else if(y <= 10){
        pxUpper = yTicks[8];
        temp = -(Math.log10(y) - 1);
        output = pxUpper + temp*50;
    } else if(y <= 100){
        pxUpper = yTicks[9];
        temp = -(Math.log10(y) - 2);
        output = pxUpper + temp*50;
    } else if(y > 100){
        output = yTicks[9];
    }
    return(output);
}

// Based on dropdown menus, initial state (T & P) is determined. Once these are determined the heats of sublimation, melting, vaporization, and triple point are determined
function initialStateDetermine(){
    switch (g.isotype){
        case 'isothermal':
            switch(g.transition){
                case 'sublimation':
                    g.T = 250;
                    g.Ti = 250;
                    break;
                case 'melting':
                    g.T = 273.07;
                    g.Ti = 273.07;
                    break;
                case 'vaporization':
                    g.T = 325;
                    g.Ti = 325;
                    break;
                case 'triple-point':
                    g.T = 273.16
                    g.Ti = 273.16;
                    break;
            }
            break;
        case 'isobaric':
            switch(g.transition){
                case 'sublimation':
                    g.T = 200
                    g.Ti = 200;
                    g.Pi = 1*Math.pow(10,-4);
                    g.P = 1*Math.pow(10,-4);
                    break;
                case 'melting':
                    g.T = 200;
                    g.Ti = 200;
                    g.Pi = 0.1;
                    g.P = 0.1;
                    break;
                case 'vaporization':
                    g.T = 303;
                    g.Ti = 303;
                    g.Pi = 0.1;
                    g.P = 0.1;
                    break;
                case 'triple-point':
                    g.T = 303;
                    g.Ti = 200;
                    g.Pi = 0.00061;
                    g.P = 0.00061;
                    break;
            }
            break;
    }

    g.heatSublime = (250 - g.Ti)*g.cp_ice;
    g.heatMelt = (273 - g.Ti)*g.cp_ice;
    g.heatVapor = (373 - g.Ti)*g.cp_water;
    g.heatTriple = (273.16 - g.Ti)*g.cp_ice;
}

// Plots the point using global variable for the current T & P
function plotPoint(){
    let x, y;
    let lx = 120; // left x
    let rx = 770; // right x

    x = map(g.T,200,680,lx+(rx-lx)/25,rx);
    y = yPlotting(g.P);
    
    push();
    fill(0);
    ellipse(x,y,12);
    pop();
}

// Determines pressure based on slider for isothermal mode
function isothermPressure(){
    
    let pressure; // Might need to make this into a global variable of sorts
    
    switch (g.transition){
        case 'sublimation':
            if (g.slider > -9.4){
                pressure = g.slider;
            } else if (g.slider <= -9.4 && g.slider >= -21.4){
                pressure = -9.4;
            } else if (g.slider < -21.4){
                pressure = -9.4 + (g.slider + 21.4)/5;
            }
            break;
        case 'melting':
            if (g.slider > .25){
                pressure = g.slider;
            } else if (g.slider <= .25 && g.slider >= -1){
                pressure = 0.25;
            } else if (g.slider < -1){
                pressure = -1 + g.slider;
            }
            break;
        case 'vaporization':
            if (g.slider > -4.4){
                pressure = g.slider;
            } else if (g.slider <= -4.4 && g.slider >= -7.8){
                pressure = -4.4;
            } else if (g.slider < -7.8){
                pressure = -4.4 + (7.8 + g.slider)/1.5;
            }
            break;
        case 'triple-point':
            if (g.slider > -7.4){
                pressure = g.slider;
            } else if (g.slider <= -7.4 && g.slider >= -10.8){
                pressure = -7.4;
            } else if (g.slider < -10.8){
                pressure = -7.4 + (10.8 + g.slider)/1.5;
            }
            break;
    }
    g.P = Math.exp(pressure);
}

// Determines the temperature for isobaric mode and the relative amounts of solid/liquid/gas for all modes
function compositionDetermine(){
    switch (g.isotype){
        case 'isothermal':
            switch (g.transition){
                case 'sublimation':
                    if (g.slider > -9.4){
                        g.comp[0] = 1;
                        g.comp[1] = 0;
                        g.comp[2] = 0;
                    } else if (g.slider <= -9.4 && g.slider >= -21.4){
                        g.comp[0] = (-21.4 - g.slider)/-12;
                        g.comp[1] = 0;
                        g.comp[2] = (g.slider + 9.4)/-12;
                    } else if (g.slider < -21.4){
                        g.comp[0] = 0;
                        g.comp[1] = 0;
                        g.comp[2] = 1;
                    }
                    break;
                case 'melting':
                    if (g.slider > 0.25){
                        g.comp[0] = 0;
                        g.comp[1] = 1;
                        g.comp[2] = 0;
                    } else if (g.slider <= 0.25 && g.slider >= -1){
                        g.comp[0] = (g.slider - 0.25)/-1.25;
                        g.comp[1] = (-1 - g.slider)/-1.25;
                        g.comp[2] = 0;
                    } else if (g.slider < -1){
                        g.comp[0] = 1;
                        g.comp[1] = 0;
                        g.comp[2] = 0;
                    }
                    break;
                case 'vaporization':
                    if (g.slider > -4.4){
                        g.comp[0] = 0;
                        g.comp[1] = 1;
                        g.comp[2] = 0;
                    } else if (g.slider <= -4.4 && g.slider >= -7.8){
                        g.comp[0] = 0;
                        g.comp[1] = (-7.8 - g.slider)/-3.4;
                        g.comp[2] = (g.slider + 4.4)/-3.4;
                    } else if (g.slider < -7.8){
                        g.comp[0] = 0;
                        g.comp[1] = 0;
                        g.comp[2] = 1;
                    }
                    break;
                case 'triple-point':
                    if (g.slider > -7.4){
                        g.comp[0] = 0;
                        g.comp[1] = 1;
                        g.comp[2] = 0;
                    } else if (g.slider <= -7.4 && g.slider >= -10.8){
                        g.comp[0] = 2*((g.slider+7.4)/-3.4)*(1-(g.slider+7.4)/-3.4);
                        g.comp[1] = 1 - 2*((g.slider+7.4)/-3.4) + ((g.slider+7.4)/-3.4)**2
                        g.comp[2] = ((g.slider+7.4)/-3.4)**2;
                    } else if (g.slider < -10.8){
                        g.comp[0] = 0;
                        g.comp[1] = 0;
                        g.comp[2] = 1;
                    }
                    break;    
            }
            break;
        case 'isobaric':
            switch (g.transition){
                case 'sublimation':
                    if (g.slider*1000 <= g.heatSublime){
                        g.T = g.Ti + 1000*g.slider/g.cp_ice;
                        g.comp[0] = 1;
                        g.comp[1] = 0;
                        g.comp[2] = 0;
                    } else if (g.slider*1000 > g.heatSublime && g.slider*1000 < g.heatSublime + g.Hs){
                        g.T = 250;
                        g.comp[0] = (g.heatSublime+g.Hs-1000*g.slider)/g.Hs;
                        g.comp[1] = 0;
                        g.comp[2] = 1 - g.comp[0];
                    } else if (1000*g.slider >= g.heatSublime + g.Hs){
                        g.T = 250 + (1000*g.slider-g.heatSublime-g.Hs)/g.cp_vapor;
                        g.comp[0] = 0;
                        g.comp[1] = 0;
                        g.comp[2] = 1;
                    }
                    break;
                case 'melting':
                    if (1000*g.slider <= g.heatMelt){
                        g.T = g.Ti + 1000*g.slider/g.cp_ice;
                        g.comp[0] = 1;
                        g.comp[1] = 0;
                        g.comp[2] = 0;
                    } else if (1000*g.slider > g.heatMelt && 1000*g.slider < g.heatMelt + g.Hm){
                        g.T = 273;
                        g.comp[0] = (g.heatMelt+g.Hm-1000*g.slider)/g.Hm;
                        g.comp[1] = 1 - g.comp[0];
                        g.comp[2] = 0;
                    } else if (1000*g.slider >= g.heatMelt + g.Hm){
                        g.T = 273 + (1000*g.slider-g.heatMelt-g.Hm)/g.cp_water;
                        g.comp[0] = 0;
                        g.comp[1] = 1;
                        g.comp[2] = 0;
                    }
                    break; 
                case 'vaporization':
                    if (1000*g.slider <= g.heatVapor){
                        g.T = g.Ti + 1000*g.slider/g.cp_water;
                        g.comp[0] = 0;
                        g.comp[1] = 1;
                        g.comp[2] = 0;
                    } else if (1000*g.slider > g.heatVapor && 1000*g.slider < g.heatVapor + g.Hv){
                        g.T = 373;
                        g.comp[0] = 0;
                        g.comp[1] = (g.heatVapor + g.Hv - 1000*g.slider)/g.Hv;
                        g.comp[2] = 1 - g.comp[1];
                    } else if (1000*g.slider >= g.heatVapor + g.Hv){
                        g.T = 373 + (1000*g.slider - g.heatVapor - g.Hv)/g.cp_vapor;
                        g.comp[0] = 0;
                        g.comp[1] = 0;
                        g.comp[2] = 1;
                    }
                    break;
                case 'triple-point':
                    if (1000*g.slider <= g.heatTriple){
                        g.T = g.Ti + 1000*g.slider/g.cp_ice;
                        g.comp[0] = 1;
                        g.comp[1] = 0;
                        g.comp[2] = 0;
                    } else if (1000*g.slider > g.heatTriple && 1000*g.slider < g.heatTriple + g.Hs){
                        g.T = 273.16;
                        g.comp[0] = 1 - 2*(1000*g.slider - g.heatTriple)/g.Hs + ((1000*g.slider - g.heatTriple)/g.Hs)**2;
                        g.comp[1] = 2*((1000*g.slider - g.heatTriple)/g.Hs)*(1 - (1000*g.slider-g.heatTriple)/g.Hs);
                        g.comp[2] = ((1000*g.slider - g.heatTriple)/g.Hs)**2;
                    } else if (1000*g.slider >= g.heatTriple + g.Hs){
                        g.T = 273.16 + (1000*g.slider - g.heatTriple - g.Hs)/g.cp_vapor;
                        g.comp[0] = 0;
                        g.comp[1] = 0;
                        g.comp[2] = 1;
                    }
                    break;    
            }
            break;
    }
}



let layer1, layer2, layer3, layer4;
layer1 = [[451.0987654320988, 1143.2765432098765],[374.19012345679016, 1101.864197530864],[242.55802469135804, 1072.283950617284],[121.27901234567902, 1023.476543209876],[70.9925925925926, 948.046913580247],[28.101234567901237, 835.641975308642],[31.05925925925926, 686.2617283950618],[65.07654320987655, 576.8148148148149],[94.6567901234568, 474.762962962963],[110.92592592592594, 356.441975308642],[110.92592592592594, 249.9530864197531],[107.9679012345679, 201.14567901234568],[137.54814814814816, 246.9950617283951],[184.87654320987656, 334.2567901234568],[239.60000000000002, 461.4518518518518],[270.6592592592593, 545.7555555555556],[283.9703703703704, 584.2098765432099],[307.63456790123456, 489.5530864197531],[338.69382716049387, 365.3160493827161],[372.7111111111111, 252.91111111111113],[415.6024691358025, 143.4641975308642],[476.241975308642, 41.41234567901235],[462.93086419753087, 118.3209876543209],[461.45185185185187, 224.8098765432099],[470.32592592592596, 317.9876543209876],[488.0740740740741, 406.7283950617284],[511.7382716049383, 486.5950617283951],[559.0666666666667, 397.8543209876543],[631.5382716049384, 307.63456790123456],[712.883950617284, 236.64197530864197],[817.8938271604939, 176.00246913580247],[760.2123456790124, 238.120987654321],[702.530864197531, 323.90370370370374],[664.0765432098766, 446.66172839506174],[680.3456790123457, 596.041975308642],[723.2370370370371, 709.925925925926],[740.9851851851852, 816.4148148148148],[726.1950617283951, 916.9876543209878],[692.1777777777778, 987.9802469135803],[628.5802469135803, 1054.535802469136],[551.6716049382717, 1098.9061728395063]];
layer2 = [[452.5777777777778, 1143.2765432098765],[403.7703703703704, 1110.7382716049383],[303.1975308641976, 1079.679012345679],[218.89382716049383, 1047.140740740740],[165.6493827160494, 998.3333333333334],[107.9679012345679, 909.5925925925926],[94.6567901234568, 841.5580246913581],[115.36296296296297, 767.6074074074074],[153.81728395061728, 669.9925925925926],[170.08641975308643, 575.3358024691358],[162.69135802469137, 474.762962962963],[207.06172839506175, 570.8987654320988],[248.47407407407408, 665.5555555555555],[276.5753086419753, 738.0271604938272],[288.40740740740745, 769.0864197530865],[313.55061728395066, 650.7654320987655],[337.2148148148148, 553.1506172839506],[362.358024691358, 454.05679012345684],[391.9382716049383, 352.00493827160494],[433.35061728395067, 235.1629629629629],[425.9555555555556, 292.84444444444443],[420.03950617283954, 386.0222222222222],[422.99753086419753, 507.3012345679012],[445.18271604938275, 601.9580246913581],[491.0320987654321, 683.3037037037037],[517.6543209876544, 613.7901234567902],[548.7135802469136, 545.7555555555556],[591.604938271605, 468.84691358024696],[634.4962962962964, 430.3925925925926],[604.9160493827161, 538.3604938271606],[609.3530864197531, 628.5802469135803],[637.4543209876543, 769.0864197530865],[658.1604938271605, 840.0790123456791],[667.0345679012346, 940.6518518518519],[646.3283950617284, 1007.2074074074075],[588.646913580247, 1069.325925925926],[522.0913580246914, 1112.2172839506175]]
layer3 = [[451.0987654320988, 1141.7975308641976],[387.50123456790124, 1098.906172839506],[316.50864197530865, 1064.888888888889],[246.9950617283951, 1026.4345679012347],[189.3135802469136, 961.3580246913581],[162.69135802469137, 885.9283950617285],[178.9604938271605, 794.2296296296297],[199.66666666666669, 715.841975308642],[207.06172839506175, 658.1604938271605],[220.37283950617285, 706.967901234568],[251.4320987654321, 754.2962962962963],[301.7185185185185, 819.3728395061729],[329.8197530864198, 859.3061728395062],[337.2148148148148, 792.7506172839506],[343.1308641975309, 729.1530864197531],[357.920987654321, 658.1604938271605],[377.14814814814815, 587.1679012345679],[399.33333333333337, 556.1086419753087],[393.41728395061733, 615.2691358024691],[403.7703703703704, 690.6987654320988],[431.8716049382716, 777.9604938271606],[467.3679012345679, 848.9530864197532],[473.28395061728395, 863.7432098765432],[489.55308641975313, 806.0617283950618],[511.7382716049383, 752.8172839506174],[542.7975308641976, 698.0938271604939],[572.3777777777779, 677.3876543209877],[550.1925925925926, 733.5901234567901],[562.0246913580247, 809.0197530864198],[588.646913580247, 894.8024691358025],[610.8320987654321, 971.7111111111112],[579.7728395061729, 1044.1827160493829],[519.1333333333333, 1100.3851851851853]];


function flameDraw(){
    let x,y;
    let max_1x = 817.89; // 817.89
    let max_1y = 1143.27; // 1143.27
    let min_1x = 28.1; // 28.1
    let min_1y = 41.4; // 41.4
    let xshift = width/2-260;
    let yshift = 505;
    push();
    noStroke(); fill(255,0,0);
    for(let j = 0; j < 8; j++){
        beginShape();
        if(j == 4){
            xshift = width/2-135;
        }
        for(let i = 0; i < layer1.length; i++){
            x = map(layer1[i][0],min_1x,max_1x,-10,10);
            y = map(layer1[i][1],min_1y,max_1y,0,25);
            curveVertex(x+xshift+57*j,y+yshift);
        }
        endShape(CLOSE);
    }
    pop();
    xshift = width/2-260;
    push();
    noStroke(); fill(255,192,0);
    for(let j = 0; j < 8; j++){
        beginShape();
        if(j == 4){
            xshift = width/2-135;
        }
        for(let i = 0; i < layer2.length; i++){
            x = map(layer2[i][0],min_1x,max_1x,-10,10);
            y = map(layer2[i][1],min_1y,max_1y,0,25);
            curveVertex(x+xshift+57*j,y+yshift);
        }
        endShape(CLOSE);
    }
    pop();

    xshift = width/2-260;
    push();
    noStroke(); fill(255,234,0);
    for(let j = 0; j < 8; j++){
        beginShape();
        if(j == 4){
            xshift = width/2-135;
        }
        for(let i = 0; i < layer3.length; i++){
            x = map(layer3[i][0],min_1x,max_1x,-10,10);
            y = map(layer3[i][1],min_1y,max_1y,0,25);
            curveVertex(x+xshift+57*j,y+yshift);
        }
        endShape(CLOSE);
    }
    pop();
    
}
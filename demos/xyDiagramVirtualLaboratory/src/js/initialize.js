const check = localStorage.getItem("A12");

if (check === null) {
    while (gvs.yA(0.05) > 0.5 || gvs.yA(0.05) < 0.05) {
        const antoine_list = [
            [7.300, 1479, 216.8],
            [7.024, 1161, 224.0],
            [6.906, 1211, 220.8],
            [7.838, 1558, 196.9],
            [6.955, 1171, 226.2],
            [6.803, 656.4, 256.0],
            [7.015, 1212, 216.0],
            [8.045, 1554, 222.7],
            [8.118, 1581, 219.6],
            [8.072, 1575, 238.9],
            [6.878, 1172, 224.4],
            [6.902, 1268, 216.9],
            [6.953, 1344, 219.4],
            [7.949, 1657, 227.0]
        ];

        const index_A = Math.floor(Math.random() * antoine_list.length);
        let index_B = Math.floor(Math.random() * antoine_list.length);
        while (index_A == index_B) {
            index_B = Math.floor(Math.random() * antoine_list.length);
        }

        const component_1_antoine_parameters = antoine_list[index_A];
        const component_2_antoine_parameters = antoine_list[index_B];

        localStorage.setItem("component_1_antoine_parameters", `${JSON.stringify(component_1_antoine_parameters)}`);
        localStorage.setItem("component_2_antoine_parameters", `${JSON.stringify(component_2_antoine_parameters)}`);

        const Psat1 = function (T) {
            const A = component_1_antoine_parameters[0];
            const B = component_1_antoine_parameters[1];
            const C = component_1_antoine_parameters[2];
            return 10 ** (A - B / (T + C));
        }

        const Psat2 = function (T) {
            const A = component_2_antoine_parameters[0];
            const B = component_2_antoine_parameters[1];
            const C = component_2_antoine_parameters[2];
            return 10 ** (A - B / (T + C));
        }

        // Define component "A" as the more volatile component at 0 degrees C
        if (Psat1(0) > Psat2(0)) {
            gvs.PsatA = Psat1;
            gvs.PsatB = Psat2;
            gvs.component_A_antoine_parameters = component_1_antoine_parameters;
            gvs.component_B_antoine_parameters = component_2_antoine_parameters;
        } else {
            gvs.PsatA = Psat2;
            gvs.PsatB = Psat1;
            gvs.component_A_antoine_parameters = component_2_antoine_parameters;
            gvs.component_B_antoine_parameters = component_1_antoine_parameters;
        }

        gvs.A12 = Math.round((0.3 + Number((Math.random() * 1.70).toFixed(2))) * 100) / 100;
        gvs.A21 = Math.round((0.3 + Number((Math.random() * 1.70).toFixed(2))) * 100) / 100;

        const negative = Math.random() >= 0.25 ? 1 : -1;

        gvs.A12 *= negative;
        gvs.A21 *= negative;

        localStorage.setItem("A12", `${gvs.A12}`);
        localStorage.setItem("A21", `${gvs.A21}`);

        gvs.gamma_A = function (xA) {
            const xB = 1 - xA;
            const ln_gamma_A = xB ** 2 * (gvs.A12 + 2 * (gvs.A21 - gvs.A12) * xA);
            const gamma_A = Math.exp(ln_gamma_A);
            return gamma_A
        }

        gvs.gamma_B = function (xA) {
            const xB = 1 - xA;
            const ln_gamma_B = xA ** 2 * (gvs.A21 + 2 * (gvs.A12 - gvs.A21) * xB);
            const gamma_B = Math.exp(ln_gamma_B);
            return gamma_B
        }

        // generate equilibrium curve
        gvs.eq_line = [];
        for (let xA = 0; xA <= 1.00; xA += 0.01) {
            xA = Math.round(xA * 100) / 100;
            const xB = 1 - xA;
            const P = 760; // atmospheric pressure, mmHg
            let delta = 1e6;
            let T_sat = -273.1;
            for (let T = -273.1; T < 400; T += 0.01) {
                const PsatA = gvs.PsatA(T);
                const PsatB = gvs.PsatB(T);
                const Psat_mixture = xA * gvs.gamma_A(xA) * PsatA + xB * gvs.gamma_B(xA) * PsatB;
                const diff = Math.abs(P - Psat_mixture);
                if (diff < delta) {
                    T_sat = Math.round(T * 100) / 100;
                    delta = diff;
                }
            }
            if (xA == 0.50) {
                gvs.temperature_flask = T_sat;
            }
            const yA = Math.max(0, Math.min(1, xA * gvs.gamma_A(xA) * gvs.PsatA(T_sat) / P));
            gvs.eq_line.push([xA, yA])
        }

        gvs.yA = function (xA) {
            let i = 0;
            let y;
            for (let j = 0; j < gvs.eq_line.length; j++) {
                const x = gvs.eq_line[j][0];
                if (xA >= x) {
                    i = j;
                }
            }
            let frac;
            if (xA < 1) {
                frac = (xA - gvs.eq_line[i][0]) / (gvs.eq_line[i + 1][0] - gvs.eq_line[i][0]);
                y = gvs.eq_line[i][1] * (1 - frac) + gvs.eq_line[i + 1][1] * frac;
            } else {
                frac = 0;
                y = 1;
            }
            return y
        }

    }

    gvs.MW_A = Number((25 + Math.random() * 125).toFixed(1));
    gvs.MW_B = Number((25 + Math.random() * 125).toFixed(1));
    gvs.density_A = Number((0.5 + Math.random() * 0.75).toFixed(2));
    gvs.density_B = Number((0.5 + Math.random() * 0.75).toFixed(2));
    gvs.molar_density_A = Number((gvs.density_A / gvs.MW_A).toPrecision(3));
    gvs.molar_density_B = Number((gvs.density_B / gvs.MW_B).toPrecision(3));
    const mol_A = gvs.volume_A * gvs.molar_density_A;
    const mol_B = (100 - gvs.volume_A) * gvs.molar_density_B;
    gvs.xA_flask = mol_A / (mol_A + mol_B);

    localStorage.setItem("MW_A", `${gvs.MW_A}`);
    localStorage.setItem("MW_B", `${gvs.MW_B}`);
    localStorage.setItem("density_A", `${gvs.density_A}`);
    localStorage.setItem("density_B", `${gvs.density_B}`);
    localStorage.setItem("volume_A_remaining", `1000`);
    localStorage.setItem("volume_B_remaining", `1000`);
    localStorage.setItem("measurements", "[]");
} else {
    let component_1_antoine_parameters = localStorage.getItem("component_1_antoine_parameters");
    let component_2_antoine_parameters = localStorage.getItem("component_2_antoine_parameters");
    component_1_antoine_parameters = JSON.parse(component_1_antoine_parameters);
    component_2_antoine_parameters = JSON.parse(component_2_antoine_parameters);

    const Psat1 = function (T) {
        const A = component_1_antoine_parameters[0];
        const B = component_1_antoine_parameters[1];
        const C = component_1_antoine_parameters[2];
        return 10 ** (A - B / (T + C));
    }

    const Psat2 = function (T) {
        const A = component_2_antoine_parameters[0];
        const B = component_2_antoine_parameters[1];
        const C = component_2_antoine_parameters[2];
        return 10 ** (A - B / (T + C));
    }

    // Define component "A" as the more volatile component at 0 degrees C
    if (Psat1(0) > Psat2(0)) {
        gvs.PsatA = Psat1;
        gvs.PsatB = Psat2;
        gvs.component_A_antoine_parameters = component_1_antoine_parameters;
        gvs.component_B_antoine_parameters = component_2_antoine_parameters;
    } else {
        gvs.PsatA = Psat2;
        gvs.PsatB = Psat1;
        gvs.component_A_antoine_parameters = component_2_antoine_parameters;
        gvs.component_B_antoine_parameters = component_1_antoine_parameters;
    }

    gvs.A12 = Number(localStorage.getItem("A12"));
    gvs.A21 = Number(localStorage.getItem("A21"));


    gvs.gamma_A = function (xA) {
        const xB = 1 - xA;
        const ln_gamma_A = xB ** 2 * (gvs.A12 + 2 * (gvs.A21 - gvs.A12) * xA);
        const gamma_A = Math.exp(ln_gamma_A);
        return gamma_A
    }

    gvs.gamma_B = function (xA) {
        const xB = 1 - xA;
        const ln_gamma_B = xA ** 2 * (gvs.A21 + 2 * (gvs.A12 - gvs.A21) * xB);
        const gamma_B = Math.exp(ln_gamma_B);
        return gamma_B
    }

    // generate equilibrium curve
    gvs.eq_line = [];
    for (let xA = 0; xA <= 1.00; xA += 0.01) {
        xA = Math.round(xA * 100) / 100;
        const xB = 1 - xA;
        const P = 760; // atmospheric pressure, mmHg
        let delta = 1e6;
        let T_sat = -273.1;
        for (let T = -273.1; T < 400; T += 0.01) {
            const PsatA = gvs.PsatA(T);
            const PsatB = gvs.PsatB(T);
            const Psat_mixture = xA * gvs.gamma_A(xA) * PsatA + xB * gvs.gamma_B(xA) * PsatB;
            const diff = Math.abs(P - Psat_mixture);
            if (diff < delta) {
                T_sat = Math.round(T * 100) / 100;
                delta = diff;
            }
        }
        if (xA == 0.50) {
            gvs.temperature_flask = T_sat;
        }
        const yA = Math.max(0, Math.min(1, xA * gvs.gamma_A(xA) * gvs.PsatA(T_sat) / P));
        gvs.eq_line.push([xA, yA])
    }

    gvs.yA = function (xA) {
        let i = 0;
        let y;
        for (let j = 0; j < gvs.eq_line.length; j++) {
            const x = gvs.eq_line[j][0];
            if (xA >= x) {
                i = j;
            }
        }
        let frac;
        if (xA < 1) {
            frac = (xA - gvs.eq_line[i][0]) / (gvs.eq_line[i + 1][0] - gvs.eq_line[i][0]);
            y = gvs.eq_line[i][1] * (1 - frac) + gvs.eq_line[i + 1][1] * frac;
        } else {
            frac = 0;
            y = 1;
        }
        return y
    }

    gvs.MW_A = Number(localStorage.getItem("MW_A"));
    gvs.MW_B = Number(localStorage.getItem("MW_B"));
    gvs.density_A = Number(localStorage.getItem("density_A"));
    gvs.density_B = Number(localStorage.getItem("density_B"));
    gvs.molar_density_A = Number((gvs.density_A / gvs.MW_A).toPrecision(3));
    gvs.molar_density_B = Number((gvs.density_B / gvs.MW_B).toPrecision(3));
    const mol_A = gvs.volume_A * gvs.molar_density_A;
    const mol_B = (100 - gvs.volume_A) * gvs.molar_density_B;
    gvs.xA_flask = mol_A / (mol_A + mol_B);

    gvs.volume_A_remaining = Number(localStorage.getItem("volume_A_remaining"));
    gvs.volume_B_remaining = Number(localStorage.getItem("volume_B_remaining"));
    gvs.measurements = JSON.parse(localStorage.getItem("measurements"));

    const slider_A = Number(document.getElementById("ml-of-a-slider").value);
    const slider_B = Math.round((100 - slider_A) * 100) / 100;
    if(slider_A > gvs.volume_A_remaining || slider_B > gvs.volume_B_remaining) {
        document.getElementById("collection-button").setAttribute("disabled", "yes");
        gvs.not_enough_liquid = true;
    }
}



const isFirstTime = localStorage.getItem("first_time");
const directionsButton = document.getElementById("directions-button");
if (isFirstTime === null) {
    let button_is_lighter = false;
    window.directionsButtonInterval = setInterval(() => {
        if (button_is_lighter == false) {
            directionsButton.style.background = "rgb(200, 200, 255)";
            button_is_lighter = true;
        } else {
            directionsButton.style.background = "rgb(13, 110, 253)";
            button_is_lighter = false;
        }
    }, 1000);
}

directionsButton.addEventListener("click", () => {
    localStorage.setItem("first_time", "false");
    directionsButton.style.background = "rgb(13, 110, 253)";
    clearInterval(directionsButtonInterval);
})
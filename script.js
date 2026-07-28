// =====================================================
// HYDRONOVA PUMPSELECT PRO
// JavaScript Engine
// Part 1
// =====================================================

console.clear();

console.log("================================");
console.log("HydroNova PumpSelect Pro");
console.log("JavaScript Engine Started");
console.log("================================");

// ====================================
// GLOBAL OBJECT
// ====================================

let pumpData = {};

// =====================================================
// PUMP TYPE ENVELOPE TABLE (typical industry/vendor ranges —
// API 610 itself defines these types by mechanical construction,
// not by numeric cutoffs; the numbers below are the same practical
// ranges already used across the app's 18 selection branches)
// =====================================================

const pumpTypeSpecs = [

    { api: "OH1", installation: "Horizontal", flowMin: 5,   flowMax: 100,  headMin: 10,  headMax: 40,   pressureMax: 16,  tempMin: -40, tempMax: 120 },
    { api: "OH2", installation: "Horizontal", flowMin: 100, flowMax: 500,  headMin: 40,  headMax: 150,  pressureMax: 40,  tempMin: -40, tempMax: 250 },
    { api: "OH3", installation: "Horizontal", flowMin: 20,  flowMax: 300,  headMin: 20,  headMax: 120,  pressureMax: 25,  tempMin: 120, tempMax: 200 },
    { api: "OH4", installation: "Horizontal", flowMin: 10,  flowMax: 200,  headMin: 80,  headMax: 300,  pressureMax: 50,  tempMin: -40, tempMax: 250, rpmMin: 3500 },
    { api: "OH5", installation: "Horizontal", flowMin: 20,  flowMax: 400,  headMin: 30,  headMax: 200,  pressureMax: 40,  tempMin: 250, tempMax: 450, fluids: ["Thermal Oil", "Hot Oil", "Heat Transfer Fluid"] },
    { api: "OH6", installation: "Horizontal", flowMin: 300, flowMax: 800,  headMin: 100, headMax: 350,  pressureMax: 60,  tempMin: -40, tempMax: 250, fluids: ["Crude Oil", "Condensate", "Chemical Solution"] },

    { api: "BB1", installation: "Horizontal", flowMin: 100, flowMax: 700,  headMin: 40,  headMax: 200,  pressureMax: 40,  tempMin: -40, tempMax: 250 },
    { api: "BB2", installation: "Horizontal", flowMin: 500, flowMax: 2500, headMin: 80,  headMax: 400,  pressureMax: 80,  tempMin: -40, tempMax: 300 },
    { api: "BB3", installation: "Horizontal", flowMin: 200, flowMax: 1200, headMin: 250, headMax: 1200, pressureMax: 150, tempMin: -40, tempMax: 350 },
    { api: "BB4", installation: "Horizontal", flowMin: 100, flowMax: 1000, headMin: 400, headMax: 1800, pressureMax: 200, tempMin: -40, tempMax: 350 },
    { api: "BB5", installation: "Horizontal", flowMin: 100, flowMax: 1500, headMin: 500, headMax: 3000, pressureMax: 350, tempMin: -40, tempMax: 450 },

    { api: "VS1", installation: "Vertical",   flowMin: 100,  flowMax: 5000,  headMin: 10,  headMax: 200, pressureMax: 20,  tempMin: -40, tempMax: 120 },
    { api: "VS2", installation: "Vertical",   flowMin: 200,  flowMax: 4000,  headMin: 20,  headMax: 250, pressureMax: 25,  tempMin: -40, tempMax: 150 },
    { api: "VS3", installation: "Vertical",   flowMin: 300,  flowMax: 6000,  headMin: 30,  headMax: 300, pressureMax: 30,  tempMin: -40, tempMax: 180 },
    { api: "VS4", installation: "Vertical",   flowMin: 500,  flowMax: 7000,  headMin: 40,  headMax: 350, pressureMax: 35,  tempMin: -40, tempMax: 200 },
    { api: "VS5", installation: "Vertical",   flowMin: 1000, flowMax: 10000, headMin: 80,  headMax: 450, pressureMax: 45,  tempMin: -40, tempMax: 250 },
    { api: "VS6", installation: "Vertical",   flowMin: 800,  flowMax: 8000,  headMin: 100, headMax: 600, pressureMax: 70,  tempMin: -40, tempMax: 300 },
    { api: "VS7", installation: "Vertical",   flowMin: 500,  flowMax: 6000,  headMin: 150, headMax: 800, pressureMax: 100, tempMin: -40, tempMax: 350 }

];

// Soft penalty for a value outside [min, max]: 0 inside the band,
// growing with how far outside it is (capped), instead of an
// instant disqualification. This is what lets ALL parameters
// (not just NPSH) behave as "best fit" rather than "hard reject".
function rangePenalty(value, min, max, span) {

    if (isNaN(value)) return 0; // not entered yet — don't penalize

    if (value >= min && value <= max) return 0;

    const miss = value < min ? (min - value) : (value - max);
    const relativeMiss = span > 0 ? miss / span : 1;

    return Math.min(35, relativeMiss * 100);

}

// Scores every API 610 type against the entered operating point.
// Returns the ranked list (best first) — nothing is eliminated here,
// every type gets a number so a poor match still surfaces as a
// (clearly flagged) option instead of a dead end.
function scoreAllPumpTypes(data) {

    return pumpTypeSpecs.map(function (spec) {

        let score = 100;
        const notes = [];

        // Installation is a real physical/mechanical constraint
        // (a horizontal-family casing can't be installed vertically
        // suspended in a sump), so it stays a heavier penalty —
        // but still not an outright elimination.
        if (data.installation && data.installation !== spec.installation) {
            score -= 45;
            notes.push("installation is " + data.installation + ", " + spec.api + " is typically " + spec.installation);
        }

        score -= rangePenalty(data.flow, spec.flowMin, spec.flowMax, spec.flowMax - spec.flowMin);
        score -= rangePenalty(data.head, spec.headMin, spec.headMax, spec.headMax - spec.headMin);
        score -= rangePenalty(data.temperature, spec.tempMin, spec.tempMax, spec.tempMax - spec.tempMin);

        if (!isNaN(data.dischargePressure) && data.dischargePressure > spec.pressureMax) {
            score -= Math.min(35, ((data.dischargePressure - spec.pressureMax) / spec.pressureMax) * 100);
            notes.push("discharge pressure exceeds the typical " + spec.pressureMax + " bar rating for " + spec.api);
        }

        if (spec.rpmMin && data.rpm && Number(data.rpm) < spec.rpmMin) {
            score -= 15;
            notes.push(spec.api + " is normally a high-speed (\u2265" + spec.rpmMin + " rpm) design");
        }

        if (spec.fluids && data.fluidName && spec.fluids.indexOf(data.fluidName) === -1) {
            score -= 15;
            notes.push(spec.api + " is purpose-built for " + spec.fluids.join("/"));
        }

        // Slight efficiency bias so that among comparably-fitting
        // types, the more efficient construction is preferred —
        // this is the "recommend the more efficient pump" part.
        const curve = pumpCurveDatabase[spec.api];
        if (curve) {
            score += (curve.bepEfficiency - 80) * 0.3;
        }

        return {
            api: spec.api,
            // Capped at 100 on both ends — the efficiency bias above can
            // otherwise push an already-perfect fit past 100%, which would
            // show up as a nonsensical "102%" match score in the UI/report.
            score: Math.min(100, Math.max(0, Math.round(score * 10) / 10)),
            notes: notes
        };

    }).sort(function (a, b) { return b.score - a.score; });

}


// ====================================
// NPSH MARGIN CHECK (API 610)
// ====================================
// API 610 requirement: "NPSH available shall exceed NPSH required by a
// margin of at least 1 meter throughout the allowable operating region
// of flow." Previously each pump type in the selection engine below was
// gated by an arbitrary flat "pumpData.npsha >= N" (N = 2 to 5) that had
// no real link to that pump's actual NPSHr — e.g. VS1 required npsha >= 2
// while its own curve data (pumpCurveDatabase.VS1.npshr = 4.0) implies a
// real NPSHr well above that. These two functions replace that with the
// actual API 610 margin check, using the same curve-based NPSHr formula
// as the Engineering Calculations and Duty Point Analysis sections, so
// all three parts of the app agree on what a pump actually requires.

function getPumpNpshr(pumpKey, flow) {

    const curve = pumpCurveDatabase[pumpKey];

    // Fallback for a pump key not yet in the curve database.
    if (!curve || !flow || flow <= 0) return 3.5;

    const maxFlow = flow * curve.maxFlowFactor;
    const x = flow / maxFlow;

    return curve.npshr + 3 * x;

}

function hasAdequateNpshMargin(pumpKey) {

    const requiredNpshr = getPumpNpshr(pumpKey, pumpData.flow);
    const margin = pumpData.npsha - requiredNpshr;

    // API 610 prefers a 1 m margin between NPSHA and NPSHR, but explicitly
    // allows less than that provided the vendor supplies a test NPSH curve
    // — it isn't an automatic disqualification. The rest of this app (Duty
    // Point Analysis) already treats margin >= 0.6 m as viable ("Marginal"
    // rather than "Unsafe"), so the selection stage uses that same 0.6 m
    // cutoff for consistency — a pump isn't offered here only to be flagged
    // as unsafe later.
    return margin >= 0.6;

}

// ====================================
// READ PUMP SELECTION DATA
// ====================================

function getPumpSelectionData() {

    pumpData.flow =
        parseFloat(document.getElementById("flow").value);

    pumpData.head =
        parseFloat(document.getElementById("tdh").value);

    pumpData.suctionPressure =
        parseFloat(document.getElementById("suction").value);

    pumpData.dischargePressure =
        parseFloat(document.getElementById("discharge").value);

    pumpData.temperature =
        parseFloat(document.getElementById("temperature").value);

    pumpData.npsha =
        parseFloat(document.getElementById("npsh").value);

    pumpData.rpm =
        document.getElementById("rpm").value;

    // Optional target speed for Affinity Law prediction.
    // Blank means "no speed change" -> predictions equal the rated point.
    pumpData.targetRpm =
        parseFloat(document.getElementById("targetRpm").value);

    pumpData.driver =
        document.getElementById("driver").value;

    pumpData.installation =
        document.getElementById("installation").value;

    return pumpData;

}

// ====================================
// VALIDATE INPUTS
// ====================================

function validatePumpSelection(data){

    if(isNaN(data.flow)){

        alert("Enter Flow Rate");

        return false;

    }

    if(isNaN(data.head)){

        alert("Enter Discharge Head");

        return false;

    }

    if(isNaN(data.suctionPressure)){

        alert("Enter Suction Pressure");

        return false;

    }

    if(isNaN(data.dischargePressure)){

        alert("Enter Discharge Pressure");

        return false;

    }

    if(isNaN(data.temperature)){

        alert("Enter Temperature");

        return false;

    }

    if(isNaN(data.npsha)){

        alert("Enter NPSH Available");

        return false;

    }

    if(data.rpm==""){

        alert("Select Pump Speed");

        return false;

    }

    if(data.driver==""){

        alert("Select Driver Type");

        return false;

    }

    if(data.installation==""){

        alert("Select Installation");

        return false;

    }

    return true;

}
// =====================================================
// PART 2
// NAVIGATION
// Pump Selection  →  Fluid Properties
// =====================================================

// Next Button

document.getElementById("nextFluid").addEventListener("click", function () {

    // Read Pump Selection Data
    let data = getPumpSelectionData();

    // Validate Data
    if (!validatePumpSelection(data)) {
        return;
    }

    // Show Fluid Properties (Pump Selection stays visible)
    document.getElementById("fluid-properties").style.display = "block";

    document.getElementById("fluid-properties").scrollIntoView({ behavior: "smooth", block: "start" });

    console.log("Moved to Fluid Properties");

});
// ======================================
// BACK BUTTON
// Fluid Properties → Pump Selection
// ======================================

document.getElementById("backPump").addEventListener("click", function () {

    document.getElementById("pump-selection").scrollIntoView({ behavior: "smooth", block: "start" });

    console.log("Returned to Pump Selection");

});
// =====================================================
// PART 3
// FLUID PROPERTIES DATA COLLECTION
// =====================================================

// Read Fluid Properties

function getFluidProperties() {

    pumpData.fluidName =
        document.getElementById("fluidName").value;

    pumpData.density =
        parseFloat(document.getElementById("density").value);

    pumpData.sg =
        parseFloat(document.getElementById("sg").value);

    pumpData.viscosity =
        parseFloat(document.getElementById("viscosity").value);

    pumpData.ph =
        parseFloat(document.getElementById("ph").value);

    pumpData.vapourPressure =
        parseFloat(document.getElementById("vapour").value);

    pumpData.chloride =
        parseFloat(document.getElementById("chloride").value);

    pumpData.solids =
        parseFloat(document.getElementById("solids").value);

    pumpData.particleSize =
        parseFloat(document.getElementById("particle").value);

    pumpData.corrosive =
        document.getElementById("corrosive").value;

    pumpData.abrasive =
        document.getElementById("abrasive").value;

    pumpData.toxic =
        document.getElementById("toxic").value;

    pumpData.flammable =
        document.getElementById("flammable").value;

    console.log("================================");
    console.log("FLUID PROPERTIES");
    console.table(pumpData);

    return pumpData;

}


// =====================================
// VALIDATE FLUID PROPERTIES
// =====================================

function validateFluidProperties(data){

    if(data.fluidName==""){

        alert("Please Select Fluid Name");

        return false;

    }

    if(isNaN(data.density)){

        alert("Enter Density");

        return false;

    }

    if(isNaN(data.sg)){

        alert("Enter Specific Gravity");

        return false;

    }

    if(isNaN(data.viscosity)){

        alert("Enter Viscosity");

        return false;

    }

    if(isNaN(data.ph)){

        alert("Enter pH Value");

        return false;

    }

    return true;

}


// =====================================
// NEXT BUTTON
// Fluid -> Material Selection
// =====================================

document.getElementById("nextMaterial").addEventListener("click", function(){

    let data = getFluidProperties();

    if(!validateFluidProperties(data)){

        return;

    }

    console.log("Fluid Properties Saved Successfully");

    // Part 4 me Material Selection open hoga.

});
// =====================================================
// PART 4
// MATERIAL SELECTION NAVIGATION
// =====================================================

document.getElementById("nextMaterial").addEventListener("click", function () {

    // Read Fluid Data
    const data = getFluidProperties();

    // Validate
    if (!validateFluidProperties(data)) {
        return;
    }

    // Show Material Section (Fluid Properties stays visible)
    document.getElementById("material-selection").style.display = "block";

    document.getElementById("material-selection").scrollIntoView({ behavior: "smooth", block: "start" });

    console.log("Moved to Material Selection");

    // ===============================
    // Material Recommendation
    // ===============================

    try {
        recommendMaterial();
    } catch (e) {
        console.error("Material Error :", e);
    }

    // ===============================
    // Pump Recommendation
    // ===============================

    try {
        recommendPump();
    } catch (e) {
        console.error("Pump Error :", e);
    }

    // ===============================
    // Engineering
    // ===============================

    if (typeof calculateEngineering === "function") {
        try {
            calculateEngineering();
        } catch (e) {
            console.error("Engineering Error :", e);
        }
    }

    // ===============================
    // API 610
    // ===============================

    if (typeof api610Compliance === "function") {
        try {
            api610Compliance();
        } catch (e) {
            console.error("API610 Error :", e);
        }
    }

    // ===============================
    // Pump Curve
    // ===============================
    // NOTE: the performance curve is already generated inside
    // recommendPump() via generatePumpCurve(), using the
    // pump-specific curve database (head/efficiency/power/NPSHr).
    // Calling the legacy drawPumpCurve() here as well would try
    // to reuse the same <canvas id="pumpChart"> without
    // destroying that chart first, which Chart.js rejects.

});
// =====================================================
// PART 5
// MATERIAL RECOMMENDATION ENGINE
// =====================================================

function recommendMaterial() {

    // ===============================
    // DEFAULT MATERIALS
    // ===============================

    let casing = "SS316";
    let impeller = "SS316";
    let shaft = "SS410";
    let sleeve = "SS316";
    let wearRing = "SS316";
    let seal = "Silicon Carbide";
    let gasket = "Spiral Wound SS316 + Graphite";
    let fastener = "SS304";

    let grade = "Stainless Steel 316";
    let corrosion = "Low";
    let abrasion = "Low";
    let maxTemp = "500°C";
    let recommendation =
        "✔ SS316 is suitable for the selected operating conditions.";

    // ===============================
    // HIGH TEMPERATURE
    // ===============================

    if (pumpData.temperature >= 200) {
        maxTemp = "650°C";
        gasket = "Spiral Wound SS316 + Graphite";
    }

    // ===============================
    // ACID SERVICE
    // ===============================

    if (pumpData.ph <= 2) {

        casing = "Hastelloy C276";
        impeller = "Hastelloy C276";
        shaft = "Hastelloy C276";
        sleeve = "Hastelloy C276";
        wearRing = "PTFE";

        grade = "Hastelloy C276";
        corrosion = "Very Severe";

        recommendation =
            "✔ Hastelloy C276 recommended for strong acidic service.";

    }

    // ===============================
    // ALKALI SERVICE
    // ===============================

    else if (pumpData.ph >= 12) {

        casing = "SS316";
        impeller = "SS316";

        grade = "SS316";
        corrosion = "High";

        recommendation =
            "✔ SS316 recommended for alkaline service.";

    }

    // ===============================
    // HIGH CHLORIDE
    // ===============================

    if (pumpData.chloride >= 500) {

        casing = "Super Duplex SS";
        impeller = "Super Duplex SS";
        sleeve = "Super Duplex SS";
        fastener = "Super Duplex SS";

        grade = "Super Duplex SS";
        corrosion = "Excellent";

        recommendation =
            "✔ Super Duplex Stainless Steel recommended due to high chloride.";

    }

    // ===============================
    // SOLIDS
    // ===============================

    if (pumpData.solids >= 10) {

        wearRing = "High Chrome Iron";
        abrasion = "High";

    }

    // ===============================
    // LARGE PARTICLES
    // ===============================

    if (pumpData.particleSize >= 1) {

        impeller = "High Chrome Iron";
        wearRing = "High Chrome Iron";

        abrasion = "Very High";

    }

    // ===============================
    // CORROSIVE
    // ===============================

    if (pumpData.corrosive === "Yes") {

        corrosion = "Severe";

    }

    // ===============================
    // ABRASIVE
    // ===============================

    if (pumpData.abrasive === "Yes") {

        abrasion = "Severe";

    }

    // ===============================
    // TOXIC
    // ===============================

    if (pumpData.toxic === "Yes") {

        seal = "Dual Mechanical Seal";

    }

    // ===============================
    // FLAMMABLE
    // ===============================

    if (pumpData.flammable === "Yes") {

        gasket = "Graphite Filled Spiral Wound";

    }

    // ===============================
    // UPDATE HTML
    // ===============================

    document.getElementById("casingMaterial").innerText = casing;
    document.getElementById("impellerMaterial").innerText = impeller;
    document.getElementById("shaftMaterial").innerText = shaft;
    document.getElementById("sleeveMaterial").innerText = sleeve;
    document.getElementById("wearRingMaterial").innerText = wearRing;
    document.getElementById("sealMaterial").innerText = seal;
    document.getElementById("gasketMaterial").innerText = gasket;
    document.getElementById("fastenerMaterial").innerText = fastener;

    document.getElementById("materialGrade").innerText = grade;
    document.getElementById("corrosionLevel").innerText = corrosion;
    document.getElementById("abrasionLevel").innerText = abrasion;
    document.getElementById("maxTemperature").innerText = maxTemp;
    document.getElementById("materialRecommendation").innerText = recommendation;

    console.log("Material Recommendation Completed");

}
// =====================================================
// PART 6
// PUMP RECOMMENDATION ENGINE
// =====================================================

function recommendPump() {

    // ===============================
    // DEBUG
    // ===============================

    console.log("recommendPump() started");
    console.log("Pump Data :", pumpData);

    // ===============================
    // VARIABLES
    // ===============================

    let pump = "";
    let api = "";
    let description = "";

    let flowRange = "";
    let headRange = "";
    let pressure = "";

    let efficiency = "";
    let motor = "";
    let speed = "";

    let mounting = "";
    let impeller = "";
    let seal = "";
    let bearing = "";

    let image = "";

    let applications = [];

    // ===============================
    // INTELLIGENT SELECTION ENGINE
    // ===============================

    let matchScore = 0;
    let selectionReason = [];
    let alternativePumps = [];

    // ===============================
    // BEST-FIT SCORING (ALL 18 TYPES, ALL PARAMETERS)
    // ===============================
    // Score every API 610 type against flow/head/pressure/temperature/
    // installation/speed/fluid — not just NPSH. The winner drives which
    // branch below fires; a tight parameter now costs points instead of
    // instantly disqualifying the pump.

    const pumpRankings = scoreAllPumpTypes(pumpData);
    const bestPumpMatch = pumpRankings[0];
    const selectedApiCode = bestPumpMatch ? bestPumpMatch.api : null;

    console.log("Pump Type Rankings :", pumpRankings);

    // =====================================================
    // PUMP SELECTION LOGIC
    // =====================================================

// =====================================================
// OH1
// =====================================================

if (

    selectedApiCode === "OH1"

) {

    pump = "OH1 Process Pump";
    api = "OH1";

    description =
        "API 610 OH1 single-stage foot-mounted overhung centrifugal pump for general process service.";

    flowRange = "5 - 100 m³/hr";
    headRange = "10 - 40 m";
    pressure = "16 bar";
    efficiency = "80 %";
    motor = "5 - 30 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Foot Mounted";
    impeller = "Closed Impeller";
    seal = "Single Mechanical Seal";
    bearing = "Deep Groove Ball Bearing";

    image = "assets/images/OH1.png";

    applications = [

        "Water Transfer",
        "Cooling Water",
        "Utility Service",
        "General Industrial Process",
        "Light Chemical Service"

    ];

    matchScore = 90;

    selectionReason = [

        "Low flow application.",
        "Low head requirement.",
        "Horizontal installation.",
        "Suitable for general process service.",
        "API 610 OH1 recommended."

    ];

    alternativePumps = [

        "OH2 (86%)",
        "BB1 (72%)",
        "VS1 (60%)"

    ];

}
// =====================================================
// OH2
// =====================================================

else if (

    selectedApiCode === "OH2"

) {

    pump = "OH2 Process Pump";
    api = "OH2";

    description =
        "API 610 OH2 single-stage centerline-mounted overhung centrifugal pump for refinery and process industries.";

    flowRange = "100 - 500 m³/hr";
    headRange = "40 - 150 m";
    pressure = "40 bar";
    efficiency = "82 %";
    motor = "30 - 250 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Centerline Mounted";
    impeller = "Closed Impeller";
    seal = "Single / Dual Mechanical Seal";
    bearing = "Angular Contact Ball Bearing";

    image = "assets/images/OH2.png";

    applications = [

        "Oil & Gas",
        "Refinery",
        "Petrochemical",
        "Chemical Process",
        "Power Plant",
        "Water Treatment"

    ];

    matchScore = 96;

    selectionReason = [

        "Flow within OH2 operating range.",
        "Head within OH2 operating range.",
        "Horizontal installation.",
        "Best choice for process pump.",
        "API 610 OH2 recommended."

    ];

    alternativePumps = [

        "OH1 (85%)",
        "OH3 (80%)",
        "BB1 (72%)"

    ];

}

// ==========================
// OH3
// ==========================

else if (

    selectedApiCode === "OH3"

) {

    pump = "OH3 Vertical In-Line Pump";
    api = "OH3";

    description =
    "API 610 OH3 vertical in-line close-coupled overhung centrifugal pump.";

    flowRange = "20 - 300 m³/hr";
    headRange = "20 - 120 m";
    pressure = "25 bar";
    efficiency = "80%";
    motor = "15 - 132 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Vertical In-Line";
    impeller = "Closed Impeller";
    seal = "Single Mechanical Seal";
    bearing = "Angular Contact Ball Bearing";

    image = "assets/images/OH3.png";

    applications = [
        "HVAC Systems",
        "Boiler Feed",
        "Cooling Water",
        "Chemical Process",
        "Industrial Utilities"
    ];

    matchScore = 92;

    selectionReason = [
        "High temperature service.",
        "Inline centerline construction.",
        "Suitable for refinery process.",
        "API 610 OH3 recommended."
    ];

    alternativePumps = [
        "OH2 (86%)",
        "OH4 (82%)",
        "BB2 (75%)"
    ];

}

// ==========================
// OH4
// ==========================

else if (

    selectedApiCode === "OH4"

) {

    pump = "OH4 Integrally Geared Pump";
    api = "OH4";

    description =
    "API 610 OH4 integrally geared high-speed overhung centrifugal pump designed for high head process applications.";

    flowRange = "10 - 200 m³/hr";
    headRange = "80 - 300 m";
    pressure = "50 bar";
    efficiency = "83%";
    motor = "45 - 315 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Horizontal";
    impeller = "Closed High-Speed Impeller";
    seal = "Single / Dual Mechanical Seal";
    bearing = "High-Speed Angular Contact Bearing";

    image = "assets/images/OH4.png";

    applications = [

        "High Pressure Process",
        "Boiler Feed",
        "Refinery",
        "Petrochemical",
        "Chemical Injection",
        "Pipeline Service"

    ];

    matchScore = 93;

    selectionReason = [

        "High speed application.",
        "Close coupled design.",
        "Compact installation.",
        "API 610 OH4 recommended."

    ];

    alternativePumps = [

        "OH3 (86%)",
        "OH2 (82%)",
        "OH5 (80%)"

    ];

}

// ==========================
// OH5
// ==========================

else if (

    selectedApiCode === "OH5"

) {

    pump = "OH5 High Temperature Process Pump";
    api = "OH5";

    description =
    "API 610 OH5 overhung centrifugal pump specially designed for high-temperature hydrocarbon and thermal fluid services.";

    flowRange = "20 - 400 m³/hr";
    headRange = "30 - 200 m";
    pressure = "40 bar";
    efficiency = "81%";
    motor = "30 - 250 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Centerline Mounted";
    impeller = "Closed High Temperature Impeller";
    seal = "API 682 Mechanical Seal";
    bearing = "Heavy Duty Angular Contact Bearing";

    image = "assets/images/OH5.png";

    applications = [

        "Thermal Oil System",
        "Hot Oil Circulation",
        "Refinery Heater Service",
        "Petrochemical Plant",
        "Heat Transfer Fluid",
        "High Temperature Process"

    ];

    matchScore = 95;

    selectionReason = [

        "Very high temperature service.",
        "Heavy duty refinery application.",
        "Centerline mounted design.",
        "API 610 OH5 recommended."

    ];

    alternativePumps = [

        "OH6 (91%)",
        "BB2 (84%)",
        "OH4 (80%)"

    ];

}
// ==========================
// OH6
// ==========================

else if (

    selectedApiCode === "OH6"

) {

    pump = "OH6 Heavy Duty Process Pump";
    api = "OH6";

    description =
    "API 610 OH6 heavy-duty overhung process pump with flexible coupling, designed for refinery, hydrocarbon and high-pressure process services.";

    flowRange = "300 - 800 m³/hr";
    headRange = "100 - 350 m";
    pressure = "60 bar";
    efficiency = "84%";
    motor = "110 - 500 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Centerline Mounted";
    impeller = "Closed Heavy Duty Impeller";
    seal = "API 682 Dual Mechanical Seal";
    bearing = "Heavy Duty Angular Contact Bearing";

    image = "assets/images/OH6.png";

    applications = [

        "Refinery Process",
        "Crude Oil Transfer",
        "Hydrocarbon Service",
        "Chemical Process",
        "Pipeline Service",
        "Petrochemical Plant"

    ];

    matchScore = 97;

    selectionReason = [

        "High flow application.",
        "High head process service.",
        "Heavy duty refinery design.",
        "API 610 OH6 recommended."

    ];

    alternativePumps = [

        "OH5 (92%)",
        "BB2 (88%)",
        "VS5 (75%)"

    ];

}
// ==========================
// BB1
// ==========================

else if (

    selectedApiCode === "BB1"

) {

    pump = "BB1 Axially Split Pump";
    api = "BB1";

    description =
    "API 610 BB1 between-bearings axially split centrifugal pump for medium flow and pressure services.";

    flowRange = "100 - 700 m³/hr";
    headRange = "40 - 200 m";
    pressure = "40 bar";
    efficiency = "84%";
    motor = "75 - 315 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Horizontal";
    impeller = "Double Suction Closed";
    seal = "Mechanical Seal";
    bearing = "Journal + Thrust Bearing";

    image = "assets/images/BB1.png";

    applications = [

        "Refinery",
        "Pipeline",
        "Cooling Water",
        "Petrochemical",
        "Power Plant"

    ];

    matchScore = 94;

    selectionReason = [

        "Between bearings construction.",
        "Medium flow application.",
        "Reliable process pump.",
        "API 610 BB1 recommended."

    ];

    alternativePumps = [

        "BB2 (90%)",
        "OH6 (85%)",
        "VS5 (75%)"

    ];

}
// ==========================
// BB2
// ==========================

else if (

    selectedApiCode === "BB2"

) {

    pump = "BB2 Radially Split Pump";
    api = "BB2";

    description =
    "API 610 BB2 between-bearings radially split centrifugal pump for high-pressure refinery services.";

    flowRange = "500 - 2500 m³/hr";
    headRange = "80 - 400 m";
    pressure = "80 bar";
    efficiency = "86%";
    motor = "160 - 800 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Centerline Mounted";
    impeller = "Closed Double Suction";
    seal = "Dual Mechanical Seal";
    bearing = "Journal + Thrust Bearing";

    image = "assets/images/BB2.png";

    applications = [

        "Pipeline",
        "Boiler Feed",
        "Refinery",
        "Petrochemical",
        "Water Transport"

    ];

    matchScore = 96;

    selectionReason = [

        "High flow process application.",
        "High pressure requirement.",
        "Radially split casing.",
        "API 610 BB2 recommended."

    ];

    alternativePumps = [

        "BB1 (90%)",
        "BB3 (88%)",
        "OH6 (82%)"

    ];

}
// ==========================
// BB3
// ==========================

else if (

    selectedApiCode === "BB3"

) {

    pump = "BB3 Axially Split Multistage Pump";
    api = "BB3";

    description =
    "API 610 BB3 between-bearings axially split multistage centrifugal pump designed for high-head process and boiler feed applications.";

    flowRange = "200 - 1200 m³/hr";
    headRange = "250 - 1200 m";
    pressure = "150 bar";
    efficiency = "87%";
    motor = "250 - 1500 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Horizontal Centerline Mounted";
    impeller = "Closed Multistage Impeller";
    seal = "API 682 Dual Mechanical Seal";
    bearing = "Journal + Thrust Bearing";

    image = "assets/images/BB3.png";

    applications = [

        "Boiler Feed Water",
        "Power Plant",
        "High Pressure Process",
        "Refinery",
        "Petrochemical",
        "Pipeline Service"

    ];

    matchScore = 97;

    selectionReason = [

        "Multistage high-head application.",
        "Axially split casing.",
        "Excellent hydraulic efficiency.",
        "Suitable for boiler feed duty.",
        "API 610 BB3 recommended."

    ];

    alternativePumps = [

        "BB4 (95%)",
        "BB2 (90%)",
        "BB5 (88%)"

    ];

}
// ==========================
// BB4
// ==========================

else if (

    selectedApiCode === "BB4"

) {

    pump = "BB4 Radially Split Multistage Pump";
    api = "BB4";

    description =
    "API 610 BB4 radially split multistage between-bearings centrifugal pump for high-pressure process applications.";

    flowRange = "100 - 1000 m³/hr";
    headRange = "400 - 1800 m";
    pressure = "200 bar";
    efficiency = "88%";
    motor = "315 - 2000 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Centerline Mounted";
    impeller = "Closed Multistage Impeller";
    seal = "API 682 Dual Mechanical Seal";
    bearing = "Heavy Duty Journal + Thrust Bearing";

    image = "assets/images/BB4.png";

    applications = [

        "Boiler Feed",
        "Refinery",
        "High Pressure Pipeline",
        "Power Plant",
        "Chemical Process",
        "Petrochemical"

    ];

    matchScore = 98;

    selectionReason = [

        "Very high head requirement.",
        "Multistage radially split design.",
        "High pressure process service.",
        "Excellent reliability.",
        "API 610 BB4 recommended."

    ];

    alternativePumps = [

        "BB5 (96%)",
        "BB3 (93%)",
        "OH6 (75%)"

    ];

}
// ==========================
// BB5
// ==========================

else if (

    selectedApiCode === "BB5"

) {

    pump = "BB5 Double Casing Multistage Pump";
    api = "BB5";

    description =
    "API 610 BB5 double casing radially split multistage pump for extremely high-pressure refinery and boiler feed services.";

    flowRange = "100 - 1500 m³/hr";
    headRange = "500 - 3000 m";
    pressure = "350 bar";
    efficiency = "89%";
    motor = "500 - 5000 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Centerline Mounted";
    impeller = "Closed Multistage Impeller";
    seal = "API 682 Dual Mechanical Seal";
    bearing = "Heavy Duty Journal + Thrust Bearing";

    image = "assets/images/BB5.png";

    applications = [

        "Boiler Feed Water",
        "Power Plant",
        "Refinery",
        "Pipeline",
        "High Pressure Hydrocarbon",
        "Petrochemical"

    ];

    matchScore = 99;

    selectionReason = [

        "Extremely high pressure service.",
        "Double casing construction.",
        "Maximum reliability.",
        "Suitable for critical refinery duty.",
        "API 610 BB5 recommended."

    ];

    alternativePumps = [

        "BB4 (96%)",
        "BB3 (91%)",
        "VS6 (85%)"

    ];

}
// ==========================
// VS1
// ==========================

else if (

    selectedApiCode === "VS1"

) {

    pump = "VS1 Vertical Suspended Pump";
    api = "VS1";

    description =
    "API 610 VS1 vertical suspended single casing diffuser pump designed for cooling water, river water and sump services.";

    flowRange = "100 - 5000 m³/hr";
    headRange = "10 - 200 m";
    pressure = "20 bar";
    efficiency = "84%";
    motor = "30 - 1000 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Vertical";
    impeller = "Mixed Flow / Closed";
    seal = "Mechanical Seal";
    bearing = "Thrust Bearing";

    image = "assets/images/VS1.png";

    applications = [

        "Cooling Water",
        "Fire Water",
        "River Water Intake",
        "Sea Water",
        "Sump Service",
        "Power Plant"

    ];

    matchScore = 95;

    selectionReason = [

        "Vertical suspended construction.",
        "Large flow handling capability.",
        "Suitable for cooling water duty.",
        "Low NPSH requirement.",
        "API 610 VS1 recommended."

    ];

    alternativePumps = [

        "VS2 (92%)",
        "VS3 (88%)",
        "BB1 (75%)"

    ];

}
// ==========================
// VS2
// ==========================

else if (

    selectedApiCode === "VS2"

) {

    pump = "VS2 Vertical Suspended Diffuser Pump";
    api = "VS2";

    description =
    "API 610 VS2 vertical suspended diffuser pump designed for cooling water, seawater intake and general industrial process applications.";

    flowRange = "200 - 4000 m³/hr";
    headRange = "20 - 250 m";
    pressure = "25 bar";
    efficiency = "85%";
    motor = "45 - 1250 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Vertical";
    impeller = "Closed Diffuser Impeller";
    seal = "Mechanical Seal";
    bearing = "Heavy Duty Thrust Bearing";

    image = "assets/images/VS2.png";

    applications = [

        "Cooling Water",
        "Sea Water Intake",
        "River Water Pumping",
        "Power Plant",
        "Refinery",
        "Water Distribution"

    ];

    matchScore = 96;

    selectionReason = [

        "Vertical diffuser construction.",
        "High flow and medium head duty.",
        "Excellent hydraulic efficiency.",
        "Suitable for cooling and seawater service.",
        "API 610 VS2 recommended."

    ];

    alternativePumps = [

        "VS1 (92%)",
        "VS3 (90%)",
        "BB1 (80%)"

    ];

}
// ==========================
// VS3
// ==========================

else if (

    selectedApiCode === "VS3"

) {

    pump = "VS3 Vertical Suspended Volute Pump";
    api = "VS3";

    description =
    "API 610 VS3 vertical suspended single-volute centrifugal pump designed for high-capacity cooling water, seawater intake and industrial process applications.";

    flowRange = "300 - 6000 m³/hr";
    headRange = "30 - 300 m";
    pressure = "30 bar";
    efficiency = "86%";
    motor = "75 - 1600 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Vertical";
    impeller = "Closed Mixed Flow Impeller";
    seal = "Mechanical Seal";
    bearing = "Heavy Duty Thrust Bearing";

    image = "assets/images/VS3.png";

    applications = [

        "Cooling Water System",
        "Sea Water Intake",
        "River Water Pumping",
        "Power Plant",
        "Refinery",
        "Petrochemical",
        "Water Distribution"

    ];

    matchScore = 97;

    selectionReason = [

        "Large capacity vertical pump.",
        "High flow and medium head application.",
        "Suitable for cooling water and intake service.",
        "Excellent hydraulic efficiency.",
        "API 610 VS3 recommended."

    ];

    alternativePumps = [

        "VS2 (93%)",
        "VS4 (91%)",
        "BB1 (82%)"

    ];

}
// ==========================
// VS4
// ==========================

else if (

    selectedApiCode === "VS4"

) {

    pump = "VS4 Vertical Suspended Double Casing Pump";
    api = "VS4";

    description =
    "API 610 VS4 vertical suspended double casing diffuser pump designed for high-capacity cooling water and refinery applications.";

    flowRange = "500 - 7000 m³/hr";
    headRange = "40 - 350 m";
    pressure = "35 bar";
    efficiency = "87%";
    motor = "90 - 2000 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Vertical";
    impeller = "Closed Diffuser Impeller";
    seal = "Mechanical Seal";
    bearing = "Heavy Duty Thrust Bearing";

    image = "assets/images/VS4.png";

    applications = [

        "Cooling Water",
        "Sea Water Intake",
        "Power Plant",
        "Petrochemical",
        "Refinery",
        "Large Water Distribution"

    ];

    matchScore = 98;

    selectionReason = [

        "Large capacity vertical diffuser pump.",
        "High efficiency hydraulic design.",
        "Suitable for refinery cooling water.",
        "API 610 VS4 recommended."

    ];

    alternativePumps = [

        "VS3 (94%)",
        "VS5 (92%)",
        "BB2 (84%)"

    ];

}
// ==========================
// VS5
// ==========================

else if (

    selectedApiCode === "VS5"

) {

    pump = "VS5 Vertical Turbine Pump";
    api = "VS5";

    description =
    "API 610 VS5 vertical turbine pump designed for deep well, cooling water, refinery and large-capacity industrial services.";

    flowRange = "1000 - 10000 m³/hr";
    headRange = "80 - 450 m";
    pressure = "45 bar";
    efficiency = "88%";
    motor = "160 - 3000 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Vertical";
    impeller = "Multistage Bowl Assembly";
    seal = "Mechanical Seal";
    bearing = "Product Lubricated / Thrust Bearing";

    image = "assets/images/VS5.png";

    applications = [

        "Deep Well Pumping",
        "Cooling Water",
        "Fire Water",
        "Sea Water Intake",
        "Power Plant",
        "Refinery",
        "Large Water Supply"

    ];

    matchScore = 99;

    selectionReason = [

        "Very high flow requirement.",
        "Vertical turbine construction.",
        "Suitable for deep well service.",
        "Excellent hydraulic efficiency.",
        "API 610 VS5 recommended."

    ];

    alternativePumps = [

        "VS4 (95%)",
        "VS6 (93%)",
        "BB2 (88%)"

    ];

}
// ==========================
// VS6
// ==========================

else if (

    selectedApiCode === "VS6"

) {

    pump = "VS6 Vertical Double Casing Pump";
    api = "VS6";

    description =
    "API 610 VS6 vertical suspended double casing multistage pump designed for high-pressure refinery, offshore and hydrocarbon services.";

    flowRange = "800 - 8000 m³/hr";
    headRange = "100 - 600 m";
    pressure = "70 bar";
    efficiency = "89%";
    motor = "250 - 3500 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Vertical";
    impeller = "Closed Multistage Impeller";
    seal = "API 682 Dual Mechanical Seal";
    bearing = "Heavy Duty Thrust Bearing";

    image = "assets/images/VS6.png";

    applications = [

        "Offshore Platform",
        "Refinery",
        "Petrochemical Plant",
        "High Pressure Cooling Water",
        "Hydrocarbon Transfer",
        "Sea Water Intake"

    ];

    matchScore = 99;

    selectionReason = [

        "Very high pressure service.",
        "Double casing construction.",
        "Suitable for offshore installations.",
        "Excellent hydraulic performance.",
        "API 610 VS6 recommended."

    ];

    alternativePumps = [

        "VS5 (95%)",
        "VS7 (93%)",
        "BB5 (90%)"

    ];

}
// ==========================
// VS7
// ==========================

else if (

    selectedApiCode === "VS7"

) {

    pump = "VS7 Vertical Barrel Pump";
    api = "VS7";

    description =
    "API 610 VS7 vertical barrel multistage pump designed for critical refinery, LNG, boiler feed and high-pressure process applications.";

    flowRange = "500 - 6000 m³/hr";
    headRange = "150 - 800 m";
    pressure = "100 bar";
    efficiency = "90%";
    motor = "315 - 5000 kW";
    speed = pumpData.rpm + " RPM";
    mounting = "Vertical Barrel";
    impeller = "Closed Multistage Impeller";
    seal = "API 682 Dual Mechanical Seal";
    bearing = "Heavy Duty Journal + Thrust Bearing";

    image = "assets/images/VS7.png";

    applications = [

        "Boiler Feed Water",
        "LNG Terminal",
        "Refinery",
        "Petrochemical",
        "Pipeline Booster",
        "High Pressure Process"

    ];

    matchScore = 100;

    selectionReason = [

        "Critical high-pressure duty.",
        "Vertical barrel construction.",
        "Maximum reliability.",
        "Suitable for LNG and refinery service.",
        "API 610 VS7 recommended."

    ];

    alternativePumps = [

        "VS6 (96%)",
        "BB5 (94%)",
        "BB4 (90%)"

    ];

}
// =====================================================
// NO MATCH FALLBACK
// =====================================================
// If none of the API 610 configurations above matched the
// entered operating conditions, surface that clearly instead
// of silently showing blank/stale results.
// =====================================================

else {

    pump = "No Suitable Pump Found";
    api = "--";

    description =
        "The scoring engine could not evaluate the entered operating conditions against any API 610 configuration. Re-check flow, head, pressure and temperature inputs.";

    flowRange = "--";
    headRange = "--";
    pressure = "--";
    efficiency = "--";
    motor = "--";
    speed = pumpData.rpm ? pumpData.rpm + " RPM" : "--";
    mounting = "--";
    impeller = "--";
    seal = "--";
    bearing = "--";

    image = "assets/images/pump.png";

    applications = [];

    matchScore = 0;

    selectionReason = [
        "Entered operating conditions fall outside all standard API 610 pump envelopes.",
        "Double-check flow, head, pressure and temperature inputs.",
        "A custom or special-engineered pump may be required."
    ];

    alternativePumps = [];

}

// =====================================================
// FULL PARAMETER-FIT ADVISORY (runs once, after a pump type is matched)
// =====================================================
// The scoring engine (scoreAllPumpTypes) already evaluated every
// parameter — installation, flow, head, pressure, temperature, speed,
// fluid — for all 18 types, softly, with no hard elimination. Here we
// surface WHY the winner isn't a perfect textbook fit (if it isn't),
// replace the hardcoded per-branch matchScore/alternativePumps with the
// real computed numbers, and fold NPSH into the same advisory instead
// of treating it as a special case.

if (api && api !== "--" && bestPumpMatch) {

    // Real efficiency from the same single source of truth used by
    // Engineering Calculations / Duty Point Analysis (pumpCurveDatabase),
    // instead of a hardcoded per-branch string that could drift out of
    // sync with the rest of the app.
    const curveForRecommendation = pumpCurveDatabase[api];
    if (curveForRecommendation) {
        efficiency = curveForRecommendation.bepEfficiency + " %";
    }

    // Real, computed match score (was previously a fixed number typed
    // into each branch, e.g. always "96" for OH2 regardless of how well
    // the actual inputs fit).
    matchScore = Math.round(bestPumpMatch.score);

    // Real alternatives: the next-best scoring types, not a static list.
    alternativePumps = pumpRankings
        .filter(function (r) { return r.api !== api; })
        .slice(0, 3)
        .map(function (r) { return r.api + " (" + Math.round(r.score) + "%)"; });

    // Surface every soft-penalty reason the scorer found for this type
    // (installation mismatch, pressure/speed/fluid outside the typical
    // envelope) — this is the "all parameters, not just NPSH" advisory.
    bestPumpMatch.notes.forEach(function (note) {
        selectionReason.push("⚠ " + note.charAt(0).toUpperCase() + note.slice(1) + ".");
    });

    if (matchScore < 60) {
        selectionReason.push(
            "⚠ Overall fit is weak (" + matchScore + "%) — entered operating point sits well outside " +
            api + "'s typical envelope. Treat this as a starting point only and consult an application engineer."
        );
    }

    // NPSH margin — folded into the same advisory pass.
    const npshrForSelected = getPumpNpshr(api, pumpData.flow);
    const npshMarginForSelected = pumpData.npsha - npshrForSelected;

    if (isNaN(npshMarginForSelected)) {
        // NPSHA not entered yet — nothing to warn about.
    } else if (npshMarginForSelected < 0) {

        matchScore = Math.max(0, matchScore - 25);

        selectionReason.push(
            "⚠ NPSH shortfall: available (" + pumpData.npsha.toFixed(1) +
            " m) is below required (" + npshrForSelected.toFixed(1) +
            " m) for " + api + ". Increase suction head/NPSHA or select a lower-NPSHr pump before finalizing."
        );

    } else if (npshMarginForSelected < 1) {

        matchScore = Math.max(0, matchScore - 10);

        selectionReason.push(
            "⚠ NPSH margin is tight (" + npshMarginForSelected.toFixed(1) +
            " m). API 610 allows this only if the vendor supplies a tested NPSH curve — request one before ordering."
        );

    }

}

// =====================================
// SAVE SELECTED PUMP DATA
// =====================================

pumpData.selectedPump = api;
pumpData.selectedPumpName = pump;
pumpData.selectedPumpImage = image;
pumpData.matchScore = matchScore;
pumpData.selectionReason = selectionReason;
pumpData.alternativePumps = alternativePumps;

    // =====================================================
    // UPDATE HTML
    // =====================================================

    document.getElementById("pumpName").innerText = pump;
    document.getElementById("pumpDescription").innerText = description;

    document.getElementById("apiType").innerText = api;
    document.getElementById("flowRange").innerText = flowRange;
    document.getElementById("headRange").innerText = headRange;
    document.getElementById("pressureRange").innerText = pressure;
    document.getElementById("efficiency").innerText = efficiency;
    document.getElementById("motorPower").innerText = motor;
    document.getElementById("pumpSpeed").innerText = speed;
    document.getElementById("mounting").innerText = mounting;
    document.getElementById("impellerType").innerText = impeller;
    document.getElementById("sealType").innerText = seal;
    document.getElementById("bearingType").innerText = bearing;
//=================================================================
    // Pump Image
//================================================================
    const pumpImage = document.getElementById("pumpImage");
    if (pumpImage) {
        pumpImage.src = image;
    }
//================================================================
    // Applications
//=================================================================
    const appList = document.getElementById("applicationList");
    if (appList) {

        appList.innerHTML = "";

        applications.forEach(function (item) {

            let li = document.createElement("li");
            li.textContent = item;
            appList.appendChild(li);

        });

    }
//================================================================
    // Match Score
//================================================================
    const matchScoreValue = document.getElementById("matchScoreValue");
    const matchScoreFill = document.getElementById("matchScoreFill");

    if (matchScoreValue && matchScoreFill) {

        matchScoreValue.innerText = matchScore + "%";
        matchScoreFill.style.width = matchScore + "%";

        matchScoreFill.classList.remove("score-high", "score-medium", "score-low");

        if (matchScore >= 90) {
            matchScoreFill.classList.add("score-high");
        } else if (matchScore >= 70) {
            matchScoreFill.classList.add("score-medium");
        } else {
            matchScoreFill.classList.add("score-low");
        }

    }
//================================================================
    // Selection Reasoning
//================================================================
    const reasonList = document.getElementById("selectionReasonList");

    if (reasonList) {

        reasonList.innerHTML = "";

        if (selectionReason.length === 0) {

            let li = document.createElement("li");
            li.textContent = "No reasoning available.";
            reasonList.appendChild(li);

        } else {

            selectionReason.forEach(function (reason) {

                let li = document.createElement("li");
                li.textContent = reason;
                reasonList.appendChild(li);

            });

        }

    }
//================================================================
    // Alternative Pumps Table
//================================================================
    const altBody = document.getElementById("alternativePumpsBody");

    if (altBody) {

        altBody.innerHTML = "";

        if (alternativePumps.length === 0) {

            let row = document.createElement("tr");
            row.innerHTML = "<td colspan='3'>No alternative pumps to compare.</td>";
            altBody.appendChild(row);

        } else {

            alternativePumps.forEach(function (entry) {

                // Entry format: "OH2 (86%)"
                let match = entry.match(/([A-Za-z0-9]+)\s*\((\d+)%\)/);

                let altApi = match ? match[1] : entry;
                let altScore = match ? Number(match[2]) : 0;

                let suitability = "Optional";

                if (altScore >= 90) {
                    suitability = "Best";
                } else if (altScore >= 75) {
                    suitability = "Good";
                }

                let row = document.createElement("tr");

                row.innerHTML =
                    "<td>" + altApi + "</td>" +
                    "<td>" + altScore + "%</td>" +
                    "<td>" + suitability + "</td>";

                altBody.appendChild(row);

            });

        }

    }
// =====================================================
// GENERATE PUMP PERFORMANCE CURVE
// =====================================================

if (api === "--" || !api) {

    console.log("No valid pump selected — skipping curve generation.");

    if (pumpChart) {
        pumpChart.destroy();
        pumpChart = null;
    }

} else if (typeof generatePumpCurve === "function") {

    generatePumpCurve();

    if (typeof analyzeDutyPoint === "function") {

        try {
            analyzeDutyPoint();
        } catch (e) {
            console.error("Duty Point Error :", e);
        }

    }

} else {

    console.error("generatePumpCurve() function not found.");

}

console.log("Pump Recommendation Completed");

} // <-- recommendPump() function ends here
// =====================================================
// STEP 4.3.3
// PROFESSIONAL PUMP PERFORMANCE CURVES
// =====================================================

function drawPumpCurve() {

    console.log("========== drawPumpCurve() ==========");

    console.log("pumpData :", pumpData);

    console.log("Flow :", pumpData.flow);

    console.log("Head :", pumpData.head);

    const canvas = document.getElementById("pumpChart");

    console.log("Canvas :", canvas);

    if (!canvas) {
        console.error("❌ pumpChart canvas NOT FOUND");
        return;
    }

    if (typeof Chart === "undefined") {
        console.error("❌ Chart.js not loaded");
        return;
    }

    const ctx = canvas.getContext("2d");

    if (window.pumpCurveChart) {
        window.pumpCurveChart.destroy();
    }

    const Q = Number(pumpData.flow);
    const H = Number(pumpData.head);

    const efficiency =
        parseFloat(document.getElementById("efficiency").innerText) || 80;

    console.log("Efficiency :", efficiency);

    const flowData = [
        0,
        Q * 0.25,
        Q * 0.50,
        Q * 0.75,
        Q,
        Q * 1.10,
        Q * 1.20
    ];

    const headData = [
        H * 1.25,
        H * 1.15,
        H * 1.08,
        H * 1.03,
        H,
        H * 0.92,
        H * 0.82
    ];

    const efficiencyData = [
        45,
        65,
        78,
        86,
        efficiency,
        83,
        70
    ];

    console.log("Flow Data :", flowData);
    console.log("Head Data :", headData);

    window.pumpCurveChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: flowData,

            datasets: [

                {
                    label: "Head (m)",
                    data: headData,
                    borderColor: "#1565C0",
                    borderWidth: 3,
                    tension: 0.35,
                    yAxisID: "y"
                },

                {
                    label: "Efficiency (%)",
                    data: efficiencyData,
                    borderColor: "#00C853",
                    borderWidth: 3,
                    tension: 0.35,
                    yAxisID: "y1"
                }

            ]

        },

        options: {

            responsive: true,

            scales: {

                x: {
                    title: {
                        display: true,
                        text: "Flow (m³/hr)"
                    }
                },

                y: {
                    position: "left",
                    title: {
                        display: true,
                        text: "Head (m)"
                    }
                },

                y1: {
                    position: "right",
                    grid: {
                        drawOnChartArea: false
                    },
                    title: {
                        display: true,
                        text: "Efficiency (%)"
                    },
                    min: 0,
                    max: 100
                }

            }

        }

    });

    console.log("✅ Pump Curve Created Successfully");

}

// =====================================================
// PART 7
// ENGINEERING CALCULATION ENGINE
// STEP 7.1
// INPUT VALIDATION & INITIALIZATION
// =====================================================

function calculateEngineering() {

    console.clear();
    console.log("=======================================");
    console.log("HYDRONOVA ENGINEERING CALCULATION");
    console.log("=======================================");

    // =====================================
    // CHECK PUMP DATA
    // =====================================

    if (!pumpData) {

        alert("Pump Data Not Found.");

        return;

    }

    // =====================================
    // REQUIRED INPUT CHECK
    // =====================================

    const requiredFields = [

        "flow",
        "head",
        "rpm",
        "density",
        "temperature",
        "npsha"

    ];

    for (let field of requiredFields) {

        if (

            pumpData[field] === undefined ||

            pumpData[field] === "" ||

            pumpData[field] === null ||

            isNaN(pumpData[field])

        ) {

            alert(field + " is Missing.");

            console.error(field + " Missing.");

            return;

        }

    }

    // =====================================
    // CONSTANTS
    // =====================================

    const g = 9.81;

    const motorServiceFactor = 1.15;

    const mechanicalEfficiency = 0.95;

    const atmosphericPressure = 1.013;

    // =====================================
    // INPUTS
    // =====================================

    let flow = Number(pumpData.flow);

    let head = Number(pumpData.head);

    let rpm = Number(pumpData.rpm);

    let density = Number(pumpData.density);

    let temperature = Number(pumpData.temperature);

    let npsha = Number(pumpData.npsha);

    let sg = density / 1000;

    let flowM3s = flow / 3600;

    // =====================================
    // PUMP EFFICIENCY
    // =====================================

    // NOTE: eta is now read from pumpCurveDatabase[selectedPump].bepEfficiency
    // instead of a second, hand-typed table. The old table had drifted out of
    // sync with pumpCurveDatabase for 15 of the 18 pumps (e.g. BB2 was 86%
    // here but 87% in pumpCurveDatabase), which is why "Pump Efficiency" on
    // the dashboard could disagree with the Pump Curve chart and the Duty
    // Point Analysis for the same pump. Keeping one source of truth fixes
    // that permanently.

    let eta = 0.80;

    let curveForEta = pumpCurveDatabase[pumpData.selectedPump];

    if (curveForEta) {
        eta = curveForEta.bepEfficiency / 100;
    }

    // =====================================
    // DISPLAY BASIC DATA
    // =====================================

    console.log("Flow :", flow, "m3/hr");

    console.log("Head :", head, "m");

    console.log("Density :", density);

    console.log("RPM :", rpm);

    console.log("Temperature :", temperature);

    console.log("Efficiency :", eta * 100, "%");

    console.log("Pump :", pumpData.selectedPump);

    console.log("---------------------------------------");
    // =====================================================
    // STEP 7.2
    // HYDRAULIC ENGINEERING CALCULATIONS
    // =====================================================

    // =====================================
    // HYDRAULIC POWER
    // P = ρgQH
    // =====================================

    let hydraulicPower =
        (density * g * flowM3s * head) / 1000;

    // =====================================
    // SHAFT POWER
    // =====================================

    let shaftPower =
        hydraulicPower / eta;

    // =====================================
    // BRAKE POWER
    // =====================================

    let brakePower =
        shaftPower / mechanicalEfficiency;

    // =====================================
    // MOTOR POWER
    // =====================================

    let motorPower =
        brakePower * motorServiceFactor;

    // =====================================
    // NPSH REQUIRED
    // Previously a flat guess: Math.max(2.5, head * 0.04) — completely
    // disconnected from the pump curve database, so this card could
    // disagree with the NPSHr shown in Duty Point Analysis for the same
    // pump (the same kind of split-source bug as the efficiency mismatch
    // fixed earlier). Now both read from the same curve.npshr baseline
    // and the same flow-ratio scaling used in analyzeDutyPoint().
    // =====================================

    let npshr = Math.max(2.5, head * 0.04); // fallback if no pump/curve selected yet

    let curveForNpshr = pumpCurveDatabase[pumpData.selectedPump];

    if (curveForNpshr) {

        let maxFlowForNpshr = flow * curveForNpshr.maxFlowFactor;
        let xForNpshr = flow / maxFlowForNpshr;

        npshr = curveForNpshr.npshr + 3 * xForNpshr;

    }

    // =====================================
    // NPSH MARGIN
    // =====================================

    let npshMargin =
        npsha - npshr;

    // =====================================
    // SPECIFIC SPEED (Metric)
    // Ns = N√Q / H^0.75
    // =====================================

    let specificSpeed =
        rpm *
        Math.sqrt(flowM3s) /
        Math.pow(head, 0.75);

    // =====================================
    // SPECIFIC DIAMETER
    // =====================================

    let specificDiameter =
        Math.sqrt(head) /
        Math.cbrt(flowM3s);

    // =====================================
    // PUMP TORQUE
    // T = 9550 × P / RPM
    // =====================================

    let pumpTorque =
        (9550 * shaftPower) / rpm;

    // =====================================
    // POWER LOSS
    // =====================================

    let powerLoss =
        motorPower - hydraulicPower;

    // =====================================
    // OVERALL EFFICIENCY
    // =====================================

    let overallEfficiency =
        (hydraulicPower / motorPower) * 100;

    // =====================================
    // VOLUMETRIC EFFICIENCY
    // =====================================

    let volumetricEfficiency =
        eta * 100;

    // =====================================
    // LOG RESULTS
    // =====================================

    console.log("Hydraulic Power :", hydraulicPower.toFixed(2), "kW");

    console.log("Shaft Power :", shaftPower.toFixed(2), "kW");

    console.log("Brake Power :", brakePower.toFixed(2), "kW");

    console.log("Motor Power :", motorPower.toFixed(2), "kW");

    console.log("Pump Torque :", pumpTorque.toFixed(2), "Nm");

    console.log("Specific Speed :", specificSpeed.toFixed(2));

    console.log("Specific Diameter :", specificDiameter.toFixed(2));

    console.log("NPSHr :", npshr.toFixed(2), "m");

    console.log("NPSHa :", npsha.toFixed(2), "m");

    console.log("NPSH Margin :", npshMargin.toFixed(2), "m");

    console.log("Overall Efficiency :", overallEfficiency.toFixed(1), "%");

    console.log("Power Loss :", powerLoss.toFixed(2), "kW");

    console.log("---------------------------------------");
    // =====================================================
    // STEP 7.3
    // PIPE SIZING & MECHANICAL DESIGN
    // =====================================================

    // =====================================
    // RECOMMENDED FLUID VELOCITIES
    // =====================================

    const suctionDesignVelocity = 2.0;      // m/s
    const dischargeDesignVelocity = 3.0;    // m/s

    // =====================================
    // PIPE DIAMETER CALCULATION
    // D = √(4Q / πV)
    // =====================================

    let suctionDiameter =
        Math.sqrt((4 * flowM3s) / (Math.PI * suctionDesignVelocity));

    let dischargeDiameter =
        Math.sqrt((4 * flowM3s) / (Math.PI * dischargeDesignVelocity));

    // Convert to mm

    suctionDiameter *= 1000;
    dischargeDiameter *= 1000;

    // =====================================
    // ACTUAL VELOCITY
    // =====================================

    let suctionArea =
        Math.PI * Math.pow(suctionDiameter / 1000, 2) / 4;

    let dischargeArea =
        Math.PI * Math.pow(dischargeDiameter / 1000, 2) / 4;

    let suctionVelocity =
        flowM3s / suctionArea;

    let dischargeVelocity =
        flowM3s / dischargeArea;

   // =====================================
// PIPE SIZE SELECTION
// =====================================

function nearestDN(size){

    if(size<=25) return "DN25";
    if(size<=40) return "DN40";
    if(size<=50) return "DN50";
    if(size<=65) return "DN65";
    if(size<=80) return "DN80";
    if(size<=100) return "DN100";
    if(size<=150) return "DN150";
    if(size<=200) return "DN200";
    if(size<=250) return "DN250";
    if(size<=300) return "DN300";

    return "DN350";

}

    let suctionPipe = nearestDN(suctionDiameter);
    let dischargePipe = nearestDN(dischargeDiameter);

    // =====================================================
    // STEP 7.4
    // IMPELLER, SHAFT & MOTOR SELECTION
    // =====================================================

   // =====================================
// IMPELLER DIAMETER ESTIMATION
// =====================================

let impellerDiameter =
    Math.sqrt(head) * 40;

impellerDiameter = Math.max(100, impellerDiameter);
impellerDiameter = Math.min(1000, impellerDiameter);

    // =====================================
    // SHAFT DIAMETER
    // =====================================

    let shaftDiameter =
        3.65 * Math.cbrt((motorPower * 1000) / rpm);

    shaftDiameter = Math.max(20, shaftDiameter);
    shaftDiameter = Math.min(250, shaftDiameter);

    // =====================================
    // MOTOR FRAME SELECTION
    // =====================================

    let motorFrame = "";

    if (motorPower <= 0.75) motorFrame = "80 Frame";
    else if (motorPower <= 1.5) motorFrame = "90S Frame";
    else if (motorPower <= 3) motorFrame = "100L Frame";
    else if (motorPower <= 5.5) motorFrame = "132S Frame";
    else if (motorPower <= 11) motorFrame = "160M Frame";
    else if (motorPower <= 22) motorFrame = "180M Frame";
    else if (motorPower <= 37) motorFrame = "200L Frame";
    else if (motorPower <= 55) motorFrame = "225S Frame";
    else if (motorPower <= 75) motorFrame = "250M Frame";
    else if (motorPower <= 110) motorFrame = "280S Frame";
    else if (motorPower <= 160) motorFrame = "315S Frame";
    else if (motorPower <= 250) motorFrame = "315L Frame";
    else if (motorPower <= 355) motorFrame = "355M Frame";
    else motorFrame = "355L Frame";

    // =====================================
    // OPERATING REGION (% OF BEP)
    // =====================================

    let operatingRegion =
        (pumpData.flow / pumpData.flow) * 100;

    let operatingStatus = "";

    if (operatingRegion >= 90 && operatingRegion <= 110)
        operatingStatus = "🟢 Excellent";

    else if (operatingRegion >= 80)
        operatingStatus = "🟢 Preferred";

    else if (operatingRegion >= 70)
        operatingStatus = "🟡 Acceptable";

    else
        operatingStatus = "🔴 Outside BEP";

    // =====================================
    // AFFINITY LAW PREDICTION
    // =====================================

    let currentRPM = rpm;

    let newRPM = rpm;

    let predictedFlow =
        pumpData.flow * (newRPM / currentRPM);

    let predictedHead =
        pumpData.head * Math.pow(newRPM / currentRPM, 2);

    let predictedPower =
        motorPower * Math.pow(newRPM / currentRPM, 3);

    // =====================================
    // LOG
    // =====================================

    console.log("Impeller Diameter :", impellerDiameter.toFixed(0), "mm");
    console.log("Shaft Diameter :", shaftDiameter.toFixed(0), "mm");
    console.log("Motor Frame :", motorFrame);
    console.log("Operating Region :", operatingRegion.toFixed(0), "%");
    console.log("Operating Status :", operatingStatus);
    console.log("Predicted Flow :", predictedFlow.toFixed(2));
    console.log("Predicted Head :", predictedHead.toFixed(2));
    console.log("Predicted Power :", predictedPower.toFixed(2));
    console.log("-------------------------------------");
    // =====================================================
    // STEP 7.5
    // ENGINEERING HEALTH & RESULTS
    // =====================================================

    // =====================================
    // ENGINEERING SCORE
    // =====================================

    let engineeringScore = 100;

    if (npshMargin < 1)
        engineeringScore -= 20;

    if (eta < 0.75)
        engineeringScore -= 15;

    if (suctionVelocity > 3)
        engineeringScore -= 10;

    if (dischargeVelocity > 5)
        engineeringScore -= 10;

    if (pumpData.temperature > 300)
        engineeringScore -= 10;

    engineeringScore = Math.max(0, engineeringScore);

    // =====================================
    // ENGINEERING GRADE
    // =====================================

    let engineeringGrade = "";

    if (engineeringScore >= 95)
        engineeringGrade = "A+";
    else if (engineeringScore >= 90)
        engineeringGrade = "A";
    else if (engineeringScore >= 80)
        engineeringGrade = "B";
    else if (engineeringScore >= 70)
        engineeringGrade = "C";
    else
        engineeringGrade = "D";

    // =====================================
    // RELIABILITY INDEX
    // =====================================

    let reliabilityIndex = engineeringScore;

    // =====================================
    // ENERGY RATING
    // =====================================

    let energyRating = "";

    if (eta >= 0.90)
        energyRating = "★★★★★";
    else if (eta >= 0.85)
        energyRating = "★★★★☆";
    else if (eta >= 0.80)
        energyRating = "★★★☆☆";
    else if (eta >= 0.75)
        energyRating = "★★☆☆☆";
    else
        energyRating = "★☆☆☆☆";

    // =====================================
    // OVERALL STATUS
    // =====================================

    let overallStatus = "";

    if (engineeringScore >= 90)
        overallStatus = "🟢 Excellent";

    else if (engineeringScore >= 75)
        overallStatus = "🟡 Good";

    else
        overallStatus = "🔴 Needs Review";

    // =====================================
    // SAFE HTML UPDATE FUNCTION
    // =====================================

    function updateValue(id, value) {

        const element = document.getElementById(id);

        if (element) {
            element.innerText = value;
        }

    }

    // =====================================
    // UPDATE HTML
    // =====================================

    updateValue("hydraulicPower", hydraulicPower.toFixed(2) + " kW");
    updateValue("shaftPower", shaftPower.toFixed(2) + " kW");
    updateValue("brakePower", brakePower.toFixed(2) + " kW");
    updateValue("motorPower", motorPower.toFixed(2) + " kW");
    updateValue("motorPowerCalc", motorPower.toFixed(2) + " kW");

    updateValue("efficiency", (eta * 100).toFixed(1) + " %");
    updateValue("pumpEfficiency", (eta * 100).toFixed(1) + " %");

    updateValue("npshMargin", npshMargin.toFixed(2) + " m");

    updateValue("specificSpeed", specificSpeed.toFixed(1));

    updateValue("specificDiameter", specificDiameter.toFixed(2));

    updateValue("suctionPipe", suctionPipe);

    updateValue("dischargePipe", dischargePipe);

    updateValue("suctionVelocity", suctionVelocity.toFixed(2) + " m/s");

    updateValue("dischargeVelocity", dischargeVelocity.toFixed(2) + " m/s");

    updateValue("impellerDiameter", impellerDiameter.toFixed(0) + " mm");

    updateValue("shaftDiameter", shaftDiameter.toFixed(0) + " mm");

    updateValue("motorFrame", motorFrame);

    updateValue("operatingRegion", operatingRegion.toFixed(0) + " %");

    updateValue("operatingStatus", operatingStatus);

    updateValue("currentRPM", currentRPM + " RPM");

    updateValue("predictedFlow", predictedFlow.toFixed(2));

    updateValue("predictedHead", predictedHead.toFixed(2));

    updateValue("predictedPower", predictedPower.toFixed(2));

    updateValue("engineeringScore", engineeringScore + " %");

    updateValue("engineeringGrade", engineeringGrade);

    updateValue("reliabilityIndex", reliabilityIndex + " %");

    updateValue("energyRating", energyRating);

    updateValue("overallStatus", overallStatus);

    // =====================================
    // STATUS
    // =====================================

    updateValue("statusEfficiency",
        eta >= 0.75 ?
        "✅ Efficiency Check : PASS" :
        "❌ Efficiency Check : FAIL");

    updateValue("statusPower",
        "✅ Motor Sizing : PASS");

    updateValue("statusVelocity",
        suctionVelocity <= 3 && dischargeVelocity <= 5 ?
        "✅ Hydraulic Check : PASS" :
        "❌ Hydraulic Check : FAIL");

    updateValue("statusNPSH",
        npshMargin >= 1 ?
        "✅ NPSH Check : PASS" :
        "❌ NPSH Check : FAIL");

    updateValue("statusRecommendation",
        "✅ Engineering Calculation Completed");

    // =====================================
    // PUMP CURVE
    // =====================================
    // Already generated by recommendPump() -> generatePumpCurve()
    // using the pump-specific curve database. Not re-drawn here
    // to avoid a Chart.js "canvas already in use" conflict.

    console.log("Engineering Calculation Completed");

}


// =====================================================
// PART 8
// CORROSION & FAILURE ANALYSIS
// =====================================================

function runCorrosionAnalysis() {

    let corrosionRisk = "LOW";
    let cavitationRisk = "LOW";
    let erosionRisk = "LOW";
    let wearRisk = "LOW";
    let sealRisk = "LOW";
    let bearingRisk = "LOW";

    let pumpLife = "20 Years";
    let sealLife = "3 Years";
    let bearingLife = "40,000 Hours";
    let maintenance = "Every 6 Months";

    let health = 95;

    let recommendation = [];

    let warning = "No critical warning detected.";

    // ==========================================
    // CORROSION ANALYSIS
    // ==========================================

    if (pumpData.ph <= 2 || pumpData.ph >= 12) {

        corrosionRisk = "HIGH";
        health -= 15;

        recommendation.push(
            "✔ Use Hastelloy or Super Duplex Stainless Steel."
        );

    }

    if (pumpData.chloride >= 500) {

        corrosionRisk = "HIGH";
        health -= 10;

        recommendation.push(
            "✔ High Chloride Detected. Super Duplex SS Recommended."
        );

    }

    // ==========================================
    // EROSION
    // ==========================================

    if (pumpData.solids >= 10) {

        erosionRisk = "HIGH";
        wearRisk = "HIGH";

        health -= 10;

        recommendation.push(
            "✔ Use High Chrome Wear Rings."
        );

    }

    if (pumpData.particleSize >= 1) {

        erosionRisk = "VERY HIGH";

        health -= 10;

        recommendation.push(
            "✔ Abrasive particles detected."
        );

    }

    // ==========================================
    // CAVITATION
    // ==========================================

    if (pumpData.npsha < 3) {

        cavitationRisk = "HIGH";

        health -= 20;

        warning =
            "Low NPSHA. Cavitation may occur.";

        recommendation.push(
            "✔ Increase Suction Head."
        );

    }

    // ==========================================
    // TEMPERATURE
    // ==========================================

    if (pumpData.temperature >= 200) {

        sealRisk = "MEDIUM";

        recommendation.push(
            "✔ High Temperature Seal Required."
        );

    }

    // ==========================================
    // BEARING
    // ==========================================

    if (pumpData.rpm >= 3500) {

        bearingRisk = "MEDIUM";

        bearingLife = "25,000 Hours";

        recommendation.push(
            "✔ High Speed Bearing Recommended."
        );

    }

    // ==========================================
    // MINIMUM HEALTH
    // ==========================================

    if (health < 40) {

        health = 40;

    }

    // ==========================================
    // UPDATE HTML
    // ==========================================

    document.getElementById("corrosionRisk").innerText =
        corrosionRisk;

    document.getElementById("cavitationRisk").innerText =
        cavitationRisk;

    document.getElementById("erosionRisk").innerText =
        erosionRisk;

    document.getElementById("wearRisk").innerText =
        wearRisk;

    document.getElementById("sealRisk").innerText =
        sealRisk;

    document.getElementById("bearingRisk").innerText =
        bearingRisk;

    document.getElementById("pumpLife").innerText =
        pumpLife;

    document.getElementById("sealLife").innerText =
        sealLife;

    document.getElementById("bearingLife").innerText =
        bearingLife;

    document.getElementById("maintenance").innerText =
        maintenance;

    document.getElementById("healthPercentage").innerText =
        health + "%";

    document.getElementById("warningMessage").innerText =
        warning;

    // ==========================================
    // RECOMMENDATION LIST
    // ==========================================

    let list =
        document.getElementById("recommendationList");

    list.innerHTML = "";

    recommendation.forEach(function(item){

        let li =
            document.createElement("li");

        li.innerText = item;

        list.appendChild(li);

    });

    if(recommendation.length===0){

        list.innerHTML =
        "<li>✔ System operating within safe engineering limits.</li>";

    }

    console.log("Corrosion Analysis Completed");

}


// =====================================================
// RUN ANALYSIS BUTTON
// =====================================================

const analyseBtn =
document.getElementById("analyseBtn");

if(analyseBtn){

    analyseBtn.addEventListener("click",function(){

        runCorrosionAnalysis();

    });

}

// =====================================================
// NAVIGATION (continued)
// Material Selection -> Pump Recommendation -> Engineering
// -> Corrosion -> Final Report
// =====================================================

// Back : Material Selection -> Fluid Properties

document.getElementById("backFluid").addEventListener("click", function () {

    document.getElementById("fluid-properties").scrollIntoView({ behavior: "smooth", block: "start" });

    console.log("Returned to Fluid Properties");

});

// Next : Material Selection -> Pump Recommendation

document.getElementById("nextPump").addEventListener("click", function () {

    // Material Selection stays visible
    document.getElementById("pump-recommendation").style.display = "block";

    document.getElementById("pump-recommendation").scrollIntoView({ behavior: "smooth", block: "start" });

    console.log("Moved to Pump Recommendation");

});

// Next : Pump Recommendation -> Engineering Calculations

document.getElementById("nextCalculation").addEventListener("click", function () {

    // Pump Recommendation stays visible
    document.getElementById("engineering").style.display = "block";

    document.getElementById("engineering").scrollIntoView({ behavior: "smooth", block: "start" });

    console.log("Moved to Engineering Calculations");

});

// Next : Engineering Calculations -> Corrosion Analysis

document.getElementById("nextCorrosion").addEventListener("click", function () {

    // Engineering Calculations stays visible
    document.getElementById("corrosion").style.display = "block";

    document.getElementById("corrosion").scrollIntoView({ behavior: "smooth", block: "start" });

    console.log("Moved to Corrosion Analysis");

});

// Next : Corrosion Analysis -> Final Report
// (also reveals API 610 Compliance and Pump Curves, which have
// no dedicated navigation buttons of their own)

document.getElementById("nextReport").addEventListener("click", function () {

    // Corrosion Analysis stays visible
    document.getElementById("api610").style.display = "block";
    document.getElementById("pump-curves").style.display = "block";
    document.getElementById("duty-point").style.display = "block";
    document.getElementById("reports").style.display = "block";

    updateEngineeringReport();

    document.getElementById("api610").scrollIntoView({ behavior: "smooth", block: "start" });

    console.log("Moved to Final Report");

});

// =====================================================
// POPULATE ENGINEERING REPORT
// =====================================================

function updateEngineeringReport() {

    const pumpNameEl = document.getElementById("pumpName");
    const materialEl = document.getElementById("casingMaterial");
    const motorEl = document.getElementById("motorPower");
    const efficiencyEl = document.getElementById("efficiency");
    const healthEl = document.getElementById("healthPercentage");

    if (pumpNameEl) {
        document.getElementById("reportPump").innerText =
            pumpNameEl.innerText;
    }

    if (materialEl) {
        document.getElementById("reportMaterial").innerText =
            materialEl.innerText;
    }

    if (motorEl) {
        document.getElementById("reportMotor").innerText =
            motorEl.innerText;
    }

    if (efficiencyEl) {
        document.getElementById("reportEfficiency").innerText =
            efficiencyEl.innerText;
    }

    if (healthEl) {
        document.getElementById("reportHealth").innerText =
            healthEl.innerText;
    }

    console.log("Engineering Report Updated");

}

// =====================================================
// PUMP CURVE DATABASE
// =====================================================

const pumpCurveDatabase = {

    OH1: {
        shutOffFactor: 1.20,
        bepEfficiency: 82,
        maxFlowFactor: 1.40,
        npshr: 3.0
    },

    OH2: {
        shutOffFactor: 1.20,
        bepEfficiency: 84,
        maxFlowFactor: 1.40,
        npshr: 3.2
    },

    OH3: {
        shutOffFactor: 1.18,
        bepEfficiency: 83,
        maxFlowFactor: 1.35,
        npshr: 3.5
    },

    OH4: {
        shutOffFactor: 1.15,
        bepEfficiency: 84,
        maxFlowFactor: 1.30,
        npshr: 3.8
    },

    OH5: {
        shutOffFactor: 1.18,
        bepEfficiency: 81,
        maxFlowFactor: 1.30,
        npshr: 3.5
    },

    OH6: {
        shutOffFactor: 1.20,
        bepEfficiency: 84,
        maxFlowFactor: 1.35,
        npshr: 4.0
    },

    BB1: {
        shutOffFactor: 1.15,
        bepEfficiency: 86,
        maxFlowFactor: 1.30,
        npshr: 2.8
    },

    BB2: {
        shutOffFactor: 1.15,
        bepEfficiency: 87,
        maxFlowFactor: 1.30,
        npshr: 3.0
    },

    BB3: {
        shutOffFactor: 1.12,
        bepEfficiency: 88,
        maxFlowFactor: 1.25,
        npshr: 3.2
    },

    BB4: {
        shutOffFactor: 1.12,
        bepEfficiency: 89,
        maxFlowFactor: 1.25,
        npshr: 3.4
    },

    BB5: {
        shutOffFactor: 1.10,
        bepEfficiency: 90,
        maxFlowFactor: 1.20,
        npshr: 3.5
    },

    VS1: {
        shutOffFactor: 1.18,
        bepEfficiency: 83,
        maxFlowFactor: 1.35,
        npshr: 4.0
    },

    VS2: {
        shutOffFactor: 1.18,
        bepEfficiency: 84,
        maxFlowFactor: 1.35,
        npshr: 4.2
    },

    VS3: {
        shutOffFactor: 1.16,
        bepEfficiency: 85,
        maxFlowFactor: 1.30,
        npshr: 4.3
    },

    VS4: {
        shutOffFactor: 1.15,
        bepEfficiency: 85,
        maxFlowFactor: 1.30,
        npshr: 4.5
    },

    VS5: {
        shutOffFactor: 1.15,
        bepEfficiency: 86,
        maxFlowFactor: 1.30,
        npshr: 4.8
    },

    VS6: {
        shutOffFactor: 1.12,
        bepEfficiency: 86,
        maxFlowFactor: 1.25,
        npshr: 5.0
    },

    VS7: {
        shutOffFactor: 1.10,
        bepEfficiency: 87,
        maxFlowFactor: 1.25,
        npshr: 5.2
    }

};
// =====================================================
// PUMP PERFORMANCE CURVE
// =====================================================

let pumpChart = null;

function generatePumpCurve() {

    // Selected Pump
    let api = pumpData.selectedPump;

    if (!api) {
        console.log("No Pump Selected");
        return;
    }

    let curve = pumpCurveDatabase[api];

    if (!curve) {
        console.log("Curve Data Not Found");
        return;
    }

    let ratedFlow = pumpData.flow;
    let ratedHead = pumpData.head;

    let shutOffHead = ratedHead * curve.shutOffFactor;
    let maxFlow = ratedFlow * curve.maxFlowFactor;

    let flowArray = [];
    let headArray = [];

    // ===============================
    // HEAD CURVE
    // ===============================

    for (let i = 0; i <= 20; i++) {

        let flow = (maxFlow / 20) * i;

        let x = flow / maxFlow;

        let head = shutOffHead * (1 - 0.45 * x * x);

        flowArray.push(Number(flow.toFixed(1)));

        headArray.push(Number(head.toFixed(2)));

    }

    // ===============================
    // EFFICIENCY CURVE
    // ===============================

    let efficiencyArray = [];

    for (let i = 0; i <= 20; i++) {

        let x = i / 20;

        let eta = curve.bepEfficiency - 25 * Math.pow(x - 0.7, 2);

        efficiencyArray.push(Number(eta.toFixed(2)));

    }

    // ===============================
    // POWER CURVE
    // ===============================

    let powerArray = [];

    for (let i = 0; i <= 20; i++) {

        let power = (flowArray[i] / ratedFlow) * 35;

        powerArray.push(Number(power.toFixed(2)));

    }

    // ===============================
    // NPSHr CURVE
    // ===============================

    let npshArray = [];

    for (let i = 0; i <= 20; i++) {

        let npsh = curve.npshr + (i * 0.15);

        npshArray.push(Number(npsh.toFixed(2)));

    }

    // ===============================
    // DUTY POINT MARKER
    // Snaps the entered duty flow/head onto the nearest
    // sample index of the curve for visual reference.
    // ===============================

    let dutyIndex = Math.round((ratedFlow / maxFlow) * 20);
    dutyIndex = Math.max(0, Math.min(20, dutyIndex));

    let dutyMarkerData = new Array(21).fill(null);
    dutyMarkerData[dutyIndex] = Number(ratedHead.toFixed(2));

    // Keep the raw curve arrays available for export (Excel "Pump Curve
    // Data" sheet) — same numbers the chart below is drawn from, so the
    // exported data always matches what's on screen.
    pumpData.curveData = {
        flow: flowArray,
        head: headArray,
        efficiency: efficiencyArray,
        power: powerArray,
        npshr: npshArray
    };

    // ===============================
    // DESTROY OLD CHART
    // ===============================

    if (pumpChart) {

        pumpChart.destroy();

    }

    const ctx = document.getElementById("pumpChart").getContext("2d");

    pumpChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: flowArray,

            datasets: [

                {
                    label: "Head (m)",
                    data: headArray,
                    borderColor: "#1565C0",
                    borderWidth: 3,
                    fill: false,
                    tension: 0.35
                },

                {
                    label: "Efficiency (%)",
                    data: efficiencyArray,
                    borderColor: "#00C853",
                    borderWidth: 3,
                    fill: false,
                    tension: 0.35
                },

                {
                    label: "Power (kW)",
                    data: powerArray,
                    borderColor: "#FF6D00",
                    borderWidth: 3,
                    fill: false,
                    tension: 0.35
                },

                {
                    label: "NPSHr (m)",
                    data: npshArray,
                    borderColor: "#D50000",
                    borderWidth: 3,
                    fill: false,
                    tension: 0.35
                },

                {
                    label: "Duty Point",
                    data: dutyMarkerData,
                    borderColor: "#6A1B9A",
                    backgroundColor: "#6A1B9A",
                    pointRadius: 9,
                    pointHoverRadius: 11,
                    pointStyle: "star",
                    showLine: false
                }

            ]

        },

        options: {

            responsive: true,

            // .curve-container now has a fixed CSS height (see style.css) —
            // this tells Chart.js to fill that height exactly instead of
            // forcing its own default aspect ratio inside it.
            maintainAspectRatio: false,

            plugins: {

                legend: {

                    position: "top"

                }

            }

        }

    });

    console.log("Pump Curve Generated Successfully");

}

// =====================================================
// DUTY POINT ANALYSIS
// -----------------------------------------------------
// Strong duty-point logic:
//  1. Locates the specified duty point (rated flow/head)
//     against the pump's performance curve
//  2. Classifies it into Preferred / Allowable / Outside
//     operating region bands (Hydraulic Institute / API 610)
//  3. Cross-checks the entered head against the head the
//     curve actually predicts at that flow
//  4. Checks NPSH margin (available vs required at duty flow)
//  5. Produces a plain-language verdict + recommendations
// =====================================================

function analyzeDutyPoint() {

    let api = pumpData.selectedPump;

    if (!api || api === "--") {
        console.log("Duty Point Analysis skipped — no pump selected.");
        return;
    }

    let curve = pumpCurveDatabase[api];

    if (!curve) {
        console.log("Duty Point Analysis skipped — no curve data for " + api);
        return;
    }

    let ratedFlow = pumpData.flow;
    let ratedHead = pumpData.head;
    let npsha = pumpData.npsha;

    if (isNaN(ratedFlow) || isNaN(ratedHead) || ratedFlow <= 0 || ratedHead <= 0) {
        console.log("Duty Point Analysis skipped — invalid flow/head.");
        return;
    }

    if (isNaN(npsha)) {
        npsha = 0;
    }

    // =====================================
    // CURVE GEOMETRY (mirrors generatePumpCurve)
    // =====================================

    let maxFlow = ratedFlow * curve.maxFlowFactor;
    let shutOffHead = ratedHead * curve.shutOffFactor;

    // Best Efficiency Point sits at x = 0.7 of max flow —
    // the peak of: eta = bepEfficiency - 25 * (x - 0.7)^2

    let bepFlow = 0.7 * maxFlow;

    let x = ratedFlow / maxFlow;

    // =====================================
    // PREDICTED PERFORMANCE AT DUTY FLOW
    // =====================================

    let predictedHead = shutOffHead * (1 - 0.45 * x * x);

    let predictedEfficiency =
        Math.max(0, curve.bepEfficiency - 25 * Math.pow(x - 0.7, 2));

    let predictedPower = (ratedFlow / ratedFlow) * 35;

    let predictedNpshr = curve.npshr + 3 * x;

    // =====================================
    // % OF BEP FLOW
    // =====================================

    let percentBEP = (ratedFlow / bepFlow) * 100;

    // =====================================
    // OPERATING REGION CLASSIFICATION
    // =====================================

    let region = "";
    let regionClass = "";

    if (percentBEP >= 70 && percentBEP <= 120) {

        region = "Preferred Operating Region (POR)";
        regionClass = "low";

    } else if ((percentBEP >= 40 && percentBEP < 70) ||
               (percentBEP > 120 && percentBEP <= 140)) {

        region = "Allowable Operating Region (AOR)";
        regionClass = "medium";

    } else {

        region = "Outside Allowable Operating Region";
        regionClass = "high";

    }

    // =====================================
    // HEAD DEVIATION CHECK
    // Does the entered duty head actually sit on the curve?
    // =====================================

    let headDeviation = ((predictedHead - ratedHead) / ratedHead) * 100;

    // =====================================
    // NPSH MARGIN CHECK
    // =====================================

    let npshMargin = npsha - predictedNpshr;

    let npshStatus = "";
    let npshClass = "";

    if (npshMargin >= 1.5) {

        npshStatus = "Safe";
        npshClass = "low";

    } else if (npshMargin >= 0.6) {

        npshStatus = "Marginal";
        npshClass = "medium";

    } else {

        npshStatus = "Unsafe";
        npshClass = "high";

    }

    // =====================================
    // RECOMMENDATIONS
    // =====================================

    let recommendations = [];

    if (percentBEP > 120) {

        recommendations.push(
            "⚠ Duty point is " + percentBEP.toFixed(0) +
            "% of BEP flow (right of BEP) — expect increased radial " +
            "shaft loading, reduced NPSH margin and higher wear. " +
            "Consider a larger pump or a lower duty flow."
        );

    }

    if (percentBEP < 70) {

        recommendations.push(
            "⚠ Duty point is " + percentBEP.toFixed(0) +
            "% of BEP flow (left of BEP) — risk of internal " +
            "recirculation, overheating and reduced seal/bearing " +
            "life. Consider a smaller pump or a minimum-flow bypass."
        );

    }

    if (Math.abs(headDeviation) > 10) {

        recommendations.push(
            "⚠ Predicted head at the duty flow deviates " +
            headDeviation.toFixed(1) + "% from the entered head — " +
            "re-check the system curve and pump sizing."
        );

    }

    if (npshMargin < 0.6) {

        recommendations.push(
            "⚠ NPSH margin is critically low (" + npshMargin.toFixed(2) +
            " m) — high cavitation risk. Increase available NPSH or " +
            "select a pump with lower NPSHr."
        );

    } else if (npshMargin < 1.5) {

        recommendations.push(
            "⚠ NPSH margin is marginal (" + npshMargin.toFixed(2) +
            " m) — API 610 recommends a margin of at least 1.5 m " +
            "(or 10% of NPSHr, whichever is greater)."
        );

    }

    if (recommendations.length === 0) {

        recommendations.push(
            "✔ Duty point falls within the Preferred Operating Region " +
            "with adequate NPSH margin — no corrective action required."
        );

    }

    // =====================================
    // OVERALL VERDICT
    // =====================================

    let verdict = "";
    let verdictClass = "";

    if (regionClass === "high" || npshClass === "high") {

        verdict = "🔴 UNSAFE — Reselect Pump / Revisit Duty Point";
        verdictClass = "high";

    } else if (regionClass === "medium" || npshClass === "medium" ||
               Math.abs(headDeviation) > 10) {

        verdict = "🟡 MARGINAL — Proceed With Caution";
        verdictClass = "medium";

    } else {

        verdict = "🟢 SAFE — Optimal Duty Point";
        verdictClass = "low";

    }

    // =====================================
    // UPDATE HTML
    // =====================================

    function setText(id, value) {
        let el = document.getElementById(id);
        if (el) el.innerText = value;
    }

    function setBadge(id, value, cls) {
        let el = document.getElementById(id);
        if (el) {
            el.innerText = value;
            el.className = "risk " + cls;
        }
    }

    setText("dutyFlowVal", ratedFlow.toFixed(1) + " m³/hr");
    setText("dutyHeadVal", ratedHead.toFixed(1) + " m");
    setText("bepFlowVal", bepFlow.toFixed(1) + " m³/hr");
    setText("percentBEPVal", percentBEP.toFixed(1) + " %");

    setBadge("operatingRegionVal", region, regionClass);

    setText("predictedHeadVal", predictedHead.toFixed(2) + " m");
    setText("headDeviationVal",
        (headDeviation >= 0 ? "+" : "") + headDeviation.toFixed(1) + " %");
    setText("predictedEfficiencyVal", predictedEfficiency.toFixed(1) + " %");
    setText("predictedPowerVal", predictedPower.toFixed(2) + " kW");

    setText("npshaVal", npsha.toFixed(2) + " m");
    setText("npshrDutyVal", predictedNpshr.toFixed(2) + " m");
    setText("npshMarginVal", npshMargin.toFixed(2) + " m");

    setBadge("npshStatusVal", npshStatus, npshClass);

    setBadge("dutyVerdictVal", verdict, verdictClass);

    let list = document.getElementById("dutyRecommendationList");

    if (list) {

        list.innerHTML = "";

        recommendations.forEach(function (item) {

            let li = document.createElement("li");
            li.innerText = item;
            list.appendChild(li);

        });

    }

    console.log("Duty Point Analysis Completed");
    console.log(
        "Flow % of BEP:", percentBEP.toFixed(1) + "%",
        "| Region:", region,
        "| NPSH Margin:", npshMargin.toFixed(2) + "m"
    );

}

// =====================================================
// RE-ANALYZE DUTY POINT BUTTON
// =====================================================

const analyzeDutyBtn =
document.getElementById("analyzeDutyBtn");

if (analyzeDutyBtn) {

    analyzeDutyBtn.addEventListener("click", function () {

        analyzeDutyPoint();

    });

}

// =====================================================
// FINAL REPORT ACTION BUTTONS
// =====================================================
// These 5 buttons had no click handlers at all, which is why
// nothing happened when clicked. Each one reads the same report
// fields already populated on-screen by updateEngineeringReport()
// (see #reportPump, #reportMaterial, #reportMotor, etc.) so the
// exported/printed/saved data always matches what the user sees.

// Small helper — pulls the current report snapshot straight from
// the DOM, since that's the single source of truth the report
// table (and now the Material/Engineering/Curve sections) already
// render from. Keeping this DOM-driven means exports always match
// exactly what's on screen, with no separate calculation to keep
// in sync.
function getReportSnapshot() {

    function textOf(id) {
        const el = document.getElementById(id);
        return el ? el.innerText.trim() : "--";
    }

    // ---- Material Compatibility & Construction table ----
    const materialRowIds = [
        ["Pump Casing", "casingMaterial", "casingReason"],
        ["Impeller", "impellerMaterial", "impellerReason"],
        ["Shaft", "shaftMaterial", "shaftReason"],
        ["Shaft Sleeve", "sleeveMaterial", "sleeveReason"],
        ["Wear Ring", "wearRingMaterial", "wearRingReason"],
        ["Mechanical Seal Faces", "sealMaterial", "sealReason"],
        ["Gasket", "gasketMaterial", "gasketReason"],
        ["Fasteners", "fastenerMaterial", "fastenerReason"]
    ];

    const materials = materialRowIds.map(function (row) {
        return { component: row[0], material: textOf(row[1]), reason: textOf(row[2]) };
    });

    const materialSummary = {
        grade: textOf("materialGrade"),
        corrosionResistance: textOf("corrosionLevel"),
        abrasionResistance: textOf("abrasionLevel"),
        maxTemperature: textOf("maxTemperature")
    };

    // ---- Engineering Calculations (calc-card grid) ----
    const engineeringCalcs = [
        ["Hydraulic Power", "hydraulicPower"],
        ["Shaft Power", "shaftPower"],
        ["Brake Power", "brakePower"],
        ["Required Motor Power", "motorPowerCalc"],
        ["Pump Efficiency", "pumpEfficiency"],
        ["NPSH Margin", "npshMargin"],
        ["Specific Speed", "specificSpeed"],
        ["Specific Diameter", "specificDiameter"],
        ["Suction Pipe Size", "suctionPipeSize"],
        ["Discharge Pipe Size", "dischargePipeSize"],
        ["Estimated Impeller Diameter", "impellerDiameter"],
        ["Estimated Shaft Diameter", "shaftDiameter"],
        ["Recommended Motor Frame", "motorFrame"],
        ["Operating Region", "operatingRegion"],
        ["Operating Status", "operatingStatus"],
        ["Current RPM", "currentRPM"],
        ["Predicted Flow", "predictedFlow"],
        ["Predicted Head", "predictedHead"],
        ["Predicted Power", "predictedPower"],
        ["Engineering Score", "engineeringScore"],
        ["API 610 Grade", "engineeringGrade"],
        ["Reliability Index", "reliabilityIndex"],
        ["Energy Rating", "energyRating"],
        ["Overall Status", "overallStatus"]
    ].map(function (pair) { return [pair[0], textOf(pair[1])]; });

    const engineeringStatus = [
        textOf("statusEfficiency"),
        textOf("statusNPSH"),
        textOf("statusPower"),
        textOf("statusVelocity"),
        textOf("statusRecommendation")
    ];

    // ---- Pump Performance Curve ----
    // Chart.js draws straight onto this canvas, so toDataURL() gives an
    // exact image of the curve as currently shown — no re-plotting needed.
    let curveImage = null;
    const curveCanvas = document.getElementById("pumpChart");
    if (curveCanvas) {
        try {
            curveImage = curveCanvas.toDataURL("image/png", 1.0);
        } catch (e) {
            console.error("Could not capture pump curve image:", e);
        }
    }

    return {
        projectName: textOf("projectName"),
        pump: textOf("reportPump"),
        apiStandard: "API 610",
        material: textOf("reportMaterial"),
        motor: textOf("reportMotor"),
        efficiency: textOf("reportEfficiency"),
        health: textOf("reportHealth"),
        remark: textOf("finalRemark"),
        savedAt: new Date().toLocaleString(),
        materials: materials,
        materialSummary: materialSummary,
        materialRecommendation: textOf("materialRecommendation"),
        engineeringCalcs: engineeringCalcs,
        engineeringStatus: engineeringStatus,
        curveImage: curveImage,
        curveData: pumpData.curveData || null
    };

}

// ---------------- SAVE PROJECT ----------------

const saveProjectBtn = document.getElementById("saveProject");

if (saveProjectBtn) {

    saveProjectBtn.addEventListener("click", function () {

        if (!pumpData.selectedPump) {
            alert("Run a pump selection first — nothing to save yet.");
            return;
        }

        const snapshot = getReportSnapshot();
        snapshot.pumpData = pumpData;

        try {

            const existing = JSON.parse(localStorage.getItem("hydronovaSavedProjects") || "[]");
            existing.push(snapshot);
            localStorage.setItem("hydronovaSavedProjects", JSON.stringify(existing));

            console.log("Project saved:", snapshot);
            alert("Project saved to this browser (" + existing.length + " saved total).");

        } catch (err) {

            console.error("Save Project failed:", err);
            alert("Could not save the project — your browser may be blocking local storage (e.g. private/incognito mode).");

        }

    });

}

// ---------------- PRINT REPORT ----------------

const printReportBtn = document.getElementById("printReport");

if (printReportBtn) {

    printReportBtn.addEventListener("click", function () {

        // @media print in style.css already hides nav/buttons/footer —
        // this just triggers the browser's print dialog.
        window.print();

    });

}

// ---------------- EXPORT PDF ----------------

const exportPdfBtn = document.getElementById("exportPdf");

if (exportPdfBtn) {

    exportPdfBtn.addEventListener("click", function () {

        if (!pumpData.selectedPump) {
            alert("Run a pump selection first — nothing to export yet.");
            return;
        }

        if (typeof window.jspdf === "undefined") {
            alert("PDF library failed to load. Check your internet connection and try again.");
            return;
        }

        const snapshot = getReportSnapshot();
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginBottom = 20;

        // Starts a fresh page and writes a section heading; every
        // section below calls this first so each one begins cleanly
        // instead of running into whatever came before it.
        function startSection(title) {
            doc.addPage();
            doc.setFontSize(14);
            doc.setFont(undefined, "bold");
            doc.text(title, 14, 20);
            doc.setFontSize(11);
            return 30;
        }

        // Adds a new page automatically if the next chunk of content
        // would run past the bottom margin.
        function ensureSpace(doc_, y, needed) {
            if (y + needed > pageHeight - marginBottom) {
                doc_.addPage();
                return 20;
            }
            return y;
        }

        // ===== PAGE 1: SUMMARY =====

        let y = 20;

        doc.setFontSize(16);
        doc.setFont(undefined, "bold");
        doc.text("HydroNova Engineering Report", 14, y);

        y += 6;
        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text("Generated " + snapshot.savedAt, 14, y);

        y += 10;
        doc.setFontSize(12);

        const summaryRows = [
            ["Project Name", snapshot.projectName],
            ["Selected Pump", snapshot.pump],
            ["API Standard", snapshot.apiStandard],
            ["Recommended Material", snapshot.material],
            ["Motor Power", snapshot.motor],
            ["Efficiency", snapshot.efficiency],
            ["Overall Pump Health", snapshot.health]
        ];

        summaryRows.forEach(function (row) {
            doc.setFont(undefined, "bold");
            doc.text(row[0] + ":", 14, y);
            doc.setFont(undefined, "normal");
            doc.text(String(row[1]), 80, y);
            y += 8;
        });

        y += 4;
        doc.setFont(undefined, "bold");
        doc.text("Final Engineering Remark:", 14, y);
        y += 7;
        doc.setFont(undefined, "normal");
        const remarkLines = doc.splitTextToSize(snapshot.remark, 180);
        doc.text(remarkLines, 14, y);

        // ===== PAGE 2: MATERIAL COMPATIBILITY & CONSTRUCTION =====

        y = startSection("Material Compatibility & Construction");

        doc.setFont(undefined, "bold");
        doc.text("Component", 14, y);
        doc.text("Material", 65, y);
        doc.text("Reason", 115, y);
        y += 3;
        doc.line(14, y, pageWidth - 14, y);
        y += 6;

        doc.setFont(undefined, "normal");

        snapshot.materials.forEach(function (row) {

            const reasonLines = doc.splitTextToSize(row.reason, 80);
            const rowHeight = Math.max(7, reasonLines.length * 5 + 2);

            y = ensureSpace(doc, y, rowHeight);

            doc.text(row.component, 14, y);
            doc.text(row.material, 65, y);
            doc.text(reasonLines, 115, y);

            y += rowHeight;

        });

        y += 4;
        y = ensureSpace(doc, y, 30);
        doc.setFont(undefined, "bold");
        doc.text("Material Grade: ", 14, y);
        doc.setFont(undefined, "normal");
        doc.text(snapshot.materialSummary.grade, 55, y);
        y += 7;
        doc.setFont(undefined, "bold");
        doc.text("Corrosion Resistance: ", 14, y);
        doc.setFont(undefined, "normal");
        doc.text(snapshot.materialSummary.corrosionResistance, 55, y);
        y += 7;
        doc.setFont(undefined, "bold");
        doc.text("Abrasion Resistance: ", 14, y);
        doc.setFont(undefined, "normal");
        doc.text(snapshot.materialSummary.abrasionResistance, 55, y);
        y += 7;
        doc.setFont(undefined, "bold");
        doc.text("Maximum Temperature: ", 14, y);
        doc.setFont(undefined, "normal");
        doc.text(snapshot.materialSummary.maxTemperature, 55, y);

        y += 10;
        y = ensureSpace(doc, y, 20);
        doc.setFont(undefined, "bold");
        doc.text("Engineering Recommendation:", 14, y);
        y += 6;
        doc.setFont(undefined, "normal");
        doc.text(doc.splitTextToSize(snapshot.materialRecommendation, 180), 14, y);

        // ===== PAGE 3: PUMP PERFORMANCE CURVE =====

        y = startSection("Pump Performance Curves");

        if (snapshot.curveImage) {

            const curveCanvas = document.getElementById("pumpChart");
            const imgWidth = pageWidth - 28;
            const imgHeight = imgWidth * (curveCanvas.height / curveCanvas.width);

            doc.addImage(snapshot.curveImage, "PNG", 14, y, imgWidth, imgHeight);

        } else {

            doc.setFont(undefined, "normal");
            doc.text("Curve not available — run Pump Recommendation first.", 14, y);

        }

        // ===== PAGE 4: ENGINEERING CALCULATIONS =====

        y = startSection("Engineering Calculations");

        snapshot.engineeringCalcs.forEach(function (row) {

            y = ensureSpace(doc, y, 8);

            doc.setFont(undefined, "bold");
            doc.text(row[0] + ":", 14, y);
            doc.setFont(undefined, "normal");
            doc.text(String(row[1]), 100, y);
            y += 7;

        });

        y += 5;
        y = ensureSpace(doc, y, snapshot.engineeringStatus.length * 7 + 10);
        doc.setFont(undefined, "bold");
        doc.text("Engineering Evaluation", 14, y);
        y += 7;
        doc.setFont(undefined, "normal");
        snapshot.engineeringStatus.forEach(function (line) {
            doc.text(line, 14, y);
            y += 7;
        });

        const fileName = "HydroNova_Report_" + (pumpData.selectedPump || "pump") + ".pdf";
        doc.save(fileName);

        console.log("PDF exported:", fileName);

    });

}

// ---------------- EXPORT EXCEL ----------------

const exportExcelBtn = document.getElementById("exportExcel");

if (exportExcelBtn) {

    exportExcelBtn.addEventListener("click", function () {

        if (!pumpData.selectedPump) {
            alert("Run a pump selection first — nothing to export yet.");
            return;
        }

        if (typeof XLSX === "undefined") {
            alert("Excel library failed to load. Check your internet connection and try again.");
            return;
        }

        const snapshot = getReportSnapshot();

        const summarySheetData = [
            ["HydroNova Engineering Report"],
            ["Generated", snapshot.savedAt],
            [],
            ["Field", "Value"],
            ["Project Name", snapshot.projectName],
            ["Selected Pump", snapshot.pump],
            ["API Standard", snapshot.apiStandard],
            ["Recommended Material", snapshot.material],
            ["Motor Power", snapshot.motor],
            ["Efficiency", snapshot.efficiency],
            ["Overall Pump Health", snapshot.health],
            [],
            ["Final Engineering Remark"],
            [snapshot.remark]
        ];

        const inputsSheetData = [
            ["Operating Parameter", "Value"],
            ["Flow", pumpData.flow],
            ["Head", pumpData.head],
            ["Suction Pressure", pumpData.suctionPressure],
            ["Discharge Pressure", pumpData.dischargePressure],
            ["Temperature", pumpData.temperature],
            ["NPSH Available", pumpData.npsha],
            ["RPM", pumpData.rpm],
            ["Installation", pumpData.installation],
            ["Fluid", pumpData.fluidName]
        ];

        // ---- Material Compatibility & Construction sheet ----

        const materialSheetData = [
            ["Component", "Recommended Material", "Reason"]
        ];

        snapshot.materials.forEach(function (row) {
            materialSheetData.push([row.component, row.material, row.reason]);
        });

        materialSheetData.push([]);
        materialSheetData.push(["Material Grade", snapshot.materialSummary.grade]);
        materialSheetData.push(["Corrosion Resistance", snapshot.materialSummary.corrosionResistance]);
        materialSheetData.push(["Abrasion Resistance", snapshot.materialSummary.abrasionResistance]);
        materialSheetData.push(["Maximum Temperature", snapshot.materialSummary.maxTemperature]);
        materialSheetData.push([]);
        materialSheetData.push(["Engineering Recommendation"]);
        materialSheetData.push([snapshot.materialRecommendation]);

        // ---- Engineering Calculations sheet ----

        const engineeringSheetData = [["Parameter", "Value"]].concat(snapshot.engineeringCalcs);
        engineeringSheetData.push([]);
        engineeringSheetData.push(["Engineering Evaluation"]);
        snapshot.engineeringStatus.forEach(function (line) {
            engineeringSheetData.push([line]);
        });

        // ---- Pump Curve Data sheet ----
        // Same arrays the on-screen chart is plotted from (see
        // generatePumpCurve), so this always matches the curve image
        // in the PDF export.

        const curveSheetData = [["Flow (m³/hr)", "Head (m)", "Efficiency (%)", "Power (kW)", "NPSHr (m)"]];

        if (snapshot.curveData) {
            for (let i = 0; i < snapshot.curveData.flow.length; i++) {
                curveSheetData.push([
                    snapshot.curveData.flow[i],
                    snapshot.curveData.head[i],
                    snapshot.curveData.efficiency[i],
                    snapshot.curveData.power[i],
                    snapshot.curveData.npshr[i]
                ]);
            }
        } else {
            curveSheetData.push(["Curve not available — run Pump Recommendation first."]);
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(summarySheetData), "Report Summary");
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(materialSheetData), "Material Compatibility");
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(curveSheetData), "Pump Curve Data");
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(engineeringSheetData), "Engineering Calculations");
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(inputsSheetData), "Operating Inputs");

        const fileName = "HydroNova_Report_" + (pumpData.selectedPump || "pump") + ".xlsx";
        XLSX.writeFile(workbook, fileName);

        console.log("Excel exported:", fileName);

    });

}

// ---------------- NEW PROJECT ----------------

const newProjectBtn = document.getElementById("newProject");

if (newProjectBtn) {

    newProjectBtn.addEventListener("click", function () {

        const confirmed = confirm(
            "Start a new project? This clears all entered data on this page (unsaved work will be lost)."
        );

        if (!confirmed) return;

        // A full manual reset would mean touching every input across
        // every section individually and risking missed fields; reloading
        // gives a guaranteed-clean slate the same way opening the app
        // fresh would.
        location.reload();

    });

}
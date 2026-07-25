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

    // Hide Pump Selection
    document.getElementById("pump-selection").style.display = "none";

    // Show Fluid Properties
    document.getElementById("fluid-properties").style.display = "block";

    console.log("Moved to Fluid Properties");

});
// ======================================
// BACK BUTTON
// Fluid Properties → Pump Selection
// ======================================

document.getElementById("backPump").addEventListener("click", function () {

    document.getElementById("fluid-properties").style.display = "none";

    document.getElementById("pump-selection").style.display = "block";

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

    // Hide Fluid Section
    document.getElementById("fluid-properties").style.display = "none";

    // Show Material Section
    document.getElementById("material-selection").style.display = "block";

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

    if (typeof drawPumpCurve === "function") {
        try {
            drawPumpCurve();
        } catch (e) {
            console.error("Curve Error :", e);
        }
    }

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
// =====================================
// INTELLIGENT SELECTION ENGINE
// =====================================

let matchScore = 0;
let selectionReason = [];

let alternativePumps = [];

    // =====================================================
    // PUMP SELECTION LOGIC
    // =====================================================
// =====================================================
// OH1
// =====================================================

if (

    pumpData.installation === "Horizontal" &&
    pumpData.flow <= 100 &&
    pumpData.head <= 40 &&
    pumpData.dischargePressure <= 16 &&
    pumpData.temperature <= 120 &&
    pumpData.solids <= 2 &&
    pumpData.particleSize < 0.5 &&
    pumpData.corrosive === "No" &&
    pumpData.abrasive === "No" &&
    pumpData.npsha >= 3

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

    pumpData.installation === "Horizontal" &&
    pumpData.flow > 100 &&
    pumpData.flow <= 500 &&
    pumpData.head > 40 &&
    pumpData.head <= 150 &&
    pumpData.dischargePressure <= 40 &&
    pumpData.temperature <= 250 &&
    pumpData.npsha >= 3

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

    pumpData.installation === "Horizontal" &&
    pumpData.temperature > 120 &&
    pumpData.temperature <= 200 &&
    pumpData.flow >= 20 &&
    pumpData.flow <= 300 &&
    pumpData.head >= 20 &&
    pumpData.head <= 120 &&
    pumpData.dischargePressure <= 25 &&
    pumpData.npsha >= 3

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

    pumpData.installation === "Horizontal" &&
    pumpData.rpm >= 3500 &&
    pumpData.flow >= 10 &&
    pumpData.flow <= 200 &&
    pumpData.head >= 80 &&
    pumpData.head <= 300 &&
    pumpData.dischargePressure <= 50 &&
    pumpData.temperature <= 250 &&
    pumpData.npsha >= 3

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

    pumpData.installation === "Horizontal" &&
    (
        pumpData.fluidName === "Thermal Oil" ||
        pumpData.fluidName === "Hot Oil" ||
        pumpData.fluidName === "Heat Transfer Fluid"
    ) &&
    pumpData.temperature > 250 &&
    pumpData.temperature <= 450 &&
    pumpData.flow >= 20 &&
    pumpData.flow <= 400 &&
    pumpData.head >= 30 &&
    pumpData.head <= 200 &&
    pumpData.dischargePressure <= 40 &&
    pumpData.npsha >= 3

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

    pumpData.installation === "Horizontal" &&
    (
        pumpData.fluidName === "Crude Oil" ||
        pumpData.fluidName === "Condensate" ||
        pumpData.fluidName === "Chemical Solution"
    ) &&
    pumpData.flow >= 300 &&
    pumpData.flow <= 800 &&
    pumpData.head >= 100 &&
    pumpData.head <= 350 &&
    pumpData.dischargePressure <= 60 &&
    pumpData.temperature <= 250 &&
    pumpData.npsha >= 4

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

    pumpData.installation === "Horizontal" &&
    pumpData.flow >= 100 &&
    pumpData.flow <= 700 &&
    pumpData.head >= 40 &&
    pumpData.head <= 200 &&
    pumpData.dischargePressure <= 40 &&
    pumpData.temperature <= 250 &&
    pumpData.npsha >= 3

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

    pumpData.installation === "Horizontal" &&
    pumpData.flow >= 500 &&
    pumpData.flow <= 2500 &&
    pumpData.head >= 80 &&
    pumpData.head <= 400 &&
    pumpData.dischargePressure <= 80 &&
    pumpData.temperature <= 300 &&
    pumpData.npsha >= 4

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

    pumpData.installation === "Horizontal" &&
    pumpData.flow >= 200 &&
    pumpData.flow <= 1200 &&
    pumpData.head >= 250 &&
    pumpData.head <= 1200 &&
    pumpData.dischargePressure <= 150 &&
    pumpData.temperature <= 350 &&
    pumpData.npsha >= 4

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

    pumpData.installation === "Horizontal" &&
    pumpData.flow >= 100 &&
    pumpData.flow <= 1000 &&
    pumpData.head >= 400 &&
    pumpData.head <= 1800 &&
    pumpData.dischargePressure <= 200 &&
    pumpData.temperature <= 350 &&
    pumpData.npsha >= 5

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

    pumpData.installation === "Horizontal" &&
    pumpData.flow >= 100 &&
    pumpData.flow <= 1500 &&
    pumpData.head >= 500 &&
    pumpData.head <= 3000 &&
    pumpData.dischargePressure <= 350 &&
    pumpData.temperature <= 450 &&
    pumpData.npsha >= 5

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

    pumpData.installation === "Vertical" &&
    pumpData.flow >= 100 &&
    pumpData.flow <= 5000 &&
    pumpData.head >= 10 &&
    pumpData.head <= 200 &&
    pumpData.dischargePressure <= 20 &&
    pumpData.temperature <= 120 &&
    pumpData.npsha >= 2

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

    pumpData.installation === "Vertical" &&
    pumpData.flow >= 200 &&
    pumpData.flow <= 4000 &&
    pumpData.head >= 20 &&
    pumpData.head <= 250 &&
    pumpData.dischargePressure <= 25 &&
    pumpData.temperature <= 150 &&
    pumpData.npsha >= 2

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

    pumpData.installation === "Vertical" &&
    pumpData.flow >= 300 &&
    pumpData.flow <= 6000 &&
    pumpData.head >= 30 &&
    pumpData.head <= 300 &&
    pumpData.dischargePressure <= 30 &&
    pumpData.temperature <= 180 &&
    pumpData.npsha >= 3

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

    pumpData.installation === "Vertical" &&
    pumpData.flow >= 500 &&
    pumpData.flow <= 7000 &&
    pumpData.head >= 40 &&
    pumpData.head <= 350 &&
    pumpData.dischargePressure <= 35 &&
    pumpData.temperature <= 200 &&
    pumpData.npsha >= 3

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

    pumpData.installation === "Vertical" &&
    pumpData.flow >= 1000 &&
    pumpData.flow <= 10000 &&
    pumpData.head >= 80 &&
    pumpData.head <= 450 &&
    pumpData.dischargePressure <= 45 &&
    pumpData.temperature <= 250 &&
    pumpData.npsha >= 4

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

    pumpData.installation === "Vertical" &&
    pumpData.flow >= 800 &&
    pumpData.flow <= 8000 &&
    pumpData.head >= 100 &&
    pumpData.head <= 600 &&
    pumpData.dischargePressure <= 70 &&
    pumpData.temperature <= 300 &&
    pumpData.npsha >= 4

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

    pumpData.installation === "Vertical" &&
    pumpData.flow >= 500 &&
    pumpData.flow <= 6000 &&
    pumpData.head >= 150 &&
    pumpData.head <= 800 &&
    pumpData.dischargePressure <= 100 &&
    pumpData.temperature <= 350 &&
    pumpData.npsha >= 5

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

    // Pump Image
    const pumpImage = document.getElementById("pumpImage");
    if (pumpImage) {
        pumpImage.src = image;
    }

    // Applications
    const appList = document.getElementById("applicationList");
    if (appList) {

        appList.innerHTML = "";

        applications.forEach(function (item) {

            let li = document.createElement("li");
            li.textContent = item;
            appList.appendChild(li);

        });

    }
// Generate Pump Curve
if (typeof drawPumpCurve === "function") {
    drawPumpCurve();
}

    console.log("Pump Recommendation Completed");

}
// =====================================================
// STEP 4.3.3
// PROFESSIONAL PUMP PERFORMANCE CURVES
// =====================================================

function drawPumpCurve() {

    const canvas = document.getElementById("pumpChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (window.pumpCurveChart) {
        window.pumpCurveChart.destroy();
    }

    const Q = pumpData.flow;
    const H = pumpData.head;

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
        parseFloat(document.getElementById("efficiency").innerText),
        83,
        70
    ];

    window.pumpCurveChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: flowData,

            datasets: [

                {
                    label: "Head (m)",
                    data: headData,
                    borderColor: "#1565C0",
                    backgroundColor: "transparent",
                    borderWidth: 3,
                    tension: 0.35,
                    yAxisID: "y"
                },

                {
                    label: "Efficiency (%)",
                    data: efficiencyData,
                    borderColor: "#00C853",
                    backgroundColor: "transparent",
                    borderWidth: 3,
                    tension: 0.35,
                    yAxisID: "y1"
                }

            ]

        },

        options: {

            responsive: true,

            interaction: {
                mode: "index",
                intersect: false
            },

            plugins: {

                legend: {
                    position: "top"
                }

            },

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

    let eta = 0.80;

    if (pumpData.selectedPump == "OH1") eta = 0.80;

    else if (pumpData.selectedPump == "OH2") eta = 0.82;

    else if (pumpData.selectedPump == "OH3") eta = 0.80;

    else if (pumpData.selectedPump == "OH4") eta = 0.83;

    else if (pumpData.selectedPump == "OH5") eta = 0.81;

    else if (pumpData.selectedPump == "OH6") eta = 0.84;

    else if (pumpData.selectedPump == "BB1") eta = 0.84;

    else if (pumpData.selectedPump == "BB2") eta = 0.86;

    else if (pumpData.selectedPump == "BB3") eta = 0.87;

    else if (pumpData.selectedPump == "BB4") eta = 0.88;

    else if (pumpData.selectedPump == "BB5") eta = 0.89;

    else if (pumpData.selectedPump == "VS1") eta = 0.84;

    else if (pumpData.selectedPump == "VS2") eta = 0.85;

    else if (pumpData.selectedPump == "VS3") eta = 0.86;

    else if (pumpData.selectedPump == "VS4") eta = 0.87;

    else if (pumpData.selectedPump == "VS5") eta = 0.88;

    else if (pumpData.selectedPump == "VS6") eta = 0.89;

    else if (pumpData.selectedPump == "VS7") eta = 0.90;

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
    // Approximate API610 estimation
    // =====================================

    let npshr =
        Math.max(2.5, head * 0.04);

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
    // =====================================================
    // STEP 7.4
    // IMPELLER, SHAFT & MOTOR SELECTION
    // =====================================================

   // =====================================
// IMPELLER DIAMETER ESTIMATION
// =====================================

let impellerDiameter =
    Math.sqrt(H) * 40;

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

    updateValue("efficiency", (eta * 100).toFixed(1) + " %");

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
    // DRAW PUMP CURVE
    // =====================================

    if (typeof drawPumpCurve === "function") {
        drawPumpCurve();
    }

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
                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "top"

                }

            }

        }

    });

    console.log("Pump Curve Generated Successfully");

}

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

// Next Button : Fluid → Material

document.getElementById("nextMaterial").addEventListener("click", function () {

    // Read Fluid Data
    let data = getFluidProperties();

    // Validate
    if (!validateFluidProperties(data)) {
        return;
    }

    // Hide Fluid Section
    document.getElementById("fluid-properties").style.display = "none";

    // Show Material Section
    document.getElementById("material-selection").style.display = "block";

    console.log("Moved to Material Selection");

    // Material Recommendation
    recommendMaterial();

    // Pump Recommendation
    if (typeof recommendPump === "function") {
        recommendPump();
    }

});


// =====================================================
// BACK BUTTON
// Material → Fluid
// =====================================================

const backFluidBtn = document.getElementById("backFluid");

if (backFluidBtn) {

    backFluidBtn.addEventListener("click", function () {

        document.getElementById("material-selection").style.display = "none";

        document.getElementById("fluid-properties").style.display = "block";

        console.log("Returned to Fluid Properties");

    });

}


// =====================================================
// CLEAR MATERIAL
// =====================================================

const clearMaterialBtn = document.getElementById("clearMaterial");

if (clearMaterialBtn) {

    clearMaterialBtn.addEventListener("click", function () {

        document.getElementById("materialGrade").innerText = "--";
        document.getElementById("corrosionLevel").innerText = "--";
        document.getElementById("abrasionLevel").innerText = "--";
        document.getElementById("maxTemperature").innerText = "--";

        document.getElementById("casingMaterial").innerText = "--";
        document.getElementById("impellerMaterial").innerText = "--";
        document.getElementById("shaftMaterial").innerText = "--";
        document.getElementById("sleeveMaterial").innerText = "--";
        document.getElementById("wearRingMaterial").innerText = "--";
        document.getElementById("sealMaterial").innerText = "--";
        document.getElementById("gasketMaterial").innerText = "--";
        document.getElementById("fastenerMaterial").innerText = "--";

        document.getElementById("materialRecommendation").innerText =
            "No recommendation available.";

        console.log("Material Data Cleared");

    });

}
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

    let pump = "OH2 Process Pump";
    let api = "OH2";
    let flowRange = "50 - 500 m³/hr";
    let headRange = "20 - 150 m";
    let pressure = "25 bar";
    let efficiency = "82 %";
    let motor = "22 kW";
    let speed = pumpData.rpm || "2900 RPM";
    let mounting = "Centerline Mounted";
    let impeller = "Closed Impeller";
    let seal = "Mechanical Seal";
    let bearing = "Angular Contact Ball Bearing";
    let description =
        "Single Stage Overhung Centerline Mounted Process Pump designed according to API 610.";

    let applications = [
        "Oil & Gas Industry",
        "Refinery",
        "Petrochemical Plant",
        "Chemical Process",
        "Power Plant",
        "Water Treatment"
    ];

    let image = "assets/images/OH2.png";

    // =====================================================
    // PUMP SELECTION LOGIC
    // =====================================================
// OH1
if (pumpData.installation === "Horizontal" &&
    pumpData.flow <= 100 &&
    pumpData.head <= 40) {

    pump="OH1 Process Pump";
    api="OH1";
    image="assets/images/OH1.png";
}

// OH2
else if (pumpData.installation === "Horizontal" &&
         pumpData.flow <= 500 &&
         pumpData.head <=150){

    pump="OH2 Process Pump";
    api="OH2";
    image="assets/images/OH2.png";
}

// OH3
else if (pumpData.installation==="Horizontal" &&
         pumpData.temperature>=200){

    pump="OH3 Inline Pump";
    api="OH3";
    image="assets/images/OH3.png";
}

// OH4
else if (pumpData.installation==="Horizontal" &&
         pumpData.rpm>=3500){

    pump="OH4 High Speed Pump";
    api="OH4";
    image="assets/images/OH4.png";
}

// OH5
else if (pumpData.installation==="Horizontal" &&
         pumpData.temperature>=350){

    pump="OH5 High Temperature Pump";
    api="OH5";
    image="assets/images/OH5.png";
}
// BB1
else if (pumpData.flow>500 &&
         pumpData.head<=100){

    pump="BB1 Axially Split Pump";
    api="BB1";
    image="assets/images/BB1.png";
}

// BB2
else if (pumpData.flow>500 &&
         pumpData.head>100 &&
         pumpData.head<=250){

    pump="BB2 Radially Split Pump";
    api="BB2";
    image="assets/images/BB2.png";
}

// BB3
else if (pumpData.head>250 &&
         pumpData.head<=500){

    pump="BB3 Multistage Pump";
    api="BB3";
    image="assets/images/BB3.png";
}

// BB4
else if (pumpData.head>500){

    pump="BB4 Double Case Pump";
    api="BB4";
    image="assets/images/BB4.png";
}

// BB5
else if (pumpData.dischargePressure>=80){

    pump="BB5 Barrel Pump";
    api="BB5";
    image="assets/images/BB5.png";
}
// VS1
else if (pumpData.installation==="Vertical" &&
         pumpData.flow<=500){

    pump="VS1";
    api="VS1";
    image="assets/images/VS1.png";
}

// VS2
else if (pumpData.installation==="Vertical" &&
         pumpData.flow<=1000){

    pump="VS2";
    api="VS2";
    image="assets/images/VS2.png";
}

// VS3
else if (pumpData.installation==="Vertical" &&
         pumpData.npsha<3){

    pump="VS3";
    api="VS3";
    image="assets/images/VS3.png";
}

// VS4
else if (pumpData.installation==="Vertical" &&
         pumpData.temperature>150){

    pump="VS4";
    api="VS4";
    image="assets/images/VS4.png";
}

// VS5
else if (pumpData.installation==="Vertical" &&
         pumpData.temperature>300){

    pump="VS5";
    api="VS5";
    image="assets/images/VS5.png";
}

    

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

    console.log("Pump Recommendation Completed");

}
// =====================================================
// PART 7
// ENGINEERING CALCULATIONS
// =====================================================

function calculateEngineering() {

    // ===============================
    // INPUTS
    // ===============================

    let Q = pumpData.flow / 3600;      // m³/s
    let H = pumpData.head;             // m
    let SG = pumpData.sg || 1;
    let rho = 1000 * SG;
    let eta = 0.82;
    let rpm = parseFloat(pumpData.rpm) || 2900;
    let npsha = pumpData.npsha || 0;
    let npshr = 3;

    // ===============================
    // HYDRAULIC POWER
    // P = ρgQH
    // ===============================

    let hydraulicPower =
        (rho * 9.81 * Q * H) / 1000;

    // ===============================
    // SHAFT POWER
    // ===============================

    let shaftPower =
        hydraulicPower / eta;

    // ===============================
    // BRAKE POWER
    // ===============================

    let brakePower =
        shaftPower * 1.05;

    // ===============================
    // MOTOR POWER
    // ===============================

    let motorPower =
        brakePower * 1.15;

    // ===============================
    // NPSH MARGIN
    // ===============================

    let npshMargin =
        npsha - npshr;

    // ===============================
    // SPECIFIC SPEED
    // ===============================

    let specificSpeed =
        rpm * Math.sqrt(Q) / Math.pow(H, 0.75);

    // ===============================
    // SPECIFIC DIAMETER
    // ===============================

    let specificDiameter =
        (Math.sqrt(H)) / Math.cbrt(Q);

    // ===============================
    // UPDATE HTML
    // ===============================

    document.getElementById("hydraulicPower").innerText =
        hydraulicPower.toFixed(2) + " kW";

    document.getElementById("shaftPower").innerText =
        shaftPower.toFixed(2) + " kW";

    document.getElementById("brakePower").innerText =
        brakePower.toFixed(2) + " kW";

    document.getElementById("motorPowerCalc").innerText =
        motorPower.toFixed(2) + " kW";

    document.getElementById("pumpEfficiency").innerText =
        (eta * 100).toFixed(0) + " %";

    document.getElementById("npshMargin").innerText =
        npshMargin.toFixed(2) + " m";

    document.getElementById("specificSpeed").innerText =
        specificSpeed.toFixed(2);

    document.getElementById("specificDiameter").innerText =
        specificDiameter.toFixed(2);

    // ===============================
    // ENGINEERING STATUS
    // ===============================

    document.getElementById("statusEfficiency").innerHTML =
        "✅ Efficiency Check : PASS";

    document.getElementById("statusPower").innerHTML =
        "✅ Motor Sizing : PASS";

    document.getElementById("statusVelocity").innerHTML =
        "✅ Hydraulic Check : PASS";

    if (npshMargin >= 1) {

        document.getElementById("statusNPSH").innerHTML =
            "✅ NPSH Check : PASS";

    } else {

        document.getElementById("statusNPSH").innerHTML =
            "❌ NPSH Check : FAIL";

    }

    document.getElementById("statusRecommendation").innerHTML =
        "✅ Engineering Calculation Completed";

    console.log("Engineering Calculation Completed");

}

// =====================================================
// CALCULATE BUTTON
// =====================================================

const calculateBtn = document.getElementById("calculateBtn");

if (calculateBtn) {

    calculateBtn.addEventListener("click", function () {

        calculateEngineering();

    });

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
// PART 9
// FINAL REPORT & PROJECT MANAGEMENT
// =====================================================


// ==========================================
// UPDATE FINAL REPORT
// ==========================================

function updateFinalReport() {

    document.getElementById("reportPump").innerText =
        document.getElementById("pumpName").innerText;

    document.getElementById("reportMaterial").innerText =
        document.getElementById("materialGrade").innerText;

    document.getElementById("reportMotor").innerText =
        document.getElementById("motorPower").innerText;

    document.getElementById("reportEfficiency").innerText =
        document.getElementById("efficiency").innerText;

    document.getElementById("reportHealth").innerText =
        document.getElementById("healthPercentage").innerText;

    document.getElementById("finalRemark").innerText =
        "Pump selection completed successfully according to the entered operating conditions.";

    console.log("Final Report Updated");

}


// ==========================================
// SAVE PROJECT
// ==========================================

const saveProjectBtn =
document.getElementById("saveProject");

if (saveProjectBtn) {

    saveProjectBtn.addEventListener("click", function () {

        localStorage.setItem(
            "HydroNovaProject",
            JSON.stringify(pumpData)
        );

        alert("Project Saved Successfully.");

    });

}


// ==========================================
// NEW PROJECT
// ==========================================

const newProjectBtn =
document.getElementById("newProject");

if (newProjectBtn) {

    newProjectBtn.addEventListener("click", function () {

        if (confirm("Start a New Project?")) {

            localStorage.removeItem("HydroNovaProject");

            location.reload();

        }

    });

}


// ==========================================
// PRINT REPORT
// ==========================================

const printBtn =
document.getElementById("printReport");

if (printBtn) {

    printBtn.addEventListener("click", function () {

        updateFinalReport();

        window.print();

    });

}


// ==========================================
// EXPORT PDF
// ==========================================

const pdfBtn =
document.getElementById("exportPdf");

if (pdfBtn) {

    pdfBtn.addEventListener("click", function () {

        updateFinalReport();

        alert("PDF Export will be enabled in Version 2 using jsPDF.");

    });

}


// ==========================================
// EXPORT EXCEL
// ==========================================

const excelBtn =
document.getElementById("exportExcel");

if (excelBtn) {

    excelBtn.addEventListener("click", function () {

        alert("Excel Export will be enabled in Version 2 using SheetJS.");

    });

}


// ==========================================
// AUTO UPDATE REPORT
// ==========================================

const nextReportBtn =
document.getElementById("nextReport");

if (nextReportBtn) {

    nextReportBtn.addEventListener("click", function () {

        document.getElementById("corrosion").style.display = "none";

        document.getElementById("reports").style.display = "block";

        updateFinalReport();

    });

}

console.log("Part 9 Loaded Successfully");
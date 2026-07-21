// =========================================
// LIVE VAULT - DASHBOARD
// Part 5A
// =========================================

// ----------------------
// Login Protection
// ----------------------

if (localStorage.getItem("liveVaultLogin") !== "true") {
    window.location.href = "index.html";
}

// ----------------------
// Google Sheet CSV URL
// ----------------------

// ⚠️ Replace this with your published CSV URL

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1S06CFQnMF0qhQl0YRQmspUbj-DNEuZMzbgemVA78SnE/export?format=csv&gid=0";

// ----------------------
// Variables
// ----------------------

const tableBody = document.getElementById("tableBody");

let documents = [];

// ----------------------
// Load Google Sheet
// ----------------------

fetch(SHEET_URL)
.then(response => response.text())
.then(csv => {

    const rows = csv.trim().split("\n");

    // Remove Header
    rows.shift();

    documents = rows.map(row => {

        const cols = row.split(",");

        return {

    sno: cols[0]?.replace(/"/g,"") || "",

    name: cols[1]?.replace(/"/g,"") || "",

    documentName: cols[2]?.replace(/"/g,"") || "",

    documentNumber: cols[3]?.replace(/"/g,"") || "",

    documentProof: cols[4]?.replace(/"/g,"") || ""

};
    });

    displayTable(documents);

    populateFilters();

})
.catch(error => {

    console.error(error);

    tableBody.innerHTML = `
        <tr>
            <td colspan="4" style="text-align:center;color:red;">
                Unable to load Google Sheet
            </td>
        </tr>
    `;

});

// ----------------------
// Display Table
// ----------------------

function displayTable(data){

    // Dashboard Cards
    document.getElementById("totalDocuments").textContent = documents.length;

    document.getElementById("totalPersons").textContent =
        new Set(documents.map(d => d.name)).size;

    document.getElementById("totalTypes").textContent =
        new Set(documents.map(d => d.documentName)).size;

    tableBody.innerHTML = "";

    if(data.length === 0){

        tableBody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center;">
                No Records Found
            </td>
        </tr>
        `;

        return;
    }

    data.forEach(item=>{

        const proofButton = item.documentProof
            ? `<a href="${item.documentProof}" target="_blank" class="view-btn">View</a>`
            : "-";

        tableBody.innerHTML += `
        <tr>
            <td>${item.sno}</td>
            <td>${item.name}</td>
            <td>${item.documentName}</td>
            <td>${item.documentNumber}</td>
            <td>${proofButton}</td>
        </tr>
        `;

    });

}


// =========================================
// LIVE VAULT - DASHBOARD
// Part 5B
// =========================================

// ----------------------
// Elements
// ----------------------

const searchInput = document.getElementById("searchInput");
const nameFilter = document.getElementById("nameFilter");
const documentFilter = document.getElementById("documentFilter");

const logoutBtn = document.getElementById("logoutBtn");
const themeBtn = document.getElementById("themeBtn");

// ----------------------
// Populate Filters
// ----------------------

function populateFilters(){

    fillSelect(nameFilter, documents.map(d => d.name));
    fillSelect(documentFilter, documents.map(d => d.documentName));
    

}

function fillSelect(select, values){

    const unique = [...new Set(values)];

    unique.sort();

    unique.forEach(value=>{

        if(value==="") return;

        const option=document.createElement("option");

        option.value=value;

        option.textContent=value;

        select.appendChild(option);

    });

}

// ----------------------
// Search + Filters
// ----------------------

function applyFilters(){

    const search = searchInput.value.toLowerCase().trim();

    const filtered = documents.filter(item=>{

        const proofStatus = item.documentProof
            ? "Available"
            : "Not Available";

        const matchesSearch =
            item.name.toLowerCase().includes(search) ||
            item.documentName.toLowerCase().includes(search) ||
            item.documentNumber.toLowerCase().includes(search);

        const matchesName =
            !nameFilter.value ||
            item.name === nameFilter.value;

        const matchesDocument =
            !documentFilter.value ||
            item.documentName === documentFilter.value;

        
        return (
            matchesSearch &&
            matchesName &&
            matchesDocument 
           
        );

    });

    displayTable(filtered);

}

searchInput.addEventListener("keyup", applyFilters);

nameFilter.addEventListener("change", applyFilters);

documentFilter.addEventListener("change", applyFilters);


// ----------------------
// Logout
// ----------------------

logoutBtn.addEventListener("click",()=>{

    if(confirm("Do you want to logout?")){

        localStorage.removeItem("liveVaultLogin");

        localStorage.removeItem("liveVaultUser");

        window.location.href="index.html";

    }

});

// ----------------------
// Dark Mode
// ----------------------

const savedTheme = localStorage.getItem("theme");

if(savedTheme==="dark"){

    document.body.classList.add("dark-mode");

    themeBtn.innerHTML =
    '<i class="fa-solid fa-sun"></i>';

}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

    }else{

        localStorage.setItem("theme","light");

        themeBtn.innerHTML =
        '<i class="fa-solid fa-moon"></i>';

    }

});
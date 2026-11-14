const API_URL = "http://127.0.0.1:5000/api";

const historyTableBody = document.getElementById("historyTableBody");

const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const emptyMessage = document.getElementById("emptyMessage");

const tableWrapper = document.getElementById("historyTableWrapper");

const searchInput = document.getElementById("searchHistory");
const filterSelect = document.getElementById("filterHistory");
const clearButton = document.getElementById("clearHistoryBtn");

const totalExecutions = document.getElementById("totalExecutions");
const uniqueAlgorithms = document.getElementById("uniqueAlgorithms");
const completedRuns = document.getElementById("completedRuns");
const resultCount = document.getElementById("resultCount");

let historyData = [];


// GET ALGORITHM NAME
function getAlgorithmName(record) {

    return record.algorithm_name || record.algorithm || "Unknown Algorithm";

}


// GET INPUT DATA
function getInputText(record) {

    const input = record.input_data || {};

    if (input.array) {
        return input.array.join(", ");
    }

    if (input.disks !== undefined) {
        return input.disks + " disks";
    }

    return "No input data";

}


// GET ALGORITHM CATEGORY
function getCategory(name) {

    if (name.includes("Sort")) {
        return "Sorting";
    }

    if (name.includes("Search")) {
        return "Searching";
    }

    if (name === "Tower of Hanoi") {
        return "Tower of Hanoi";
    }

    return "Other";

}


// FORMAT DATE
function formatDate(dateString) {

    if (!dateString) {
        return "Unknown";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return "Unknown";
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

}


// UPDATE STATISTICS
function updateStatistics(data) {

    totalExecutions.textContent = data.length;

    const algorithms = new Set(
        data.map(record => getAlgorithmName(record))
    );

    uniqueAlgorithms.textContent = algorithms.size;

    const completed = data.filter(
        record => record.status === "completed"
    );

    completedRuns.textContent = completed.length;

}


// SHOW HISTORY
function displayHistory(data) {

    historyTableBody.innerHTML = "";

    if (data.length === 0) {

        tableWrapper.hidden = true;
        emptyMessage.hidden = false;

        resultCount.textContent = "Showing 0 records";

        return;
    }

    emptyMessage.hidden = true;
    tableWrapper.hidden = false;

    data.forEach(record => {

        const row = document.createElement("tr");

        const algorithmName = getAlgorithmName(record);

        const inputText = getInputText(record);

        const steps = Array.isArray(record.steps)
            ? record.steps.length
            : 0;

        const status = record.status || "completed";

        const date = formatDate(record.created_at);

        const algorithmCell = document.createElement("td");
        algorithmCell.className = "algorithm-name";
        algorithmCell.textContent = algorithmName;

        const inputCell = document.createElement("td");
        inputCell.className = "input-value";
        inputCell.textContent = inputText;

        const stepsCell = document.createElement("td");
        stepsCell.textContent = steps;

        const statusCell = document.createElement("td");

        const statusBadge = document.createElement("span");
        statusBadge.className = "status-badge";

        if (status !== "completed") {
            statusBadge.classList.add("failed");
        }

        statusBadge.textContent = status;

        statusCell.appendChild(statusBadge);

        const dateCell = document.createElement("td");
        dateCell.textContent = date;

        const actionCell = document.createElement("td");

        const actionButtons = document.createElement("div");
        actionButtons.className = "action-buttons";

        // OPEN VISUALIZER
        const viewButton = document.createElement("a");

        viewButton.className = "view-btn";
        viewButton.textContent = "View Again";

        viewButton.href =
            "visualizer.html?algorithm=" +
            encodeURIComponent(algorithmName);

        // DELETE RECORD
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteHistory(record._id);
        });

        actionButtons.appendChild(viewButton);
        actionButtons.appendChild(deleteButton);

        actionCell.appendChild(actionButtons);

        row.appendChild(algorithmCell);
        row.appendChild(inputCell);
        row.appendChild(stepsCell);
        row.appendChild(statusCell);
        row.appendChild(dateCell);
        row.appendChild(actionCell);

        historyTableBody.appendChild(row);

    });

    resultCount.textContent =
        "Showing " + data.length + " records";

}


// FILTER HISTORY
function filterHistory() {

    const searchValue = searchInput.value.toLowerCase();

    const selectedCategory = filterSelect.value;

    const filteredData = historyData.filter(record => {

        const name = getAlgorithmName(record);

        const matchesSearch =
            name.toLowerCase().includes(searchValue);

        const matchesCategory =
            selectedCategory === "all" ||
            getCategory(name) === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    displayHistory(filteredData);

}


// FETCH HISTORY FROM MONGODB
async function loadHistory() {

    loadingMessage.hidden = false;
    errorMessage.hidden = true;
    emptyMessage.hidden = true;
    tableWrapper.hidden = true;

    try {

        const response = await fetch(
            API_URL + "/history",
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (response.status === 401) {

            window.location.href = "login.html";
            return;

        }

        if (!response.ok) {
            throw new Error("Unable to load history");
        }

        historyData = await response.json();

        loadingMessage.hidden = true;

        updateStatistics(historyData);

        filterHistory();

        clearButton.disabled = historyData.length === 0;

    }

    catch (error) {

        loadingMessage.hidden = true;

        errorMessage.hidden = false;

        errorMessage.textContent =
            "Could not load history. Please check your Flask server and MongoDB connection.";

        console.error(error);

    }

}


// DELETE ONE HISTORY RECORD
async function deleteHistory(historyId) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this history record?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            API_URL + "/history/" + encodeURIComponent(historyId),
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        const result = await response.json();

        if (response.status === 401) {

            window.location.href = "login.html";
            return;

        }

        if (!response.ok) {
            throw new Error(result.error || "Delete failed");
        }

        await loadHistory();

    }

    catch (error) {

        alert(error.message);

        console.error(error);

    }

}


// CLEAR ALL HISTORY
async function clearAllHistory() {

    if (historyData.length === 0) {
        return;
    }

    const confirmClear = confirm(
        "Are you sure you want to delete ALL your history?"
    );

    if (!confirmClear) {
        return;
    }

    clearButton.disabled = true;

    try {

        const response = await fetch(
            API_URL + "/history",
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        const result = await response.json();

        if (response.status === 401) {

            window.location.href = "login.html";
            return;

        }

        if (!response.ok) {
            throw new Error(result.error || "Unable to clear history");
        }

        await loadHistory();

    }

    catch (error) {

        clearButton.disabled = false;

        alert(error.message);

        console.error(error);

    }

}


// EVENT LISTENERS
searchInput.addEventListener("input", filterHistory);

filterSelect.addEventListener("change", filterHistory);

clearButton.addEventListener("click", clearAllHistory);


// LOAD HISTORY WHEN PAGE OPENS
loadHistory();
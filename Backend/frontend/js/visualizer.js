
const params = new URLSearchParams(window.location.search);
const algorithm = params.get("algorithm") || "Bubble Sort";

const algorithmDescriptions = {
    "Bubble Sort": "Explore how Bubble Sort compares adjacent elements and swaps them step by step.",
    "Selection Sort": "Explore how Selection Sort finds the smallest element and places it in the correct position.",
    "Insertion Sort": "Explore how Insertion Sort builds a sorted array by inserting elements into their correct positions.",
    "Merge Sort": "Explore how Merge Sort divides an array into smaller parts and merges them in sorted order.",
    "Quick Sort": "Explore how Quick Sort uses a pivot to divide an array into smaller sections.",
    "Linear Search": "Explore how Linear Search checks elements one by one to find the target.",
    "Binary Search": "Explore how Binary Search repeatedly divides a sorted array into smaller halves.",
    "Tower of Hanoi": "Explore how disks move between three rods using recursive steps."
};

const selectedAlgorithm =
    algorithmDescriptions[algorithm] ? algorithm : "Bubble Sort";

document.getElementById("algorithmTitle").innerHTML =
    `${selectedAlgorithm} <span>Visualizer</span>`;

document.getElementById("algorithmDescription").textContent =
    algorithmDescriptions[selectedAlgorithm];

const arrayInput = document.getElementById("arrayInput");
const targetInput = document.getElementById("targetInput");
const diskInput = document.getElementById("diskInput");

const arrayInputGroup = document.getElementById("arrayInputGroup");
const targetInputGroup = document.getElementById("targetInputGroup");
const towerInputGroup = document.getElementById("towerInputGroup");

const visualizeBtn = document.getElementById("visualizeBtn");

const arrayContainer = document.getElementById("arrayContainer");
const mergeSortView = document.getElementById("mergeSortView");
const towerView = document.getElementById("towerView");

const mergeCurrentValues = document.getElementById("mergeCurrentValues");
const mergeLeftValues = document.getElementById("mergeLeftValues");
const mergeRightValues = document.getElementById("mergeRightValues");
const mergeResultValues = document.getElementById("mergeResultValues");
const mergeStageTitle = document.getElementById("mergeStageTitle");
const mergeRangeInfo = document.getElementById("mergeRangeInfo");

const towerStageTitle = document.getElementById("towerStageTitle");
const towerMoveInfo = document.getElementById("towerMoveInfo");

const rodA = document.getElementById("rodA");
const rodB = document.getElementById("rodB");
const rodC = document.getElementById("rodC");

const status = document.getElementById("status");
const stepMessage = document.getElementById("stepMessage");
const stepNumber = document.getElementById("stepNumber");

const previousBtn = document.getElementById("previousBtn");
const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

let steps = [];
let currentStep = 0;
let originalArray = [];
let originalDisks = 0;
let playInterval = null;


// ==========================================
// INPUT CONFIGURATION
// ==========================================

function configureInputs() {

    arrayInputGroup.hidden = false;
    targetInputGroup.hidden = true;
    towerInputGroup.hidden = true;

    if (
        selectedAlgorithm === "Linear Search" ||
        selectedAlgorithm === "Binary Search"
    ) {
        targetInputGroup.hidden = false;
    }

    if (selectedAlgorithm === "Tower of Hanoi") {
        arrayInputGroup.hidden = true;
        towerInputGroup.hidden = false;
    }
}

configureInputs();


// ==========================================
// NORMAL ARRAY VISUALIZATION
// ==========================================

function displayArray(numbers, affected = []) {

    arrayContainer.innerHTML = "";

    if (!numbers.length) return;

    const maxValue = Math.max(
        ...numbers.map(number => Math.abs(number)),
        1
    );

    numbers.forEach((number, index) => {

        const wrapper = document.createElement("div");
        wrapper.className = "bar-wrapper";

        const bar = document.createElement("div");
        bar.className = "bar";

        const height = Math.max(
            20,
            (Math.abs(number) / maxValue) * 200
        );

        bar.style.height = height + "px";
        bar.textContent = number;

        if (affected.includes(index)) {
            bar.classList.add("active");
        }

        const label = document.createElement("span");
        label.className = "bar-index";
        label.textContent = index;

        wrapper.appendChild(bar);
        wrapper.appendChild(label);

        arrayContainer.appendChild(wrapper);
    });
}


// ==========================================
// MERGE SORT VISUALIZATION
// ==========================================

function renderMergeBars(container, values, highlighted = []) {

    container.innerHTML = "";

    if (!Array.isArray(values) || values.length === 0) {

        const empty = document.createElement("span");
        empty.className = "merge-empty";
        empty.textContent = "Waiting...";

        container.appendChild(empty);
        return;
    }

    const maxValue = Math.max(
        ...values.map(value => Math.abs(value)),
        1
    );

    values.forEach((value, index) => {

        const wrapper = document.createElement("div");
        wrapper.className = "merge-bar-wrapper";

        const bar = document.createElement("div");
        bar.className = "merge-bar";

        const height = Math.max(
            25,
            (Math.abs(value) / maxValue) * 130
        );

        bar.style.height = height + "px";
        bar.textContent = value;

        if (highlighted.includes(index)) {
            bar.classList.add("merge-highlight");
        }

        const label = document.createElement("span");
        label.className = "merge-bar-index";
        label.textContent = index;

        wrapper.appendChild(bar);
        wrapper.appendChild(label);

        container.appendChild(wrapper);
    });
}


function displayMergeSortState(state, step) {

    arrayContainer.hidden = true;
    mergeSortView.hidden = false;
    towerView.hidden = true;

    const phase = state.phase || "divide";

    const left = Number(state.left ?? 0);
    const mid = Number(state.mid ?? -1);
    const right = Number(state.right ?? -1);

    const affected = (step.affected || []).map(Number);

    const leftHighlighted = [];
    const rightHighlighted = [];

    if (phase === "compare") {

        affected.forEach(index => {

            if (index >= left && index <= mid) {
                leftHighlighted.push(index - left);
            }

            if (index > mid && index <= right) {
                rightHighlighted.push(index - mid - 1);
            }
        });
    }

    renderMergeBars(
        mergeCurrentValues,
        state.array || [],
        affected
    );

    renderMergeBars(
        mergeLeftValues,
        state.leftPart || [],
        leftHighlighted
    );

    renderMergeBars(
        mergeRightValues,
        state.rightPart || [],
        rightHighlighted
    );

    renderMergeBars(
        mergeResultValues,
        state.merged || []
    );

    const titles = {
        divide: "DIVIDE: Splitting the array",
        compare: "COMPARE: Comparing two elements",
        merge: "MERGE: Building the sorted array",
        complete: "MERGE COMPLETE: Section sorted",
        sorted: "SORTING COMPLETE"
    };

    mergeStageTitle.textContent =
        titles[phase] || "MERGE SORT";

    mergeRangeInfo.textContent =
        `Working on indexes ${left} to ${right}` +
        (mid >= left && mid < right
            ? ` | Middle index: ${mid}`
            : "");
}


// ==========================================
// TOWER OF HANOI VISUALIZATION
// ==========================================

function renderTowerStep(index) {

    const rods = {
        A: [],
        B: [],
        C: []
    };

    // Initially, all disks are on rod A.
    for (let disk = originalDisks; disk >= 1; disk--) {
        rods.A.push(disk);
    }

    // Replay all moves up to the selected step.
    for (let i = 0; i <= index; i++) {

        const state = String(steps[i].state || "");

        const match = state.match(
            /Disk\s+(\d+)\s+from\s+([ABC])\s+to\s+([ABC])/i
        );

        if (!match) continue;

        const disk = Number(match[1]);
        const source = match[2].toUpperCase();
        const destination = match[3].toUpperCase();

        if (rods[source].length > 0) {

            const movedDisk = rods[source].pop();

            if (movedDisk === disk) {
                rods[destination].push(movedDisk);
            } else {
                // Restore the rod if the move is not valid.
                rods[source].push(movedDisk);
            }
        }
    }

    arrayContainer.hidden = true;
    mergeSortView.hidden = true;
    towerView.hidden = false;

    drawRod(rodA, rods.A);
    drawRod(rodB, rods.B);
    drawRod(rodC, rods.C);

    const currentState = String(steps[index].state || "");

    const moveMatch = currentState.match(
        /Disk\s+(\d+)\s+from\s+([ABC])\s+to\s+([ABC])/i
    );

    if (moveMatch) {

        towerStageTitle.textContent =
            `Moving Disk ${moveMatch[1]}`;

        towerMoveInfo.textContent =
            `Move disk ${moveMatch[1]} from Rod ${moveMatch[2]} to Rod ${moveMatch[3]}`;

    } else {

        towerStageTitle.textContent = "Tower of Hanoi Completed";

        towerMoveInfo.textContent =
            "All disks have been moved successfully to the destination rod.";
    }
}


function drawRod(rodElement, disks) {

    rodElement.innerHTML = "";

    disks.forEach(disk => {

        const diskElement = document.createElement("div");

        diskElement.className = "tower-disk";
        diskElement.textContent = disk;

        // Disk width is calculated relative to the full rod container.
        // Disk 1 is smallest and the largest disk is widest.
        const width = 28 + disk * 5.5;

        diskElement.style.width =
            Math.min(width, 94) + "%";

        rodElement.appendChild(diskElement);
    });
}


// ==========================================
// DISPLAY CONFIGURATION
// ==========================================

function showNormalArrayView() {

    mergeSortView.hidden = true;
    towerView.hidden = true;
    arrayContainer.hidden = false;
}


function updateProgress() {

    if (steps.length === 0) {

        progressFill.style.width = "0%";
        progressText.textContent = "0% COMPLETE";

        return;
    }

    const percentage = Math.round(
        ((currentStep + 1) / steps.length) * 100
    );

    progressFill.style.width = percentage + "%";

    progressText.textContent =
        percentage + "% COMPLETE";
}


// ==========================================
// SEARCHING ALGORITHM HIGHLIGHTING
// ==========================================

function getSearchIndex(index, step) {

    const message = step.message || "";

    // Linear and Binary Search found messages
    // contain the index.
    const indexMatch = message.match(/index\s+(\d+)/i);

    if (indexMatch) {
        return Number(indexMatch[1]);
    }

    // Linear Search compares elements one by one.
    // Count comparison steps to get the current index.
    if (selectedAlgorithm === "Linear Search") {

        let comparisonCount = 0;

        for (let i = 0; i <= index; i++) {

            if (
                String(steps[i].action).toLowerCase() === "compare"
            ) {
                comparisonCount++;
            }
        }

        if (String(step.action).toLowerCase() === "compare") {
            return comparisonCount - 1;
        }
    }

    // Fallback: locate the compared value.
    const affectedValue = Number(
        (step.affected || [])[0]
    );

    const state = JSON.parse(step.state);

    if (Array.isArray(state)) {
        return state.indexOf(affectedValue);
    }

    return -1;
}


// ==========================================
// SHOW CURRENT STEP
// ==========================================

function showStep(index) {

    if (index < 0 || index >= steps.length) return;

    currentStep = index;

    const step = steps[index];

    let parsedState = null;

    try {
        parsedState = JSON.parse(step.state);
    } catch (error) {
        // Tower of Hanoi state is a text instruction,
        // not a JSON array.
    }

    if (selectedAlgorithm === "Tower of Hanoi") {

        renderTowerStep(index);

    } else if (
        selectedAlgorithm === "Merge Sort" &&
        parsedState &&
        !Array.isArray(parsedState)
    ) {

        displayMergeSortState(parsedState, step);

    } else {

        showNormalArrayView();

        const currentArray = Array.isArray(parsedState)
            ? parsedState
            : originalArray;

        let affected = [];

        if (
            selectedAlgorithm === "Linear Search" ||
            selectedAlgorithm === "Binary Search"
        ) {

            const searchIndex = getSearchIndex(index, step);

            if (
                Number.isInteger(searchIndex) &&
                searchIndex >= 0 &&
                searchIndex < currentArray.length
            ) {
                affected = [searchIndex];
            }

        } else {

            affected = (step.affected || [])
                .map(Number)
                .filter(Number.isInteger);
        }

        displayArray(currentArray, affected);
    }

    stepMessage.textContent =
        step.message || "Processing algorithm step...";

    stepNumber.textContent =
        `${currentStep + 1} / ${steps.length}`;

    status.textContent =
        step.action || "Processing";

    previousBtn.disabled = currentStep === 0;

    nextBtn.disabled =
        currentStep === steps.length - 1;

    updateProgress();
}


// ==========================================
// PLAYBACK CONTROLS
// ==========================================

function stopPlayback() {

    if (playInterval !== null) {

        clearInterval(playInterval);

        playInterval = null;
    }

    playBtn.textContent = "▶";
    playBtn.title = "Play";
    playBtn.setAttribute("aria-label", "Play");
}


// ==========================================
// VISUALIZE BUTTON
// ==========================================

visualizeBtn.addEventListener("click", async function () {

    let inputData = {};

    if (selectedAlgorithm === "Tower of Hanoi") {

        const disks = Number(diskInput.value);

        if (
            !Number.isInteger(disks) ||
            disks < 1 ||
            disks > 12
        ) {
            alert("Please enter a number of disks between 1 and 12.");
            return;
        }

        originalDisks = disks;

        inputData.disks = disks;

    } else {

        const input = arrayInput.value.trim();

        if (input === "") {
            alert("Please enter array elements.");
            return;
        }

        const values = input.split(",");

        if (values.some(value => value.trim() === "")) {
            alert("Please enter valid integers separated by commas.");
            return;
        }

        const numbers = values.map(value => Number(value.trim()));

        if (
            numbers.some(number => !Number.isInteger(number)) ||
            numbers.length > 1000
        ) {
            alert("Please enter up to 1000 valid integers.");
            return;
        }

        originalArray = [...numbers];

        inputData.array = numbers;

        if (
            selectedAlgorithm === "Linear Search" ||
            selectedAlgorithm === "Binary Search"
        ) {

            const targetValue = targetInput.value.trim();

            if (targetValue === "") {
                alert("Please enter the target element.");
                return;
            }

            const target = Number(targetValue);

            if (!Number.isInteger(target)) {
                alert("Target must be a valid integer.");
                return;
            }

            inputData.target = target;
        }

        if (selectedAlgorithm === "Binary Search") {

            for (let i = 1; i < numbers.length; i++) {

                if (numbers[i] < numbers[i - 1]) {

                    alert(
                        "Binary Search requires a sorted array. Please enter elements in ascending order."
                    );

                    return;
                }
            }
        }
    }

    stopPlayback();

    steps = [];
    currentStep = 0;

    showNormalArrayView();

    if (selectedAlgorithm === "Tower of Hanoi") {

        displayArray([]);

    } else {

        displayArray(originalArray);
    }

    updateProgress();

    visualizeBtn.disabled = true;

    status.textContent = "Connecting to backend...";

    stepMessage.textContent =
        "Sending your input to the C++ algorithm...";

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/visualize",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    algorithm_name: selectedAlgorithm,
                    input_data: inputData
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error || "Something went wrong."
            );
        }

        steps = result.steps;

        if (!Array.isArray(steps) || steps.length === 0) {
            throw new Error("No visualization steps received.");
        }

        showStep(0);

        status.textContent = "Visualization Ready";

    } catch (error) {

        console.error("Visualization Error:", error);

        status.textContent = "Error";

        stepMessage.textContent = error.message;

        alert(error.message);

    } finally {

        visualizeBtn.disabled = false;
    }
});


// ==========================================
// NEXT STEP
// ==========================================

nextBtn.addEventListener("click", function () {

    stopPlayback();

    if (currentStep < steps.length - 1) {
        showStep(currentStep + 1);
    }
});


// ==========================================
// PREVIOUS STEP
// ==========================================

previousBtn.addEventListener("click", function () {

    stopPlayback();

    if (currentStep > 0) {
        showStep(currentStep - 1);
    }
});


// ==========================================
// PLAY / PAUSE
// ==========================================

playBtn.addEventListener("click", function () {

    if (steps.length === 0) {

        alert("Please visualize an algorithm first.");

        return;
    }

    if (playInterval !== null) {

        stopPlayback();

        return;
    }

    if (currentStep === steps.length - 1) {
        showStep(0);
    }

    playBtn.textContent = "Ⅱ";
    playBtn.title = "Pause";
    playBtn.setAttribute("aria-label", "Pause");

    playInterval = setInterval(function () {

        if (currentStep < steps.length - 1) {

            showStep(currentStep + 1);

        } else {

            stopPlayback();

            status.textContent =
                "Visualization Completed";
        }

    }, 1000);
});


// ==========================================
// RESET
// ==========================================

resetBtn.addEventListener("click", function () {

    stopPlayback();

    if (steps.length > 0) {

        showStep(0);

    } else {

        showNormalArrayView();

        displayArray(originalArray);

        stepNumber.textContent = "0";

        previousBtn.disabled = true;
        nextBtn.disabled = true;

        status.textContent = "Waiting to start...";

        stepMessage.textContent =
            "Enter the input and click Visualize Algorithm to begin.";

        updateProgress();
    }
});

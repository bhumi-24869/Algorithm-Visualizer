
// ==========================================
// 1. GET SELECTED ALGORITHM FROM URL
// ==========================================

const params = new URLSearchParams(window.location.search);

const algorithm = params.get("algorithm") || "Bubble Sort";


// ==========================================
// 2. ALGORITHM INFORMATION
// ==========================================

const algorithmDescriptions = {

    "Bubble Sort":
        "Explore how Bubble Sort compares adjacent elements and swaps them step by step.",

    "Selection Sort":
        "Explore how Selection Sort finds the smallest element and places it in the correct position.",

    "Insertion Sort":
        "Explore how Insertion Sort builds a sorted array by inserting elements into their correct positions.",

    "Merge Sort":
        "Explore how Merge Sort divides an array into smaller parts and merges them in sorted order.",

    "Quick Sort":
        "Explore how Quick Sort uses a pivot to divide an array into smaller sections."

};


// ==========================================
// 3. DISPLAY SELECTED ALGORITHM
// ==========================================

const algorithmTitle = document.getElementById("algorithmTitle");

const algorithmDescription =
    document.getElementById("algorithmDescription");

const selectedAlgorithm =
    algorithmDescriptions[algorithm] ? algorithm : "Bubble Sort";

algorithmTitle.innerHTML =
    `${selectedAlgorithm} <span>Visualizer</span>`;

algorithmDescription.textContent =
    algorithmDescriptions[selectedAlgorithm];


// ==========================================
// 4. GET HTML ELEMENTS
// ==========================================

const arrayInput = document.getElementById("arrayInput");

const visualizeBtn = document.getElementById("visualizeBtn");

const arrayContainer = document.getElementById("arrayContainer");

const status = document.getElementById("status");

const stepMessage = document.getElementById("stepMessage");

const stepNumber = document.getElementById("stepNumber");

const previousBtn = document.getElementById("previousBtn");

const playBtn = document.getElementById("playBtn");

const nextBtn = document.getElementById("nextBtn");

const resetBtn = document.getElementById("resetBtn");


// ==========================================
// 5. VISUALIZATION VARIABLES
// ==========================================

let steps = [];

let currentStep = 0;

let originalArray = [];

let playInterval = null;


// ==========================================
// 6. DISPLAY ARRAY BARS
// ==========================================

function displayArray(numbers, affected = []) {

    arrayContainer.innerHTML = "";

    if (!numbers.length) {
        return;
    }

    const maxValue = Math.max(
        ...numbers.map(number => Math.abs(number)),
        1
    );

    for (let i = 0; i < numbers.length; i++) {

        // Create wrapper for bar and index
        const barWrapper = document.createElement("div");

        barWrapper.className = "bar-wrapper";

        // Create bar
        const bar = document.createElement("div");

        bar.className = "bar";

        // Calculate height
        const height = Math.max(
            20,
            (Math.abs(numbers[i]) / maxValue) * 200
        );

        bar.style.height = height + "px";

        // Display value
        bar.textContent = numbers[i];

        // Highlight affected bars
        if (affected.includes(i)) {

            bar.classList.add("active");

        }

        // Create index label
        const index = document.createElement("span");

        index.className = "bar-index";

        index.textContent = i;

        // Add elements
        barWrapper.appendChild(bar);

        barWrapper.appendChild(index);

        arrayContainer.appendChild(barWrapper);

    }

}


// ==========================================
// 7. DISPLAY ONE BACKEND STEP
// ==========================================

function showStep(index) {

    if (index < 0 || index >= steps.length) {
        return;
    }

    currentStep = index;

    const step = steps[currentStep];

    let currentArray = originalArray;

    // Read current array state from backend
    if (step.state) {

        try {

            const parsedState = JSON.parse(step.state);

            if (Array.isArray(parsedState)) {

                currentArray = parsedState;

            }

        } catch (error) {

            console.error("Could not read step state:", error);

        }

    }

    // Convert affected indexes into numbers
    const affectedIndexes = (step.affected || [])
        .map(Number)
        .filter(Number.isInteger);

    // Display bars
    displayArray(currentArray, affectedIndexes);

    // Display explanation
    stepMessage.textContent =
        step.message || "Processing algorithm step...";

    // Display step count
    stepNumber.textContent =
        `${currentStep + 1} / ${steps.length}`;

    // Display action
    status.textContent =
        step.action || "Processing";

    // Update button states
    previousBtn.disabled = currentStep === 0;

    nextBtn.disabled = currentStep === steps.length - 1;

}


// ==========================================
// 8. STOP AUTOMATIC PLAYBACK
// ==========================================

function stopPlayback() {

    if (playInterval !== null) {

        clearInterval(playInterval);

        playInterval = null;

    }

    playBtn.textContent = "Play";

}


// ==========================================
// 9. SEND INPUT TO FLASK BACKEND
// ==========================================

visualizeBtn.addEventListener("click", async function () {

    const input = arrayInput.value.trim();

    // Check empty input
    if (input === "") {

        alert("Please enter array elements.");

        return;

    }

    // Convert input into numbers
    const numbers = input.split(",").map(value => Number(value.trim()));

    // Validate integers
    if (
        numbers.some(number => !Number.isInteger(number)) ||
        numbers.length > 1000
    ) {

        alert("Please enter up to 1000 valid integers separated by commas.");

        return;

    }

    // Stop previous playback
    stopPlayback();

    steps = [];

    currentStep = 0;

    originalArray = [...numbers];

    displayArray(originalArray);

    // Disable button during request
    visualizeBtn.disabled = true;

    status.textContent = "Connecting to backend...";

    stepMessage.textContent =
        "Sending your input to the C++ algorithm...";

    try {

        // Send request to Flask
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

                    input_data: {
                        array: numbers
                    }

                })

            }
        );

        // Convert response into JSON
        const result = await response.json();

        // Handle backend errors
        if (!response.ok) {

            throw new Error(
                result.error || "Something went wrong."
            );

        }

        // Store received steps
        steps = result.steps;

        if (!Array.isArray(steps) || steps.length === 0) {

            throw new Error("No visualization steps received.");

        }

        // Show first step
        showStep(0);

        status.textContent = "Visualization Ready";

    }

    catch (error) {

        console.error("Visualization Error:", error);

        status.textContent = "Error";

        stepMessage.textContent = error.message;

        alert(error.message);

    }

    finally {

        visualizeBtn.disabled = false;

    }

});


// ==========================================
// 10. NEXT BUTTON
// ==========================================

nextBtn.addEventListener("click", function () {

    stopPlayback();

    if (currentStep < steps.length - 1) {

        showStep(currentStep + 1);

    }

});


// ==========================================
// 11. PREVIOUS BUTTON
// ==========================================

previousBtn.addEventListener("click", function () {

    stopPlayback();

    if (currentStep > 0) {

        showStep(currentStep - 1);

    }

});


// ==========================================
// 12. PLAY BUTTON
// ==========================================

playBtn.addEventListener("click", function () {

    if (steps.length === 0) {

        alert("Please visualize an array first.");

        return;

    }

    // Pause if already playing
    if (playInterval !== null) {

        stopPlayback();

        return;

    }

    // Start again if at last step
    if (currentStep === steps.length - 1) {

        showStep(0);

    }

    playBtn.textContent = "Pause";

    playInterval = setInterval(function () {

        if (currentStep < steps.length - 1) {

            showStep(currentStep + 1);

        } else {

            stopPlayback();

        }

    }, 1000);

});


// ==========================================
// 13. RESET BUTTON
// ==========================================

resetBtn.addEventListener("click", function () {

    stopPlayback();

    if (steps.length > 0) {

        showStep(0);

    } else {

        displayArray(originalArray);

        stepNumber.textContent = "0";

        previousBtn.disabled = true;

        nextBtn.disabled = true;

        status.textContent = "Waiting to start...";

        stepMessage.textContent =
            "Enter an array and click Visualize Algorithm to begin.";

    }

});

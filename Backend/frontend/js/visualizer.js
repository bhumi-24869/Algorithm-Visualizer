
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

if (algorithmDescriptions[algorithm]) {

    algorithmTitle.innerHTML =
        `${algorithm} <span>Visualizer</span>`;

    algorithmDescription.textContent =
        algorithmDescriptions[algorithm];

} else {

    algorithmTitle.innerHTML =
        "Bubble Sort <span>Visualizer</span>";

    algorithmDescription.textContent =
        algorithmDescriptions["Bubble Sort"];

}


// ==========================================
// 4. GET HTML ELEMENTS
// ==========================================

const arrayInput = document.getElementById("arrayInput");

const visualizeBtn = document.getElementById("visualizeBtn");

const arrayContainer = document.getElementById("arrayContainer");


// ==========================================
// 5. VISUALIZE INPUT ARRAY
// ==========================================

visualizeBtn.addEventListener("click", function () {

    const input = arrayInput.value.trim();

    // Check empty input
    if (input === "") {

        alert("Please enter array elements.");
        return;

    }


    // Convert input into numbers
    const numbers = input.split(",").map(Number);


    // Check valid numbers
    if (numbers.some(number => !Number.isFinite(number))) {

        alert("Please enter valid numbers separated by commas.");
        return;

    }


    // Clear previous bars
    arrayContainer.innerHTML = "";


    // Find maximum value
    const maxValue = Math.max(
        ...numbers.map(number => Math.abs(number)),
        1
    );


    // Create bars
    for (let i = 0; i < numbers.length; i++) {

        const bar = document.createElement("div");

        bar.className = "bar";

        const height = Math.max(
            20,
            (Math.abs(numbers[i]) / maxValue) * 200
        );

        bar.style.height = height + "px";

        bar.textContent = numbers[i];

        arrayContainer.appendChild(bar);

    }


    // Update status
    document.getElementById("status").textContent =
        "Array Loaded";

    document.getElementById("stepMessage").textContent =
        "Your array is ready for " + algorithm + " visualization.";

    document.getElementById("stepNumber").textContent = "0";

});

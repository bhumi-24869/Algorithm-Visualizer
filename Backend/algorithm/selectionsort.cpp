#include <vector>
#include <string>
#include "../models/step.h"

using namespace std;

// Helper function: Array ko string me convert karne ke liye
string selectionArrayToString(const vector<int>& arr) {
    string s = "[";
    for (size_t i = 0; i < arr.size(); i++) {
        s += to_string(arr[i]);
        if (i < arr.size() - 1) s += ", ";
    }
    s += "]";
    return s;
}

// Selection Sort Backend Function
vector<Step> selectionSort(vector<int> arr) {
    vector<Step> steps; // Steps ki khali diary
    size_t n = arr.size();

    for (size_t i = 0; i < n - 1; i++) {
        size_t minIndex = i;

        for (size_t j = i + 1; j < n; j++) {
            // Step 1: Comparison record karo
            Step compareStep;
            compareStep.dataStructure = "Array";
            compareStep.action = "compare";
            compareStep.state = selectionArrayToString(arr);
            compareStep.message = "Comparing " + to_string(arr[j]) + " with current minimum " + to_string(arr[minIndex]);
            compareStep.affected = {to_string(j), to_string(minIndex)};
            steps.push_back(compareStep);

            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }

        // Step 2: Swap karo agar zaroorat ho
        if (minIndex != i) {
            int temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;

            Step swapStep;
            swapStep.dataStructure = "Array";
            swapStep.action = "swap";
            swapStep.state = selectionArrayToString(arr); // Swap ke baad ki nayi state
            swapStep.message = "Swapped to place minimum element";
            swapStep.affected = {to_string(i), to_string(minIndex)};
            steps.push_back(swapStep);
        }
    }

    // Step 3: Final Sorted Step
    Step finalStep;
    finalStep.dataStructure = "Array";
    finalStep.action = "sorted";
    finalStep.state = selectionArrayToString(arr);
    finalStep.message = "Array is fully sorted!";
    steps.push_back(finalStep);

    return steps;
}
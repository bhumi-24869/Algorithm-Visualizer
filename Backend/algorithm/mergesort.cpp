
#include <iostream>
#include <vector>
#include <string>
#include "../models/step.h"

using namespace std;

// Convert array into JSON-compatible array text
string mergeArrayToString(const vector<int>& arr) {
    string s = "[";

    for (size_t i = 0; i < arr.size(); i++) {
        s += to_string(arr[i]);

        if (i < arr.size() - 1) {
            s += ",";
        }
    }

    s += "]";
    return s;
}

// Create state information for frontend
string createState(
    const vector<int>& arr,
    const vector<int>& leftPart,
    const vector<int>& rightPart,
    const string& phase,
    int left,
    int mid,
    int right,
    const vector<int>& merged
) {
    string state = "{";

    state += "\"phase\":\"" + phase + "\",";
    state += "\"array\":" + mergeArrayToString(arr) + ",";
    state += "\"leftPart\":" + mergeArrayToString(leftPart) + ",";
    state += "\"rightPart\":" + mergeArrayToString(rightPart) + ",";
    state += "\"merged\":" + mergeArrayToString(merged) + ",";
    state += "\"left\":" + to_string(left) + ",";
    state += "\"mid\":" + to_string(mid) + ",";
    state += "\"right\":" + to_string(right);

    state += "}";

    return state;
}

// Merge two sorted parts
void mergeWithSteps(
    vector<int>& arr,
    int left,
    int mid,
    int right,
    vector<Step>& steps
) {
    vector<int> L(arr.begin() + left, arr.begin() + mid + 1);
    vector<int> R(arr.begin() + mid + 1, arr.begin() + right + 1);

    int i = 0;
    int j = 0;
    int k = left;

    vector<int> merged;

    // Compare and merge
    while (i < L.size() && j < R.size()) {

        Step compareStep;

        compareStep.dataStructure = "Array";
        compareStep.action = "compare";

        compareStep.state = createState(
            arr, L, R, "compare",
            left, mid, right, merged
        );

        compareStep.message =
            "Comparing " + to_string(L[i]) +
            " from the left part with " +
            to_string(R[j]) + " from the right part.";

        compareStep.affected = {
            to_string(left + i),
            to_string(mid + 1 + j)
        };

        steps.push_back(compareStep);

        if (L[i] <= R[j]) {
            arr[k] = L[i];
            merged.push_back(L[i]);
            i++;
        }
        else {
            arr[k] = R[j];
            merged.push_back(R[j]);
            j++;
        }

        Step placeStep;

        placeStep.dataStructure = "Array";
        placeStep.action = "overwrite";

        placeStep.state = createState(
            arr, L, R, "merge",
            left, mid, right, merged
        );

        placeStep.message =
            "Placed " + to_string(arr[k]) +
            " at index " + to_string(k) + ".";

        placeStep.affected = {to_string(k)};

        steps.push_back(placeStep);

        k++;
    }

    // Copy remaining elements from left part
    while (i < L.size()) {

        arr[k] = L[i];

        merged.push_back(L[i]);

        Step step;

        step.dataStructure = "Array";
        step.action = "overwrite";

        step.state = createState(
            arr, L, R, "merge",
            left, mid, right, merged
        );

        step.message =
            "Copying remaining left element " +
            to_string(L[i]) + " into the merged array.";

        step.affected = {to_string(k)};

        steps.push_back(step);

        i++;
        k++;
    }

    // Copy remaining elements from right part
    while (j < R.size()) {

        arr[k] = R[j];

        merged.push_back(R[j]);

        Step step;

        step.dataStructure = "Array";
        step.action = "overwrite";

        step.state = createState(
            arr, L, R, "merge",
            left, mid, right, merged
        );

        step.message =
            "Copying remaining right element " +
            to_string(R[j]) + " into the merged array.";

        step.affected = {to_string(k)};

        steps.push_back(step);

        j++;
        k++;
    }

    // Merge completed
    Step completeStep;

    completeStep.dataStructure = "Array";
    completeStep.action = "merge-complete";

    completeStep.state = createState(
        arr, L, R, "complete",
        left, mid, right, merged
    );

    completeStep.message =
        "Successfully merged the two parts into sorted order.";

    steps.push_back(completeStep);
}

// Recursive Merge Sort
void mergeSortHelper(
    vector<int>& arr,
    int left,
    int right,
    vector<Step>& steps
) {
    if (left >= right) {
        return;
    }

    int mid = left + (right - left) / 2;

    vector<int> leftPart(
        arr.begin() + left,
        arr.begin() + mid + 1
    );

    vector<int> rightPart(
        arr.begin() + mid + 1,
        arr.begin() + right + 1
    );

    // Show division
    Step divideStep;

    divideStep.dataStructure = "Array";
    divideStep.action = "divide";

    divideStep.state = createState(
        arr, leftPart, rightPart, "divide",
        left, mid, right, {}
    );

    divideStep.message =
        "Dividing the array into two parts: [" +
        mergeArrayToString(leftPart) + "] and [" +
        mergeArrayToString(rightPart) + "].";

    for (int i = left; i <= right; i++) {
        divideStep.affected.push_back(to_string(i));
    }

    steps.push_back(divideStep);

    // Divide left half
    mergeSortHelper(arr, left, mid, steps);

    // Divide right half
    mergeSortHelper(arr, mid + 1, right, steps);

    // Merge both halves
    mergeWithSteps(arr, left, mid, right, steps);
}

// Main Merge Sort function
vector<Step> mergeSort(vector<int> arr) {

    vector<Step> steps;

    if (arr.empty()) {
        return steps;
    }

    mergeSortHelper(
        arr,
        0,
        static_cast<int>(arr.size()) - 1,
        steps
    );

    Step finalStep;

    finalStep.dataStructure = "Array";
    finalStep.action = "sorted";

    finalStep.state = createState(
        arr, {}, {}, "sorted",
        0, static_cast<int>(arr.size()) - 1,
        static_cast<int>(arr.size()) - 1, arr
    );

    finalStep.message =
        "Merge Sort completed! The entire array is now sorted.";

    steps.push_back(finalStep);

    return steps;
}

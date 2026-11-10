#include <iostream>
#include <vector>
#include <string>
#include "../models/step.h"

using namespace std;

// Array ko string me convert karne ka helper function (state dikhane ke liye)
string bubbleArrayToString(const vector<int>& arr) {
    string s = "[";
    for (size_t i = 0; i < arr.size(); i++) {
        s += to_string(arr[i]);
        if (i < arr.size() - 1) s += ", ";
    }
    s += "]";
    return s;
}

vector<Step> bubbleSort(vector<int> arr) {
    vector<Step> steps;
    int n = arr.size();

    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            
            // Step 1: Record comparison
            Step compareStep;
            compareStep.dataStructure = "Array";
            compareStep.action = "compare";
            compareStep.state = bubbleArrayToString(arr);
            compareStep.message = "Comparing " + to_string(arr[j]) + " and " + to_string(arr[j+1]);
            compareStep.affected = {to_string(j), to_string(j + 1)};
            steps.push_back(compareStep);

            // Step 2: Swap if necessary
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;

                Step swapStep;
                swapStep.dataStructure = "Array";
                swapStep.action = "swap";
                swapStep.state = bubbleArrayToString(arr);
                swapStep.message = "Swapped " + to_string(arr[j]) + " and " + to_string(arr[j+1]);
                swapStep.affected = {to_string(j), to_string(j + 1)};
                steps.push_back(swapStep);
            }
        }
    }

    // Final sorted step
    Step finalStep;
    finalStep.dataStructure = "Array";
    finalStep.action = "sorted";
    finalStep.state = bubbleArrayToString(arr);
    finalStep.message = "Array is fully sorted!";
    finalStep.affected = {};
    steps.push_back(finalStep);

    return steps;
}
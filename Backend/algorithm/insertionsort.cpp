#include <vector>
#include <string>
#include "../models/step.h"

using namespace std;

string insertionArrayToString(const vector<int>& arr) {
    string s = "[";
    for (size_t i = 0; i < arr.size(); i++) {
        s += to_string(arr[i]);
        if (i < arr.size() - 1) s += ", ";
    }
    s += "]";
    return s;
}

vector<Step> insertionSort(vector<int> arr) {
    vector<Step> steps; // Steps ki diary
    size_t n = arr.size();

    for (size_t i = 1; i < n; i++) {
        size_t j = i;

        while (j > 0 && arr[j] < arr[j - 1]) {
            
            Step compareStep;
            compareStep.dataStructure = "Array";
            compareStep.action = "compare";
            compareStep.state = insertionArrayToString(arr);
            compareStep.message = "Comparing " + to_string(arr[j]) + " with " + to_string(arr[j - 1]);
            compareStep.affected = {to_string(j), to_string(j - 1)};
            steps.push_back(compareStep);

            int temp = arr[j];
            arr[j] = arr[j - 1];
            arr[j - 1] = temp;

            Step swapStep;
            swapStep.dataStructure = "Array";
            swapStep.action = "swap";
            swapStep.state = insertionArrayToString(arr); // Swap ke baad ki nayi state
            swapStep.message = "Swapped elements to insert correctly";
            swapStep.affected = {to_string(j), to_string(j - 1)};
            steps.push_back(swapStep);

            j--;
        }
    }

    Step finalStep;
    finalStep.dataStructure = "Array";
    finalStep.action = "sorted";
    finalStep.state = insertionArrayToString(arr);
    finalStep.message = "Array is fully sorted!";
    steps.push_back(finalStep);

    return steps;
}
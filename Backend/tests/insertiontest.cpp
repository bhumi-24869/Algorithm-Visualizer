#include <iostream>
#include <vector>
#include <string>
#include "../models/step.h"

using namespace std;

// Helper function
string insertionArrayToString(const vector<int>& arr) {
    string s = "[";
    for (size_t i = 0; i < arr.size(); i++) {
        s += to_string(arr[i]);
        if (i < arr.size() - 1) s += ", ";
    }
    s += "]";
    return s;
}

// Insertion Sort Logic
vector<Step> insertionSort(vector<int> arr) {
    vector<Step> steps;
    size_t n = arr.size();

    for (size_t i = 1; i < n; i++) {
        size_t j = i;

        while (j > 0 && arr[j] < arr[j - 1]) {
            Step compareStep;
            compareStep.dataStructure = "Array";
            compareStep.action = "compare";
            compareStep.state = insertionArrayToString(arr);
            compareStep.message = "Comparing elements";
            compareStep.affected = {to_string(j), to_string(j - 1)};
            steps.push_back(compareStep);

            int temp = arr[j];
            arr[j] = arr[j - 1];
            arr[j - 1] = temp;

            Step swapStep;
            swapStep.dataStructure = "Array";
            swapStep.action = "swap";
            swapStep.state = insertionArrayToString(arr);
            swapStep.message = "Swapped elements";
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

int main() {
    int n;
    cout << "Enter size of array: ";
    cin >> n;

    vector<int> arr(n);
    cout << "Enter " << n << " elements: ";
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    vector<Step> steps = insertionSort(arr);

    for (size_t i = 0; i < steps.size(); i++) {
        cout << "\nStep " << i + 1 << endl;
        cout << "Action: " << steps[i].action << endl;
        cout << "State: " << steps[i].state << endl;
        cout << "Message: " << steps[i].message << endl;
    }

    return 0;
}
#include <iostream>
#include <vector>
#include <string>
#include "../models/step.h"

using namespace std;

// Helper function
string selectionArrayToString(const vector<int>& arr) {
    string s = "[";
    for (size_t i = 0; i < arr.size(); i++) {
        s += to_string(arr[i]);
        if (i < arr.size() - 1) s += ", ";
    }
    s += "]";
    return s;
}

// Selection Sort Logic yhin andar hai
vector<Step> selectionSort(vector<int> arr) {
    vector<Step> steps;
    size_t n = arr.size();

    for (size_t i = 0; i < n - 1; i++) {
        size_t minIndex = i;

        for (size_t j = i + 1; j < n; j++) {
            Step compareStep;
            compareStep.dataStructure = "Array";
            compareStep.action = "compare";
            compareStep.state = selectionArrayToString(arr);
            compareStep.message = "Comparing element";
            compareStep.affected = {to_string(j), to_string(minIndex)};
            steps.push_back(compareStep);

            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }

        if (minIndex != i) {
            int temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;

            Step swapStep;
            swapStep.dataStructure = "Array";
            swapStep.action = "swap";
            swapStep.state = selectionArrayToString(arr);
            swapStep.message = "Swapped elements";
            swapStep.affected = {to_string(i), to_string(minIndex)};
            steps.push_back(swapStep);
        }
    }

    Step finalStep;
    finalStep.dataStructure = "Array";
    finalStep.action = "sorted";
    finalStep.state = selectionArrayToString(arr);
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

    vector<Step> steps = selectionSort(arr);

    for (size_t i = 0; i < steps.size(); i++) {
        cout << "\nStep " << i + 1 << endl;
        cout << "Action: " << steps[i].action << endl;
        cout << "State: " << steps[i].state << endl;
        cout << "Message: " << steps[i].message << endl;
    }

    return 0;
}
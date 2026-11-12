#include <iostream>
#include <vector>
#include <string>
#include "../models/step.h"

using namespace std;

string quickArrayToString(const vector<int>& arr) {
    string s = "[";
    for (size_t i = 0; i < arr.size(); i++) {
        s += to_string(arr[i]);
        if (i < arr.size() - 1) s += ", ";
    }
    s += "]";
    return s;
}

int partitionWithSteps(vector<int>& arr, int low, int high, vector<Step>& steps) {
    int pivot = arr[high];
    int i = (low - 1);

    for (int j = low; j <= high - 1; j++) {
        Step compareStep;
        compareStep.dataStructure = "Array";
        compareStep.action = "compare";
        compareStep.state = quickArrayToString(arr);
        compareStep.message = "Comparing element with pivot";
        compareStep.affected = {to_string(j), to_string(high)};
        steps.push_back(compareStep);

        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;

            Step swapStep;
            swapStep.dataStructure = "Array";
            swapStep.action = "swap";
            swapStep.state = quickArrayToString(arr);
            swapStep.message = "Swapped elements around partition";
            swapStep.affected = {to_string(i), to_string(j)};
            steps.push_back(swapStep);
        }
    }

    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    Step pivotPlaceStep;
    pivotPlaceStep.dataStructure = "Array";
    pivotPlaceStep.action = "swap";
    pivotPlaceStep.state = quickArrayToString(arr);
    pivotPlaceStep.message = "Placed pivot in correct position";
    pivotPlaceStep.affected = {to_string(i + 1), to_string(high)};
    steps.push_back(pivotPlaceStep);

    return (i + 1);
}

void quickSortHelper(vector<int>& arr, int low, int high, vector<Step>& steps) {
    if (low < high) {
        int pi = partitionWithSteps(arr, low, high, steps);
        quickSortHelper(arr, low, pi - 1, steps);
        quickSortHelper(arr, pi + 1, high, steps);
    }
}

vector<Step> quickSort(vector<int> arr) {
    vector<Step> steps;
    if (arr.empty()) return steps;

    quickSortHelper(arr, 0, arr.size() - 1, steps);

    Step finalStep;
    finalStep.dataStructure = "Array";
    finalStep.action = "sorted";
    finalStep.state = quickArrayToString(arr);
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

    vector<Step> steps = quickSort(arr);

    for (size_t i = 0; i < steps.size(); i++) {
        cout << "\nStep " << i + 1 << endl;
        cout << "Action: " << steps[i].action << endl;
        cout << "State: " << steps[i].state << endl;
        cout << "Message: " << steps[i].message << endl;
    }

    return 0;
}

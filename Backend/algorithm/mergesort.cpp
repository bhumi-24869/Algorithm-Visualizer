#include <iostream>
#include <vector>
#include <string>
#include "../models/step.h"

using namespace std;

// Helper function to convert array to string
string mergeArrayToString(const vector<int>& arr) {
    string s = "[";
    for (size_t i = 0; i < arr.size(); i++) {
        s += to_string(arr[i]);
        if (i < arr.size() - 1) s += ", ";
    }
    s += "]";
    return s;
}

// Backend Merge Logic
void mergeWithSteps(vector<int>& arr, int left, int mid, int right, vector<Step>& steps) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    vector<int> L(n1), R(n2);

    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {
        Step compareStep;
        compareStep.dataStructure = "Array";
        compareStep.action = "compare";
        compareStep.state = mergeArrayToString(arr);
        compareStep.message = "Comparing elements";
        compareStep.affected = {to_string(left + i), to_string(mid + 1 + j)};
        steps.push_back(compareStep);

        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        
        Step placeStep;
        placeStep.dataStructure = "Array";
        placeStep.action = "overwrite";
        placeStep.state = mergeArrayToString(arr);
        placeStep.message = "Placed element into position";
        placeStep.affected = {to_string(k)};
        steps.push_back(placeStep);

        k++;
    }

    while (i < n1) {
        arr[k++] = L[i++];
    }
    while (j < n2) {
        arr[k++] = R[j++];
    }
}

// Backend Merge Sort Helper
void mergeSortHelper(vector<int>& arr, int left, int right, vector<Step>& steps) {
    if (left < right) {
        int mid = left + (right - left) / 2;

        mergeSortHelper(arr, left, mid, steps);
        mergeSortHelper(arr, mid + 1, right, steps);

        mergeWithSteps(arr, left, mid, right, steps);
    }
}

// Main Merge Sort Function
vector<Step> mergeSort(vector<int> arr) {
    vector<Step> steps;
    if (arr.empty()) return steps;

    mergeSortHelper(arr, 0, arr.size() - 1, steps);

    Step finalStep;
    finalStep.dataStructure = "Array";
    finalStep.action = "sorted";
    finalStep.state = mergeArrayToString(arr);
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

    vector<Step> steps = mergeSort(arr);

    for (size_t i = 0; i < steps.size(); i++) {
        cout << "\nStep " << i + 1 << endl;
        cout << "Action: " << steps[i].action << endl;
        cout << "State: " << steps[i].state << endl;
        cout << "Message: " << steps[i].message << endl;
    }

    return 0;
}
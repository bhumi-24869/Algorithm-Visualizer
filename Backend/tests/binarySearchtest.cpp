#include <iostream>
#include <vector>
#include <string>
#include "../models/step.h"

using namespace std;

// Helper to convert vector to string state
string binaryArrayToString(const vector<int>& arr) {
    string s = "[";
    for (size_t i = 0; i < arr.size(); i++) {
        s += to_string(arr[i]);
        if (i < arr.size() - 1) s += ", ";
    }
    s += "]";
    return s;
}

vector<Step> binarySearch(vector<int> arr, int target) {
    vector<Step> steps;
    int low = 0;
    int high = arr.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;

        Step compareStep;
        compareStep.dataStructure = "Array";
        compareStep.action = "compare";
        compareStep.state = binaryArrayToString(arr);
        compareStep.message = "Checking middle element " + to_string(arr[mid]) + " at index " + to_string(mid);
        compareStep.affected = {to_string(low), to_string(mid), to_string(high)};
        steps.push_back(compareStep);

        if (arr[mid] == target) {
            Step foundStep;
            foundStep.dataStructure = "Array";
            foundStep.action = "found";
            foundStep.state = binaryArrayToString(arr);
            foundStep.message = "Found target " + to_string(target) + " at index " + to_string(mid);
            foundStep.affected = {to_string(mid)};
            steps.push_back(foundStep);
            return steps;
        } 
        else if (arr[mid] < target) {
            low = mid + 1;
        } 
        else {
            high = mid - 1;
        }
    }

    Step notFoundStep;
    notFoundStep.dataStructure = "Array";
    notFoundStep.action = "not_found";
    notFoundStep.state = binaryArrayToString(arr);
    notFoundStep.message = "Target not found in array";
    notFoundStep.affected = {};
    steps.push_back(notFoundStep);

    return steps;
}
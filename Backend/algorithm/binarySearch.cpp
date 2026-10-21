
#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include "../models/step.h"

using namespace std;

string arrayToString(const vector<int>& arr) {
    stringstream ss;
    ss << "[";

    for (int i = 0; i < arr.size(); i++) {
        ss << arr[i];

        if (i != arr.size() - 1) {
            ss << ", ";
        }
    }

    ss << "]";
    return ss.str();
}

vector<Step> binarySearch(vector<int> arr, int target) {
    vector<Step> steps;

    int left = 0;
    int right = arr.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        Step s;
        s.dataStructure = "Array";
        s.action = "compare";
        s.state = arrayToString(arr);
        s.affected = {
            to_string(arr[mid]),
            to_string(target)
        };
        s.message = "Comparing " + to_string(arr[mid]) +
                    " with " + to_string(target) +
                    " at index " + to_string(mid);

        steps.push_back(s);

        if (arr[mid] == target) {
            Step found;
            found.dataStructure = "Array";
            found.action = "found";
            found.state = arrayToString(arr);
            found.affected = {to_string(arr[mid])};
            found.message = "Target found at index " +
                            to_string(mid);

            steps.push_back(found);
            return steps;
        }
        else if (arr[mid] < target) {
            left = mid + 1;
        }
        else {
            right = mid - 1;
        }
    }

    Step notFound;
    notFound.dataStructure = "Array";
    notFound.action = "not_found";
    notFound.state = arrayToString(arr);
    notFound.affected = {to_string(target)};
    notFound.message = "Target " + to_string(target) +
                       " was not found";

    steps.push_back(notFound);

    return steps;
    
}

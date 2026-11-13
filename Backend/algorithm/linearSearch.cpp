
#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include "../models/step.h"

using namespace std;

string lineararrayToString(const vector<int>& arr) {
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

vector<Step> linearSearch(vector<int> arr, int target) {
    vector<Step> steps;

    for (int i = 0; i < arr.size(); i++) {
        Step s;

        s.dataStructure = "Array";
        s.action = "compare";
        s.state = lineararrayToString(arr);
        s.affected = {
            to_string(arr[i]),
            to_string(target)
        };
        s.message = "Comparing " + to_string(arr[i])
                    + " with " + to_string(target);

        steps.push_back(s);

        if (arr[i] == target) {
            Step found;

            found.dataStructure = "Array";
            found.action = "found";
            found.state = lineararrayToString(arr);
            found.affected = {to_string(target)};
            found.message = "Target found at index "
                            + to_string(i);

            steps.push_back(found);
            return steps;
        }
    }

    Step notFound;

    notFound.dataStructure = "Array";
    notFound.action = "not_found";
    notFound.state = lineararrayToString(arr);
    notFound.affected = {to_string(target)};
    notFound.message = "Target not found in the array";

    steps.push_back(notFound);

    return steps;
}

#include <iostream>
#include <string>
#include <vector>
#include <sstream>

#include "models/step.h"

using namespace std;

// Function declarations from existing algorithm files
vector<Step> binarySearch(vector<int> arr, int target);
vector<Step> bubbleSort(vector<int> arr);

// Convert special characters into valid JSON strings
string escapeJSON(const string& text) {
    string result;

    for (char c : text) {
        switch (c) {
            case '"':
                result += "\\\"";
                break;

            case '\\':
                result += "\\\\";
                break;

            case '\n':
                result += "\\n";
                break;

            case '\r':
                result += "\\r";
                break;

            case '\t':
                result += "\\t";
                break;

            default:
                if (static_cast<unsigned char>(c) < 0x20) {
                    result += ' ';
                } else {
                    result += c;
                }
        }
    }

    return result;
}

// Convert Step objects into JSON
string stepsToJSON(const vector<Step>& steps) {
    stringstream json;
    json << "{\"steps\":[";

    for (size_t i = 0; i < steps.size(); i++) {
        const Step& s = steps[i];

        if (i > 0) {
            json << ",";
        }

        json << "{";

        json << "\"dataStructure\":\""
             << escapeJSON(s.dataStructure) << "\",";

        json << "\"action\":\""
             << escapeJSON(s.action) << "\",";

        json << "\"state\":\""
             << escapeJSON(s.state) << "\",";

        json << "\"affected\":[";

        for (size_t j = 0; j < s.affected.size(); j++) {

            if (j > 0) {
                json << ",";
            }

            json << "\""
                 << escapeJSON(s.affected[j])
                 << "\"";
        }

        json << "],";

        json << "\"message\":\""
             << escapeJSON(s.message) << "\"";

        json << "}";
    }

    json << "]}";

    return json.str();
}


// Convert comma-separated input into an integer array
vector<int> parseArray(const string& input) {
    vector<int> arr;
    stringstream ss(input);
    string value;

    while (getline(ss, value, ',')) {
        if (value.empty()) {
            throw invalid_argument("Empty array element");
        }

        size_t pos = 0;
        int number = stoi(value, &pos);

        if (pos != value.size()) {
            throw invalid_argument("Invalid array element");
        }

        arr.push_back(number);
    }

    if (arr.empty()) {
        throw invalid_argument("Array cannot be empty");
    }

    return arr;
}


// Main execution function
int main(int argc, char* argv[]) {

    try {
        if (argc < 3) {

            cerr << "Usage: algorithm_runner "
                 << "<algorithm> <array> [target]";

            return 1;
        }

        string algorithm = argv[1];
        vector<int> arr = parseArray(argv[2]);
        vector<Step> steps;

        if (algorithm == "binarySearch") {
            if (argc < 4) {
                throw invalid_argument(
                    "Binary Search requires a target"
                );
            }

            int target = stoi(argv[3]);
            steps = binarySearch(arr, target);

        }

        else if (algorithm == "bubbleSort") {
            steps = bubbleSort(arr);
        }

        else {
            throw invalid_argument(
                "Unknown algorithm"
            );
        }

        cout << stepsToJSON(steps);
        return 0;
    }

    catch (const exception& e) {
        cerr << e.what();
        return 1;
    }
}

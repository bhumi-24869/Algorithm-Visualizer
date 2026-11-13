#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <stdexcept>
#include <algorithm>
#include "models/step.h"

using namespace std;

// Algorithm function declarations
vector<Step> binarySearch(vector<int> arr, int target);
vector<Step> linearSearch(vector<int> arr, int target);
vector<Step> bubbleSort(vector<int> arr);
vector<Step> insertionSort(vector<int> arr);
vector<Step> mergeSort(vector<int> arr);
vector<Step> quickSort(vector<int> arr);
vector<Step> selectionSort(vector<int> arr);
vector<Step> towerOfHanoi(int n);

// JSON string escaping
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

        if (arr.size() > 1000) {
            throw invalid_argument("Array is too large");
        }
    }

    if (arr.empty()) {
        throw invalid_argument("Array cannot be empty");
    }

    return arr;
}

// Parse a single integer
int parseInteger(const string& input) {
    size_t pos = 0;
    int number = stoi(input, &pos);

    if (pos != input.size()) {
        throw invalid_argument("Invalid integer input");
    }

    return number;
}

// Main execution function
int main(int argc, char* argv[]) {
    try {
        if (argc < 3) {
            throw invalid_argument(
                "Usage: algorithm_runner <algorithm> <input> [target]"
            );
        }

        string algorithm = argv[1];

        vector<Step> steps;

        // SEARCHING ALGORITHMS

        if (algorithm == "binarySearch" ||
            algorithm == "linearSearch") {

            vector<int> arr = parseArray(argv[2]);

            if (argc < 4) {
                throw invalid_argument(
                    "Search algorithms require a target"
                );
            }

            int target = parseInteger(argv[3]);

            if (algorithm == "binarySearch") {
                if (!is_sorted(arr.begin(), arr.end())) {
                    throw invalid_argument(
                        "Binary Search requires a sorted array"
                    );
                }

                steps = binarySearch(arr, target);
            }

            else {
                steps = linearSearch(arr, target);
            }
        }

        // SORTING ALGORITHMS
        else if (algorithm == "bubbleSort" ||
                 algorithm == "insertionSort" ||
                 algorithm == "mergeSort" ||
                 algorithm == "quickSort" ||
                 algorithm == "selectionSort") {

            vector<int> arr = parseArray(argv[2]);

            if (algorithm == "bubbleSort") {
                steps = bubbleSort(arr);
            }

            else if (algorithm == "insertionSort") {
                steps = insertionSort(arr);
            }

            else if (algorithm == "mergeSort") {
                steps = mergeSort(arr);
            }

            else if (algorithm == "quickSort") {
                steps = quickSort(arr);
            }

            else if (algorithm == "selectionSort") {
                steps = selectionSort(arr);
            }
        }


        // TOWER OF HANOI
        else if (algorithm == "towerOfHanoi") {

            int disks = parseInteger(argv[2]);

            if (disks < 1 || disks > 12) {
                throw invalid_argument(
                    "Number of disks must be between 1 and 12"
                );
            }

            steps = towerOfHanoi(disks);
        }


        // UNKNOWN ALGORITHM
        else {

            throw invalid_argument(
                "Unknown algorithm: " + algorithm
            );
        }


        // Output JSON
        cout << stepsToJSON(steps) << endl;

        return 0;
    }

    catch (const exception& e) {
        cerr << e.what() << endl;
        return 1;
    }
}

#include <iostream>
#include <vector>
#include "../models/step.h"
#include "../algorithm/bubbleSort.cpp"

using namespace std;

int main() {
    int n;
    cout << "Enter size of array: ";
    cin >> n;

    vector<int> arr(n);
    cout << "Enter " << n << " elements: ";
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    vector<Step> steps = bubbleSort(arr);

    for (int i = 0; i < steps.size(); i++) {
        cout << "\nStep " << i + 1 << endl;
        cout << "Data Structure: " << steps[i].dataStructure << endl;
        cout << "Action: " << steps[i].action << endl;
        cout << "State: " << steps[i].state << endl;
        cout << "Message: " << steps[i].message << endl;
        
        cout << "Affected: ";
        for (const string& item : steps[i].affected) {
            cout << item << " ";
        }
        cout << endl;
    }

    return 0;
}

#include <iostream>
#include <vector>
#include "../algorithm/binarySearch.cpp"

using namespace std;

int main() {
    vector<int> arr = {2, 4, 6, 8, 10, 12, 14};
    int target = 10;

    vector<Step> steps = binarySearch(arr, target);

    for (int i = 0; i < steps.size(); i++) {
        cout << "\nStep " << i + 1 << endl;
        cout << "Data Structure: "
             << steps[i].dataStructure << endl;
        cout << "Action: "
             << steps[i].action << endl;
        cout << "State: "
             << steps[i].state << endl;

        cout << "Affected: ";
        for (const string& item : steps[i].affected) {
            cout << item << " ";
        }
        cout << endl;

        cout << "Message: "
             << steps[i].message << endl;
    }

    return 0;
}

#include <iostream>
#include <vector>
#include "../models/step.h"          
#include "../algorithm/linearSearch.cpp" 
using namespace std;                  

int main(int argc, char** argv) {
    vector<int> arr = {10, 20, 30, 40};
    int target = 30;

    vector<Step> steps = linearSearch(arr, target);

    for (int i = 0; i < steps.size(); i++) {
        cout << "Step " << i + 1 << endl;
        cout << "Action: " << steps[i].action << endl;
        cout << "Array: " << steps[i].state << endl;
        cout << "Message: " << steps[i].message << endl;
        cout << "--------------------" << endl;
    }

    return 0;
}

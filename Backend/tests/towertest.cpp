#include <iostream>
#include <vector>
#include <string>
#include "../models/step.h"

using namespace std;

void hanoiHelper(int n, char source, char helper, char destination, vector<Step>& steps) {
    if (n == 1) {
        Step moveStep;
        moveStep.dataStructure = "TowerOfHanoi";
        moveStep.action = "move";
        moveStep.state = "Disk 1 from " + string(1, source) + " to " + string(1, destination);
        moveStep.message = "Move disk 1 from rod " + string(1, source) + " to rod " + string(1, destination);
        moveStep.affected = {string(1, source), string(1, destination)};
        steps.push_back(moveStep);
        return;
    }

    hanoiHelper(n - 1, source, destination, helper, steps);

    Step moveStep;
    moveStep.dataStructure = "TowerOfHanoi";
    moveStep.action = "move";
    moveStep.state = "Disk " + to_string(n) + " from " + string(1, source) + " to " + string(1, destination);
    moveStep.message = "Move disk " + to_string(n) + " from rod " + string(1, source) + " to rod " + string(1, destination);
    moveStep.affected = {string(1, source), string(1, destination)};
    steps.push_back(moveStep);

    hanoiHelper(n - 1, helper, source, destination, steps);
}

vector<Step> towerOfHanoi(int n) {
    vector<Step> steps;
    if (n <= 0) return steps;

    hanoiHelper(n, 'A', 'B', 'C', steps);

    Step finalStep;
    finalStep.dataStructure = "TowerOfHanoi";
    finalStep.action = "completed";
    finalStep.state = "All disks moved successfully!";
    finalStep.message = "Tower of Hanoi puzzle solved!";
    steps.push_back(finalStep);

    return steps;
}

int main() {
    int n;
    cout << "Enter number of disks: ";
    cin >> n;

    vector<Step> steps = towerOfHanoi(n);

    for (size_t i = 0; i < steps.size(); i++) {
        cout << "\nStep " << i + 1 << endl;
        cout << "Action: " << steps[i].action << endl;
        cout << "State: " << steps[i].state << endl;
        cout << "Message: " << steps[i].message << endl;
    }

    return 0;
}
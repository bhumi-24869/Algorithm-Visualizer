#ifndef STEP_H
#define STEP_H

#include <string>
#include <vector>

struct Step {
    std::string dataStructure;
    std::string action;
    std::string state;
    std::vector<std::string> affected;
    std::string message;
};

#endif
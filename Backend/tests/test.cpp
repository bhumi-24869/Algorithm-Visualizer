

#include <iostream>
#include "../Models/Step.h"

int main() {
    Step s;

    s.dataStructure = "LinkedList";
    s.action = "visit";
    s.state = "10 -> 20 -> 30";
    s.affected = {"20"};
    s.message = "Visiting node 20";

    std::cout << s.dataStructure << '\n';
    std::cout << s.action << '\n';
    std::cout << s.state << '\n';
    std::cout << s.message << '\n';

    return 0;
}



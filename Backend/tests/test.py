
import sys
import os

# Add the root project directory to the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from Backend.models.step import Step

def main():
    # Create a Step object
    s = Step(
        dataStructure="Array",
        action="swap",
        state="[2, 5, 4]",
        affected=["5", "2"],
        message="Swapping 5 and 2"
    )

    # Display the Step object's fields
    print("Data Structure:", s.dataStructure)
    print("Action:", s.action)
    print("State:", s.state)
    print("Affected:", s.affected)
    print("Message:", s.message)


if __name__ == "__main__":
    main()



if __name__ == "__main__":
    main()

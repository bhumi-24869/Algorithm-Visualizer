from dataclasses import dataclass, field
from typing import List

@dataclass
class Step:
    dataStructure: str
    action: str
    state: str
    affected: List[str] = field(default_factory=list)
    message: str = ""
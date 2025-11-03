from dataclasses import dataclass

@dataclass
class Zhu:
    gan: str
    zhi: str

    def __str__(self) -> str:
        return f"{self.gan}{self.zhi}"
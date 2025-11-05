from dataclasses import dataclass
from qimen.jia_zi_graph import LiuShiJiaZi

@dataclass
class Zhu:
    gan: str
    zhi: str

    def __str__(self) -> str:
        return f"{self.gan}{self.zhi}"

    def get_gan(self) -> str:
        if self.gan == "甲":
            return LiuShiJiaZi[str(self)]["遁"]
        else:
            return self.gan
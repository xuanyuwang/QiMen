from dataclasses import dataclass, field
from typing import Any

@dataclass
class info:
    label: str
    value: Any


@dataclass
class Pan:
    JieQi: info = field(default_factory=lambda: info(label="节气", value=None))
    NianZhu: info = field(default_factory=lambda: info(label="年柱", value=None))
    YueZhu: info = field(default_factory=lambda: info(label="月柱", value=None))
    RiZhu: info = field(default_factory=lambda: info(label="日柱", value=None))
    ShiZhu: info = field(default_factory=lambda: info(label="时柱", value=None))
    YinYang: info = field(default_factory=lambda: info(label="阴阳", value=None))
    KongWang: info = field(default_factory=lambda: info(label="空亡", value=None))
    Yuan: info = field(default_factory=lambda: info(label="元", value=None))
    XunShou: info = field(default_factory=lambda: info(label="旬首", value=None))
    JuShu: info = field(default_factory=lambda: info(label="局数", value=None))

    def __str__(self) -> str:
        lines = []
        for field_name in self.__dataclass_fields__:
            field_value = getattr(self, field_name)
            if isinstance(field_value, info):
                lines.append(f"{field_value.label}: {field_value.value}")
        return "\n".join(lines)
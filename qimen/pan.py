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
    DiPan: info = field(default_factory=lambda: info(label="地盘", value=dict()))
    TianPan: info = field(default_factory=lambda: info(label="天盘", value=dict()))
    JiuXing: info = field(default_factory=lambda: info(label="九星", value=dict()))
    BaShen: info = field(default_factory=lambda: info(label="八神", value=dict()))
    ZhiShiMen: info = field(default_factory=lambda: info(label="值使门", value=None))

    def __str__(self) -> str:
        lines = []
        for field_name in self.__dataclass_fields__:
            field_value = getattr(self, field_name)
            if isinstance(field_value, info):
                # Special handling for dict values (like DiPan with Gong objects)
                if isinstance(field_value.value, dict):
                    dict_str = {k: str(v) for k, v in field_value.value.items()}
                    lines.append(f"{field_value.label}: {dict_str}")
                else:
                    lines.append(f"{field_value.label}: {str(field_value.value)}")
        return "\n".join(lines)
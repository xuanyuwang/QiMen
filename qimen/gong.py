from __future__ import annotations

from dataclasses import dataclass


@dataclass
class Gong:
    BaGua: str
    Number: int
    Name: str
    WuXing: str
    YinYang: str
    ZhuDiXing: str
    ZhuDiMen: str
    TianGan: list[str]
    DiZhi: list[str]
    FeiXing: list[str]
    FeiShen: str
    FeiMen: str

    def __str__(self) -> str:
        return self.Name


KanGong = Gong(
    BaGua="坎",
    Number=1,
    Name="坎一宫",
    WuXing="水",
    YinYang="阳",
    ZhuDiXing="天蓬",
    ZhuDiMen="休门",
    TianGan=[],
    DiZhi=[],
    FeiXing=[],
    FeiShen="",
    FeiMen="",
)

KunGong = Gong(
    BaGua="坤",
    Number=2,
    Name="坤二宫",
    WuXing="土",
    YinYang="阴",
    ZhuDiXing="天芮",
    ZhuDiMen="死门",
    TianGan=[],
    DiZhi=[],
    FeiXing=[],
    FeiShen="",
    FeiMen="",
)

ZhenGong = Gong(
    BaGua="震",
    Number=3,
    Name="震三宫",
    WuXing="木",
    YinYang="阳",
    ZhuDiXing="天冲",
    ZhuDiMen="伤门",
    TianGan=[],
    DiZhi=[],
    FeiXing=[],
    FeiShen="",
    FeiMen="",
)

XunGong = Gong(
    BaGua="巽",
    Number=4,
    Name="巽四宫",
    WuXing="木",
    YinYang="阳",
    ZhuDiXing="天辅",
    ZhuDiMen="杜门",
    TianGan=[],
    DiZhi=[],
    FeiXing=[],
    FeiShen="",
    FeiMen="",
)

ZhongGong = Gong(
    BaGua="中",
    Number=5,
    Name="中五宫",
    WuXing="土",
    YinYang="阳",
    ZhuDiXing="天禽",
    ZhuDiMen="",
    TianGan=[],
    DiZhi=[],
    FeiXing=[],
    FeiShen="",
    FeiMen="",
)

QianGong = Gong(
    BaGua="乾",
    Number=6,
    Name="乾六宫",
    WuXing="金",
    YinYang="阳",
    ZhuDiXing="天心",
    ZhuDiMen="开门",
    TianGan=[],
    DiZhi=[],
    FeiXing=[],
    FeiShen="",
    FeiMen="",
)

DuiGong = Gong(
    BaGua="兑",
    Number=7,
    Name="兑七宫",
    WuXing="金",
    YinYang="阴",
    ZhuDiXing="天柱",
    ZhuDiMen="惊门",
    TianGan=[],
    DiZhi=[],
    FeiXing=[],
    FeiShen="",
    FeiMen="",
)

GenGong = Gong(
    BaGua="艮",
    Number=8,
    Name="艮八宫",
    WuXing="土",
    YinYang="阳",
    ZhuDiXing="天任",
    ZhuDiMen="生门",
    TianGan=[],
    DiZhi=[],
    FeiXing=[],
    FeiShen="",
    FeiMen="",
)

LiGong = Gong(
    BaGua="离",
    Number=9,
    Name="离九宫",
    WuXing="火",
    YinYang="阴",
    ZhuDiXing="天英",
    ZhuDiMen="景门",
    TianGan=[],
    DiZhi=[],
    FeiXing=[],
    FeiShen="",
    FeiMen="",
)

GONGS: tuple[Gong, ...] = (
    KanGong,
    KunGong,
    ZhenGong,
    XunGong,
    ZhongGong,
    QianGong,
    DuiGong,
    GenGong,
    LiGong,
)

NumToGong = {gong.Number: gong for gong in GONGS}
NameToGong = {gong.Name: gong for gong in GONGS}
ZhuDiXingToGong = {gong.ZhuDiXing: gong for gong in GONGS}

ClockwiseGongOrder: list[Gong] = [
    QianGong,
    KanGong,
    GenGong,
    ZhenGong,
    XunGong,
    LiGong,
    KunGong,
    DuiGong,
]

AntiClockwiseGongOrder: list[Gong] = [
    DuiGong,
    KunGong,
    LiGong,
    XunGong,
    ZhenGong,
    GenGong,
    KanGong,
    QianGong,
]


def NextGong(current_gong: Gong, order: list[Gong]) -> Gong:
    index = order.index(current_gong)
    next_index = (index + 1) % len(order)
    return order[next_index]

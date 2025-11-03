from dataclasses import dataclass
@dataclass
class Gong:
    num: int
    name: str
    WuXing: str
    ZhuDiXing: str
    YinYang: str
    Men: str

    def __str__(self) -> str:
        return f"{self.name}"


KanGong = Gong(
    num=1,
    name="坎一宫",
    WuXing="水",
    ZhuDiXing="天蓬",
    YinYang="阳",
    Men="休门",
)
KunGong = Gong(
    num=2,
    name="坤二宫",
    WuXing="土",
    ZhuDiXing="天芮",
    YinYang="阴",
    Men="死门",
)
ZhenGong = Gong(
    num=3,
    name="震三宫",
    WuXing="木",
    ZhuDiXing="天冲",
    YinYang="阳",
    Men="伤门",
)
XunGong = Gong(
    num=4,
    name="巽四宫",
    WuXing="木",
    ZhuDiXing="天辅",
    YinYang="阳",
    Men="杜门",
)
ZhongGong = Gong(
    num=5,
    name="中五宫",
    WuXing="土",
    ZhuDiXing="天禽",
    YinYang="阳",
    Men="",
)
QianGong = Gong(
    num=6,
    name="乾六宫",
    WuXing="金",
    ZhuDiXing="天心",
    YinYang="阳",
    Men="开门",
)
DuiGong = Gong(
    num=7,
    name="兑七宫",
    WuXing="金",
    ZhuDiXing="天柱",
    YinYang="阴",
    Men="惊门",
)
GenGong = Gong(
    num=8,
    name="艮八宫",
    WuXing="土",
    ZhuDiXing="天任",
    YinYang="阳",
    Men="生门",
)
LiGong = Gong(
    num=9,
    name="离九宫",
    WuXing="火",
    ZhuDiXing="天英",
    YinYang="阴",
    Men="景门",
)

NumToGong = {
    1: KanGong,
    2: KunGong,
    3: ZhenGong,
    4: XunGong,
    5: ZhongGong,
    6: QianGong,
    7: DuiGong,
    8: GenGong,
    9: LiGong,
}

ClockwiseGongOrder = [
    QianGong,
    KanGong,
    GenGong,
    ZhenGong,
    XunGong,
    LiGong,
    KunGong,
    DuiGong,
]

AntiClockwiseGongOrder = [
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

# find Gong by name
NameToGong = {gong.name: gong for gong in NumToGong.values()}
ZhuDiXingToGong = {gong.ZhuDiXing: gong for gong in NumToGong.values()}
NumToGong = {gong.num: gong for gong in NumToGong.values()}
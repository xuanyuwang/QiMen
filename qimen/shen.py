BaShen = [
    "值符",
    "螣蛇",
    "太阴",
    "六合",
    "白虎",
    "玄武",
    "九地",
    "九天",
]

def nextBaShen(current: str) -> str:
    index = BaShen.index(current)
    next_index = (index + 1) % len(BaShen)
    return BaShen[next_index]

def nextGong(gong: str, yinYang: str) -> str:
    gong_order = [
        "坎一宫",
        "艮八宫",
        "震三宫",
        "巽四宫",
        "离九宫",
        "坤二宫",
        "兑七宫",
        "乾六宫",
    ]
    clockwise = yinYang == "阳"
    if not clockwise:
        gong_order.reverse()
    index = gong_order.index(gong)
    return gong_order[(index + 1) % len(gong_order)]

def ArrangeBaShen(start_bashen: str, start_gong: str, yinYang: str) -> dict[str, str]:
    arranged: dict[str, str] = {}
    current_bashen = start_bashen
    current_gong = start_gong
    for _ in range(8):
        arranged[current_bashen] = current_gong
        current_bashen = nextBaShen(current_bashen)
        current_gong = nextGong(current_gong, yinYang)
    return arranged
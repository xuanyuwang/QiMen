JiuXing = [
    "天蓬",
    "天任",
    "天冲",
    "天辅",
    "天英",    
    "天芮",
    "天柱",
    "天心",
    "天禽",
]

def nextJiuXing(xing: str) -> str:
    index = JiuXing.index(xing)
    xing = JiuXing[(index + 1) % len(JiuXing)]
    if xing == "天禽":
        return nextJiuXing(xing)
    return xing

def nextGong(gong: str) -> str:
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
    index = gong_order.index(gong)
    return gong_order[(index + 1) % len(gong_order)]

def ArrangeJiuXing(start_xing: str, start_gong: str) -> dict[str, str]:
    arranged: dict[str, str] = {}
    current_xing = start_xing
    current_gong = start_gong
    for _ in range(9):
        arranged[current_xing] = current_gong
        current_xing = nextJiuXing(current_xing)
        current_gong = nextGong(current_gong)
    arranged["天禽"] = arranged["天芮"]
    return arranged
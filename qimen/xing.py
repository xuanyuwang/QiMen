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

def NextJiuXing(xing: str) -> str:
    index = JiuXing.index(xing)
    xing = JiuXing[(index + 1) % len(JiuXing)]
    if xing == "天禽":
        return NextJiuXing(xing)
    return xing
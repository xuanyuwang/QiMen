from __future__ import annotations

import argparse
from datetime import datetime
from typing import Sequence
from tyme4py.solar import SolarTime
from tyme4py.lunar import LunarHour

from qimen import parse_observation_datetime
from qimen.jie_qi_graph import JieQiYinYang, JieQiGraph, GetJieQiYinYang
from qimen.jia_zi_graph import LiuShiJiaZi


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="qimen",
        description="Generate a 奇门遁甲 chart for a specified datetime.",
    )
    parser.add_argument(
        "--moment",
        help="Observation datetime in ISO 8601 format (e.g., 2024-03-20T09:15:00). Defaults to current local time when omitted.",
    )
    parser.add_argument(
        "--timezone",
        help="IANA timezone name (e.g., Asia/Shanghai). Required if --moment is naive.",
    )
    return parser

def get_ju(solar_time: SolarTime) -> [str, [int, int, int]]:
    jie_qi = solar_time.get_term()
    yin_yang = GetJieQiYinYang(jie_qi.get_name())
    ju_list = JieQiGraph[jie_qi.get_name()]
    print(f"节气: {jie_qi}, 阴阳: {yin_yang}, 可能的局: {ju_list}")
    
    gan_zhi = solar_time.get_sixty_cycle_hour()
    ri_gan = gan_zhi.get_day()
    print(f"日干: {ri_gan}")
    yuan = None
    xun_shou = None
    kong_wang = None
    for key in LiuShiJiaZi:
        if ri_gan in LiuShiJiaZi[key].get("上元", []):
            yuan = "上元"
            xun_shou = key
            kong_wang = LiuShiJiaZi[key]["空亡"]
            break
        if ri_gan in LiuShiJiaZi[key].get("中元", []):
            yuan = "中元"
            xun_shou = key
            kong_wang = LiuShiJiaZi[key]["空亡"]
            break
        if ri_gan in LiuShiJiaZi[key].get("下元", []):
            yuan = "下元"
            xun_shou = key
            kong_wang = LiuShiJiaZi[key]["空亡"]
            break
    print(f"元: {yuan}, 旬首: {xun_shou}, 空亡: {kong_wang}")
    
    ju = None
    if yuan == "上元":
        ju = ju_list[0]
    elif yuan == "中元":
        ju = ju_list[1]
    elif yuan == "下元":
        ju = ju_list[2]
    print(f"局: {ju}")


def main(argv: Sequence[str] | None = None) -> None:
    parser = build_parser()
    args = parser.parse_args(argv)

    raw_moment = args.moment or datetime.now().astimezone()
    observation = parse_observation_datetime(raw_moment, tz=args.timezone)

    print(
        f"{observation.year:04d}-{observation.month:02d}-{observation.day:02d}"
        f"T{observation.hour:02d}:{observation.minute:02d}"
    )
    
    solar_time = SolarTime(
        year=observation.year,
        month=observation.month,
        day=observation.day,
        hour=observation.hour,
        minute=observation.minute,
        second=0,
    )
    lunar_hour = solar_time.get_lunar_hour()
    print(f"时辰: {lunar_hour}")

    gan_zhi = solar_time.get_sixty_cycle_hour()
    nian_gan = gan_zhi.get_year()
    yue_gan = gan_zhi.get_month()
    ri_gan = gan_zhi.get_day()
    shi_gan = gan_zhi.get_sixty_cycle()
    print(f"年干: {nian_gan}")
    print(f"月干: {yue_gan}")
    print(f"日干: {ri_gan}")
    print(f"时干: {shi_gan}")
    
    get_ju(solar_time)


if __name__ == "__main__":
    main()

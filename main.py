from __future__ import annotations

import argparse
from datetime import datetime
from typing import Sequence
from tyme4py.solar import SolarTime

from qimen import parse_observation_datetime
from qimen.jie_qi_graph import JieQiGraph, GetJieQiYinYang
from qimen.jia_zi_graph import LiuShiJiaZi
from qimen.pan import Pan
from qimen.gong import NumToGong, NameToGong
from qimen.xing import ArrangeJiuXing


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

def get_yin_yang_ju_shu(solar_time: SolarTime, pan: Pan) -> None:
    ju_list = JieQiGraph[pan.JieQi.value]
    
    ri_zhu = pan.RiZhu.value
    yuan = None
    for key in LiuShiJiaZi:
        if ri_zhu in LiuShiJiaZi[key].get("上元", []):
            yuan = "上元"
            break
        if ri_zhu in LiuShiJiaZi[key].get("中元", []):
            yuan = "中元"
            break
        if ri_zhu in LiuShiJiaZi[key].get("下元", []):
            yuan = "下元"
            break
    pan.Yuan.value = yuan
    
    ju = None
    if yuan == "上元":
        ju = ju_list[0]
    elif yuan == "中元":
        ju = ju_list[1]
    elif yuan == "下元":
        ju = ju_list[2]
    pan.JuShu.value = ju
    
def di_pan(pan: Pan) -> None:
    start_num: int = pan.JuShu.value - 1
    op = (lambda x: x + 1) if pan.YinYang.value == "阳" else (lambda x: x - 1)
    generated_nums = [start_num]
    for i in range(8):
        generated_nums.append(op(generated_nums[-1]) % 9)
    for i in range(len(generated_nums)):
        generated_nums[i] = generated_nums[i] + 1
    pan.DiPan.value = {}
    pan.DiPan.value["戊"] = NumToGong[generated_nums[0]]
    pan.DiPan.value["己"] = NumToGong[generated_nums[1]]
    pan.DiPan.value["庚"] = NumToGong[generated_nums[2]]
    pan.DiPan.value["辛"] = NumToGong[generated_nums[3]]
    pan.DiPan.value["壬"] = NumToGong[generated_nums[4]]
    pan.DiPan.value["癸"] = NumToGong[generated_nums[5]]
    pan.DiPan.value["丁"] = NumToGong[generated_nums[6]]
    pan.DiPan.value["丙"] = NumToGong[generated_nums[7]]
    pan.DiPan.value["乙"] = NumToGong[generated_nums[8]]
    
def get_xun_shou_kong_wang(pan: Pan) -> None:
    shi_zhu = pan.ShiZhu.value
    xun_shou = None
    kong_wang = None
    for key in LiuShiJiaZi:
        if shi_zhu in LiuShiJiaZi[key].get("上元", []):
            xun_shou = key
            kong_wang = LiuShiJiaZi[key].get("空亡", [])
            break
        if shi_zhu in LiuShiJiaZi[key].get("中元", []):
            xun_shou = key
            kong_wang = LiuShiJiaZi[key].get("空亡", [])
            break
        if shi_zhu in LiuShiJiaZi[key].get("下元", []):
            xun_shou = key
            kong_wang = LiuShiJiaZi[key].get("空亡", [])
            break
    pan.XunShou.value = xun_shou
    pan.KongWang.value = kong_wang
    
def get_zhi_fu(pan: Pan) -> None:
    shi_zhu = pan.ShiZhu.value
    di_pan = None
    for key in LiuShiJiaZi:
        if shi_zhu in LiuShiJiaZi[key].get("上元", []) or shi_zhu in LiuShiJiaZi[key].get("中元", []) or shi_zhu in LiuShiJiaZi[key].get("下元", []):
            di_pan = LiuShiJiaZi[key]["遁"]
    gong = pan.DiPan.value[di_pan]
    xing = gong.ZhuDiXing
    
    shi_zhu_gong = pan.DiPan.value[shi_zhu[0]]
    
    pan.TianPan.value[di_pan] = shi_zhu_gong
    pan.JiuXing.value[xing] = shi_zhu_gong
    pan.BaShen.value["值符"] = shi_zhu_gong
    
def get_zhi_shi_men(pan: Pan) -> None:
    shi_zhu = pan.ShiZhu.value
    di_pan = None
    for key in LiuShiJiaZi:
        if shi_zhu in LiuShiJiaZi[key].get("上元", []) or shi_zhu in LiuShiJiaZi[key].get("中元", []) or shi_zhu in LiuShiJiaZi[key].get("下元", []):
            di_pan = LiuShiJiaZi[key]["遁"]
    gong = pan.DiPan.value[di_pan]
    pan.ZhiShiMen.value = gong.Men

def arrange_jiu_xing(pan: Pan) -> None:
    first_xing = next(iter(pan.JiuXing.value))
    first_gong = pan.JiuXing.value[first_xing].name
    arrange_jiu_xing = ArrangeJiuXing(first_xing, first_gong)
    for xing, gong_name in arrange_jiu_xing.items():
        pan.JiuXing.value[xing] = NameToGong[gong_name]


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
    print(f"时辰: {solar_time.get_lunar_hour()}")
    
    pan = Pan()
    pan.JieQi.value = solar_time.get_term().get_name()
    gan_zhi = solar_time.get_sixty_cycle_hour()
    pan.NianZhu.value = gan_zhi.get_year().get_name()
    pan.YueZhu.value = gan_zhi.get_month().get_name()
    pan.RiZhu.value = gan_zhi.get_day().get_name()
    pan.ShiZhu.value = gan_zhi.get_sixty_cycle().get_name()
    pan.YinYang.value = GetJieQiYinYang(pan.JieQi.value)

    get_yin_yang_ju_shu(solar_time, pan)
    di_pan(pan)
    get_xun_shou_kong_wang(pan)
    get_zhi_fu(pan)
    get_zhi_shi_men(pan)
    arrange_jiu_xing(pan)
    print(pan)


if __name__ == "__main__":
    main()

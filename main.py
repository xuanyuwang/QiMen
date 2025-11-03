from __future__ import annotations

import argparse
from datetime import datetime
from typing import Sequence
from tyme4py.solar import SolarTime

from qimen import parse_observation_datetime
from qimen.jie_qi_graph import JieQiGraph, GetJieQiYinYang
from qimen.jia_zi_graph import LiuShiJiaZi
from qimen.pan import Pan
from qimen.gong import NumToGong, NameToGong, ZhuDiXingToGong, NextGong, ClockwiseGongOrder
from qimen.xing import ArrangeJiuXing
from qimen.shen import ArrangeBaShen
from qimen.zhu import Zhu


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


def get_yin_yang_ju_shu(pan: Pan) -> None:
    ju_list = JieQiGraph[pan.JieQi.value]

    ri_zhu = str(pan.RiZhu.value)
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


def arrange_di_pan(pan: Pan) -> None:
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
    shi_zhu = str(pan.ShiZhu.value)
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
    pan.XunShou.value = Zhu(gan=xun_shou[0], zhi=xun_shou[1])
    pan.KongWang.value = kong_wang


def get_zhi_fu(pan: Pan) -> None:
    xun_shou = str(pan.XunShou.value)
    dun = LiuShiJiaZi[xun_shou]["遁"]
    gong = pan.DiPan.value[dun]
    xing = gong.ZhuDiXing

    target_gong = pan.DiPan.value[pan.ShiZhu.value.gan]
    pan.TianPan.value[dun] = target_gong
    pan.JiuXing.value[xing] = target_gong
    pan.BaShen.value["值符"] = target_gong


def get_zhi_shi_men(pan: Pan) -> None:
    shi_zhu = str(pan.ShiZhu.value)
    di_pan = None
    for key in LiuShiJiaZi:
        if (
            shi_zhu in LiuShiJiaZi[key].get("上元", [])
            or shi_zhu in LiuShiJiaZi[key].get("中元", [])
            or shi_zhu in LiuShiJiaZi[key].get("下元", [])
        ):
            di_pan = LiuShiJiaZi[key]["遁"]
    gong = pan.DiPan.value[di_pan]
    pan.ZhiShiMen.value = gong.Men


def arrange_jiu_xing(pan: Pan) -> None:
    first_xing = next(iter(pan.JiuXing.value))
    first_gong = pan.JiuXing.value[first_xing].name
    arranged_jiu_xing = ArrangeJiuXing(first_xing, first_gong)
    for xing, gong_name in arranged_jiu_xing.items():
        pan.JiuXing.value[xing] = NameToGong[gong_name]


def arrange_ba_shen(pan: Pan) -> None:
    first_bashen = next(iter(pan.BaShen.value))
    first_gong = pan.BaShen.value[first_bashen].name
    arranged_ba_shen = ArrangeBaShen(first_bashen, first_gong, pan.YinYang.value)
    for bashen, gong_name in arranged_ba_shen.items():
        pan.BaShen.value[bashen] = NameToGong[gong_name]

def arrange_tian_pan(pan: Pan) -> None:
    for xing, gong in pan.JiuXing.value.items():
        gong = NameToGong[gong.name]
        original_gong_of_xing = ZhuDiXingToGong[xing].name
        di_pan_gong_to_tian_gan = {gong.name: tian_gan for tian_gan, gong in pan.DiPan.value.items()}
        tian_gan = di_pan_gong_to_tian_gan[original_gong_of_xing]
        pan.TianPan.value[tian_gan] = gong

def arrange_ba_men(pan: Pan) -> None:
    dun = LiuShiJiaZi[str(pan.XunShou.value)]["遁"]
    dun_gong = pan.DiPan.value[dun]

    op = (lambda x: x + 1) if pan.YinYang.value == "阳" else (lambda x: x - 1)
    di_zhi_list = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
    next_di_zhi = lambda x: di_zhi_list[(di_zhi_list.index(x) + 1) % 12]
    next_gong_num = lambda current_gong_num: (op(current_gong_num - 1) % 8) + 1
    start_gong_num = dun_gong.num
    start_di_zhi = pan.XunShou.value.zhi
    di_zhi_map = {start_di_zhi: start_gong_num}
    for i in range(len(di_zhi_list)):
        start_di_zhi = next_di_zhi(start_di_zhi)
        start_gong_num = next_gong_num(start_gong_num)
        di_zhi_map[start_di_zhi] = start_gong_num
    
    target_di_zhi = pan.ShiZhu.value.zhi
    
    ba_men = ["开门", "休门", "生门", "伤门", "杜门", "景门", "死门", "惊门"]
    next_men = lambda current_men: ba_men[(ba_men.index(current_men) + 1) % len(ba_men)]
    start_men = pan.ZhiShiMen.value
    start_gong = NumToGong[di_zhi_map[target_di_zhi]]
    pan.BaMen.value = {start_men: start_gong}
    for i in range(len(ba_men)):
        start_men = next_men(start_men)
        start_gong = NextGong(start_gong, ClockwiseGongOrder)
        pan.BaMen.value[start_men] = start_gong

def ji_gong(pan: Pan) -> None:
    di_pan_tian_gan = None
    for di_pan, gong in pan.DiPan.value.items():
        if gong.name == "中五宫":
            di_pan_tian_gan = di_pan
            continue
    pan.DiPan.value[di_pan_tian_gan] = NumToGong[2]
    
        
def group_by_gong(pan: Pan):
    gong_map = {}
    for gong in NumToGong.values():
        gong_map[gong.name] = {
            "宫位": gong.name,
            "天干": [],
            "地支": [],
            "星": [],
            "神": None,
            "门": None,
        }
    for tian_gan, gong in pan.TianPan.value.items():
        gong_map[gong.name]["天干"].append(tian_gan)
    for di_zhi, gong in pan.DiPan.value.items():
        gong_map[gong.name]["地支"].append(di_zhi)
    for xing, gong in pan.JiuXing.value.items():
        gong_map[gong.name]["星"].append(xing)
    for shen, gong in pan.BaShen.value.items():
        gong_map[gong.name]["神"] = shen 
    for men, gong in pan.BaMen.value.items():
        gong_map[gong.name]["门"] = men
    for gong_name, details in gong_map.items():
        print(f"{gong_name}: {details}")

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
    pan.NianZhu.value = Zhu(
        gan=gan_zhi.get_year().get_name()[0],
        zhi=gan_zhi.get_year().get_name()[1],
    )
    pan.YueZhu.value = Zhu(
        gan=gan_zhi.get_month().get_name()[0],
        zhi=gan_zhi.get_month().get_name()[1],
    )
    pan.RiZhu.value = Zhu(
        gan=gan_zhi.get_day().get_name()[0],
        zhi=gan_zhi.get_day().get_name()[1],
    )
    pan.ShiZhu.value = Zhu(
        gan=gan_zhi.get_sixty_cycle().get_name()[0],
        zhi=gan_zhi.get_sixty_cycle().get_name()[1],
    )
    pan.YinYang.value = GetJieQiYinYang(pan.JieQi.value)

    get_yin_yang_ju_shu(pan)
    arrange_di_pan(pan)
    get_xun_shou_kong_wang(pan)
    get_zhi_fu(pan)
    get_zhi_shi_men(pan)
    arrange_jiu_xing(pan)
    arrange_ba_shen(pan)
    arrange_tian_pan(pan)
    arrange_ba_men(pan)
    ji_gong(pan)
    group_by_gong(pan)
    print(pan)


if __name__ == "__main__":
    main()

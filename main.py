from __future__ import annotations

import argparse
from datetime import datetime
from typing import Sequence
from tyme4py.solar import SolarTime
from tyme4py.lunar import LunarHour

from qimen import parse_observation_datetime


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
    print(f"Lunar Hour: {lunar_hour}")


if __name__ == "__main__":
    main()

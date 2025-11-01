from __future__ import annotations

import argparse
from datetime import datetime, timezone
from typing import Sequence

from qimen import parse_observation_datetime


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="qimen",
        description="Generate a 奇门遁甲 chart for a specified datetime.",
    )
    parser.add_argument(
        "--moment",
        help="Observation datetime in ISO 8601 format. Defaults to current UTC time when omitted.",
    )
    parser.add_argument(
        "--timezone",
        help="IANA timezone name (e.g., Asia/Shanghai). Required if --moment is naive.",
    )
    return parser


def main(argv: Sequence[str] | None = None) -> None:
    parser = build_parser()
    args = parser.parse_args(argv)

    raw_moment = args.moment or datetime.now(timezone.utc)
    observation = parse_observation_datetime(raw_moment, tz=args.timezone)

    print(observation.instant.isoformat())


if __name__ == "__main__":
    main()

"""Utilities for converting observation datetimes into local components."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional, Union
from zoneinfo import ZoneInfo


@dataclass(slots=True, frozen=True)
class ObservationMoment:
    """Localized representation of the observation moment."""

    year: int
    month: int
    day: int
    hour: int
    minute: int

    @classmethod
    def from_datetime(cls, value: datetime) -> ObservationMoment:
        return cls(
            year=value.year,
            month=value.month,
            day=value.day,
            hour=value.hour,
            minute=value.minute,
        )


def parse_observation_datetime(
    value: Union[str, datetime],
    tz: Optional[str] = None,
) -> ObservationMoment:
    """Parse user input and return localized calendar components.

    Assumes the input moment and timezone are already valid."""
    moment = _to_datetime(value)
    localized = _apply_timezone(moment, tz)
    return ObservationMoment.from_datetime(localized)


def _to_datetime(value: Union[str, datetime]) -> datetime:
    if isinstance(value, datetime):
        return value
    stripped = value.strip()
    if stripped.endswith("Z"):
        return datetime.fromisoformat(stripped[:-1]).replace(tzinfo=timezone.utc)
    return datetime.fromisoformat(stripped)


def _apply_timezone(moment: datetime, tz: Optional[str]) -> datetime:
    local_zone = datetime.now().astimezone().tzinfo
    if local_zone is None:
        local_zone = timezone.utc
    target_zone = ZoneInfo(tz) if tz else local_zone
    print("target_zone:", target_zone)

    if moment.tzinfo is None or moment.tzinfo.utcoffset(moment) is None:
        return moment.replace(tzinfo=target_zone)

    return moment.astimezone(target_zone)

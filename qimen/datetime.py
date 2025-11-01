"""Utilities for parsing and validating observation datetimes."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional, Union
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError


class DateTimeParseError(ValueError):
    """Raised when the observation datetime cannot be parsed."""


@dataclass(slots=True, frozen=True)
class ObservationMoment:
    """Normalized representation of the observation moment."""

    instant: datetime

    def __post_init__(self) -> None:
        if self.instant.tzinfo is None or self.instant.tzinfo.utcoffset(self.instant) is None:
            raise DateTimeParseError("Observation moment must be timezone-aware.")
        if not (datetime(1800, 1, 1, tzinfo=timezone.utc) <= self.instant <= datetime(2200, 12, 31, tzinfo=timezone.utc)):
            raise DateTimeParseError("Observation moment must be between years 1800 and 2200.")


def parse_observation_datetime(
    value: Union[str, datetime],
    tz: Optional[str] = None,
) -> ObservationMoment:
    """Parse user input into a validated, timezone-aware datetime.

    Args:
        value: String or datetime object representing the observation moment.
        tz: Optional IANA timezone identifier (e.g., ``Asia/Shanghai``).

    Returns:
        ObservationMoment: Normalized result with timezone-aware datetime.

    Raises:
        DateTimeParseError: If parsing fails or the timezone is invalid.
    """
    moment = _to_datetime(value)
    target_zone = _resolve_timezone(tz)

    if moment.tzinfo is None or moment.tzinfo.utcoffset(moment) is None:
        if target_zone is None:
            raise DateTimeParseError("Naive datetimes must provide a timezone.")
        moment = moment.replace(tzinfo=target_zone)
    elif target_zone is not None:
        moment = moment.astimezone(target_zone)

    normalized = moment.astimezone(timezone.utc)
    return ObservationMoment(instant=normalized)


def _to_datetime(value: Union[str, datetime]) -> datetime:
    if isinstance(value, datetime):
        return value
    if not isinstance(value, str):
        raise DateTimeParseError(f"Unsupported type for datetime parsing: {type(value)!r}")
    stripped = value.strip()
    if not stripped:
        raise DateTimeParseError("Datetime string cannot be empty.")
    try:
        if stripped.endswith("Z"):
            return datetime.fromisoformat(stripped[:-1]).replace(tzinfo=timezone.utc)
        return datetime.fromisoformat(stripped)
    except ValueError as exc:
        raise DateTimeParseError(f"Unable to parse datetime string: {value!r}") from exc


def _resolve_timezone(tz: Optional[str]) -> Optional[ZoneInfo]:
    if tz is None:
        return None
    try:
        return ZoneInfo(tz)
    except ZoneInfoNotFoundError as exc:
        raise DateTimeParseError(f"Unknown timezone '{tz}'.") from exc

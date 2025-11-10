/**
 * Utilities for converting observation datetimes into local components.
 */

/**
 * ObservationMoment - Localized representation of the observation moment
 */
export class ObservationMoment {
  /**
   * @param {number} year
   * @param {number} month
   * @param {number} day
   * @param {number} hour
   * @param {number} minute
   */
  constructor(year, month, day, hour, minute) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.hour = hour;
    this.minute = minute;
  }

  /**
   * Create from a Date object
   * @param {Date} date
   * @returns {ObservationMoment}
   */
  static fromDate(date) {
    return new ObservationMoment(
      date.getFullYear(),
      date.getMonth() + 1,  // JavaScript months are 0-indexed
      date.getDate(),
      date.getHours(),
      date.getMinutes()
    );
  }
}

/**
 * Parse user input and return localized calendar components
 * @param {string|Date} value - ISO 8601 string or Date object
 * @param {string|null} tz - IANA timezone name (e.g., 'Asia/Shanghai')
 * @returns {ObservationMoment}
 */
export function parseObservationDatetime(value, tz = null) {
  const moment = toDatetime(value);
  const localized = applyTimezone(moment, tz);
  return ObservationMoment.fromDate(localized);
}

/**
 * Convert value to Date object
 * @param {string|Date} value
 * @returns {Date}
 */
function toDatetime(value) {
  if (value instanceof Date) {
    return value;
  }
  
  const stripped = value.trim();
  
  // Handle 'Z' suffix (UTC)
  if (stripped.endsWith('Z')) {
    return new Date(stripped);
  }
  
  // Parse ISO 8601 format
  return new Date(stripped);
}

/**
 * Apply timezone to the datetime
 * @param {Date} moment
 * @param {string|null} tz - IANA timezone name
 * @returns {Date}
 */
function applyTimezone(moment, tz) {
  // If timezone is provided, convert to that timezone
  if (tz) {
    // Create a formatter for the target timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const parts = formatter.formatToParts(moment);
    const getValue = (type) => parts.find(p => p.type === type)?.value;
    
    console.log('target_zone:', tz);
    
    // Reconstruct the date in the target timezone
    return new Date(
      parseInt(getValue('year')),
      parseInt(getValue('month')) - 1,
      parseInt(getValue('day')),
      parseInt(getValue('hour')),
      parseInt(getValue('minute')),
      parseInt(getValue('second'))
    );
  }
  
  // If no timezone specified, return as-is (local time)
  return moment;
}

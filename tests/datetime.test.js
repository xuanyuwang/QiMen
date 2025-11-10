/**
 * Tests for datetime parsing utilities
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ObservationMoment, parseObservationDatetime } from '../qimen/datetime.js';

describe('ObservationMoment', () => {
  it('should create instance with all fields', () => {
    const moment = new ObservationMoment(2024, 3, 20, 9, 15);
    assert.strictEqual(moment.year, 2024);
    assert.strictEqual(moment.month, 3);
    assert.strictEqual(moment.day, 20);
    assert.strictEqual(moment.hour, 9);
    assert.strictEqual(moment.minute, 15);
  });

  it('should create from Date object', () => {
    const date = new Date(2024, 2, 20, 9, 15); // Month is 0-indexed in JS
    const moment = ObservationMoment.fromDate(date);
    assert.strictEqual(moment.year, 2024);
    assert.strictEqual(moment.month, 3); // Should be 1-indexed in ObservationMoment
    assert.strictEqual(moment.day, 20);
    assert.strictEqual(moment.hour, 9);
    assert.strictEqual(moment.minute, 15);
  });
});

describe('parseObservationDatetime', () => {
  it('should parse ISO 8601 string without timezone', () => {
    const moment = parseObservationDatetime('2024-03-20T09:15:00');
    assert.strictEqual(moment.year, 2024);
    assert.strictEqual(moment.month, 3);
    assert.strictEqual(moment.day, 20);
    assert.strictEqual(moment.hour, 9);
    assert.strictEqual(moment.minute, 15);
  });

  it('should parse ISO 8601 string with Z suffix (UTC)', () => {
    const moment = parseObservationDatetime('2024-03-20T09:15:00Z');
    assert.strictEqual(moment.year, 2024);
    assert.strictEqual(moment.month, 3);
    assert.strictEqual(moment.day, 20);
    // Note: hour may differ due to local timezone conversion
    assert.ok(moment.hour >= 0 && moment.hour < 24);
  });

  it('should parse Date object', () => {
    const date = new Date(2024, 2, 20, 9, 15); // March 20, 2024 at 09:15
    const moment = parseObservationDatetime(date);
    assert.strictEqual(moment.year, 2024);
    assert.strictEqual(moment.month, 3);
    assert.strictEqual(moment.day, 20);
    assert.strictEqual(moment.hour, 9);
    assert.strictEqual(moment.minute, 15);
  });

  it('should handle timezone conversion to Asia/Shanghai', () => {
    // Create a UTC time
    const moment = parseObservationDatetime('2024-03-20T01:15:00Z', 'Asia/Shanghai');
    assert.strictEqual(moment.year, 2024);
    assert.strictEqual(moment.month, 3);
    assert.strictEqual(moment.day, 20);
    assert.strictEqual(moment.hour, 9); // UTC+8 = 01:15 + 8 hours = 09:15
    assert.strictEqual(moment.minute, 15);
  });

  it('should handle timezone conversion to America/New_York', () => {
    // Create a UTC time
    const moment = parseObservationDatetime('2024-03-20T14:15:00Z', 'America/New_York');
    assert.strictEqual(moment.year, 2024);
    assert.strictEqual(moment.month, 3);
    assert.strictEqual(moment.day, 20);
    // EDT is UTC-4, so 14:15 - 4 = 10:15
    assert.strictEqual(moment.hour, 10);
    assert.strictEqual(moment.minute, 15);
  });

  it('should handle strings with whitespace', () => {
    const moment = parseObservationDatetime('  2024-03-20T09:15:00  ');
    assert.strictEqual(moment.year, 2024);
    assert.strictEqual(moment.month, 3);
    assert.strictEqual(moment.day, 20);
    assert.strictEqual(moment.hour, 9);
    assert.strictEqual(moment.minute, 15);
  });

  it('should default to local time when no timezone specified', () => {
    const date = new Date();
    const moment = parseObservationDatetime(date);
    assert.strictEqual(moment.year, date.getFullYear());
    assert.strictEqual(moment.month, date.getMonth() + 1);
    assert.strictEqual(moment.day, date.getDate());
    assert.strictEqual(moment.hour, date.getHours());
    assert.strictEqual(moment.minute, date.getMinutes());
  });
});

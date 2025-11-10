#!/usr/bin/env node

/**
 * QiMen DunJia CLI - Generate a 奇门遁甲 chart for a specified datetime
 */

import { parseObservationDatetime } from './qimen/datetime.js';
import { SolarTime } from 'tyme4ts';
import { Pan } from './qimen/models/pan.js';

/**
 * Parse command line arguments
 * @returns {Object} Parsed arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    moment: null,
    timezone: null
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--moment' && i + 1 < args.length) {
      result.moment = args[i + 1];
      i++;
    } else if (args[i] === '--timezone' && i + 1 < args.length) {
      result.timezone = args[i + 1];
      i++;
    }
  }

  return result;
}

/**
 * Main entry point
 */
function main() {
  const args = parseArgs();

  // Use provided moment or default to current time
  const rawMoment = args.moment || new Date();
  const observation = parseObservationDatetime(rawMoment, args.timezone);

  // Print formatted datetime
  const year = String(observation.year).padStart(4, '0');
  const month = String(observation.month).padStart(2, '0');
  const day = String(observation.day).padStart(2, '0');
  const hour = String(observation.hour).padStart(2, '0');
  const minute = String(observation.minute).padStart(2, '0');
  console.log(`${year}-${month}-${day}T${hour}:${minute}`);

  // Create SolarTime object
  const solarTime = SolarTime.fromYmdHms(
    observation.year,
    observation.month,
    observation.day,
    observation.hour,
    observation.minute,
    0
  );

  // Create Pan and populate from SolarTime
  const pan = new Pan();
  pan.calculateShiChen(solarTime);
  pan.calculateJieQi(solarTime);
  pan.calculateNianZhu(solarTime);
  pan.calculateYueZhu(solarTime);
  pan.calculateRiZhu(solarTime);
  pan.calculateShiZhu(solarTime);

  // Calculate derived fields (YinYang is auto-derived from JieQi)
  pan.calculateYuan();
  pan.calculateJuShu();
  pan.arrangeDiPan();
  pan.calculateXunShou();
  pan.calculateKongWang();
  pan.calculateZhiFu();
  pan.calculateZhiShiMen();
  pan.arrangeJiuXing();
  pan.arrangeBaShen();
  pan.arrangeTianPan();
  pan.arrangeBaMen();
  pan.jiGong();

  console.log(`\n阴阳: ${pan.YinYang}`);
  console.log(`元: ${pan.Yuan}`);
  console.log(`局数: ${pan.JuShu}`);
  console.log(`旬首: ${pan.XunShou}`);
  console.log(`空亡: ${pan.KongWang.join(', ')}`);
  console.log(`值使门: ${pan.ZhiShiMen}`);

  // Print full pan details
  console.log('\n' + pan.toString());
}

main();

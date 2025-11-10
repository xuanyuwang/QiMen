/**
 * Jiu Xing (九星) - Nine Stars arrangement logic
 */

import * as JiuXing from '../data/jiu_xing.js';

const JiuXingOrder = [
  JiuXing.TianPeng,
  JiuXing.TianRen,
  JiuXing.TianChong,
  JiuXing.TianFu,
  JiuXing.TianYing,
  JiuXing.TianRui,
  JiuXing.TianZhu,
  JiuXing.TianXin,
  JiuXing.TianQin,
];

/**
 * Get next Jiu Xing in sequence, skipping 天禽
 * @param {string} xing - Current star
 * @returns {string} Next star
 */
export function nextJiuXing(xing) {
  const index = JiuXingOrder.indexOf(xing);
  const nextXing = JiuXingOrder[(index + 1) % JiuXingOrder.length];
  if (nextXing === JiuXing.TianQin) {
    return nextJiuXing(nextXing);
  }
  return nextXing;
}

/**
 * Get next Gong in clockwise order
 * @param {string} gong - Current palace
 * @returns {string} Next palace
 */
function nextGong(gong) {
  const gongOrder = [
    "坎一宫",
    "艮八宫",
    "震三宫",
    "巽四宫",
    "离九宫",
    "坤二宫",
    "兑七宫",
    "乾六宫",
  ];
  const index = gongOrder.indexOf(gong);
  return gongOrder[(index + 1) % gongOrder.length];
}

/**
 * Arrange Jiu Xing starting from a specific star and palace
 * @param {string} startXing - Starting star
 * @param {string} startGong - Starting palace
 * @returns {Object} Mapping of stars to palaces
 */
export function ArrangeJiuXing(startXing, startGong) {
  const arranged = {};
  let currentXing = startXing;
  let currentGong = startGong;
  
  for (let i = 0; i < 9; i++) {
    arranged[currentGong] = currentXing;
    currentXing = nextJiuXing(currentXing);
    currentGong = nextGong(currentGong);
  }
  
  return arranged;
}

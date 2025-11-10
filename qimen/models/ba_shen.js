/**
 * Ba Shen (八神) - Eight Spirits arrangement logic
 */

import * as BaShen from '../data/ba_shen.js';
import * as YinYang from '../data/yin_yang.js';

const BaShenOrder = [
  BaShen.ZhiFu,
  BaShen.TengShe,
  BaShen.TaiYin,
  BaShen.LiuHe,
  BaShen.BaiHu,
  BaShen.XuanWu,
  BaShen.JiuDi,
  BaShen.JiuTian,
];

/**
 * Get next Ba Shen in sequence
 * @param {string} current - Current spirit
 * @returns {string} Next spirit
 */
export function nextBaShen(current) {
  const index = BaShenOrder.indexOf(current);
  const nextIndex = (index + 1) % BaShenOrder.length;
  return BaShenOrder[nextIndex];
}

/**
 * Get next Gong based on Yin/Yang direction
 * @param {string} gong - Current palace
 * @param {string} yinYang - "阳" for clockwise, "阴" for counter-clockwise
 * @returns {string} Next palace
 */
function nextGong(gong, yinYang) {
  let gongOrder = [
    "坎一宫",
    "艮八宫",
    "震三宫",
    "巽四宫",
    "离九宫",
    "坤二宫",
    "兑七宫",
    "乾六宫",
  ];
  
  const clockwise = yinYang === YinYang.Yang;
  if (!clockwise) {
    gongOrder = [...gongOrder].reverse();
  }
  
  const index = gongOrder.indexOf(gong);
  return gongOrder[(index + 1) % gongOrder.length];
}

/**
 * Arrange Ba Shen starting from a specific spirit and palace
 * @param {string} startBaShen - Starting spirit
 * @param {string} startGong - Starting palace
 * @param {string} yinYang - "阳" or "阴" for direction
 * @returns {Object} Mapping of spirits to palaces
 */
export function ArrangeBaShen(startBaShen, startGong, yinYang) {
  const arranged = {};
  let currentBaShen = startBaShen;
  let currentGong = startGong;
  
  for (let i = 0; i < 8; i++) {
    arranged[currentGong] = currentBaShen;
    currentBaShen = nextBaShen(currentBaShen);
    currentGong = nextGong(currentGong, yinYang);
  }
  
  return arranged;
}

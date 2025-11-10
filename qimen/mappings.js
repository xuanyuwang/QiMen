/**
 * Mappings between different data combinations
 * This file acts as a hub to prevent circular dependencies
 */

import {
  KanGongFixedState,
  KunGongFixedState,
  ZhenGongFixedState,
  XunGongFixedState,
  ZhongGongFixedState,
  QianGongFixedState,
  DuiGongFixedState,
  GenGongFixedState,
  LiGongFixedState
} from './models/gong.js';
import * as JiuXing from './data/jiu_xing.js';

// Internal mapping objects
const _numToGongMap = Object.freeze({
  1: KanGongFixedState,
  2: KunGongFixedState,
  3: ZhenGongFixedState,
  4: XunGongFixedState,
  5: ZhongGongFixedState,
  6: QianGongFixedState,
  7: DuiGongFixedState,
  8: GenGongFixedState,
  9: LiGongFixedState
});

const _nameToGongMap = Object.freeze({
  [KanGongFixedState.Name]: KanGongFixedState,
  [KunGongFixedState.Name]: KunGongFixedState,
  [ZhenGongFixedState.Name]: ZhenGongFixedState,
  [XunGongFixedState.Name]: XunGongFixedState,
  [ZhongGongFixedState.Name]: ZhongGongFixedState,
  [QianGongFixedState.Name]: QianGongFixedState,
  [DuiGongFixedState.Name]: DuiGongFixedState,
  [GenGongFixedState.Name]: GenGongFixedState,
  [LiGongFixedState.Name]: LiGongFixedState
});

const _zhuDiXingToGongMap = Object.freeze({
  [JiuXing.TianPeng]: KanGongFixedState,
  [JiuXing.TianRui]: KunGongFixedState,
  [JiuXing.TianChong]: ZhenGongFixedState,
  [JiuXing.TianFu]: XunGongFixedState,
  [JiuXing.TianQin]: ZhongGongFixedState,
  [JiuXing.TianXin]: QianGongFixedState,
  [JiuXing.TianZhu]: DuiGongFixedState,
  [JiuXing.TianRen]: GenGongFixedState,
  [JiuXing.TianYing]: LiGongFixedState
});

/**
 * Get Gong fixed state by number
 * @param {number} num - Palace number (1-9)
 * @returns {Object} Gong fixed state
 */
export function NumToGong(num) {
  return _numToGongMap[num];
}

/**
 * Get Gong fixed state by name
 * @param {string} name - Palace name (e.g., "坎一宫")
 * @returns {Object} Gong fixed state
 */
export function NameToGong(name) {
  return _nameToGongMap[name];
}

/**
 * Get Gong fixed state by ZhuDiXing (star)
 * @param {string} xing - Star name (e.g., "天蓬")
 * @returns {Object} Gong fixed state
 */
export function ZhuDiXingToGong(xing) {
  return _zhuDiXingToGongMap[xing];
}

// Palace orders for rotation
export const ClockwiseGongOrder = Object.freeze([
  QianGongFixedState,
  KanGongFixedState,
  GenGongFixedState,
  ZhenGongFixedState,
  XunGongFixedState,
  LiGongFixedState,
  KunGongFixedState,
  DuiGongFixedState
]);

export const AntiClockwiseGongOrder = Object.freeze([
  DuiGongFixedState,
  KunGongFixedState,
  LiGongFixedState,
  XunGongFixedState,
  ZhenGongFixedState,
  GenGongFixedState,
  KanGongFixedState,
  QianGongFixedState
]);

/**
 * Get next Gong in the specified order
 * @param {Object} currentGong - Current palace fixed state
 * @param {Array} order - Palace order array
 * @returns {Object} Next palace fixed state
 */
export function NextGong(currentGong, order) {
  const index = order.indexOf(currentGong);
  const nextIndex = (index + 1) % order.length;
  return order[nextIndex];
}

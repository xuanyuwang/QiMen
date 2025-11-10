/**
 * Gong (宫) - Palace class with immutable fixed properties and mutable state
 */

import * as BaGua from '../data/ba_gua.js';

// Fixed/immutable state for each palace
export const KanGongFixedState = Object.freeze({
  BaGua: BaGua.Kan,
  Number: 1,
  Name: "坎一宫",
  WuXing: "水",
  YinYang: "阳",
  ZhuDiXing: "天蓬",
  ZhuDiMen: "休门"
});

export const KunGongFixedState = Object.freeze({
  BaGua: BaGua.Kun,
  Number: 2,
  Name: "坤二宫",
  WuXing: "土",
  YinYang: "阴",
  ZhuDiXing: "天芮",
  ZhuDiMen: "死门"
});

export const ZhenGongFixedState = Object.freeze({
  BaGua: BaGua.Zhen,
  Number: 3,
  Name: "震三宫",
  WuXing: "木",
  YinYang: "阳",
  ZhuDiXing: "天冲",
  ZhuDiMen: "伤门"
});

export const XunGongFixedState = Object.freeze({
  BaGua: BaGua.Xun,
  Number: 4,
  Name: "巽四宫",
  WuXing: "木",
  YinYang: "阳",
  ZhuDiXing: "天辅",
  ZhuDiMen: "杜门"
});

export const ZhongGongFixedState = Object.freeze({
  BaGua: BaGua.Zhong,
  Number: 5,
  Name: "中五宫",
  WuXing: "土",
  YinYang: "阳",
  ZhuDiXing: "天禽",
  ZhuDiMen: ""
});

export const QianGongFixedState = Object.freeze({
  BaGua: BaGua.Qian,
  Number: 6,
  Name: "乾六宫",
  WuXing: "金",
  YinYang: "阳",
  ZhuDiXing: "天心",
  ZhuDiMen: "开门"
});

export const DuiGongFixedState = Object.freeze({
  BaGua: BaGua.Dui,
  Number: 7,
  Name: "兑七宫",
  WuXing: "金",
  YinYang: "阴",
  ZhuDiXing: "天柱",
  ZhuDiMen: "惊门"
});

export const GenGongFixedState = Object.freeze({
  BaGua: BaGua.Gen,
  Number: 8,
  Name: "艮八宫",
  WuXing: "土",
  YinYang: "阳",
  ZhuDiXing: "天任",
  ZhuDiMen: "生门"
});

export const LiGongFixedState = Object.freeze({
  BaGua: BaGua.Li,
  Number: 9,
  Name: "离九宫",
  WuXing: "火",
  YinYang: "阴",
  ZhuDiXing: "天英",
  ZhuDiMen: "景门"
});

/**
 * Gong class - combines immutable fixed state with mutable time-based state
 */
export class Gong {
  /**
   * @param {Object} fixedState - Immutable palace properties
   */
  constructor(fixedState) {
    this.fixedState = fixedState;
    
    // Mutable state (changes with timestamp)
    this.TianGan = [];
    this.DiZhi = [];
    this.FeiXing = [];
    this.FeiShen = "";
    this.FeiMen = "";
  }

  // Getters for immutable fields
  get BaGua() { return this.fixedState.BaGua; }
  get Number() { return this.fixedState.Number; }
  get Name() { return this.fixedState.Name; }
  get WuXing() { return this.fixedState.WuXing; }
  get YinYang() { return this.fixedState.YinYang; }
  get ZhuDiXing() { return this.fixedState.ZhuDiXing; }
  get ZhuDiMen() { return this.fixedState.ZhuDiMen; }

  /**
   * String representation returns the palace name
   */
  toString() {
    return this.Name;
  }
}

/**
 * Clockwise order for palace navigation (excluding center palace)
 */
export const ClockwiseGongOrder = [
  QianGongFixedState,
  KanGongFixedState,
  GenGongFixedState,
  ZhenGongFixedState,
  XunGongFixedState,
  LiGongFixedState,
  KunGongFixedState,
  DuiGongFixedState,
];

/**
 * Anti-clockwise order for palace navigation (excluding center palace)
 */
export const AntiClockwiseGongOrder = [
  DuiGongFixedState,
  KunGongFixedState,
  LiGongFixedState,
  XunGongFixedState,
  ZhenGongFixedState,
  GenGongFixedState,
  KanGongFixedState,
  QianGongFixedState,
];

/**
 * Get the next palace in a given order
 * @param {Gong} currentGong - Current palace
 * @param {Array} order - Navigation order (ClockwiseGongOrder or AntiClockwiseGongOrder)
 * @returns {Gong} The next palace in the order
 */
export function NextGong(currentGong, order) {
  const index = order.findIndex(fixedState => fixedState.Name === currentGong.Name);
  if (index === -1) {
    throw new Error(`Gong ${currentGong.Name} not found in order`);
  }
  const nextIndex = (index + 1) % order.length;
  // Return a new Gong instance with the next fixed state
  return new Gong(order[nextIndex]);
}

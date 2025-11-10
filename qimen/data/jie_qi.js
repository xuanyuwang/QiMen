/**
 * 24 Solar Terms (节气) constants and mappings
 *
 * Usage:
 *   import * as JieQi from './data/jie_qi.js';
 *   console.log(JieQi.LiChun);  // "立春"
 */

import * as Yuan from './yuan.js';

// 24 Solar Terms
export const LiChun = "立春";
export const YuShui = "雨水";
export const JingZhe = "惊蛰";
export const ChunFen = "春分";
export const QingMing = "清明";
export const GuYu = "谷雨";
export const LiXia = "立夏";
export const XiaoMan = "小满";
export const MangZhong = "芒种";
export const XiaZhi = "夏至";
export const XiaoShu = "小暑";
export const DaShu = "大暑";
export const LiQiu = "立秋";
export const ChuShu = "处暑";
export const BaiLu = "白露";
export const QiuFen = "秋分";
export const HanLu = "寒露";
export const ShuangJiang = "霜降";
export const LiDong = "立冬";
export const XiaoXue = "小雪";
export const DaXue = "大雪";
export const DongZhi = "冬至";
export const XiaoHan = "小寒";
export const DaHan = "大寒";

/**
 * JieQi Graph - Maps solar terms to Ju numbers for each Yuan period
 * Each solar term has three Ju numbers corresponding to 上元, 中元, 下元
 */
export const JieQiGraph = Object.freeze({
  [LiChun]: { [Yuan.ShangYuan]: 8, [Yuan.ZhongYuan]: 5, [Yuan.XiaYuan]: 2 },
  [YuShui]: { [Yuan.ShangYuan]: 9, [Yuan.ZhongYuan]: 6, [Yuan.XiaYuan]: 3 },
  [JingZhe]: { [Yuan.ShangYuan]: 1, [Yuan.ZhongYuan]: 7, [Yuan.XiaYuan]: 4 },
  [ChunFen]: { [Yuan.ShangYuan]: 3, [Yuan.ZhongYuan]: 9, [Yuan.XiaYuan]: 6 },
  [QingMing]: { [Yuan.ShangYuan]: 4, [Yuan.ZhongYuan]: 1, [Yuan.XiaYuan]: 7 },
  [GuYu]: { [Yuan.ShangYuan]: 5, [Yuan.ZhongYuan]: 2, [Yuan.XiaYuan]: 8 },
  [LiXia]: { [Yuan.ShangYuan]: 4, [Yuan.ZhongYuan]: 1, [Yuan.XiaYuan]: 7 },
  [XiaoMan]: { [Yuan.ShangYuan]: 5, [Yuan.ZhongYuan]: 2, [Yuan.XiaYuan]: 8 },
  [MangZhong]: { [Yuan.ShangYuan]: 6, [Yuan.ZhongYuan]: 3, [Yuan.XiaYuan]: 9 },
  [XiaZhi]: { [Yuan.ShangYuan]: 9, [Yuan.ZhongYuan]: 3, [Yuan.XiaYuan]: 6 },
  [XiaoShu]: { [Yuan.ShangYuan]: 8, [Yuan.ZhongYuan]: 2, [Yuan.XiaYuan]: 5 },
  [DaShu]: { [Yuan.ShangYuan]: 7, [Yuan.ZhongYuan]: 1, [Yuan.XiaYuan]: 4 },
  [LiQiu]: { [Yuan.ShangYuan]: 2, [Yuan.ZhongYuan]: 5, [Yuan.XiaYuan]: 8 },
  [ChuShu]: { [Yuan.ShangYuan]: 1, [Yuan.ZhongYuan]: 4, [Yuan.XiaYuan]: 7 },
  [BaiLu]: { [Yuan.ShangYuan]: 9, [Yuan.ZhongYuan]: 3, [Yuan.XiaYuan]: 6 },
  [QiuFen]: { [Yuan.ShangYuan]: 7, [Yuan.ZhongYuan]: 1, [Yuan.XiaYuan]: 4 },
  [HanLu]: { [Yuan.ShangYuan]: 6, [Yuan.ZhongYuan]: 9, [Yuan.XiaYuan]: 3 },
  [ShuangJiang]: { [Yuan.ShangYuan]: 5, [Yuan.ZhongYuan]: 8, [Yuan.XiaYuan]: 2 },
  [LiDong]: { [Yuan.ShangYuan]: 6, [Yuan.ZhongYuan]: 9, [Yuan.XiaYuan]: 3 },
  [XiaoXue]: { [Yuan.ShangYuan]: 5, [Yuan.ZhongYuan]: 8, [Yuan.XiaYuan]: 2 },
  [DaXue]: { [Yuan.ShangYuan]: 4, [Yuan.ZhongYuan]: 7, [Yuan.XiaYuan]: 1 },
  [DongZhi]: { [Yuan.ShangYuan]: 1, [Yuan.ZhongYuan]: 7, [Yuan.XiaYuan]: 4 },
  [XiaoHan]: { [Yuan.ShangYuan]: 2, [Yuan.ZhongYuan]: 8, [Yuan.XiaYuan]: 5 },
  [DaHan]: { [Yuan.ShangYuan]: 3, [Yuan.ZhongYuan]: 9, [Yuan.XiaYuan]: 6 },
});

/**
 * Reverse map: Solar Term -> Yin/Yang
 * Maps each solar term to its corresponding 阴 or 阳 category
 */
export const JieQiToYinYang = Object.freeze({
  [LiChun]: "阳",
  [YuShui]: "阳",
  [JingZhe]: "阳",
  [ChunFen]: "阳",
  [QingMing]: "阳",
  [GuYu]: "阳",
  [LiXia]: "阳",
  [XiaoMan]: "阳",
  [MangZhong]: "阳",
  [XiaZhi]: "阴",
  [XiaoShu]: "阴",
  [DaShu]: "阴",
  [LiQiu]: "阴",
  [ChuShu]: "阴",
  [BaiLu]: "阴",
  [QiuFen]: "阴",
  [HanLu]: "阴",
  [ShuangJiang]: "阴",
  [LiDong]: "阴",
  [XiaoXue]: "阴",
  [DaXue]: "阴",
  [DongZhi]: "阳",
  [XiaoHan]: "阳",
  [DaHan]: "阳",
});

/**
 * Get Yin/Yang category for a given solar term
 * @param {string} jieQi - Solar term name
 * @returns {string} "阳" or "阴"
 */
export function GetJieQiYinYang(jieQi) {
  return JieQiToYinYang[jieQi];
}

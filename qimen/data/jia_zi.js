/**
 * Jia Zi (甲子) - Sixty JiaZi cycle data
 * 
 * Usage:
 *   import * as JiaZi from './data/jia_zi.js';
 */

import * as Yuan from './yuan.js';
import * as TianGan from './tian_gan.js';
import * as DiZhi from './di_zhi.js';

// Six starting points of the 60 JiaZi cycle (六甲)
export const JiaZi = "甲子";
export const JiaXu = "甲戌";
export const JiaShen = "甲申";
export const JiaWu = "甲午";
export const JiaChen = "甲辰";
export const JiaYin = "甲寅";

export const Dun = "遁";
export const KongWang = "空亡";

/**
 * LiuShiJiaZi (六十甲子) - 60 JiaZi cycle mapping
 * Maps each of the 6 Jia periods to their yuan cycles, empty void, and dun stem
 */
export const LiuShiJiaZi = Object.freeze({
  [JiaZi]: {
    [Yuan.ShangYuan]: ["甲子", "乙丑", "丙寅", "丁卯", "戊辰"],
    [Yuan.ZhongYuan]: ["己巳", "庚午", "辛未", "壬申", "癸酉"],
    [KongWang]: [DiZhi.Xu, DiZhi.Hai],
    [Dun]: TianGan.Wu,
  },
  [JiaXu]: {
    [Yuan.XiaYuan]: ["甲戌", "乙亥", "丙子", "丁丑", "戊寅"],
    [Yuan.ShangYuan]: ["己卯", "庚辰", "辛巳", "壬午", "癸未"],
    [KongWang]: [DiZhi.Shen, DiZhi.You],
    [Dun]: TianGan.Ji,
  },
  [JiaShen]: {
    [Yuan.ZhongYuan]: ["甲申", "乙酉", "丙戌", "丁亥", "戊子"],
    [Yuan.XiaYuan]: ["己丑", "庚寅", "辛卯", "壬辰", "癸巳"],
    [KongWang]: [DiZhi.Wu, DiZhi.Wei],
    [Dun]: TianGan.Geng,
  },
  [JiaWu]: {
    [Yuan.ShangYuan]: ["甲午", "乙未", "丙申", "丁酉", "戊戌"],
    [Yuan.ZhongYuan]: ["己亥", "庚子", "辛丑", "壬寅", "癸卯"],
    [KongWang]: [DiZhi.Chen, DiZhi.Si],
    [Dun]: TianGan.Xin,
  },
  [JiaChen]: {
    [Yuan.XiaYuan]: ["甲辰", "乙巳", "丙午", "丁未", "戊申"],
    [Yuan.ShangYuan]: ["己酉", "庚戌", "辛亥", "壬子", "癸丑"],
    [KongWang]: [DiZhi.Yin, DiZhi.Mao],
    [Dun]: TianGan.Ren,
  },
  [JiaYin]: {
    [Yuan.ZhongYuan]: ["甲寅", "乙卯", "丙辰", "丁巳", "戊午"],
    [Yuan.XiaYuan]: ["己未", "庚申", "辛酉", "壬戌", "癸亥"],
    [KongWang]: [DiZhi.Zi, DiZhi.Chou],
    [Dun]: TianGan.Gui,
  },
});

/**
 * Pan (盘) - QiMen DunJia chart class
 */

import { Zhu } from './zhu.js';
import { Gong, KanGongFixedState, KunGongFixedState, ZhenGongFixedState,
         XunGongFixedState, ZhongGongFixedState, QianGongFixedState,
         DuiGongFixedState, GenGongFixedState, LiGongFixedState,
         NextGong, ClockwiseGongOrder } from './gong.js';
import * as JieQi from '../data/jie_qi.js';
import * as YinYang from '../data/yin_yang.js';
import * as Yuan from '../data/yuan.js';
import * as TianGan from '../data/tian_gan.js';
import * as DiZhi from '../data/di_zhi.js';
import * as JiaZi from '../data/jia_zi.js';
import { ArrangeJiuXing } from '../jiu_xing.js';
import { ArrangeBaShen } from '../ba_shen.js';

/**
 * Chinese labels for Pan fields
 */
const FIELD_LABELS = Object.freeze({
  ShiChen: "时辰",
  JieQi: "节气",
  NianZhu: "年柱",
  YueZhu: "月柱",
  RiZhu: "日柱",
  ShiZhu: "时柱",
  YinYang: "阴阳",
  KongWang: "空亡",
  Yuan: "元",
  XunShou: "旬首",
  JuShu: "局数",
  ZhiShiMen: "值使门",
  Gongs: "九宫"
});

/**
 * Pan class - represents the complete QiMen DunJia chart
 */
export class Pan {
  constructor() {
    // Private fields to store values
    this._shiChen = null;
    this._jieQi = null;
    this._nianZhu = new Zhu("", "");
    this._yueZhu = new Zhu("", "");
    this._riZhu = new Zhu("", "");
    this._shiZhu = new Zhu("", "");
    this._yinYang = null;
    this._kongWang = null;
    this._yuan = null;
    this._xunShou = new Zhu("甲", "");
    this._juShu = null;
    this._zhiShiMen = null;

    // Nine palaces with their mutable state
    // All mutable data (TianGan, DiZhi, FeiXing, FeiShen, FeiMen) lives in each Gong
    this.Gongs = [
      new Gong(KanGongFixedState),    // 1
      new Gong(KunGongFixedState),    // 2
      new Gong(ZhenGongFixedState),   // 3
      new Gong(XunGongFixedState),    // 4
      new Gong(ZhongGongFixedState),  // 5
      new Gong(QianGongFixedState),   // 6
      new Gong(DuiGongFixedState),    // 7
      new Gong(GenGongFixedState),    // 8
      new Gong(LiGongFixedState)      // 9
    ];

    // Dictionaries populated during calculation
    // DiPan: TianGan -> Gong mapping (ground/earth plate)
    this.DiPan = {};
    // TianPan: TianGan -> Gong mapping (heaven plate)
    this.TianPan = {};
    // JiuXing: Star name -> Gong mapping
    this.JiuXing = {};
    // BaShen: Spirit name -> Gong mapping
    this.BaShen = {};
    // BaMen: Door name -> Gong mapping
    this.BaMen = {};
  }

  // Getters and setters with validation
  get ShiChen() { return this._shiChen; }
  set ShiChen(value) { this._shiChen = value; }

  get JieQi() { return this._jieQi; }
  set JieQi(value) {
    // Validate that it's one of the 24 solar terms
    const validTerms = [
      JieQi.LiChun, JieQi.YuShui, JieQi.JingZhe, JieQi.ChunFen,
      JieQi.QingMing, JieQi.GuYu, JieQi.LiXia, JieQi.XiaoMan,
      JieQi.MangZhong, JieQi.XiaZhi, JieQi.XiaoShu, JieQi.DaShu,
      JieQi.LiQiu, JieQi.ChuShu, JieQi.BaiLu, JieQi.QiuFen,
      JieQi.HanLu, JieQi.ShuangJiang, JieQi.LiDong, JieQi.XiaoXue,
      JieQi.DaXue, JieQi.DongZhi, JieQi.XiaoHan, JieQi.DaHan
    ];
    if (value !== null && !validTerms.includes(value)) {
      throw new Error(`Invalid JieQi: ${value}`);
    }
    this._jieQi = value;

    // Automatically derive YinYang from JieQi
    if (value !== null) {
      this._yinYang = JieQi.GetJieQiYinYang(value);
    }
  }

  get NianZhu() { return this._nianZhu; }
  set NianZhu(value) {
    if (!(value instanceof Zhu)) {
      throw new Error('NianZhu must be a Zhu instance');
    }
    this._nianZhu = value;
  }

  get YueZhu() { return this._yueZhu; }
  set YueZhu(value) {
    if (!(value instanceof Zhu)) {
      throw new Error('YueZhu must be a Zhu instance');
    }
    this._yueZhu = value;
  }

  get RiZhu() { return this._riZhu; }
  set RiZhu(value) {
    if (!(value instanceof Zhu)) {
      throw new Error('RiZhu must be a Zhu instance');
    }
    this._riZhu = value;
  }

  get ShiZhu() { return this._shiZhu; }
  set ShiZhu(value) {
    if (!(value instanceof Zhu)) {
      throw new Error('ShiZhu must be a Zhu instance');
    }
    this._shiZhu = value;
  }

  get YinYang() { return this._yinYang; }
  set YinYang(value) {
    if (value !== null && value !== YinYang.Yang && value !== YinYang.Yin) {
      throw new Error(`Invalid YinYang: ${value}`);
    }
    this._yinYang = value;
  }

  get KongWang() { return this._kongWang; }
  set KongWang(value) {
    if (value !== null && !Array.isArray(value)) {
      throw new Error('KongWang must be an array');
    }
    this._kongWang = value;
  }

  get Yuan() { return this._yuan; }
  set Yuan(value) {
    if (value !== null && value !== Yuan.ShangYuan && value !== Yuan.ZhongYuan && value !== Yuan.XiaYuan) {
      throw new Error(`Invalid Yuan: ${value}`);
    }
    this._yuan = value;
  }

  get XunShou() { return this._xunShou; }
  set XunShou(value) {
    if (!(value instanceof Zhu)) {
      throw new Error('XunShou must be a Zhu instance');
    }
    this._xunShou = value;
  }

  get JuShu() { return this._juShu; }
  set JuShu(value) {
    if (value !== null && (typeof value !== 'number' || value < 1 || value > 9)) {
      throw new Error(`Invalid JuShu: ${value}`);
    }
    this._juShu = value;
  }

  get ZhiShiMen() { return this._zhiShiMen; }
  set ZhiShiMen(value) { this._zhiShiMen = value; }

  /**
   * Get a Gong by its number
   * @param {number} num - Palace number (1-9)
   * @returns {Gong} The Gong instance
   */
  getGongByNumber(num) {
    return this.Gongs[num - 1];
  }

  /**
   * Get a Gong by its name
   * @param {string} name - Palace name (e.g., "坎一宫")
   * @returns {Gong} The Gong instance
   */
  getGongByName(name) {
    return this.Gongs.find(gong => gong.Name === name);
  }

  /**
   * Calculate Yuan (元) based on RiZhu
   * Searches through LiuShiJiaZi to find which yuan period contains RiZhu
   */
  calculateYuan() {
    const riZhu = this.RiZhu.toString();

    for (const key in JiaZi.LiuShiJiaZi) {
      const jiaZiData = JiaZi.LiuShiJiaZi[key];

      if (jiaZiData[Yuan.ShangYuan]?.includes(riZhu)) {
        this.Yuan = Yuan.ShangYuan;
        return;
      }
      if (jiaZiData[Yuan.ZhongYuan]?.includes(riZhu)) {
        this.Yuan = Yuan.ZhongYuan;
        return;
      }
      if (jiaZiData[Yuan.XiaYuan]?.includes(riZhu)) {
        this.Yuan = Yuan.XiaYuan;
        return;
      }
    }
  }
  
  calculateNianZhu(solarTime) {
    const sixtyCycleHour = solarTime.getSixtyCycleHour();
    const nianZhuName = sixtyCycleHour.getYear().getName();
    this.NianZhu = new Zhu(nianZhuName[0], nianZhuName[1]);
  }
  
  calculateYueZhu(solarTime) {
    const sixtyCycleHour = solarTime.getSixtyCycleHour();
    const yueZhuName = sixtyCycleHour.getMonth().getName();
    this.YueZhu = new Zhu(yueZhuName[0], yueZhuName[1]);
  }

  calculateRiZhu(solarTime) {
    const sixtyCycleHour = solarTime.getSixtyCycleHour();
    const riZhuName = sixtyCycleHour.getDay().getName();
    this.RiZhu = new Zhu(riZhuName[0], riZhuName[1]);
  }

  calculateShiZhu(solarTime) {
    const sixtyCycleHour = solarTime.getSixtyCycleHour();
    const shiZhuName = sixtyCycleHour.getSixtyCycle().getName();
    this.ShiZhu = new Zhu(shiZhuName[0], shiZhuName[1]);
  }

  /**
   * Calculate JuShu (局数) based on JieQi and Yuan
   * Must call calculateYuan() first
   */
  calculateJuShu() {
    if (!this.JieQi || !this.Yuan) {
      throw new Error('JieQi and Yuan must be set before calculating JuShu');
    }

    const juList = JieQi.JieQiGraph[this.JieQi];
    this.JuShu = juList[this.Yuan];
  }

  /**
   * Calculate XunShou (旬首) based on ShiZhu
   * Searches through LiuShiJiaZi to find which group contains ShiZhu
   */
  calculateXunShou() {
    const shiZhu = this.ShiZhu.toString();

    for (const key in JiaZi.LiuShiJiaZi) {
      const jiaZiData = JiaZi.LiuShiJiaZi[key];

      if (jiaZiData[Yuan.ShangYuan]?.includes(shiZhu) ||
          jiaZiData[Yuan.ZhongYuan]?.includes(shiZhu) ||
          jiaZiData[Yuan.XiaYuan]?.includes(shiZhu)) {
        this.XunShou = new Zhu(key[0], key[1]);
        return;
      }
    }
  }

  /**
   * Calculate KongWang (空亡) based on ShiZhu
   * Searches through LiuShiJiaZi to find the empty void for ShiZhu's group
   */
  calculateKongWang() {
    const shiZhu = this.ShiZhu.toString();

    for (const key in JiaZi.LiuShiJiaZi) {
      const jiaZiData = JiaZi.LiuShiJiaZi[key];

      if (jiaZiData[Yuan.ShangYuan]?.includes(shiZhu) ||
          jiaZiData[Yuan.ZhongYuan]?.includes(shiZhu) ||
          jiaZiData[Yuan.XiaYuan]?.includes(shiZhu)) {
        this.KongWang = jiaZiData["空亡"];
        return;
      }
    }
  }
  
  calculateShiChen(solarTime) {
    this.ShiChen = solarTime.getLunarHour().toString();
  }
  
  calculateJieQi(solarTime) {
    this.JieQi = solarTime.getTerm().getName();
  }

  /**
   * Arrange DiPan (地盘) - maps TianGan to Gongs
   * Based on JuShu and YinYang (Yang: clockwise increment, Yin: counter-clockwise decrement)
   */
  arrangeDiPan() {
    if (!this.JuShu || !this.YinYang) {
      throw new Error('JuShu and YinYang must be set before arranging DiPan');
    }

    // Start with JuShu - 1 (convert to 0-based)
    let startNum = this.JuShu - 1;

    // Operation: increment for Yang, decrement for Yin
    const op = this.YinYang === YinYang.Yang ? (x => x + 1) : (x => x - 1);

    // Generate 9 numbers (0-8 range)
    const generatedNums = [startNum];
    for (let i = 0; i < 8; i++) {
      const next = op(generatedNums[generatedNums.length - 1]);
      // Proper modulo that handles negative numbers
      generatedNums.push(((next % 9) + 9) % 9);
    }

    // Convert to 1-based palace numbers (1-9 range)
    for (let i = 0; i < generatedNums.length; i++) {
      generatedNums[i] = generatedNums[i] + 1;
    }

    // Map TianGan to Gongs in the fixed order (reuse existing Gongs array)
    this.DiPan = {};
    this.DiPan[TianGan.Wu] = this.Gongs[generatedNums[0] - 1];
    this.DiPan[TianGan.Ji] = this.Gongs[generatedNums[1] - 1];
    this.DiPan[TianGan.Geng] = this.Gongs[generatedNums[2] - 1];
    this.DiPan[TianGan.Xin] = this.Gongs[generatedNums[3] - 1];
    this.DiPan[TianGan.Ren] = this.Gongs[generatedNums[4] - 1];
    this.DiPan[TianGan.Gui] = this.Gongs[generatedNums[5] - 1];
    this.DiPan[TianGan.Ding] = this.Gongs[generatedNums[6] - 1];
    this.DiPan[TianGan.Bing] = this.Gongs[generatedNums[7] - 1];
    this.DiPan[TianGan.Yi] = this.Gongs[generatedNums[8] - 1];
  }

  /**
   * Calculate ZhiFu (值符) - the duty star
   * Sets the first entry in JiuXing, TianPan, and BaShen
   */
  calculateZhiFu() {
    if (!this.XunShou || !this.ShiZhu || Object.keys(this.DiPan).length === 0) {
      throw new Error('XunShou, ShiZhu, and DiPan must be set before calculating ZhiFu');
    }

    // Get the hidden gan (遁) for XunShou
    const xunShou = this.XunShou.toString();
    const dun = JiaZi.LiuShiJiaZi[xunShou][JiaZi.Dun];

    // Get the gong where the hidden gan is located in DiPan
    const gong = this.DiPan[dun];

    // Get the fixed star (ZhuDiXing) of that gong
    const xing = gong.ZhuDiXing;

    // Get the target gong from DiPan using ShiZhu's gan
    const targetGong = this.DiPan[this.ShiZhu.getGan()];

    // Set the first entry in JiuXing, TianPan, and BaShen
    this.JiuXing[xing] = targetGong;
    this.TianPan[dun] = targetGong;
    this.BaShen["值符"] = targetGong;
  }

  /**
   * Calculate ZhiShiMen (值使门) - the duty door
   * Finds the door based on ShiZhu's group in LiuShiJiaZi
   */
  calculateZhiShiMen() {
    if (!this.ShiZhu || Object.keys(this.DiPan).length === 0) {
      throw new Error('ShiZhu and DiPan must be set before calculating ZhiShiMen');
    }

    const shiZhu = this.ShiZhu.toString();
    let diPanGan = null;

    // Search through LiuShiJiaZi to find which group contains ShiZhu
    for (const key in JiaZi.LiuShiJiaZi) {
      const jiaZiData = JiaZi.LiuShiJiaZi[key];

      if (jiaZiData[Yuan.ShangYuan]?.includes(shiZhu) ||
          jiaZiData[Yuan.ZhongYuan]?.includes(shiZhu) ||
          jiaZiData[Yuan.XiaYuan]?.includes(shiZhu)) {
        diPanGan = jiaZiData[JiaZi.Dun];
        break;
      }
    }

    // Get the gong from DiPan and extract its ZhuDiMen
    const gong = this.DiPan[diPanGan];
    this.ZhiShiMen = gong.ZhuDiMen;
  }

  /**
   * Helper method to find Gong by name
   * @param {string} name - Palace name
   * @returns {Gong} The Gong instance
   */
  _getGongByName(name) {
    return this.Gongs.find(gong => gong.Name === name);
  }

  /**
   * Helper method to find Gong by ZhuDiXing (star)
   * @param {string} xing - Star name
   * @returns {Gong} The Gong instance
   */
  _getGongByZhuDiXing(xing) {
    return this.Gongs.find(gong => gong.ZhuDiXing === xing);
  }

  /**
   * Arrange JiuXing (九星) - the nine stars
   * Arranges all nine stars based on the first star set by calculateZhiFu
   */
  arrangeJiuXing() {
    if (Object.keys(this.JiuXing).length === 0) {
      throw new Error('JiuXing must have at least one entry before arranging (call calculateZhiFu first)');
    }

    // Get the first star and its gong
    const firstXing = Object.keys(this.JiuXing)[0];
    const firstGong = this.JiuXing[firstXing].Name;

    // Arrange all stars
    const arrangedJiuXing = ArrangeJiuXing(firstXing, firstGong);

    // Update JiuXing with all arranged stars
    for (const [xing, gongName] of Object.entries(arrangedJiuXing)) {
      this.JiuXing[xing] = this._getGongByName(gongName);
    }
  }

  /**
   * Arrange BaShen (八神) - the eight spirits
   * Arranges all eight spirits based on the first spirit set by calculateZhiFu
   */
  arrangeBaShen() {
    if (!this.YinYang || Object.keys(this.BaShen).length === 0) {
      throw new Error('YinYang and BaShen must be set before arranging (call calculateZhiFu first)');
    }

    // Get the first spirit and its gong
    const firstBaShen = Object.keys(this.BaShen)[0];
    const firstGong = this.BaShen[firstBaShen].Name;

    // Arrange all spirits (requires YinYang)
    const arrangedBaShen = ArrangeBaShen(firstBaShen, firstGong, this.YinYang);

    // Update BaShen with all arranged spirits
    for (const [bashen, gongName] of Object.entries(arrangedBaShen)) {
      this.BaShen[bashen] = this._getGongByName(gongName);
    }
  }

  /**
   * Arrange TianPan (天盘) - the heaven plate
   * Maps TianGan to Gongs based on how stars have moved from their original positions
   */
  arrangeTianPan() {
    if (Object.keys(this.JiuXing).length === 0 || Object.keys(this.DiPan).length === 0) {
      throw new Error('JiuXing and DiPan must be set before arranging TianPan');
    }

    // Create reverse map: DiPan gong name -> tian gan
    const diPanGongToTianGan = {};
    for (const [tianGan, gong] of Object.entries(this.DiPan)) {
      diPanGongToTianGan[gong.Name] = tianGan;
    }

    // For each star, find its original gong and map the corresponding tian gan to its current gong
    for (const [xing, currentGong] of Object.entries(this.JiuXing)) {
      // Get the original/fixed gong for this star
      const originalGong = this._getGongByZhuDiXing(xing);

      // Find which tian gan in DiPan corresponds to the original gong
      const tianGan = diPanGongToTianGan[originalGong.Name];

      // Map that tian gan in TianPan to the star's current gong
      this.TianPan[tianGan] = currentGong;
    }
  }

  /**
   * Arrange BaMen (八门) - the eight doors
   * Maps door names to Gongs based on a complex calculation involving DiZhi
   */
  arrangeBaMen() {
    if (!this.XunShou || !this.YinYang || !this.ShiZhu || !this.ZhiShiMen ||
        Object.keys(this.DiPan).length === 0) {
      throw new Error('XunShou, YinYang, ShiZhu, ZhiShiMen, and DiPan must be set before arranging BaMen');
    }

    // Get the dun gan and its gong from DiPan
    const xunShou = this.XunShou.toString();
    const dun = JiaZi.LiuShiJiaZi[xunShou][JiaZi.Dun];
    const dunGong = this.DiPan[dun];

    // Operation: increment for Yang, decrement for Yin
    const op = this.YinYang === YinYang.Yang ? (x => x + 1) : (x => x - 1);

    // List of 12 DiZhi in order
    const diZhiList = [
      DiZhi.Zi, DiZhi.Chou, DiZhi.Yin, DiZhi.Mao,
      DiZhi.Chen, DiZhi.Si, DiZhi.Wu, DiZhi.Wei,
      DiZhi.Shen, DiZhi.You, DiZhi.Xu, DiZhi.Hai
    ];

    // Helper to get next dizhi
    const nextDiZhi = (x) => diZhiList[(diZhiList.indexOf(x) + 1) % 12];

    // Helper to get next gong number (skip center palace #5)
    const nextGongNum = (currentGongNum) => {
      let next = (op(currentGongNum - 1) % 8) + 1;
      // If next is 5 (center), skip it
      return next === 5 ? nextGongNum(next) : next;
    };

    // Build DiZhi -> Gong number mapping starting from XunShou's zhi
    let startGongNum = dunGong.Number;
    let startDiZhi = this.XunShou.zhi;
    const diZhiMap = { [startDiZhi]: startGongNum };
    const targetDiZhi = this.ShiZhu.zhi;

    // Generate mapping until we reach the target DiZhi
    for (let i = 0; i < diZhiList.length; i++) {
      if (targetDiZhi in diZhiMap) {
        break;
      }
      startDiZhi = nextDiZhi(startDiZhi);
      startGongNum = nextGongNum(startGongNum);
      diZhiMap[startDiZhi] = startGongNum;
    }

    // List of 8 doors in fixed order
    const baMen = ["开门", "休门", "生门", "伤门", "杜门", "景门", "死门", "惊门"];

    // Helper to get next door
    const nextMen = (currentMen) => baMen[(baMen.indexOf(currentMen) + 1) % baMen.length];

    // Start with ZhiShiMen at the gong corresponding to ShiZhu's zhi
    let startMen = this.ZhiShiMen;
    let startGong = this.Gongs[diZhiMap[targetDiZhi] - 1];
    this.BaMen = { [startMen]: startGong };

    // Arrange remaining doors clockwise
    for (let i = 0; i < baMen.length - 1; i++) {
      startMen = nextMen(startMen);
      startGong = NextGong(startGong, ClockwiseGongOrder);
      this.BaMen[startMen] = startGong;
    }
  }

  /**
   * JiGong (寄宫) - handles the center palace "residing" logic
   * When center palace (中五宫) appears in DiPan, it "resides" in palace #2 (坤二宫)
   */
  jiGong() {
    if (Object.keys(this.DiPan).length === 0) {
      throw new Error('DiPan must be set before calling jiGong');
    }

    // Find which TianGan maps to center palace in DiPan
    let diPanTianGan = null;
    for (const [tianGan, gong] of Object.entries(this.DiPan)) {
      if (gong.Name === "中五宫") {
        diPanTianGan = tianGan;
        break;
      }
    }

    // If found, remap it to palace #2 (坤二宫) - using existing Gongs[1]
    if (diPanTianGan) {
      this.DiPan[diPanTianGan] = this.Gongs[1];  // Gongs[1] is KunGong (palace #2)
    }
  }

  /**
   * String representation with Chinese labels
   * @returns {string} Formatted string with all Pan data
   */
  toString() {
    const lines = [];

    // Basic fields
    const basicFields = [
      'ShiChen', 'JieQi', 'NianZhu', 'YueZhu', 'RiZhu', 'ShiZhu',
      'YinYang', 'KongWang', 'Yuan', 'XunShou', 'JuShu', 'ZhiShiMen'
    ];

    for (const field of basicFields) {
      const label = FIELD_LABELS[field];
      const value = this[field];
      const valueStr = value !== null && value !== undefined ? String(value) : 'null';
      lines.push(`${label}: ${valueStr}`);
    }

    // Gongs summary
    lines.push(`\n${FIELD_LABELS.Gongs}:`);
    for (const gong of this.Gongs) {
      const tianGan = gong.TianGan.join(', ') || '无';
      const diZhi = gong.DiZhi.join(', ') || '无';
      const feiXing = gong.FeiXing.join(', ') || '无';
      lines.push(`  ${gong.Name}:`);
      lines.push(`    天干: ${tianGan}`);
      lines.push(`    地支: ${diZhi}`);
      lines.push(`    星: ${feiXing}`);
      lines.push(`    神: ${gong.FeiShen || '无'}`);
      lines.push(`    门: ${gong.FeiMen || '无'}`);
    }

    return lines.join('\n');
  }
}

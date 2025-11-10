/**
 * Zhu (柱) - Pillar class representing a Gan-Zhi combination
 */

import * as JiaZi from '../data/jia_zi.js';
import * as TianGan from '../data/tian_gan.js';

export class Zhu {
  /**
   * Create a Zhu (pillar)
   * @param {string} gan - Heavenly stem (天干)
   * @param {string} zhi - Earthly branch (地支)
   */
  constructor(gan, zhi) {
    this.gan = gan;
    this.zhi = zhi;
  }

  /**
   * Convert to string representation
   * @returns {string} Concatenated gan and zhi
   */
  toString() {
    return `${this.gan}${this.zhi}`;
  }

  /**
   * Get the effective Gan, considering special Jia cases
   * For Jia (甲) stems, returns the corresponding Dun (遁) value
   * @returns {string} The effective heavenly stem
   */
  getGan() {
    if (this.gan === TianGan.Jia) {
      const zhuStr = this.toString();
      return JiaZi.LiuShiJiaZi[zhuStr][JiaZi.Dun];
    }
    return this.gan;
  }
}

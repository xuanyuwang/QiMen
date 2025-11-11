/**
 * Browser entry point for QiMen DunJia
 * This file will be bundled into the standalone HTML page
 */

import { parseObservationDatetime } from './qimen/datetime.js';
import { SolarTime } from 'tyme4ts';
import { Pan } from './qimen/models/pan.js';

/**
 * Generate HTML for a Gong (palace) in the grid
 */
function generateGongHTML(gong) {
  const tianGan = gong.TianGan.join(', ') || '无';
  const diGan = gong.DiGan.join(', ') || '无';
  const feiXing = gong.FeiXing.join(', ') || '无';
  const feiShen = gong.FeiShen || '无';
  const feiMen = gong.FeiMen || '无';

  return `
    <div class="gong" data-number="${gong.Number}">
      <div class="gong-header">${gong.Name}</div>
      <div class="gong-content">
        <div class="gong-row"><span class="label">天干:</span> ${tianGan}</div>
        <div class="gong-row"><span class="label">地干:</span> ${diGan}</div>
        <div class="gong-row"><span class="label">星:</span> ${feiXing}</div>
        <div class="gong-row"><span class="label">神:</span> ${feiShen}</div>
        <div class="gong-row"><span class="label">门:</span> ${feiMen}</div>
      </div>
    </div>
  `;
}

/**
 * Generate HTML for the 3x3 Gong grid
 * Order: 4,9,2 / 3,5,7 / 8,1,6
 */
function generateGongGrid(pan) {
  // Define the order: row 1 (top), row 2 (middle), row 3 (bottom)
  const gridOrder = [
    [4, 9, 2],  // Top row: left to right
    [3, 5, 7],  // Middle row: left to right
    [8, 1, 6]   // Bottom row: left to right
  ];

  let gridHTML = '<div class="gong-grid">';

  for (const row of gridOrder) {
    gridHTML += '<div class="gong-row-container">';
    for (const gongNumber of row) {
      const gong = pan.getGongByNumber(gongNumber);
      gridHTML += generateGongHTML(gong);
    }
    gridHTML += '</div>';
  }

  gridHTML += '</div>';
  return gridHTML;
}

/**
 * Generate HTML for basic Pan fields
 */
function generateBasicFields(pan) {
  const fields = [
    { label: '时辰', value: pan.ShiChen },
    { label: '节气', value: pan.JieQi },
    { label: '年柱', value: pan.NianZhu },
    { label: '月柱', value: pan.YueZhu },
    { label: '日柱', value: pan.RiZhu },
    { label: '时柱', value: pan.ShiZhu },
    { label: '阴阳', value: pan.YinYang },
    { label: '空亡', value: pan.KongWang ? pan.KongWang.join(', ') : 'null' },
    { label: '元', value: pan.Yuan },
    { label: '旬首', value: pan.XunShou },
    { label: '局数', value: pan.JuShu },
    { label: '值使门', value: pan.ZhiShiMen }
  ];

  let html = '<div class="basic-fields">';
  for (const field of fields) {
    const value = field.value !== null && field.value !== undefined ? String(field.value) : 'null';
    html += `
      <div class="field-row">
        <span class="field-label">${field.label}:</span>
        <span class="field-value">${value}</span>
      </div>
    `;
  }
  html += '</div>';
  return html;
}

// Store the current Pan globally so we can access it for copying
let currentPan = null;

/**
 * Calculate and display the Pan
 */
function calculatePan(datetimeStr, timezone) {
  try {
    // Parse datetime
    const observation = parseObservationDatetime(datetimeStr, timezone);

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
    pan.calculateYinYang();
    pan.calculateNianZhu(solarTime);
    pan.calculateYueZhu(solarTime);
    pan.calculateRiZhu(solarTime);
    pan.calculateShiZhu(solarTime);

    // Calculate derived fields
    pan.calculateYuan();
    pan.calculateJuShu();
    pan.calculateXunShou();
    pan.calculateKongWang();

    // Arrange pan
    pan.arrangeDiPan();
    pan.calculateZhiFu();
    pan.calculateZhiShiMen();
    pan.arrangeJiuXing();
    pan.arrangeBaShen();
    pan.arrangeTianPan();
    pan.arrangeBaMen();
    pan.jiGong();

    // Store the pan globally
    currentPan = pan;

    // Display timestamp
    const year = String(observation.year).padStart(4, '0');
    const month = String(observation.month).padStart(2, '0');
    const day = String(observation.day).padStart(2, '0');
    const hour = String(observation.hour).padStart(2, '0');
    const minute = String(observation.minute).padStart(2, '0');
    const timestampStr = `${year}-${month}-${day}T${hour}:${minute}`;

    document.getElementById('timestamp').textContent = timestampStr;

    // Display basic fields
    document.getElementById('basicFields').innerHTML = generateBasicFields(pan);

    // Display gong grid
    document.getElementById('gongGrid').innerHTML = generateGongGrid(pan);

    // Enable copy button
    document.getElementById('copyButton').disabled = false;

    // Clear any error
    document.getElementById('error').textContent = '';
  } catch (error) {
    document.getElementById('error').textContent = `错误: ${error.message}`;
    console.error(error);
    currentPan = null;
    document.getElementById('copyButton').disabled = true;
  }
}

/**
 * Copy Pan toString() output to clipboard
 */
function copyToClipboard() {
  if (!currentPan) {
    document.getElementById('error').textContent = '错误: 没有可复制的数据 (No data to copy)';
    return;
  }

  const textToCopy = currentPan.toString();

  // Use modern clipboard API
  navigator.clipboard.writeText(textToCopy).then(() => {
    // Show success feedback
    const button = document.getElementById('copyButton');
    const originalText = button.textContent;
    button.textContent = '已复制! (Copied!)';
    button.style.background = '#28a745';

    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 2000);
  }).catch(err => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      const button = document.getElementById('copyButton');
      const originalText = button.textContent;
      button.textContent = '已复制! (Copied!)';
      button.style.background = '#28a745';

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);
    } catch (fallbackErr) {
      document.getElementById('error').textContent = `复制失败 (Copy failed): ${fallbackErr.message}`;
    }

    document.body.removeChild(textArea);
  });
}

// Make functions available globally
window.calculatePan = calculatePan;
window.copyToClipboard = copyToClipboard;

// Calculate on page load with current time
window.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const datetimeInput = document.getElementById('datetimeInput');
  const timezoneSelect = document.getElementById('timezoneSelect');

  // Detect local timezone
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Set timezone selector to local timezone if it exists in the list
  const timezoneOptions = Array.from(timezoneSelect.options).map(opt => opt.value);
  if (timezoneOptions.includes(localTimezone)) {
    timezoneSelect.value = localTimezone;
  } else {
    // Default to Asia/Shanghai if local timezone not in list
    timezoneSelect.value = 'Asia/Shanghai';
  }

  // Format current datetime for input
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');

  datetimeInput.value = `${year}-${month}-${day}T${hour}:${minute}`;

  // Calculate with current time and detected/default timezone
  calculatePan(now, timezoneSelect.value);
});

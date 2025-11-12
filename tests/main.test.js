/**
 * Integration tests for main.js - QiMen DunJia chart generation
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const mainPath = join(__dirname, '..', 'main.js');

/**
 * Helper function to run main.js with arguments and capture output
 * @param {string[]} args - Command line arguments
 * @returns {Promise<string>} - Program output
 */
function runMain(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [mainPath, ...args]);
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Process exited with code ${code}\nStderr: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Parse the output to extract key-value pairs
 * @param {string} output - Program output
 * @returns {Object} - Parsed output fields
 */
function parseOutput(output) {
  const lines = output.split('\n');
  const result = {
    datetime: '',
    yinyang: '',
    yuan: '',
    jushu: '',
    xunshou: '',
    kongwang: [],
    zhishimen: '',
    jiuGong: {}
  };

  // Extract datetime from first line
  result.datetime = lines[0].trim();

  // Extract main fields
  for (const line of lines) {
    if (line.includes('阴阳:')) {
      result.yinyang = line.split('阴阳:')[1].trim();
    } else if (line.includes('元:')) {
      result.yuan = line.split('元:')[1].trim();
    } else if (line.includes('局数:')) {
      result.jushu = line.split('局数:')[1].trim();
    } else if (line.includes('旬首:')) {
      result.xunshou = line.split('旬首:')[1].trim();
    } else if (line.includes('空亡:')) {
      const kongwangStr = line.split('空亡:')[1].trim();
      result.kongwang = kongwangStr.split(',').map(s => s.trim());
    } else if (line.includes('值使门:')) {
      result.zhishimen = line.split('值使门:')[1].trim();
    }
  }

  // Parse 九宫 (Nine Palaces) structure
  const palaces = ['坎一宫', '坤二宫', '震三宫', '巽四宫', '中五宫', '乾六宫', '兑七宫', '艮八宫', '离九宫'];
  let currentPalace = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check if this line is a palace name
    for (const palace of palaces) {
      if (trimmedLine.includes(palace)) {
        currentPalace = palace;
        result.jiuGong[currentPalace] = {
          tianGan: '',
          diGan: '',
          xing: '',
          shen: '',
          men: ''
        };
        break;
      }
    }

    // Parse palace properties
    if (currentPalace && trimmedLine.includes(':')) {
      if (trimmedLine.includes('天干:')) {
        result.jiuGong[currentPalace].tianGan = trimmedLine.split('天干:')[1].trim();
      } else if (trimmedLine.includes('地干:')) {
        result.jiuGong[currentPalace].diGan = trimmedLine.split('地干:')[1].trim();
      } else if (trimmedLine.includes('星:')) {
        result.jiuGong[currentPalace].xing = trimmedLine.split('星:')[1].trim();
      } else if (trimmedLine.includes('神:')) {
        result.jiuGong[currentPalace].shen = trimmedLine.split('神:')[1].trim();
      } else if (trimmedLine.includes('门:')) {
        result.jiuGong[currentPalace].men = trimmedLine.split('门:')[1].trim();
      }
    }
  }

  return result;
}

describe('QiMen DunJia Chart Generation - Test Cases', () => {
  it('Test case 1: 2008-11-04T12:30:00', async () => {
    const output = await runMain(['--moment', '2008-11-04T12:30:00']);
    const result = parseOutput(output);

    // Verify main fields
    assert.strictEqual(result.datetime, '2008-11-04T12:30', 'Datetime should match');
    assert.strictEqual(result.yinyang, '阴', 'YinYang should be 阴');
    assert.strictEqual(result.yuan, '下元', 'Yuan should be 下元');
    assert.strictEqual(result.jushu, '2', 'JuShu should be 2');
    assert.strictEqual(result.xunshou, '甲寅', 'XunShou should be 甲寅');
    assert.deepStrictEqual(result.kongwang, ['子', '丑'], 'KongWang should be [子, 丑]');
    assert.strictEqual(result.zhishimen, '开门', 'ZhiShiMen should be 开门');

    // Verify selected palaces
    assert.strictEqual(result.jiuGong['坎一宫'].tianGan, '乙', '坎一宫 TianGan should be 乙');
    assert.strictEqual(result.jiuGong['坎一宫'].diGan, '己', '坎一宫 DiGan should be 己');
    assert.strictEqual(result.jiuGong['坎一宫'].xing, '天冲', '坎一宫 Xing should be 天冲');
    assert.strictEqual(result.jiuGong['坎一宫'].shen, '玄武', '坎一宫 Shen should be 玄武');
    assert.strictEqual(result.jiuGong['坎一宫'].men, '伤门', '坎一宫 Men should be 伤门');

    assert.strictEqual(result.jiuGong['坤二宫'].tianGan, '癸', '坤二宫 TianGan should be 癸');
    assert.strictEqual(result.jiuGong['坤二宫'].xing, '天心', '坤二宫 Xing should be 天心');
    assert.strictEqual(result.jiuGong['坤二宫'].shen, '值符', '坤二宫 Shen should be 值符');
    assert.strictEqual(result.jiuGong['坤二宫'].men, '开门', '坤二宫 Men should be 开门');

    assert.strictEqual(result.jiuGong['巽四宫'].tianGan, '戊, 丁', '巽四宫 TianGan should be 戊, 丁');
    assert.strictEqual(result.jiuGong['巽四宫'].xing, '天芮, 天禽', '巽四宫 Xing should be 天芮, 天禽');
  });

  it('Test case 2: 1998-09-26T11:20:00', async () => {
    const output = await runMain(['--moment', '1998-09-26T11:20:00']);
    const result = parseOutput(output);

    // Verify main fields
    assert.strictEqual(result.datetime, '1998-09-26T11:20', 'Datetime should match');
    assert.strictEqual(result.yinyang, '阴', 'YinYang should be 阴');
    assert.strictEqual(result.yuan, '下元', 'Yuan should be 下元');
    assert.strictEqual(result.jushu, '4', 'JuShu should be 4');
    assert.strictEqual(result.xunshou, '甲午', 'XunShou should be 甲午');
    assert.deepStrictEqual(result.kongwang, ['辰', '巳'], 'KongWang should be [辰, 巳]');
    assert.strictEqual(result.zhishimen, '休门', 'ZhiShiMen should be 休门');

    // Verify selected palaces (伏吟局 - all tianGan and diGan match)
    assert.strictEqual(result.jiuGong['坎一宫'].tianGan, '辛', '坎一宫 TianGan should be 辛');
    assert.strictEqual(result.jiuGong['坎一宫'].diGan, '辛', '坎一宫 DiGan should be 辛');
    assert.strictEqual(result.jiuGong['坎一宫'].xing, '天蓬', '坎一宫 Xing should be 天蓬');
    assert.strictEqual(result.jiuGong['坎一宫'].shen, '值符', '坎一宫 Shen should be 值符');
    assert.strictEqual(result.jiuGong['坎一宫'].men, '休门', '坎一宫 Men should be 休门');

    assert.strictEqual(result.jiuGong['坤二宫'].tianGan, '庚, 乙', '坤二宫 TianGan should be 庚, 乙');
    assert.strictEqual(result.jiuGong['坤二宫'].diGan, '庚', '坤二宫 DiGan should be 庚');
    assert.strictEqual(result.jiuGong['坤二宫'].xing, '天芮, 天禽', '坤二宫 Xing should be 天芮, 天禽');

    assert.strictEqual(result.jiuGong['震三宫'].tianGan, '己', '震三宫 TianGan should be 己');
    assert.strictEqual(result.jiuGong['震三宫'].diGan, '己', '震三宫 DiGan should be 己');
    assert.strictEqual(result.jiuGong['震三宫'].xing, '天冲', '震三宫 Xing should be 天冲');
  });

  it('Test case 3: 2025-11-05T21:43:00 (伏吟局)', async () => {
    const output = await runMain(['--moment', '2025-11-05T21:43:00']);
    const result = parseOutput(output);

    // Verify main fields
    assert.strictEqual(result.datetime, '2025-11-05T21:43', 'Datetime should match');
    assert.strictEqual(result.yinyang, '阴', 'YinYang should be 阴');
    assert.strictEqual(result.yuan, '下元', 'Yuan should be 下元');
    assert.strictEqual(result.jushu, '2', 'JuShu should be 2');
    assert.strictEqual(result.xunshou, '甲寅', 'XunShou should be 甲寅');
    assert.deepStrictEqual(result.kongwang, ['子', '丑'], 'KongWang should be [子, 丑]');
    assert.strictEqual(result.zhishimen, '开门', 'ZhiShiMen should be 开门');

    // Verify selected palaces (伏吟局 - all tianGan and diGan match)
    assert.strictEqual(result.jiuGong['坎一宫'].tianGan, '己', '坎一宫 TianGan should be 己');
    assert.strictEqual(result.jiuGong['坎一宫'].diGan, '己', '坎一宫 DiGan should be 己');
    assert.strictEqual(result.jiuGong['坎一宫'].xing, '天蓬', '坎一宫 Xing should be 天蓬');
    assert.strictEqual(result.jiuGong['坎一宫'].shen, '九天', '坎一宫 Shen should be 九天');
    assert.strictEqual(result.jiuGong['坎一宫'].men, '休门', '坎一宫 Men should be 休门');

    assert.strictEqual(result.jiuGong['坤二宫'].tianGan, '戊, 丁', '坤二宫 TianGan should be 戊, 丁');
    assert.strictEqual(result.jiuGong['坤二宫'].diGan, '戊', '坤二宫 DiGan should be 戊');
    assert.strictEqual(result.jiuGong['坤二宫'].xing, '天芮, 天禽', '坤二宫 Xing should be 天芮, 天禽');

    assert.strictEqual(result.jiuGong['震三宫'].tianGan, '乙', '震三宫 TianGan should be 乙');
    assert.strictEqual(result.jiuGong['震三宫'].diGan, '乙', '震三宫 DiGan should be 乙');
    assert.strictEqual(result.jiuGong['震三宫'].xing, '天冲', '震三宫 Xing should be 天冲');

    assert.strictEqual(result.jiuGong['乾六宫'].tianGan, '癸', '乾六宫 TianGan should be 癸');
    assert.strictEqual(result.jiuGong['乾六宫'].diGan, '癸', '乾六宫 DiGan should be 癸');
    assert.strictEqual(result.jiuGong['乾六宫'].shen, '值符', '乾六宫 Shen should be 值符');
    assert.strictEqual(result.jiuGong['乾六宫'].men, '开门', '乾六宫 Men should be 开门');

    assert.strictEqual(result.jiuGong['离九宫'].tianGan, '庚', '离九宫 TianGan should be 庚');
    assert.strictEqual(result.jiuGong['离九宫'].diGan, '庚', '离九宫 DiGan should be 庚');
    assert.strictEqual(result.jiuGong['离九宫'].xing, '天英', '离九宫 Xing should be 天英');
  });

  it('Test case 4: 2025-11-05T23:30:00 (变局)', async () => {
    const output = await runMain(['--moment', '2025-11-05T23:30:00']);
    const result = parseOutput(output);

    // Verify main fields - note the change from 下元 to 上元 and JuShu from 2 to 5
    assert.strictEqual(result.datetime, '2025-11-05T23:30', 'Datetime should match');
    assert.strictEqual(result.yinyang, '阴', 'YinYang should be 阴');
    assert.strictEqual(result.yuan, '上元', 'Yuan should be 上元 (changed from test case 3)');
    assert.strictEqual(result.jushu, '5', 'JuShu should be 5 (changed from test case 3)');
    assert.strictEqual(result.xunshou, '甲子', 'XunShou should be 甲子 (changed from test case 3)');
    assert.deepStrictEqual(result.kongwang, ['戌', '亥'], 'KongWang should be [戌, 亥] (changed from test case 3)');
    assert.strictEqual(result.zhishimen, '死门', 'ZhiShiMen should be 死门 (changed from test case 3)');

    // Verify selected palaces
    assert.strictEqual(result.jiuGong['坎一宫'].tianGan, '壬', '坎一宫 TianGan should be 壬');
    assert.strictEqual(result.jiuGong['坎一宫'].diGan, '壬', '坎一宫 DiGan should be 壬');
    assert.strictEqual(result.jiuGong['坎一宫'].xing, '天蓬', '坎一宫 Xing should be 天蓬');
    assert.strictEqual(result.jiuGong['坎一宫'].shen, '玄武', '坎一宫 Shen should be 玄武');
    assert.strictEqual(result.jiuGong['坎一宫'].men, '休门', '坎一宫 Men should be 休门');

    assert.strictEqual(result.jiuGong['坤二宫'].tianGan, '辛, 戊', '坤二宫 TianGan should be 辛, 戊');
    assert.strictEqual(result.jiuGong['坤二宫'].diGan, '辛', '坤二宫 DiGan should be 辛');
    assert.strictEqual(result.jiuGong['坤二宫'].xing, '天芮, 天禽', '坤二宫 Xing should be 天芮, 天禽');
    assert.strictEqual(result.jiuGong['坤二宫'].shen, '值符', '坤二宫 Shen should be 值符');
    assert.strictEqual(result.jiuGong['坤二宫'].men, '死门', '坤二宫 Men should be 死门');

    assert.strictEqual(result.jiuGong['震三宫'].tianGan, '庚', '震三宫 TianGan should be 庚');
    assert.strictEqual(result.jiuGong['震三宫'].diGan, '庚', '震三宫 DiGan should be 庚');
    assert.strictEqual(result.jiuGong['震三宫'].xing, '天冲', '震三宫 Xing should be 天冲');

    assert.strictEqual(result.jiuGong['巽四宫'].tianGan, '己', '巽四宫 TianGan should be 己');
    assert.strictEqual(result.jiuGong['巽四宫'].diGan, '己', '巽四宫 DiGan should be 己');

    assert.strictEqual(result.jiuGong['离九宫'].tianGan, '癸', '离九宫 TianGan should be 癸');
    assert.strictEqual(result.jiuGong['离九宫'].diGan, '癸', '离九宫 DiGan should be 癸');
    assert.strictEqual(result.jiuGong['离九宫'].xing, '天英', '离九宫 Xing should be 天英');
    assert.strictEqual(result.jiuGong['离九宫'].shen, '螣蛇', '离九宫 Shen should be 螣蛇');
    assert.strictEqual(result.jiuGong['离九宫'].men, '景门', '离九宫 Men should be 景门');
  });
});

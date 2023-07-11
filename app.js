'use strict'

// 引入所需的套件和模組
require('dotenv').config();
const fs = require('fs');
const yaml = require('js-yaml');
const notifySDK = require('line-notify-sdk');
const numeral = require('numeral');
const { DateTime } = require('luxon');
const { WebSocketClient } = require('@fugle/marketdata');

// 獲取環境變數設定
const apiKey = process.env.FUGLE_MARKETDATA_API_KEY;
const token = process.env.LINE_NOTIFY_ACCESS_TOKEN;

// 主要邏輯執行區塊
async function main() {
  try {
    // 讀取設定檔
    const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));
    const alerts = new Map(Object.entries(config.alerts));

    // 建立 Line Notify 服務和 Fugle Market Data API 的 WebSocket 連接
    const notify = new notifySDK();
    const client = new WebSocketClient({ apiKey });
    const stock = client.stock;

    // 監聽行情資料變化
    if (alerts.size) {
      const symbols = Array.from(alerts.keys());
      await stock.connect();
      stock.subscribe({ channel: 'aggregates', symbols });

      stock.on('message', (message) => {
        const { event, data } = JSON.parse(message);
        if (event === 'data') checkMatches(data);
      });
    }

    // 檢查符合條件的行情資料
    function checkMatches(data) {
      // 擷取行情資料中的相關數據
      const { symbol, lastTrade, lastUpdated } = data;
      if (lastTrade?.time !== lastUpdated) return;

      // 檢查符合條件的監控股票
      const alert = alerts.get(symbol);
      if (!alert) return;

      // 根據監控條件進行判斷
      const compare = {
        '>': (value, target) => value > target,
        '>=': (value, target) => value >= target,
        '=': (value, target) => value === target,
        '<=': (value, target) => value <= target,
        '<': (value, target) => value < target,
      };

      // 符合條件時，發送通知
      if (alert.type === 'price' && compare[alert.comparator](lastTrade.price, alert.target)) {
        sendAlert(alert, data);
      }
    }

    // 發送通知
    function sendAlert(alert, data) {
      // 擷取相關數據
      const { symbol, name, lastPrice, change, changePercent, lastUpdated } = data;

      // 格式化時間
      const time = DateTime
        .fromMillis(Math.floor(lastUpdated / 1000))
        .toFormat('yyyy/MM/dd HH:mm:ss');

      // 建構通知內容
      const message = [''].concat([
        `<<${alert.title}>>`,
        `${alert.message}`,
        `---`,
        `${name} (${symbol})`,
        `成交: ${numeral(lastPrice).format('0.00')}`,
        `漲跌: ${numeral(change).format('+0.00')} (${numeral(changePercent).format('+0.00')}%)`,
        `時間: ${time}`,
      ]).join('\n');

      // 發送 Line Notify 通知
      notify.notify(token, message)
        .then(() => console.log(message))
        .catch((e) => console.log(e));

      // 從監控清單中刪除該股票
      alerts.delete(symbol);
    }
  } catch (e) {
    console.log(e)
  }
}

// 執行主要邏輯
main();

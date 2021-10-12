'use strict';

async function alert(client, notify, config) {
  const { token, alert } = config;
  let notified = false;  // 僅通知一次，預設未通知

  client.intraday.quote({ symbolId: alert.symbol })
    .onmessage = message => {
      const res = JSON.parse(message.data); // 將 JSON string 轉為 JavaScript 物件

      if (res.data.info.type !== 'EQUITY') return;  // 僅監控整股盤，忽略盤中零股
      if (!res.data.quote.trade) return;  // 沒有成交價時跳過

      const { price } = res.data.quote.trade;  // 取得成交價
      const { tradeVolume } = res.data.quote.total;  // 取得成交總量

      // 比較運算子
      const compare = {
        '>': (price, target) => price > target,
        '>=': (price, target) => price >= target,
        '=': (price, target) => price === target,
        '<=': (price, target) => price <= target,
        '<': (price, target) => price < target,
      };

      // 當成交價格來到設定條件、且尚未通知時，發送通知
      if (alert.type === 'price' && !notified && compare[alert.comparator](price, alert.target)) {
        const message = `${alert.symbol} ${alert.name} 成交價 ${price} 總量 ${tradeVolume}`;

        notify.notify(token, message)
          .then(() => console.log(message))
          .catch((e)=> console.log(e));

        notified = true;
      }
    };
}

module.exports = alert;

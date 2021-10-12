'use strict'

require('dotenv').config();

const { WebSocketClient } = require('@fugle/realtime');
const notifySDK = require('line-notify-sdk');
const config = require('./config.json');

const apiToken = process.env.FUGLE_REALTIME_API_TOKEN;
const token = process.env.LINE_NOTIFY_ACCESS_TOKEN;

async function main() {
  try {
    const client = new WebSocketClient({ apiToken });
    const notify = new notifySDK();

    if (config?.alerts?.length) {
      config.alerts.forEach(alert => require('./lib/alert')(client, notify, { token, alert }));
    }
  } catch (e) {
    console.log(e)
  }
}

main();

# Price Alerts Example

> Stock price alerts implementation using Fugle Realtime API and Line Notify

## Installation

Clone the repository

    git clone https://github.com/fugle-dev/price-alerts-example.git

Switch to the repo folder

    cd price-alerts-example
    
Install dependencies
    
    npm install

Copy `.env` file and set `FUGLE_REALTIME_API_TOKEN`, `LINE_NOTIFY_TOKEN` 

    cp .env.example .env

## Set Price Alerts

Edit `config.json` to set price alerts

    {
      "alerts": [
        {
          "symbol": "2884",
          "name": "玉山金",
          "type": "price",
          "comparator": ">=",
          "target": 25
        },
        {
          "symbol": "2330",
          "name": "台積電",
          "type": "price",
          "comparator": "<=",
          "target": 600
        }
      ]
    }



## Start Application

    npm start

## License

[MIT](LICENSE)

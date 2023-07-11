# Price Alerts Example

> Stock price alerts implementation using Fugle Realtime API and Line Notify

## Installation

Clone the repository

    git clone https://github.com/fugle-dev/price-alerts-example.git

Switch to the repo folder

    cd price-alerts-example
    
Install dependencies
    
    npm install

Copy `.env` file and set `FUGLE_MARKETDATA_API_KEY`, `LINE_NOTIFY_TOKEN` 

    cp .env.example .env

## Set Price Alerts

Edit `config.yml` to set price alerts


    ---
    alerts:
      2330:
        title: 到價提醒
        message: 台積電突破600元
        type: price
        comparator: ">"
        target: 600


## Start Application

    npm start

## License

[MIT](LICENSE)

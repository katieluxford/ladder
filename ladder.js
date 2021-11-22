

const getHistoricalPrice = async (currency, date) => {
let indexDate="22-11-2021";
let string = "https://api.coingecko.com/api/v3/coins/" + currency +"/history?date="+indexDate+"&localization=false";
await fetch(string)
.then(resp => resp.json())
.then(data => console.log(data.market_data.current_price.gbp))}


getHistoricalPrice("vechain");

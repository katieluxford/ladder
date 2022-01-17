async function getCurrentPrice(currency, fiat) {
let string = "https://api.coingecko.com/api/v3/simple/price?ids="+currency+"&vs_currencies="+fiat;
let response = await fetch(string)
if(response.status===200)
  {
    return await response.json();
  }
}

function calculateAssetPosition(cost, value, txn) {
  var position = 0.0;
  if (txn.type == "buy"){
    position = txn.amount * (value - cost);
  } else if (txn.type == "sell"){
    position = txn.amount * (cost - value);
  } else if (txn.type == "in"){
    position += txn.amount * value;
  } else if (txn.type == "out"){
    position -= txn.amount * value;
  }
  return position;
}

async function getHistoricalPrice(currency, date) {
let string = "https://api.coingecko.com/api/v3/coins/" + currency +"/history?date="+date+"&localization=true";
let response = await fetch(string)
if(response.status===200)
  {
    return await response.json();
  }
}

var Portfolio = function()
{
  this.counterCurrency = "gbp";
  this.txns = {};

  this.totalAssetValue = async (asset) => {
    var val = 0.0
    var assetName = this.txns[asset].name;
    var assetHistory = this.txns[asset].data;
    await getCurrentPrice(assetName, this.counterCurrency).then(priceData=>{
      for (let i = 0; i < assetHistory.length; i++)
      {
        let txn = assetHistory[i];
        if (txn.type == "buy")
        {
          val += txn.amount* priceData[assetName][this.counterCurrency];
        } else if (txn.type == "sell"){
          val -= txn.amount * priceData[assetName][this.counterCurrency];
        } else if (txn.type == "in"){
          val += txn.amount * priceData[assetName][this.counterCurrency];
        } else if (txn.type == "out"){
          val -= txn.amount * priceData[assetName][this.counterCurrency];
        }
      }
    })
    return val;
  }

  this.totalPortfolioValue = async () => {
    var val = 0.0
    for(const asset in this.txns)
    {
      val += await this.totalAssetValue(asset);
    }
    return val;
  }

  this.totalPortfolioPosition = async () => {
    var position = 0.0
    for(const asset in this.txns)
    {
      position += await this.totalAssetPosition(asset);
    }
    return position;
  }

  this.totalAssetPosition = async (asset)=>{
    var position = 0.0;
    var assetName = this.txns[asset].name;
    var assetHistory = this.txns[asset].data;
    await getCurrentPrice(assetName, this.counterCurrency)
    .then(async currentPriceData=>{
      for (let i = 0; i < assetHistory.length; i++){
        let txn = assetHistory[i];
        if (txn.fees===0){
          await getHistoricalPrice(assetName, txn.date)
          .then(historicalPriceData=>{
            let currentPrice = currentPriceData[assetName][this.counterCurrency];
            let historicalPrice = historicalPriceData.market_data.current_price[this.counterCurrency];
            position += calculateAssetPosition(historicalPrice, currentPrice, txn);
          })
        } else {
          let currentPrice = currentPriceData[assetName][this.counterCurrency];
          position += calculateAssetPosition(txn.fees / txn.amount, currentPrice, txn);
        }
      }
    })
    return position;
  }
}

Ladder.Portfolio = new Portfolio();
const portfolio = Ladder.Portfolio;

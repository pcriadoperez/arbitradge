'use strict';
const ccxt = require ('ccxt')
const fetch = require("node-fetch")
var basicAuth = require('express-basic-auth')

//Parameters
var baseFiat = "EUR"
var fiats = ["USD", "AUD", "EUR", "ZAR", "IDR"]
var baseCryptocurrency = "BTC"
var symbols = ["BTC", "ETH", "BCH","LTC", "XRP"] //List of accepted cryptocurrencies

//HARD CODED Tickers
//must see what ticker looks like and if all look the same

/*
function Ticker(){

}

function Trade(){
    this.type = "" // ENUMERABLE OF BUY/SELL/TRANSFER
    this.currencyFrom = ""
    this.currencyTo = ""
    this.exchangeFrom = ""
    this.exchangeTo = ""
    this.price = -1
    this.time = -1
    this.fee = 0
}

function Transfer(){
    this.fromExchange = ""
    this.toExchange = ""
    this.currency = ""
    this.fee = ""
    this.time = -1
}*/

/*function OpenLoop(){
    this.initialTrade = {} //First Trade ie USD->ETH
    this.transfer = {} //Transfer to different exchange
    this.finalTrade = {}
    this.gains = -0.1
}
function ClosedLoop(){
    this.operations = []
}*/

//TODO add function to create operation and only create if valid (Currency coming in is equal to currency coming out)
function Trade (ticker, type){
    this.ticker = ticker //Contains ticker information, must check if all tickers for exchanges are the same
    this.type = type // can be BUY, SELL, TRANSFER
}

function Operation(){
    this.trades = {}
    //this.fixedFee = 0
    //this.percentageFee = 0.0
    //this.time = -1
    this.gain = undefined //Doesn't include fixedFee //TODO Include Fixed fee
    //this.rating = 0
}
Operation.prototype.addTrade = function (trade) {
    try{
        if(this.trades.length != 0 && trade.currencyFrom != this.trades[length-1].currencyTo) return false //CHECK CURRENCIES MATCH
        this.trades.push(trade) 
        //this.fee += transaction.fee
        //this.time += transaction.time
        this.gain = this.getGains()
        //this.rating = 0 //TODO
        return true
    }
    catch(error){
        return error
    }
    
}
Operation.prototype.getGains = function (){
    var price = 1
    var percentage = 1 //In percentage includes fees
    if(trades.length<2) return 0
    else{
        for (var i =0; i<this.trades.length; i++){
            //percentage = percentage * (1- this.trades[i].percentageFee)
            if(this.trades[i].type = "SELL") percentage = percentage * this.trades[i].ticker.last
            if(this.trades[i].type = "BUY") percentage = percentage / this.trades[i].ticker.last
            if(this.trades[i].type = "TRANSFER") percentage = percentage
        }
        return percentage
    }
    
}

//FIAT HANDLER

var fiatData ={"base":"EUR","date":"2018-01-15","rates":{"AUD":1.5434,"BGN":1.9558,"BRL":3.9237,"CAD":1.5263,"CHF":1.1799,"CNY":7.904,"CZK":25.531,"DKK":7.4496,"GBP":0.89043,"HKD":9.605,"HRK":7.434,"HUF":308.9,"IDR":16337.0,"ILS":4.1737,"INR":77.98,"JPY":135.81,"KRW":1305.7,"MXN":23.12,"MYR":4.8568,"NOK":9.6708,"NZD":1.6828,"PHP":61.753,"PLN":4.1686,"RON":4.6278,"RUB":69.283,"SEK":9.8335,"SGD":1.6223,"THB":39.194,"TRY":4.6442,"USD":1.2277,"ZAR":15.103}}

function updateFIATData(base){
    baseFiat = base
    const url = "https://api.fixer.io/latest?base="+base
    return fetch(url)
    .then(response => {
      response.json().then(json => {
        fiatData = json
      })
    })
    .catch(error => {
      console.log(error);
    });
}

function fiatRate(base, to){
    if(base==to) return 1
    return fiatData.rates[to]
}

function crpytoRate(baseExchange = baseExchange, base, to){
    if(baseExchange.symbols.indexOf(base+"/"+to)>-1) {
        //await baseExchange.fetchTicker(base+"/"+to)).then
    }
    else if (baseExchange.symbols.indexOf(to+"/"+base)>-1){
        //await baseExchange.fetchTicker(to+"/"+base))
    }
    return false
}

function update(){  
    var operations = []
    for(var symbol =0 ; symbol<symbols.length; symbol++){
        for(var baseExchange=0; baseExchange<exchanges.length ; baseExchange++){
            let baseSymbols = fetchSymbols(baseExchange, symbol)
            baseSymbols.forEach(function(element) {
            }, this);
            var baseOperation = Operation()
            //baseOperation.addTrade(exchangeTickers[baseExchange], "TRANSFER") // TODO INCLUDE TRANSFER FEE
            baseOperation.addTrade(await (baseExchange.fetchTicker(fetchSymbol(baseExchange, symbol)).catch(()=>{})), "BUY")
            for (var quoteExchange = 0; quoteExchange<exchanges.length; quoteExchange++){
                var newOperation = baseOperation
                //newOperation.addTrade(transferTickers[symbol], "TRASNFER")  //TODO include transfer fee
                newOperation.addTrade(await (quoteExchange.fetchTicker(fetchSymbol(quoteExchange, symbol)).catch(()=>{})), "SELL")
                //newOperation.addTrade(exchangeTickers[quoteExchange], "TRANSFER") // TODO INCLUDE TRANSFER FEE
                operations.push(newOperation) 
            }
        }
    }
    console.log(operations)
}

function fetchSymbols(exchange, symbol){
    try{
        var symbols = []
        exchange.loadMarkets()
        for(var i=0;i<exchange.symbols.length;i++){
            let s = exchange.symbols[i].split('/')
            if(s[0]==symbol || s[1]==symbol){
                symbols.push(exchange.symbols[i])
            }
        }
        return symbols
    }
    catch(error){
        return error
    }
}

function calculateGains(ticker1, ticker2){
    if(ticker1[baseFiat] != null && ticker2[bacseFiat] != null) return ticker2[baseFiat]/ticker1[baseFiat]
}

(async () => {
    console.log("--------------- START --------------------")
    
    //Get FIAT DATA & Test
    console.log("Rate from EUR to AUD")
    console.log(fiatRate("EUR", "AUD"))

    var tableify = require('tableify');
    var ratesHtml = tableify(fiatData.rates)

    // ADD EXCHANGES
    var exchanges = [] 
    const bitstamp = new ccxt.bitstamp()
    exchanges.push(bitstamp)
    const btcmarkets = new ccxt.btcmarkets()
    exchanges.push(btcmarkets)
    const bitfinex = new ccxt.bitfinex ()
    exchanges.push(bitfinex)
    const bitbay = new ccxt.bitbay()
    exchanges.push(bitbay)
    const kraken = new ccxt.kraken()
    exchanges.push(kraken)
    const luno = new ccxt.luno()
    //exchanges.push(luno)
    const coinspot = new ccxt.coinspot()
    exchanges.push(coinspot)
    const gdax = new ccxt.gdax()
    exchanges.push(gdax)
    const coinmate = new ccxt.coinmate()
    exchanges.push(coinmate)

    var data

    //console.log(await exchanges[0].fetchTickers())

    // LOAD MARKETS
    for (var i=0;i<exchanges.length;i++){
        await(exchanges[i].loadMarkets()).catch((error)=>{return error})
    }

    var tickers = []
    for (let exchange of exchanges){
        let listOfSymbols = exchange.symbols
        console.log(listOfSymbols)
        for(var i=0; i<listOfSymbols.length; i++){
            let ticker = await (exchange.fetchTicker(listOfSymbols[i])).then(
                (ticker) => {
                    let customTicker = {
                        exchange: exchange.name,
                        symbol: ticker.symbol,
                        symbolFrom: ticker.symbol.split('/')[0],
                        symbolTo: ticker.symbol.split('/')[1],
                        last: ticker.last,
                        [baseFiat]: ticker.last/fiatRate(baseFiat, ticker.symbol.split('/')[1]),
                        [baseCryptocurrency]: -1
                    }
                    tickers.push(customTicker)
                    console.log(exchange.name)
                    console.log(ticker.symbol)
                    console.log(ticker.last)
                }
            ).catch((error)=>{
                console.log(error)
                return error})
            //Return tickers
        } 
    }
    var tickers2 = []
    for (let exchange of exchanges){
        for(let baseTicker of tickers){
            for(let endTicker of tickers){
                if(baseTicker.exchange != endTicker.exchange && (baseTicker.symbol.includes(endTicker.symbolFrom) || baseTicker.symbol.includes(endTicker.symbolFrom))){
                    let customTicker = {
                        base: baseTicker,
                        end: endTicker,
                        gain: endTicker[baseFiat]/baseTicker[baseFiat]
                    }
                    tickers2.push(customTicker)
                }
            }
        }
    }
    tickers2.sort(function(a,b) {
        if(a.gain > b.gain) return -1
        return 1
    })
    console.log("GENERATED {0} COMBINATIONS!!", tickers2.length)
    let tickersHtml = tableify(tickers2)

    // --- TEST ---
    //console.log(gdax.symbols) // List possible symbols
    
    //let listOfSymbols = fetchSymbols(gdax, "BTC") //Find possible symbols using BTC
   
    /*exchanges.forEach(function(exchange){
        let listOfSymbols = exchange.symbols
        console.log(listOfSymbols)
        for(var i=0; i<listOfSymbols.length; i++){
            let ticker = await (gdax.fetchTicker(listOfSymbols[i])).catch((error)=>{return error})
            console.log(ticker.symbol)
            console.log(ticker.info.price) //Retunr tickers
        }
    })*/

    /*
    for (let exchange of exchanges){
        let listOfSymbols = exchange.symbols
        console.log(listOfSymbols)
        for(var i=0; i<listOfSymbols.length; i++){
            let ticker = await (exchange.fetchTicker(listOfSymbols[i])).catch((error)=>{
                console.log(error)
                return error})
            //console.log(ticker)
            console.log(exchange.name)
            console.log(ticker.symbol)
            console.log(ticker.last) //Return tickers
        } 
    }

    */

    /* FINDS BEST BTCEUR PRICE
    var listofBTCEUR = []
    for(let exchange of exchanges){
        await (exchange.fetchTicker("BTC/EUR")).then((btceur) => {
            console.log(exchange.name)
            console.log(btceur.symbol)
            console.log(btceur.last)
            listofBTCEUR.push(btceur)}).catch(() => {console.log("Didn't find symbol")})
    }
    let result = listofBTCEUR.reduce(function(a,b){
        if(a.last > b.last) return a
        else return b
    })
    console.log("result")
    console.log(result)
    */

    //loop every exchange
    for(var i = 0; i< exchanges.length ; i++) {
        //console.log (await (exchanges[i].fetchTicker ("BTC/USD")).catch(() => {console.log("Didn't find symbol")}))// all tickers indexed by their symbols
        //loop every coin
    }
    //update()
    //console.log(await(gdax.fet))

    const express = require('express')
    const app = express()

    /*app.use(basicAuth({
        users: { 'admin': 'fantastic' }
    }))*/
    
    app.get('/', (req, res) => res.send(tickersHtml))

    app.listen(3000, () => console.log('Example app listening on port 3000!'))

}) ()
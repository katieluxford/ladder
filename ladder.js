window.onload = function(){
var infoBox = document.createElement("canvas");
infoBox.setAttribute("id", "infoBox");
infoBox.style.position = "fixed";
infoBox.style.padding = "2.5px";
infoBox.style.backgroundColor = "cornsilk";
infoBox.style.width = "70%";
infoBox.style.height = "70%";
infoBox.style.color = "rgb(173,172,173)";
infoBox.style.overflowX = "scroll";
infoBox.style.overflowY = "scroll";
document.body.appendChild(infoBox);
}

portfolio.totalPortfolioValue().then(value=>{console.log(value)});
portfolio.totalPortfolioPosition().then(value=>{console.log(value)});


/*
for (const key in portfolio.txns)
{
  //portfolio.totalAssetValue(key).then(value=>{console.log(key+" value: "+value)});
  //portfolio.totalAssetPosition(key).then(value=>{console.log(key+" position: "+value)});
}
*/

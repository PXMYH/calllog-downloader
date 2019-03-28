var url = process.env.URL;
var username = process.env.USERNAME;
var password = process.env.PASSWORD;
var interval = process.env.INTERVAL;

console.log("Getting URL: " + url);
console.log("Getting USERNAME: " + username);
console.log("Getting PASSWORD: " + password);
console.log("Getting INTERVAL: " + interval);

module.exports = {
  // URL: "http://localhost:3000/",
  URL:
    "https://www.sec.gov/cgi-bin/browse-edgar?CIK=AAPL&action=getcompany&owner=exclude",
  USERNAME: "simon",
  PASSWORD: "says",
  INTERVAL: "5", // minutes
  DATE_SLECTOR: "#prior_to",
  EXPORT_SELECTOR:
    "#dataTable_wrapper > div.fg - toolbar.ui - toolbar.ui - widget - header.ui - helper - clearfix.ui - corner - tl.ui - corner - tr > div > a.dt - button.ui - button.ui - state -default.ui - button - text - only.buttons - collection > span",
  CSV_SELECTOR: "body > div.dt-button-collection > a:nth-child(2) > span",
  EXCEL_SELECTOR: "body > div.dt-button-collection > a:nth-child(1) > span"
};

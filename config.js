var url = process.env.URL;
var username = process.env.USERNAME;
var password = process.env.PASSWORD;
var interval = process.env.INTERVAL;

console.log("Getting URL: " + url);
console.log("Getting USERNAME: " + username);
console.log("Getting PASSWORD: " + password);
console.log("Getting INTERVAL: " + interval);

module.exports = {
  URL: "https://10.23.77.169/e911-lam-gui/init.do",
  USERNAME: "admin", // Action: change this
  PASSWORD: "admin", // Action: change this
  INTERVAL: "5", // minutes
  DATE_SLECTOR: "#searchCallTimestampInput",
  EXPORT_SELECTOR:
    "#dataTable_wrapper > div.fg-toolbar.ui-toolbar.ui-widget-header.ui-helper-clearfix.ui-corner-tl.ui-corner-tr > div > a.dt-button.ui-button.ui-state-default.ui-button-text-only.buttons-collection > span",
  CSV_SELECTOR: "body > div.dt-button-collection > a:nth-child(2) > span",
  EXCEL_SELECTOR: "body > div.dt-button-collection > a:nth-child(1) > span"
};

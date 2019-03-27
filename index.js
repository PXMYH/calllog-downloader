const puppeteer = require("puppeteer");
var configFile = require("./config_test.js");
var cronJob = require("cron").CronJob;

var job = new cronJob({
  // runs every 5 minutes
  cronTime: "* */5 * * * *",
  onTick: function() {
    console.log("You will see this message every second");

    (async () => {
      const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true // bypass security warning page
      });
      const page = await browser.newPage();

      // ******** LOGIN ******** //

      // authenticate basic auth
      console.log("authenticating basic auth ...");
      await page.authenticate({
        username: configFile.USERNAME,
        password: configFile.PASSWORD
      });

      console.log("opening page " + configFile.URL + " ...");
      await page.goto(configFile.URL, { waitUntil: "networkidle2" });

      // type date and filter result
      gmtDate = new Date();

      var currentMonth = gmtDate.getUTCMonth() + 1;
      currentMonth = (currentMonth < 10 ? "0" : "") + currentMonth;

      var currentDate = gmtDate.getUTCDate();
      currentDate = (currentDate < 10 ? "0" : "") + currentDate;

      var currentYear = "" + gmtDate.getUTCFullYear();
      var currentGMTString =
        "" + currentYear + "-" + currentMonth + "-" + currentDate;
      console.log("typing in filter ...");
      await page.type(configFile.DATE_SLECTOR, currentGMTString);
      console.log("press enter ...");
      await page.keyboard.press("Enter");

      // click on export
      // page.waitForSelector(configFile.EXPORT_SELECTOR);
      // await page.click(configFile.EXPORT_SELECTOR);
      // await page.waitForSelector(configFile.CSV_SELECTOR);

      // save report

      browser.close();
    })();
  },
  start: false,
  timeZone: "America/New_York"
});

job.start();

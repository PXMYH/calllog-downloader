const fs = require("fs");
const os = require("os");
const path = require("path");
const puppeteer = require("puppeteer");
const util = require("util");

var configFile = require("./config_test.js");
var cronJob = require("cron").CronJob;

const DOWNLOAD_PATH = path.resolve(__dirname, "downloads");

/**
 * From @xprudhomme.
 * Check if file exists, watching containing directory meanwhile.
 * Resolve if the file exists, or if the file is created before the timeout
 * occurs.
 * @param {string} filePath
 * @param {integer} timeout
 * @returns {!Promise<undefined>} Resolves when file has been created. Rejects
 *     if timeout is reached.
 */
function waitForFileExists(filePath, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath);
    const basename = path.basename(filePath);

    const watcher = fs.watch(dir, (eventType, filename) => {
      if (eventType === "rename" && filename === basename) {
        clearTimeout(timer);
        watcher.close();
        resolve();
      }
    });

    const timer = setTimeout(() => {
      watcher.close();
      reject(
        new Error(
          " [checkFileExists] File does not exist, and was not created during the timeout delay."
        )
      );
    }, timeout);

    fs.access(filePath, fs.constants.R_OK, err => {
      if (!err) {
        clearTimeout(timer);
        watcher.close();
        resolve();
      }
    });
  });
}

// set up, invoke the function, wait for the download to complete
async function download(page, f) {
  const downloadPath = path.resolve(
    process.cwd(),
    `download-${Math.random()
      .toString(36)
      .substr(2, 8)}`
  );
  await util.promisify(fs.mkdir)(downloadPath);
  console.error("Download directory:", downloadPath);

  await page._client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadPath
  });

  await f();

  console.error("Downloading...");
  let fileName;
  while (!fileName || fileName.endsWith(".crdownload")) {
    await new Promise(resolve => setTimeout(resolve, 100));
    [fileName] = await util.promisify(fs.readdir)(downloadPath);
  }

  const filePath = path.resolve(downloadPath, fileName);
  console.error("Downloaded file:", filePath);
  return filePath;
}

var job = new cronJob({
  // runs every X minutes defined in configuration file
  cronTime: "* " + configFile.INTERVAL + " * * * *",
  onTick: function() {
    console.log(
      "You will see this message every " + configFile.INTERVAL + " minutes"
    );

    (async () => {
      const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true // bypass security warning page
      });
      // try {
      console.log("opening chrome headless browser ...");
      const page = await browser.newPage();
      console.log("opening a new tab ...");
      const client = await page.target().createCDPSession();

      await client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: DOWNLOAD_PATH
      });

      // ******** LOGIN ******** //

      // authenticate basic auth
      console.log("authenticating basic auth ...");
      await page.authenticate({
        username: configFile.USERNAME,
        password: configFile.PASSWORD
      });

      console.log("opening page " + configFile.URL + " ...");
      await page.goto(configFile.URL, {
        waitUntil: "networkidle2"
      });

      // ******** FILTER ******** //
      // type date and filter result
      gmtDate = new Date();

      var currentMonth = gmtDate.getUTCMonth() + 1;
      currentMonth = (currentMonth < 10 ? "0" : "") + currentMonth;

      var currentDate = gmtDate.getUTCDate();
      currentDate = (currentDate < 10 ? "0" : "") + currentDate;

      var currentYear = "" + gmtDate.getUTCFullYear();
      var currentGMTString =
        "" + currentYear + "-" + currentMonth + "-" + currentDate;

      // for demo purpose
      // var currentGMTString = "" + currentYear + currentMonth + currentDate;
      console.log("typing in filter ...");
      await page.type(configFile.DATE_SLECTOR, currentGMTString);
      console.log("pressing enter ...");
      await page.keyboard.press("Enter");

      // ******** DOWNLOAD ******** //

      // click on export
      page.waitForSelector(configFile.EXPORT_SELECTOR);
      await page.click(configFile.EXPORT_SELECTOR);

      // click on csv
      await page.waitForSelector(configFile.CSV_SELECTOR);
      await page.click(configFile.CSV_SELECTOR);

      // click on proceed to download

      // download report
      // const downloadUrl = await page.evaluate(() => {
      //   const link = document.evaluate(
      //     `//a[text()="Short Selling (csv)"]`,
      //     document,
      //     null,
      //     XPathResult.FIRST_ORDERED_NODE_TYPE,
      //     null
      //   ).singleNodeValue;
      //   if (link) {
      //     // Prevent link from opening up in a new tab. Puppeteer won't respect
      //     // the Page.setDownloadBehavior on the new tab and the file ends up in the
      //     // default download folder.
      //     link.target = "";
      //     link.click();
      //     return link.href;
      //   }
      //   return null;
      // });

      // if (!downloadUrl) {
      //   console.warn("Did not find link to download!");
      //   await browser.close();
      //   return;
      // }

      // // Wait for file response to complete.
      // await new Promise(resolve => {
      //   page.on("response", async resp => {
      //     if (resp.url() === downloadUrl) {
      //       resolve();
      //     }
      //   });
      // });

      // console.log("File downloaded successfully!");

      // await waitForFileExists(`${DOWNLOAD_PATH}/output.csv`);
      // console.log("File Exists!");

      // download method #2
      // const path = await download(page, () =>
      //   page.click(
      //     'a[href="http://file-examples.com/wp-content/uploads/2017/02/file_example_CSV_5000.csv"]'
      //   )
      // );

      // const { size } = await util.promisify(fs.stat)(path);
      // console.log(path, `${size}B`);
      // } finally {
      // await browser.close();
      // }
    })().catch(e => {
      console.error(e.stack);
      // process.exit(1);
    });
  },
  runOnInit: true,
  start: false,
  timeZone: "America/New_York"
});

job.start();

const puppeteer = require("puppeteer");

(async () => {
  const url =
    "https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_confirm";

  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true // bypass security warning page
  });

  console.log("opening chrome headless browser ...");
  const page = await browser.newPage();
  console.log("opening a new tab ...");

  console.log("opening page " + url + " ...");
  await page.goto(url, {
    waitUntil: "networkidle2"
  });

  page.waitForSelector("html > body > button");
  await page.click("html > body > button");

  page.on("dialog", async dialog => {
    console.log(dialog.message());
    await dialog.accept();
  });

  console.log("outside of dialog");
})();

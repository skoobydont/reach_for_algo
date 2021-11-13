// selenium
const {
  By,
  Key,
  Builder,
  until,
} = require('selenium-webdriver');
// chrome driver
require('chromedriver');
// firefox driver
require('geckodriver');

const SEARCHSTRING = 'Automation testing with Selenium';
/**
 * Single Browser Google Search Test
 * @param {String} browser the specified browser to test
 * @description test that goes to google on passed browser,
 *  queries search string & then returns whether page title ===
 *  (search string + "- Google Search")
 * @returns {Boolean}
 */
 const singleBrowserTest = async (browser) => {
  const driver = await new Builder().forBrowser(browser).build();
  // get site
  await driver.get('https://google.com');
  // find search input & send query + press enter (return)
  await driver
    .wait(
      until.elementsLocated(By.name('q')),
      1000
    )
    .then(async () => {
      await driver
        .findElement(By.name('q'))
        .sendKeys(SEARCHSTRING, Key.RETURN);
    })
    .catch((e) => {
      console.error('esh ', e);
    });
  // verify page title
  const title = await driver
    .wait(
      until.titleIs(`${SEARCHSTRING} - Google Search`),
      1000,
    )
    .then(async () => {
      try {
        return await driver.getTitle();
      } catch (err) {
        throw new Error(err);
      }
    })
    .catch((e) => {
      console.error('yeesh ', e);
    });
  // cleanup
  await driver.quit();
  // return if title equates to search string
  return title === `${SEARCHSTRING} - Google Search`;
};
/**
 * Run Multiple Browser Tests
 * @async
 * @description run basic google search test on each of provided supported
 *  browsers. Will attempt to query search string & verify page title after submit
 */
const multiBrowserTests = async () => {
  // Add additional browsers here (ENSURE YOU IMPORT PROPER DRIVERS ABOVE)
  const supportedBrowswers = ['chrome', 'firefox'];
  // run basic google test for each supported browser
  supportedBrowswers.forEach(
    async (sB) => {
      const result = await singleBrowserTest(sB);
      console.log(`${sB}: ${result ? 'passed' : 'failed'}`);
    }
  );
};

multiBrowserTests();

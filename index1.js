import { Builder, By } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const searchQuery = "Російський Дмитро";

async function runTest() {
  
  const options = new chrome.Options();

  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  try {
    await driver.get('https://google.com.ua');
    const searchInput = await driver.findElement(By.name('q'));
    await searchInput.sendKeys(searchQuery);
    await searchInput.submit();

    const pageSource = await driver.getPageSource();

    if (pageSource.includes(searchQuery)) {
      console.log("Verification successful.");
    } else {
      console.log("Verification error.");
    }

  } catch (error) {
    console.error("Error during test:", error);
  } finally {
    await driver.quit();
  }
}

runTest();

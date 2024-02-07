import { Builder, Browser, By, Select } from 'selenium-webdriver';


(async function yahooRegistrationTest() {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();
  const yahooUrl = "https://www.yahoo.com/";

  const userCredentials = {
    firstName: "Dmitriy",
    lastName: "Ross",
    username: "basiclogin123123",
    password: "basicpassword19090",
    birthMonth: "12",
    birthDay: "10",
    birthYear: "2002"
  };

  try {
    await driver.get(yahooUrl);
    await driver.findElement(By.id("login-container")).click();
    await driver.findElement(By.id("createacc")).click();

    const formFields = [
      { id: "usernamereg-firstName", value: userCredentials.firstName },
      { id: "usernamereg-lastName", value: userCredentials.lastName },
      { id: "usernamereg-userId", value: userCredentials.username },
      { id: "usernamereg-password", value: userCredentials.password },
      { id: "usernamereg-month", value: userCredentials.birthMonth },
      { id: "usernamereg-day", value: userCredentials.birthDay },
      { id: "usernamereg-year", value: userCredentials.birthYear },
    ];

    for (const field of formFields) {
      await driver.findElement(By.id(field.id)).sendKeys(field.value);
    }

    const monthSelectElement = await driver.findElement(By.id("usernamereg-month"));
    const selectMonth = new Select(monthSelectElement);
    await selectMonth.selectByValue(userCredentials.birthMonth);


    const dayInputElement = await driver.findElement(By.id("usernamereg-day"));
    await dayInputElement.sendKeys(userCredentials.birthDay);

    const yearInputElement = await driver.findElement(By.id("usernamereg-year"));
    await yearInputElement.sendKeys(userCredentials.birthYear);

    await driver.findElement(By.id("reg-submit-button")).submit();

    const pageSource = await driver.getPageSource();

    if (pageSource.includes("Secure your&nbsp;account")) {
      console.log("Yahoo registration verified");
    } else {
      console.log("Yahoo registration verification error.");
    }
  } finally {
    //Завершення тесту та зачинення браузеру через 1 секунду
    setTimeout(async () => {
      await driver.quit();
    }, 1000);
  }
})();

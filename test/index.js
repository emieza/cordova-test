const {Builder, Browser, By, Key, until} = require("selenium-webdriver");
const firefox = require('selenium-webdriver/firefox');
var assert = require('assert');

const HEADLESS = true;

(async function test_exemple() {
    // Configurem driver
    let driver = await new Builder()
            .forBrowser(Browser.FIREFOX)
            .setFirefoxOptions(new firefox.Options().headless())
            .build();
    try {
        await driver.get("http://localhost:8000/");
        await driver.findElement(By.name("usuari")).sendKeys("webdriver", Key.RETURN);
        await driver.findElement(By.tagName("button")).click();

        // alert selenium doc: https://www.selenium.dev/documentation/webdriver/interactions/alerts/
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        
        // assegurem que s'ha logat correctament
        assert(alertText=="Login...");
        await alert.accept();

        //await driver.wait(until.titleIs("webdriver — Google Search"), 4000);
        await driver.sleep(2000);
    } finally {
        await driver.quit();
    }

})();

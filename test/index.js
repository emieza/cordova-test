const {Builder, Browser, By, Key, until} = require("selenium-webdriver");
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');
const { exec } = require("child_process");
const assert = require('assert');
const HEADLESS = true;

const { spawn } = require("child_process");


// Engeguem server amb la APP
const cmd = spawn("cordova", ["serve"]);

cmd.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
});

cmd.stderr.on("data", data => {
    console.log(`stderr: ${data}`);
});

cmd.on('error', (error) => {
    console.log(`error: ${error.message}`);
});

cmd.on("close", code => {
    console.log(`child process exited with code ${code}`);
});


// TESTS

(async function test_exemple() {
    // Configurem driver
    let driver = await new Builder()
            //.forBrowser(Browser.FIREFOX)
            //.setFirefoxOptions(new firefox.Options().headless())
            .forBrowser(Browser.CHROME)
            //.setChromeOptions(new chrome.Options().addArguments('--headless=new'))
            .build();
    try {
        // deixem temps a que el servidor es posi en marxa
        await driver.sleep(2000);

        // testejem
        await driver.get("http://localhost:8000/browser/www/");
        await driver.findElement(By.name("usuari")).sendKeys("pepa", Key.RETURN);
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
        // tanquem servidor
        await cmd.kill("SIGHUP")
        // tanquem browser
        await driver.quit();
    }

})();

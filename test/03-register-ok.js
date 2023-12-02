const {Builder, Browser, By, Key, until} = require("selenium-webdriver");
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');
const { spawn } = require("child_process");
const assert = require('assert');
const HEADLESS = true;



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
            .setChromeOptions(new chrome.Options().addArguments('--headless=new'))
            .build();
    try {
        // deixem temps a que el servidor es posi en marxa
        await driver.sleep(2000);

        // introduim nou usuari
        //////////////////////////////////////////////////////
        let nouusuari = "random";
        let novacontrasenya = "mesrandom";
        let nouemail = "encaramesrandom";
        await driver.get("http://localhost:8000/browser/www/");
        await driver.findElement(By.id("reg_usuari")).sendKeys(nouusuari);
        await driver.findElement(By.id("reg_contrasenya")).sendKeys(novacontrasenya);
        await driver.findElement(By.id("reg_email")).sendKeys(nouemail);
        await driver.findElement(By.xpath("//button[text()='Registra']")).click();
        // comprovem que l'alert message és correcte
        await driver.wait(until.alertIsPresent(),2000,"ERROR TEST: després del REGISTRE ha d'aparèixer un alert amb el resultat de la introducció del nou usuari.");
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        let assertMessage = "Nou usuari registrat correctament";
        assert(alertText==assertMessage,"ERROR TEST: al registrar un nou usuari hauria d'aparèixer un alert amb el missatge '"+assertMessage+"'.");
        await alert.accept();

        // testejem LOGIN CORRECTE pel nou usuari
        //////////////////////////////////////////////////////
        await driver.get("http://localhost:8000/browser/www/");
        await driver.findElement(By.id("usuari")).sendKeys(nouusuari);
        await driver.findElement(By.id("contrasenya")).sendKeys(novacontrasenya);
        await driver.findElement(By.xpath("//button[text()='Login']")).click();

        // comprovem que l'alert message és correcte
        await driver.wait(until.alertIsPresent(),2000,"ERROR TEST: després del login ha d'aparèixer un alert amb el resultat de la validació de la contrasenya.");
        alert = await driver.switchTo().alert();
        alertText = await alert.getText();
        assertMessage = "Login exitós";
        assert(alertText==assertMessage,"ERROR TEST: El nou usuari registrat no es loga correctament.");
        await alert.accept();

        // temps d'espera final
        await driver.sleep(2000);
    } finally {
        // tanquem servidor
        await cmd.kill("SIGHUP")
        // tanquem browser
        await driver.quit();
    }

})();

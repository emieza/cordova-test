const {Builder, By, Key, until} = require("selenium-webdriver");

(async function example() {
	let driver = await new Builder().forBrowser("chrome").build();
	try {
		await driver.get("http://localhost:8000/");
		await driver.findElement(By.name("usuari")).sendKeys("webdriver", Key.RETURN);
		//await driver.wait(until.titleIs("webdriver — Google Search"), 4000);
		await driver.sleep(4000);
	} finally {
		await driver.quit();
	}

})();

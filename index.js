const {Builder, By, Key} = require('selenium-webdriver');
const chromedriver = require('chromedriver');
require('dotenv').config();

async function main() {
    try {
        console.log(process.env.PASSWORD);
        let driver = await new Builder().forBrowser("chrome").build();
    
        // opens up page
        await driver.get("https://www.nottingham.ac.uk/sport/membership/member-login.aspx");

        // press login
        await driver.findElement(By.xpath('//*[@id="content"]/div[2]/div[2]/div/a')).click();
        
        // open new tab
        let tabs = await driver.getAllWindowHandles();

        // switch focus of the driver to new tab
        await driver.switchTo().window(tabs[1]);

        // input log in details
        await driver.findElement(By.xpath('//*[@id="username"]')).sendKeys("test");
    } catch (error) {
        console.log(error);
    }


}

main();
const {Builder, By, Capabilities} = require('selenium-webdriver');
const chromedriver = require('chromedriver');
require('dotenv').config();


// problem: takes too long to load page fully then click login, find a way to press log in button as soon as it shows up

async function main() {

    const caps = new Capabilities();
    caps.setPageLoadStrategy("eager");

    try {
        let driver = await new Builder().withCapabilities(caps).forBrowser("chrome").build();
    
        // opens up page
        await driver.get("https://www.nottingham.ac.uk/sport/membership/member-login.aspx");

        // press login
        await driver.findElement(By.xpath('//*[@id="content"]/div[2]/div[2]/div/a')).click();
        //console.log(await driver.getCurrentUrl());

        // open new tab
        let tabs = await driver.getAllWindowHandles();

        // switch focus of the driver to new tab
        await driver.switchTo().window(tabs[1]);

        // input log in details
        await driver.findElement(By.xpath('//*[@id="username"]')).sendKeys(process.env.USERNAME);
        await driver.findElement(By.xpath('//*[@id="password"]')).sendKeys(process.env.PASSWORD);

        // click login
        driver.findElement(By.xpath('/html/body/div[1]/div/div/div[1]/form/div[3]/button')).click();

        

        
    } catch (error) {
        console.log(error);
    }


}

main();
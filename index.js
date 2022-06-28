const {Builder, By, Capabilities, until} = require('selenium-webdriver');
const chromedriver = require('chromedriver');
const xpaths = require('./xpaths');
require('dotenv').config();


// problem: takes too long to load page fully then click login, find a way to press log in button as soon as it shows up


async function main() {
    
    // 'eager' means that the get command will be considered complete when the DOM of the page is loaded
    const caps = new Capabilities();
    caps.setPageLoadStrategy("none");
    
    try {
        let driver = await new Builder().withCapabilities(caps).forBrowser("chrome").build();
        // opens up page
        await driver.get("https://www.nottingham.ac.uk/sport/membership/member-login.aspx");

        // press login
        let buttonToOpenLoginPage = returnXpathElement(driver, xpaths.buttonToOpenLoginPage);
        await buttonToOpenLoginPage.click()

        // open new tab
        // switch focus of the driver to new tab
        let tabs = await driver.getAllWindowHandles();
        driver.switchTo().window(tabs[1]);
        
        LogIntoBookingWebsite(driver);
        
        // click make booking button
        let buttonMakeBooking = returnXpathElement(driver, xpaths.buttonMakeBooking);
        await buttonMakeBooking.click();
        
        let fieldToSelectSportCentre = returnXpathElement(driver, xpaths.fieldToSelectSportCentre);
        await fieldToSelectSportCentre.click();

        // working fully up till this point

        // for now, we use statically set the users input.
        // sports centre: 0 = david ross, 1 = jubilee
        // category: 0 = sports hall

        let sportsCentreChosen = 0;
        // need user input on whether to select david ross or jubilee

        if (sportsCentreChosen == 0) {
            BookActivityDavidRoss();
        } else if (sportsCentreChosen == 1) {
            BookActivityJubileeCampus();
        }
        
    } catch (error) {
        console.log(error);
    }
}

async function LogIntoBookingWebsite(driver){
    let usernameField = returnXpathElement(driver, xpaths.usernameField);
    await usernameField.sendKeys(process.env.USERNAME);

    let passwordField = returnXpathElement(driver, xpaths.passwordField);
    await passwordField.sendKeys(process.env.PASSWORD);

    let buttonToLogIntoBookingWebsite = returnXpathElement(driver, xpaths.buttonToLogIntoBookingWebsite)
    await buttonToLogIntoBookingWebsite.click();
}

function returnXpathElement(driver, xpath) {
    return driver.wait(until.elementLocated(By.xpath(`${xpath}`)), 60000);
}

async function BookActivityDavidRoss(activityType) {
    /*
    activityType
    Volleyball - Hall C/D  = 0
    Basketball 1/2 Court - Hall A/B = 1
    Basketball Full Court - Hall A/B = 2
    Basketball Cross Court - Hall C/D (Near) = 3
    Basketball 1/2 Court - Hall C/D = 4
    Basketball Cross Court - Hall C/D (Far) = 5
    Basketball Full Court - Hall C/D = 6
    */

    try {
        if (activityType == 0 ){
            await driver.findElement(By.xpath(xpaths.DR_Vball_CD)).click();
        } else if (activityType == 1){

        } else if (activityType == 2){
            
        } else if (activityType == 3){
            
        } else if (activityType == 4){
            
        } else if (activityType == 5){
    
        } else if (activityType == 6){
            
        }
    } catch (error) {
        
    }
}



main();
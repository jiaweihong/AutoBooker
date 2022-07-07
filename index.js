const {Builder, By, Capabilities, until, Key} = require('selenium-webdriver');
const chromedriver = require('chromedriver');
const xpaths = require('./xpaths');
const { listOfActivitiesDiv, timeDivOfBookingSlot } = require('./xpaths');
require('dotenv').config();

const userData = require('./data.json');

async function main() {
    // 'eager' means that the get command will be considered complete when the DOM of the page is loaded
    const caps = new Capabilities();
    caps.setPageLoadStrategy("eager");
    
    try {
        let driver = await new Builder().withCapabilities(caps).forBrowser("chrome").build();
        
        // opens up page
        await driver.get("https://www.nottingham.ac.uk/sport/membership/member-login.aspx");

        // press login
        let openLoginPageButton = returnXpathElement(driver, xpaths.openLoginPageButton);
        await openLoginPageButton.click()

        // open new tab
        // switch focus of the driver to new tab
        let tabs = await driver.getAllWindowHandles();
        driver.switchTo().window(tabs[1]);
        
        LogIntoBookingWebsite(driver);
        
        // This css selector returns 2 elements, 0th is not interactable and 1st index is.
        let makeBookingButton = await driver.wait(until.elementsLocated(By.css('a[data-test-id="account-bookings-dropins"]')), 60000);
        await makeBookingButton[1].click();

        if (userData.sportCentreNum == 30) {
            await bookActivityDavidRoss(driver, userData);
        } else if (sportsCentreChosen == 1) {
            await BookActivityJubileeCampus();
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

    let logIntoBookingWebsiteButton = returnXpathElement(driver, xpaths.logIntoBookingWebsiteButton)
    await logIntoBookingWebsiteButton.click();
}

function returnXpathElement(driver, xpath) {
    return driver.wait(until.elementLocated(By.xpath(`${xpath}`)), 60000);
}

async function bookActivityDavidRoss(driver, userData) {
    await selectClubCategoryActivities(driver, userData);

    let viewTimeTableButton = returnXpathElement(driver, xpaths.viewTimetableButton);
    await viewTimeTableButton.click();

    await bookActivity(driver, userData);
}

async function selectClubCategoryActivities(driver, userData){
    let selectSportCentreField = returnXpathElement(driver, xpaths.selectSportCentreField);
    await selectSportCentreField.click();

    let davidRossField = returnXpathElement(driver, xpaths.davidRoss);
    await davidRossField.click();

    let sportsHallRadioButton = returnXpathElement(driver, xpaths.sportsHall);
    await sportsHallRadioButton.click();
    
    if (userData.activityNum == 279 ){
        let volleyball_CD = await driver.wait(until.elementLocated(By.id('booking-activity-option279')));
        await volleyball_CD.click();
    } 
}

async function bookActivity(driver, userData){
    await selectDate(driver, userData);

    let slot = await getSlot(driver, userData)

    await bookSlot(driver, slot);
}


async function selectDate(driver, userData){
    let dateField = await driver.wait(until.elementLocated(By.id("unique-identifier-2")));
    await dateField.clear();
    await dateField.sendKeys(userData.activityDate);
    await dateField.sendKeys(Key.ENTER);

    let dateText = await dateField.getAttribute("value");

    if (userData.activityDate != dateText){
        throw new Error(`User's selected date is invalid. User Input: ${userData.activityDate}, Date Field: ${dateText}`);
    }
}

async function getSlot(driver, userData) {
    let listOfSlots = await driver.wait(until.elementsLocated(By.className("col-xs-12 col-sm-6 col-md-6 col-lg-4")));

    for (let slot of listOfSlots){
        let slotAnchor = await slot.findElement(By.css("A"));
        let timeDiv = slotAnchor.findElement(By.css(".timeOfDay"));
        let timeTextFromSlot = await timeDiv.getText();
        
        let spaceDetailsText = await slot.findElement(By.css(".spaceDetails")).getText();

        let count = 0;
        while (spaceDetailsText == ""){
            if (count == 0){
                spaceDetailsText = await slot.findElement(By.css(".spaceDetailsFull")).getText();
            } else if (count == 1) {
                spaceDetailsText = await slot.findElement(By.css(".spaceDetailsBasket")).getText();
            }
            count++;
        }

        if (userData.activityTime == timeTextFromSlot && spaceDetailsText != "Full") {
            return slotAnchor;
        } else if (spaceDetailsText == "Full") {
            throw new Error("The slot selected is full")
        } 
    }
}

async function bookSlot(driver, slot){
    await slot.click();

    let button = await driver.wait(until.elementLocated(By.css('button[data-test-id="bookings-sportshall-activitydetails-addandbookanother"]')), 60000);
    await driver.executeScript("arguments[0].click();", button);
}


main();
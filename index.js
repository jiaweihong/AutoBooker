const {Builder, By, Capabilities, until, Key} = require('selenium-webdriver');
const chromedriver = require('chromedriver');
const xpaths = require('./xpaths');
const { listOfActivitiesDiv, timeDivOfBookingSlot } = require('./xpaths');
require('dotenv').config();

const userData = require('./data.json');

async function LogIntoBookingWebsite(driver){
    let usernameField = await driver.wait(until.elementLocated(By.css('input[id="username"]')), 60000);
    await usernameField.sendKeys(process.env.USERNAME);

    let passwordField = await driver.wait(until.elementLocated(By.css('input[id="password"]')), 60000);
    await passwordField.sendKeys(process.env.PASSWORD);

    let logIntoBookingWebsiteButton = await driver.wait(until.elementLocated(By.css('button[name="_eventId_proceed"]')), 60000);
    await logIntoBookingWebsiteButton.click();
}

async function bookActivity(driver, userData) {
    await selectSportCentreCategoryActivity(driver, userData);

    await buyNowActivity(driver, userData);
}

async function selectSportCentreCategoryActivity(driver, userData){
    await selectSportCentre(driver, userData.sportCentreNum);

    // Select category
    let sportsHallRadio = await driver.wait(until.elementLocated(By.css('input[id="booking-behaviour-option2"]')), 60000);
    await sportsHallRadio.click();

    await selectActivity(driver, userData.activityNum);

    let viewTimeTableButton = await driver.wait(until.elementLocated(By.css('button[data-test-id="bookings-viewtimetable"]')), 60000);
    await viewTimeTableButton.click();
}

async function selectSportCentre(driver, sportCentreNum) {
    let selectSportCentreField = await driver.wait(until.elementLocated(By.css('input[class="select2-search__field"]')), 60000);
    await selectSportCentreField.click();

    if (sportCentreNum == 18) {
        let davidRossOption = await driver.wait(until.elementLocated(By.css('li[data-select2-id="18"]')), 60000);
        await davidRossOption.click();
    } else if (sportCentreNum == 19) {
        let jubileeCampusOption = await driver.wait(until.elementLocated(By.css('li[data-select2-id="19"]')), 60000);
        await jubileeCampusOption.click();
    } else {
        throw new Error("No valid sport centre was chosen");
    }
}

async function selectActivity(driver, activityNum){
    if (activityNum == 279 ){
        let volleyball_DR_CD = await driver.wait(until.elementLocated(By.id('booking-activity-option279')), 60000);
        await volleyball_DR_CD.click();
    } else if (activityNum == 87){
        let volleyball_JC_H1 = await driver.wait(until.elementLocated(By.id('booking-activity-option87')), 60000);
        await volleyball_JC_H1.click();
    } else {
        throw new Error("No valid activity was chosen");
    }
}

async function buyNowActivity(driver, userData){
    await selectDate(driver, userData);

    let slot = await getSlot(driver, userData)

    await buyNowSlot(driver, slot);
}

async function selectDate(driver, userData){
    let dateField = await driver.wait(until.elementLocated(By.id("unique-identifier-2")), 60000);
    await dateField.clear();
    await dateField.sendKeys(userData.activityDate);
    await dateField.sendKeys(Key.ENTER);

    let dateText = await dateField.getAttribute("value");

    if (userData.activityDate != dateText){
        throw new Error(`User's selected date is invalid. User Input: ${userData.activityDate}, Date Field: ${dateText}`);
    }
}

async function getSlot(driver, userData) {
    let listOfSlots = await driver.wait(until.elementsLocated(By.className("col-xs-12 col-sm-6 col-md-6 col-lg-4")), 60000);

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

async function buyNowSlot(driver, slot){
    await slot.click();

    let button = await driver.wait(until.elementLocated(By.css('button[data-test-id="bookings-sportshall-activitydetails-addandbookanother"]')), 60000);
    await driver.executeScript("arguments[0].click();", button);
}


async function main() {
    // 'eager' means that the get command will be considered complete when the DOM of the page is loaded
    const caps = new Capabilities();
    caps.setPageLoadStrategy("eager");
    
    try {
        let driver = await new Builder().withCapabilities(caps).forBrowser("chrome").build();
        
        // opens up page
        await driver.get("https://sso.legendonlineservices.co.uk/sso/nottingham/enterprise");
        
        await LogIntoBookingWebsite(driver);

        await driver.navigate().to("https://universityofnottingham.legendonlineservices.co.uk/enterprise/bookingscentre/index");

        bookActivity(driver, userData);
    } catch (error) {
        console.log(error);
    }
}

main();
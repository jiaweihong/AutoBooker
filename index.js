const {Builder, By, Capabilities, until, Key} = require('selenium-webdriver');
const chromedriver = require('chromedriver');
const xpaths = require('./xpaths');
const { listOfActivitiesDiv, timeDivOfBookingSlot } = require('./xpaths');
require('dotenv').config();

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
        
        let makeBookingButton = await driver.wait(until.elementsLocated(By.css('a[data-test-id="account-bookings-dropins"]')), 60000);
        await makeBookingButton[1].click();
        
        // for now, we use statically set the users input.
        let sportsCentreChosen = 0;
        // need user input on whether to select david ross or jubilee

        if (sportsCentreChosen == 0) {
            BookActivityDavidRoss(driver, 0, 0);
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

    let logIntoBookingWebsiteButton = returnXpathElement(driver, xpaths.logIntoBookingWebsiteButton)
    await logIntoBookingWebsiteButton.click();
}

function returnXpathElement(driver, xpath) {
    return driver.wait(until.elementLocated(By.xpath(`${xpath}`)), 60000);
}

async function BookActivityDavidRoss(driver, activityType, categoryType) {
    let selectSportCentreField = returnXpathElement(driver, xpaths.selectSportCentreField);
    await selectSportCentreField.click();

    let davidRossField = returnXpathElement(driver, xpaths.davidRoss);
    await davidRossField.click();

    if (categoryType == 0 ){
        let sportsHallRadioButton = returnXpathElement(driver, xpaths.sportsHall);
        await sportsHallRadioButton.click();
    }

    // needs to dynamically find the right div containing the correct activity type
    
    if (activityType == 0 ){
        let volleyball_CD = await driver.wait(until.elementLocated(By.id('booking-activity-option279')));
        await volleyball_CD.click();
    } else if (activityType == 1){

    } else if (activityType == 2){
        
    } else if (activityType == 3){
        
    } else if (activityType == 4){
        
    } else if (activityType == 5){

    } else if (activityType == 6){
        
    }

    let viewTimeTableButton = returnXpathElement(driver, xpaths.viewTimetableButton);
    await viewTimeTableButton.click();

    bookActivity(driver, "13:00", "04 Jul 2022");
}

async function bookActivity(driver, userSelectedTime, userSelectedDate){
    selectDate(driver, userSelectedDate);

    let slot = await getSlot(driver, userSelectedTime)

    bookSlot(driver, slot);
}


async function selectDate(driver, userSelectedDate){
    let dateField = await driver.wait(until.elementLocated(By.id("unique-identifier-2")));
    await dateField.clear();
    await dateField.sendKeys(userSelectedDate);
    await dateField.sendKeys(Key.ENTER);

    let dateText = await dateField.getAttribute("value");

    if (userSelectedDate != dateText){
        throw new Error(`User's selected date is invalid. User Input: ${userSelectedDate}, Date Field: ${dateText}`);
    }
}

async function getSlot(driver, userSelectedTime) {
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

        if (userSelectedTime == timeTextFromSlot && spaceDetailsText != "Full") {
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
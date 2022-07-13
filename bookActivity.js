const {Builder, By, Capabilities, until, Key} = require('selenium-webdriver');
const chromedriver = require('chromedriver');
const chrome = require('selenium-webdriver/chrome');
require('dotenv').config();

const userData = require('./data.json');

async function LogIntoBookingWebsite(driver){
    let usernameField = await driver.wait(until.elementLocated(By.css('input[id="username"]')), 30000);
    await usernameField.sendKeys(process.env.USERNAME);

    let passwordField = await driver.wait(until.elementLocated(By.css('input[id="password"]')), 30000);
    await passwordField.sendKeys(process.env.PASSWORD);

    let logIntoBookingWebsiteButton = await driver.wait(until.elementLocated(By.css('button[name="_eventId_proceed"]')), 30000);
    await logIntoBookingWebsiteButton.click();
}

async function bookActivity(driver, userData) {
    
}

async function selectSportCentreCategoryActivity(driver, userData){
    await selectSportCentre(driver, userData.sportCentre);

    // Select category
    let sportsHallRadio = await driver.wait(until.elementLocated(By.css('input[id="booking-behaviour-option2"]')), 30000);
    await sportsHallRadio.click();

    await selectActivity(driver, userData.activityNum);

    let viewTimeTableButton = await driver.wait(until.elementLocated(By.css('button[data-test-id="bookings-viewtimetable"]')), 30000);
    await viewTimeTableButton.click();
}

async function selectSportCentre(driver, sportCentre) {
    let selectSportCentreField = await driver.wait(until.elementLocated(By.css('input[class="select2-search__field"]')), 30000);
    await selectSportCentreField.click();

    let sportCentreUl = await driver.wait(until.elementLocated(By.css('ul[class="select2-results__options select2-results__options--nested"]')), 30000);
    let sportCentreList = await sportCentreUl.findElements(By.css('li'), 30000);

    if (sportCentre == "David Ross") {
        await sportCentreList[0].click();
    } else if (sportCentre == "Jubilee Campus") {
        await sportCentreList[1].click();
    } else {
        throw new Error("No valid sport centre was chosen");
    }
}

async function selectActivity(driver, activityNum){
    if (activityNum == 279 ){
        let volleyball_DR_CD = await driver.wait(until.elementLocated(By.id('booking-activity-option279')), 30000);
        await volleyball_DR_CD.click();
    } else if (activityNum == 87){
        let volleyball_JC_H1 = await driver.wait(until.elementLocated(By.id('booking-activity-option87')), 30000);
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
    let dateField = await driver.wait(until.elementLocated(By.id("unique-identifier-2")), 30000);
    await dateField.clear();
    await dateField.sendKeys(userData.activityDate);
    await dateField.sendKeys(Key.ENTER);

    let dateText = await dateField.getAttribute("value");

    if (userData.activityDate != dateText){
        throw new Error(`User's selected date is invalid. User Input: ${userData.activityDate}, Date Field: ${dateText}`);
    }
}

async function getSlot(driver, userData) {
    let listOfSlots = await driver.wait(until.elementsLocated(By.className("col-xs-12 col-sm-6 col-md-6 col-lg-4")), 30000);

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

        if (userData.activityTime == timeTextFromSlot) {
            if (spaceDetailsText != "Full"){
                return slotAnchor;
            } else {
                throw new Error("The slot selected is full.")
            }
        }
    }

    // if the code execution gets to this point, then that means that the userData.activityTime did not match any time slot.
    throw new Error("The time slot selected does not exist.")
}

async function buyNowSlot(driver, slot){
    await slot.click();

    let button = await driver.wait(until.elementLocated(By.css('button[data-test-id="bookings-sportshall-activitydetails-addandbookanother"]')), 30000);
    await driver.executeScript("arguments[0].click();", button);
    console.log("booked");
}

async function payForBookings(driver){
    let basketSummaryContinueButton = await driver.wait(until.elementLocated(By.css('button[data-test-id="universalbasket-paymentsummary-continueoptions-continue"]')), 30000);
    await basketSummaryContinueButton.click();

    await basketSummaryContinueButton.click();

    // next button pressed will be a pay now and we are not implementing that yet, as i do not have a membership;
}

async function bookActivity() {
    // 'eager' means that the get command will be considered complete when the DOM of the page is loaded
    const caps = new Capabilities();
    caps.setPageLoadStrategy("eager");

    const options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments("--window-size=1920,1080");
    options.addArguments("--disable-gpu");
    options.addArguments("--no-sandbox");
    let driver = await new Builder().withCapabilities(caps).forBrowser("chrome").setChromeOptions(options).build();
    
    try {
        // opens up page
        await driver.get("https://sso.legendonlineservices.co.uk/sso/nottingham/enterprise");
        
        await LogIntoBookingWebsite(driver);

        let makeBookingButton = await driver.wait(until.elementsLocated(By.css('a[data-test-id="account-bookings-dropins"]')), 60000);
        await makeBookingButton[1].click();

        await selectSportCentreCategoryActivity(driver, userData);

        await buyNowActivity(driver, userData);

        //await driver.navigate().to("https://universityofnottingham.legendonlineservices.co.uk/enterprise/universalbasket/summary");

        //await payForBookings(driver);

        await driver.quit();
    } catch (error) {
        console.log(error);
    }
}

bookActivity();

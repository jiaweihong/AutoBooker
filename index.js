const {Builder, By, Capabilities, until, Key} = require('selenium-webdriver');
const chromedriver = require('chromedriver');
const xpaths = require('./xpaths');
const { listOfActivitiesDiv } = require('./xpaths');
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
        

        let makeBookingButton = returnXpathElement(driver, xpaths.makeBookingButton);
        await makeBookingButton.click();

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
        console.log("about clicked view time");

        let viewTimeTableButton = returnXpathElement(driver, xpaths.viewTimetableButton);
        await viewTimeTableButton.click();
        console.log("clicked view time");

        bookActivity(driver, "08:00", "01 Jul 2022");
    } catch (error) {
        console.log(error);
    }
}

async function bookActivity(driver, timeToBook, date){
    // get a list of booking slots
    // for each slot
    
    let dateField = await driver.wait(until.elementLocated(By.id("unique-identifier-2")));
    await dateField.clear();
    await dateField.sendKeys(date);
    await dateField.sendKeys(Key.ENTER);



    // make sure activity slots have been loaded 
    let toMakeSureActivitySlotsAreLoaded = await driver.wait(until.elementLocated(By.className("col-xs-12 col-sm-6 col-md-6 col-lg-4")));

    // loop through each activitySlot
    let listOfActivitySlots = await driver.findElements(By.className("col-xs-12 col-sm-6 col-md-6 col-lg-4"));
    console.log(listOfActivitySlots.length)
    for (let activitySlot of listOfActivitySlots){
        let activitySlotAnchor = await activitySlot.findElement(By.css("A"));

        let timeDiv = activitySlotAnchor.findElement(By.css(".timeOfDay"));
        let timeFromAcitivitySlot = await timeDiv.getText();
        
        console.log(timeFromAcitivitySlot);

        if (timeFromAcitivitySlot == timeToBook) {

            await activitySlotAnchor.click();
            break;
        } else {
            continue;
        }
    }

    // get child div with class name well-sm activityBox
    // get child div row
    // get child div timeofday.innertext
    // if matches time arg
    // click on div



   
    

}


main();
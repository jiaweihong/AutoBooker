const {Builder} = require('selenium-webdriver');

async function main() {
    try {
        let driver = await Builder.forBrowser("Chrome").build();
    
        await driver.get("https://legendidp.nottingham.ac.uk/idp/profile/SAML2/Redirect/SSO?execution=e1s1");
    } catch (error) {
        console.log(error);
    }


}

main();
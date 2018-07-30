const puppeteer = require('puppeteer');
const { URL, URLSearchParams } = require('url');
const devices = require('puppeteer/DeviceDescriptors');



describe('Checkout Analysis', async () => {
    const browser = await puppeteer.launch({ headless: false });
    //const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    beforeAll(async () => {


    await page.emulate(devices['iPad Pro']);


    const waitForNetwork = (page) => {
        return new Promise(async (resolve, reject) => {
            let network = [];
            page.setRequestInterception(true);

            page.on('request', request => {
                request.continue(); // pass it through.
            });
            page.on('response', async function responseDataHandler(response){
                network.push(response);
            });
            page.on('load', async () => {
                resolve(network);
            });

            setTimeout(function() {
                resolve(network);
            },15000);


        });
    }

    console.log('running');
    await page.tracing.start({path: 'trace.json'});
    await page.goto('https://www.shaw.ca/store/cart/orderLeadForm-contactDetails.jsp?eoId=4300008', {waitUntil: ['domcontentloaded']});

    let network = await waitForNetwork(page);
    let analytics = await page.evaluate(() => analytics);
    let utag_data = await page.evaluate(() => utag_data);
    let cookies = await page.cookies();
    let jQuery = await page.evaluate(() => jQuery);
});
test('Checkout Flow Adobe Analysis', async () => {
    //First Page
    const firstName = 'input#firstname';
    const lastName = 'input#lastname';
    const email = 'input#email';
    const phone = 'input#phone';

    var submit = 'input#leads_submit';

    await page.waitForSelector(firstName);
    await page.type(firstName, 'Test');

    await page.waitForSelector(lastName);
    await page.type(lastName, 'Test');

    await page.waitForSelector(email);
    await page.type(email, 'test@sjrb.ca');

    await page.waitForSelector(phone);
    await page.type(phone, '5555555555');

    await page.waitForSelector(submit);
    await page.click(submit);

    //Contact Info
    const address = 'input#address';
    const city = 'input#city';
    const province = 'select#province';
    const postal = 'input#postalcode';

    await page.waitForSelector(address);
    await page.type(address, '');

    await page.waitForSelector(city);
    await page.type(city, 'CALGARY');

    await page.waitForSelector(province);
    await page.select(province, 'AB');

    await page.waitForSelector(postal);
    await page.type(postal, 'T2Z 0J9');

    await page.waitForSelector(address);
    await page.type(address, '1234 Test Road');

    await page.waitForSelector(submit);
    await Promise.all([
        page.click(submit),
        page.waitForNavigation(),
    ]);
    const acceptance = 'span#digital-acceptance-cta > a';
    const signature = 'input#agreement_signature';
    const agree = '#agreement_consent';
    const button = '.accept';


    //Agreement page
    await page.waitForSelector(acceptance);
    await page.click(acceptance);
    await page.waitForSelector(button);
    await page.evaluate((signature, agree) => {
        document.querySelector(signature).value = 'Test Test';
        jQuery(agree).iCheck('check');
    }, signature, agree);

    await page.waitForSelector(button);
    await page.click(button);
    await page.waitFor(3000); //Let the page callback finish
    await Promise.all([
        page.waitForSelector(submit),
        page.click(submit),
        page.waitForNavigation()
    ]);

    //Review Page
    await Promise.all([
        page.waitForSelector(submit),
        page.click(submit),
        page.waitForNavigation()
    ]);


    //Thankyou Page
    await page.waitForSelector('#footer_wrap');
    let adobe = [];
        await network;
        for (let nr of network) {
            if (nr._request._url.includes('shawtelevision.112.2o7.net')) {
                //console.log(nr);
                adobe.push(nr);
            }
        }
        for (let ar of adobe) {
            let payload = new URLSearchParams(ar._request._postData);
            console.log(payload);
        }
        expect(adobe.length).toBeGreaterThan(0);

        await page.tracing.stop();
        await browser.close();
},90000);
});

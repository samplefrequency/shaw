const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { URL, URLSearchParams } = require('url');
const devices = require('puppeteer/DeviceDescriptors');
const { harFromMessages } = require('chrome-har');

//Define the page to start on
const start_url = 'https://www.shaw.ca/store/cart/orderLeadForm-contactDetails.jsp?eoId=4300008';
//list of events for converting to HAR
const events = [];
//event types to observe
const observe = [
  'Page.loadEventFired',
  'Page.domContentEventFired',
  'Page.frameStartedLoading',
  'Page.frameAttached',
  'Network.requestWillBeSent',
  'Network.requestServedFromCache',
  'Network.dataReceived',
  'Network.responseReceived',
  'Network.resourceChangedPriority',
  'Network.loadingFinished',
  'Network.loadingFailed',
];


const run = () => {
    return new Promise(async (resolve, reject) => {
        console.log('Please Wait: Running browser...');
        const browser = await puppeteer.launch({ headless: false });
        //const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();

        //register events listeners
        const client = await page.target().createCDPSession();
        await client.send('Page.enable');
        await client.send('Network.enable');
        observe.forEach(method => {
            client.on(method, params => {
            events.push({ method, params });
            });
        });
        //Device Emulation
        await page.emulate(devices['iPad Pro']);

        //Accumulate Network
        const waitForNetwork = (page) => {
            return new Promise(async (resolve, reject) => {
                let network = [];
                page.setRequestInterception(true);
                page.on('request', request => {
                    //Perform network blocking here;
                    /*
                    TODO: if request._url to be blocked else pass it on
                    */
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
        let errors = [];
        page.on('error', err=> {
            errors.push(err);
        });
        page.on('pageerror', pageerr=> {
            errors.push(pageerr);
        });

        let url_steps = [];
        page.on('framenavigated', frame => {
            if (frame._parentFrame == null) {
                //console.log('new url:', frame.url());
                url_steps.push(frame.url());
            }
        });

        await page.tracing.start({path: 'trace.json'});
        await page.goto(start_url, {waitUntil: ['domcontentloaded']});

        let network = await waitForNetwork(page);
        //Hook to page app data
        let analytics = await page.evaluate(() => analytics);
        let utag_data = await page.evaluate(() => utag_data);
        let utag = await page.evaluate(() => utag);
        let cookies = await page.cookies();
        let jQuery = await page.evaluate(() => jQuery);

        //Checkout Selectors
        const firstName = 'input#firstname';
        const lastName = 'input#lastname';
        const email = 'input#email';
        const phone = 'input#phone';
        const address = 'input#address';
        const city = 'input#city';
        const province = 'select#province';
        const postal = 'input#postalcode';
        const acceptance = 'span#digital-acceptance-cta > a';
        const signature = 'input#agreement_signature';
        const agree = '#agreement_consent';
        const button = '.accept';
        var submit = 'input#leads_submit';

        //First Page
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

        //Agreement page
        await page.waitForSelector(acceptance);
        await page.click(acceptance);
        await page.waitForSelector(button);
        await page.evaluate((signature, agree) => {
            document.querySelector(signature).value = 'Test Test';
            jQuery(agree).iCheck('check');
          }, signature, agree);
        await page.waitFor(1000);
        await page.waitForSelector(button);
        await page.click(button);
        await page.waitFor(1000);
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
        await page.tracing.stop();

        //Save HTTP Archive
        const har = harFromMessages(events);
        await Promise.all([
            fs.writeFile('trace.har', JSON.stringify(har))
        ]);
        await browser.close();
        console.log('Browser Complete, Begin Unit Testing...');
        let data = {
            url_steps: url_steps,
            errors: errors,
            network: network,
            analytics: analytics,
            utag: utag,
            utag_data: utag_data,
            cookies: cookies,
        }
        resolve(data);
    });
}


//Unit Testing
function adobe_string(n, string) {
    var s, nth = 0;
    s = string.replace(/;/g, function (match, i, original) {
        nth++;
        return (nth % n === 0) ? "{!}" : match;
    });
    return s;
}

describe('Multi-step Lead Form Analysis', async () => {
    beforeAll (async (done) => {
        global.data = await run();
        done();
    },90000);

    describe('Error Checking', async () => {
        test('Page Errors', async () => {
            expect(data.errors.length).toBeLessThanOrEqual(0);
        });
    });

    describe('Data Validation', async () => {
        test('Validate Data Exists', async () => {
            console.log(data);
            expect(Object.keys(data).length).toBeGreaterThan(0);
        });
        test('Adobe Network Payload Data', async () => {
            let adobe = [];
            for (let nr of data.network) {
                if (nr._request._url.includes('shawtelevision.112.2o7.net')) {
                    adobe.push(nr);
                }
            }
            global.adobe = adobe;
            expect(adobe.length).toBeGreaterThan(0);
        });
        test('MCID Continuity', async() => {
            let mcids = [];
            for (let ar of adobe) {
                let payload = new URLSearchParams(ar._request._postData);
                //console.log(payload);
                var mid = payload.get('mid');
                if (mid !== null) {
                    mcids.push(payload.get('mid'));
                }
            }
            let unique_mcid = [...new Set(mcids)];
            expect(unique_mcid.length).toEqual(1);
        });
        test('Analytics Utilities Products vs Adobe Product String', async () => {
            var product_string = data.analytics.settings.product_string; //Get product string from the utils applications.
            var adobe_payload = adobe.reverse()[0];
            var adobe_params = new URLSearchParams(adobe_payload._request._postData);
            var adobe_products = adobe_params.get('products');
            //console.log(product_string);
            //console.log(adobe_products);
            expect(Object.keys(product_string).length).toBeGreaterThan(0);
        });
    });
});




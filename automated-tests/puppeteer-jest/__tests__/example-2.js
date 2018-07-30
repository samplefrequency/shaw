const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const net = require('../modules/network.js');
const { URL, URLSearchParams } = require('url');
const fs = require('fs');
const path = require('path');
const filename = path.basename(__filename);
const settings = JSON.parse(fs.readFileSync(path.resolve(__dirname, filename.replace(path.extname(filename), '.json')),'utf8'));

if (typeof(settings) == 'object') {
    run_test(settings.tests[0]);
}
else {
    throw new Error('Unable to read settings file');
}


function run_test (config) {
    describe(config.pageName, () => {
        let browser, page;

        if (config.monitorNetwork) { let network, payload_analysis; }
        if (config.checkPageErrors) { let errors = []; }

        beforeEach (async () => {
            browser = await puppeteer.launch({ headless: false });
            page = await browser.newPage();
            page.setViewport({width: 1920, height: 1080});

            if (config.isMobile && config.emulateMobile) {
                await page.emulate(devices[config.emulateMobile]);
            }
            if (config.monitorNetwork) {
                //Assign globals so they can be picked up by ../modules/network.js
                global.page = await page;
                global.browser = await browser;
                network = net.monitor_network();
            }
            if (config.checkPageErrors) {
                errors = net.monitor_errors();
            }
        });
        afterEach (async () => {
            //browser.close();
        });

        /*  Begin Tests  */

        test('Checkout Flow Analysis', async () => {
            page.on('load', () => {
                if (config.monitorNetwork) {
                    payload_analysis = net.analyze_payload(network);
                    expect(network.loaded.passed.length).toBeGreaterThan(0);
                    expect(network.loaded.failed).toEqual([]);
                    if (payload_analysis.payload_seen.length && config.requiredScripts && config.requiredScripts.length) {
                        net.check_required_scripts(payload_analysis.payload_seen, config.requiredScripts);
                    }
                }
                if (config.checkPageErrors) { expect(errors).toEqual([]); }
            });

            await page.goto(config.url, {waitUntil: ['domcontentloaded', 'networkidle2']});

            const metrics = await page.metrics();
            var loadTime = metrics.TaskDuration;
            expect(loadTime).toBeLessThanOrEqual(10);

            const analytics = await page.evaluate(() => analytics);
            expect(analytics).toBeDefined();
            expect(analytics.init).toBeDefined();

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

            const address = 'input#address';
            const city = 'input#city';
            const province = 'select#province';
            const postal = 'input#postalcode';

            await expect(true).toBeTruthy();

            await page.waitForSelector(address);
            await page.type(address, '1234 Test Road');

            await page.waitForSelector(city);
            await page.type(city, 'CALGARY');

            await page.waitForSelector(province);
            await page.select(province, 'AB');

            await page.waitForSelector(postal);
            await page.type(postal, 'T2Z 0J9');

            await page.waitForSelector(submit);
            await page.click(submit);

            const acceptance = 'span#digital-acceptance-cta > a';
            const signature = 'input#agreement_signature';
            const agree = 'input#agreement_consent';
            const button = '.accept';

            await page.waitForSelector(acceptance);
            await page.click(acceptance);

            await page.waitForSelector(signature);
            await page.type('Test Test');

            await page.waitForSelector(agree);
            await page.click(agree);

            await page.waitForSelector(button);
            await page.click(button);

            await expect(true).toBeTruthy();



        },90000);
    });
}



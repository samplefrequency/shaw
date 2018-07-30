const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const net = require('../modules/network.js');
const { URL, URLSearchParams } = require('url');
const fs = require('fs');
const path = require('path');
const filename = path.basename(__filename);
const settings = JSON.parse(fs.readFileSync(path.resolve(__dirname, filename.replace(path.extname(filename), '.json')),'utf8'));

if (typeof(settings) == 'object') {
    settings.tests.forEach((item, index) => {
        run_test(item);
    });
}
else {
    throw new Error('Unable to read settings file:', json_filename);
}

function run_test (config) {
    describe(config.pageName, () => {
        let browser, page;

        if (config.monitorNetwork) { let network, payload_analysis; }
        if (config.checkPageErrors) { let errors = []; }

        beforeEach (async () => {
            browser = await puppeteer.launch({ headless: true });
            page = await browser.newPage();

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
        afterEach (() => {
            browser.close();
        });

        /*  Begin Tests  */

        test('Network, Page Errors & Script Analysis', async () => {
            page.on('load',  () => {
                if (config.monitorNetwork) {
                    payload_analysis = net.analyze_payload(network);
                }
            });


            await page.goto(config.url, {waitUntil: ['load', 'networkidle2']});

            //Network Analysis
            if (config.checkPageErrors) { expect(errors).toEqual([]); }

            if (config.monitorNetwork) {
                expect(network.loaded.passed.length).toBeGreaterThan(0);
                expect(network.loaded.failed).toEqual([]);
                if (payload_analysis.payload_seen.length && config.requiredScripts && config.requiredScripts.length) {
                    net.check_required_scripts(payload_analysis.payload_seen, config.requiredScripts);
                }
            }

            const analytics = await page.evaluate(() => analytics);
            expect(analytics).toBeDefined();
            expect(analytics.init).toBeDefined();

            const metrics = await page.metrics();
            var page_loadTime = metrics.TaskDuration;

            expect(page_loadTime).toBeLessThanOrEqual(2);


        },30000);
    });
}



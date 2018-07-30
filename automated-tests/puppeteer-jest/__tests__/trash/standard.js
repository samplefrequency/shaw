const puppeteer = require('puppeteer');
const { URL, URLSearchParams } = require('url');
const fs = require('fs');
const path = require('path');
const filename = path.basename(__filename);
const json_filename = filename.replace(path.extname(filename), '.json');
const settings = JSON.parse(fs.readFileSync(path.resolve(__dirname, json_filename),'utf8'));

if (typeof(settings) == 'object') {
    settings.tests.forEach((item, index) => {
        run_test(item);
    });
}
else {
    throw new Error('Unable to read settings file:', json_filename);
}

async function run_test (item) {
    const config = item;
    console.log('Running test: ', item.pageName);
    var loaded = {
        all: [],
        failed: [],
        redirect: [],
        passed: [],
    };
    var payload_seen = [];

    const process = {
        response: function() {
            loaded.all.push(process.data);
            if (process.data.response._status == '200' || process.data.response._status == '204') {
                loaded.passed.push(process.data);
            }
            else if (process.data.response._status == '302') {
                loaded.redirect.push(process.data);
            }
            else {
                loaded.failed.push(process.data);
            }
        },
        payload: function(payload) {
            //Filename Matching
            var filename = payload.pathname.substring(payload.pathname.lastIndexOf('/')+1).toLowerCase();
            switch(filename) {
                case 'uts_tracking_utils.js':
                    payload_seen.push('tracking utils');
                break;
            }

            //Hostname Matching
            switch(payload.hostname) {
                case 'tags.tiqcdn.com':
                    payload_seen.push('tealium iq');
                break;
                case 'collect.tealiumiq.com':
                case 'datacloud.tealiumiq.com':
                    payload_seen.push('tealium collect');
                break;
                case 'shawtelevision.112.2o7.net':
                    if (payload.searchParams.has('AQB')) {
                        payload_seen.push('adobe');
                        payload.searchParams.forEach((value, name) => {
                            let ipe = !isNaN(parseInt(name.substring(1)));
                            //events
                            if (name == 'events') {
                                //console.log('Events: ', value);
                            }

                            if (/^c/.test(name) && ipe) {
                                //console.log('Prop', name.substring(1), ':', value);
                            }
                            if (/^v/.test(name) && ipe) {
                                //console.log('eVar', name.substring(1), ':', value);
                            }
                        });
                    }
                break;
                case 'www.facebook.com':
                    if (payload.searchParams.get('ev') == 'PageView') {
                        payload_seen.push('facebook pageview');
                    }
                break;
                case 'vt.myvisualiq.net':
                    payload_seen.push('visual iq');
                break;
                default:
                    //console.log(payload);
            }
        }
    };

    describe(config.pageName, () => {
        let browser, page;

        beforeAll(async () => {
            browser = await puppeteer.launch({ headless: true });
            page = await browser.newPage();
            global.page = page;

            await page.setRequestInterception(true);

            if (config.isMobile) {
                const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25';
                await page.emulate({
                    viewport: {
                    width: 375,
                    height: 667,
                    isMobile: true
                    },
                    userAgent
                });
            }

        });

        afterAll(async () => {
            browser.close();
        });

        beforeEach (async () => {

        });
        afterEach (() => {

        });
        test('Network Connections & Page Errors', async () => {
            await page.setRequestInterception(true);
            global.page = page;
            const net = require('../modules/network.js');
            var network = net.monitor_network();

            console.log(network);



           /*  page.on('error', err=> {
                errors.push(err);
            });
            page.on('pageerror', pageerr=> {
                errors.push(pageerr);
            }); */

            await page.goto(config.url, {waitUntil: 'networkidle2'});

            expect(errors).toEqual([]);
            expect(loaded.failed).toEqual([]);
        },30000);
        test('Required Pixel Analysis', async () => {
            /* expect(loaded.passed.length).toBeGreaterThan(0);
            if (loaded.passed.length) {
                for(let item of loaded.passed) {
                    let payload = new URL(item.response._url);
                    process.payload(payload);
                }
            }
            expect(payload_seen.length).toBeGreaterThan(0);
            expect(payload_seen).toContain('tealium iq');
            expect(payload_seen).toContain('adobe');
            expect(payload_seen).toContain('facebook pageview');
            expect(payload_seen).toContain('visual iq');
            expect(payload_seen).toContain('tealium collect');
            expect(payload_seen).toContain('tracking utils'); */
        });
        test('Analytics Utilities', async() => {
            const analytics = await page.evaluate(() => analytics);
            expect(analytics).toBeDefined();
            expect(analytics.init).toBeDefined();
        });

    });
}

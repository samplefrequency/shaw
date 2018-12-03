const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { URL, URLSearchParams } = require('url');
const devices = require('puppeteer/DeviceDescriptors');
const { harFromMessages } = require('chrome-har');

//Define the page to start on
const start_url = 'http://localhost:3000';
let adobe_track = 'track.shaw.ca';
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
        const browser = await puppeteer.launch({ headless: true });
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
        //await page.emulate(devices['iPad Pro']);

        //Accumulate Network
        const waitForNetwork = (page) => {
            return new Promise(async (resolve, reject) => {
                let network = [];
                page.setRequestInterception(true);
                page.on('request', request => {
                    request.continue();
                });
                page.on('response', async function responseDataHandler(response){
                    let request_url = new URL(response._request._url);
                    if (request_url.hostname.includes(adobe_track)) { resolve(network); }
                    network.push(response);
                });
                page.on('load', async () => {
                    resolve(network);
                    console.log(network);
                });
                setTimeout(function() {
                    resolve(network);
                    console.log(network);
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
        await page.goto(start_url);

        let network = await waitForNetwork(page);
        let utag_data = await page.evaluate(() => utag_data);
        let utag = await page.evaluate(() => utag);
        let cookies = await page.cookies();
        let jQuery = await page.evaluate(() => jQuery);


        await page.tracing.stop();

        //Save HTTP Archive
        const har = harFromMessages(events);
        await Promise.all([
            fs.writeFile('trace.har', JSON.stringify(har))
        ]);
        await browser.close();

        let data = {
            errors: errors,
            network: network,
            utag: utag,
            utag_data: utag_data,
            cookies: cookies,
            url_steps: url_steps
        }
        resolve(data);
    });
}

describe('Analytics Network Data', async () => {
    beforeAll (async (done) => {
        global.data = await run();
        done();
    },30000);

    describe('Error Checking', async () => {
        test('Page Errors', async () => {
            expect(data.errors.length).toBeLessThanOrEqual(0);
        });
    });

    describe('Data Validation', async () => {
        test('Validate Data Exists', async () => {
            expect(Object.keys(data).length).toBeGreaterThan(0);
        });
        test('Adobe Network Payload Data', async () => {
            let adobe = [];
            for (let nr of data.network) {
                if (nr._request._url.includes(adobe_track)) {
                    adobe.push(nr);
                }
            }
            console.log(data.network);
            global.adobe = adobe;
            expect(adobe.length).toBeGreaterThan(0);
        });
        test('MCID Continuity', async() => {
            let mcids = [];
            for (let ar of adobe) {
                let payload = new URLSearchParams(ar._request._url);
                var mid = payload.get('mcorgid');
                if (mid !== null) {
                    mcids.push(payload.get('mcorgid'));
                }
            }
            let unique_mcid = [...new Set(mcids)];
            expect(unique_mcid.length).toEqual(1);
        });
    });
});
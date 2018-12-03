import Shaw_Analytics from '../analytics';

const analytics = new Shaw_Analytics('shaw', 'uts-shaw-consumer', 'dev');
const puppeteer = require('puppeteer');
const RequestInterceptor = require('puppeteer-request-spy').RequestInterceptor;
const RequestSpy = require('puppeteer-request-spy').RequestSpy;
const { URL, URLSearchParams } = require('url');

let browser;

beforeAll(async () => {
    browser = await puppeteer.launch({
        headless: true,
    });
});

afterAll(async () => {
    await browser.close();
});

describe('e2e Network Testing', async () => {
    let requestInterceptor;
    let adobeSpy;
    let doubleSpy;
    let fbSpy;

    beforeEach(async () => {
        requestInterceptor = new RequestInterceptor(
            (testee, pattern) => testee.indexOf(pattern) > -1,
        );
        adobeSpy = new RequestSpy('track.shaw.ca');
        requestInterceptor.addSpy(adobeSpy);

        doubleSpy = new RequestSpy('doubleclick.net');
        requestInterceptor.addSpy(doubleSpy);

        fbSpy = new RequestSpy('facebook.net');
        requestInterceptor.addSpy(fbSpy);
    });

    describe('Adobe Testing', async () => {
        let document;
        let adobe;
        let doubleclick;
        let facebook;

        test('Verify Network Requests', async () => {
            let page = await browser.newPage();
            page.setRequestInterception(true);
            page.on('request', requestInterceptor.intercept.bind(requestInterceptor));

            await page.goto('http://localhost:3000', {
                waitUntil: 'networkidle2',
            });

            adobe = adobeSpy.getMatchedUrls();
            doubleclick = doubleSpy.getMatchedUrls();
            facebook = fbSpy.getMatchedUrls();

            expect(adobeSpy.getMatchedUrls().length).toBeGreaterThan(0);
            expect(doubleSpy.getMatchedUrls().length).toBeGreaterThan(0);
            expect(fbSpy.getMatchedUrls().length).toBeGreaterThan(0);
        }, 30000);

        test('Marketing Cloud ID', async () => {
            let mcids = [];
            for (let ar of adobe) {
                let payload = new URLSearchParams(ar);
                let mid = payload.get('mcorgid');
                if (mid !== null) {
                    mcids.push(payload.get('mcorgid'));
                }
            }
            let unique_mcid = [...new Set(mcids)];
            expect(unique_mcid.length).toEqual(1);
        });
    });
});

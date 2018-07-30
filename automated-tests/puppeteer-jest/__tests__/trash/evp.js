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

function run_test (item) {
    const config = item;
    console.log('Running test: ', item.pageName);
    var loaded = {
        all: [],
        failed: [],
        redirect: [],
        passed: [],
    };
    var adobe = {
        pagename: false,
        events: [],
        evars: {},
        props: {},
        payload: false,
    };

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
            switch(payload.hostname) {
                case 'shawtelevision.112.2o7.net':
                    if (payload.searchParams.has('AQB')) {
                        adobe.payload = payload.searchParams.toString();
                        payload.searchParams.forEach((value, name) => {
                            let ipe = !isNaN(parseInt(name.substring(1)));
                            if (name == 'pageName') {
                                adobe.pagename = value;
                            }
                            //events
                            if (name == 'events') {
                                adobe.events.push(value);
                            }

                            if (/^c/.test(name) && ipe) {
                                //console.log('Prop', name.substring(1), ':', value);
                                adobe.props[name] = value;
                            }
                            if (/^v/.test(name) && ipe) {
                                //console.log('eVar', name.substring(1), ':', value);
                                adobe.evars[name] = value;
                            }
                        });
                    }
                break;
            }
        }
    };



    describe(config.pageName, () => {
        var browser, page;

        beforeAll(async () => {
            browser = await puppeteer.launch({ headless: true });
            page = await browser.newPage();
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
        test('Network Connections', async () => {
            page.on('request', request => {
                request.continue(); // pass it through.
            });
            page.on('response', response => {
                process.data = {
                    request: response.request(),
                    response: response
                };
                process.response();
            });
            await page.goto(config.url, {waitUntil: 'networkidle0'});
            expect(loaded.failed).toEqual([]);
        },30000);
        test('Adobe Pixel Analysis', async () => {
            expect(loaded.passed.length).toBeGreaterThan(0);
            if (loaded.passed.length) {
                for(let network of loaded.passed) {
                    let payload = new URL(network.response._url);
                    process.payload(payload);
                }
                expect(adobe.payload.length).toBeGreaterThan(0);
                expect(Object.keys(adobe.evars).length).toBeGreaterThan(0);

                console.log(config.adobe.evars);

            }

        });
    });
}

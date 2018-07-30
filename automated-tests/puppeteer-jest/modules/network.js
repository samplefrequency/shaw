const { URL, URLSearchParams } = require('url');

module.exports = {
   monitor_network() {
        try {
            if (typeof(page) == 'undefined') { throw new Error('Error: page variable not defined.'); }
            page.setRequestInterception(true);

            var network = {
                loaded: {
                    all: [],
                    failed: [],
                    redirect: [],
                    passed: [],
                },
            },
            data;
            page.on('request', request => {
                request.continue(); // pass it through.
            });
            page.on('response', response => {
                data = {
                    request: response.request(),
                    response: response
                };
                network.loaded.all.push(data);
                if (response._status == '200' || response._status == '204') {
                    network.loaded.passed.push(data);
                }
                else if (response._status == '302') {
                    network.loaded.redirect.push(data);
                }
                else {
                    network.loaded.failed.push(data);
                }
            });
            return network;
        }
        catch(e) {
            console.log('Network Service Unavaiable.', e);
        }
    },
    analyze_payload(network) {
        var payload_seen = [];
        var adobe = {
            pagename: false,
            events: [],
            evars: {},
            props: {},
            payload: false,
        };

        if (network.loaded.passed.length) {
            for(let item of network.loaded.passed) {
                let payload = new URL(item.response._url);
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
                                if (name == 'pageName') {
                                    adobe.pagename = value;
                                }
                                if (name == 'events') {
                                    adobe.events.push(value);
                                }

                                if (/^c/.test(name) && ipe) {
                                    adobe.props[name] = value;
                                }
                                if (/^v/.test(name) && ipe) {
                                    adobe.evars[name] = value;
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
        }
        return {
            payload_seen: payload_seen,
            adobe: adobe
        }
    },
    monitor_errors() {
        try {
            if (typeof(page) == 'undefined') { throw new Error('Error: page variable not defined.'); }

            var errors = [];
            page.on('error', err=> {
                errors.push(err);
            });
            page.on('pageerror', pageerr=> {
                errors.push(pageerr);
            });
            return errors;
        }
        catch(e) {
            console.log('Error Service Unavaiable.', e);
        }
    },
    check_required_scripts(payload_seen, required) {
        if (required.length > 0 && payload_seen.length > 0) {
            var matches = [];
            for (let name of required) {
                if (payload_seen.includes(name)) { matches.push(name); }
            }
            //expect(matches).toEqual(required);
            expect(matches).toEqual(expect.arrayContaining(required));
        }
    }
};
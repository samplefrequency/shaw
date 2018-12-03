import { loader } from '../utils/externalLoader';

export class Tealium {
    constructor(account, profile, environment) {
        this.account = account;
        this.profile = profile;
        this.environment = environment;
        this.utag_data = {};
        this.external_scripts = [];
        this.loaded = false;
        this.tealium_ready = false;
        this.debug = false;
    }

    log() {
        if (this.debug && typeof (console) !== 'undefined') {
            console.log.apply(console, arguments);
        }
    }

    load() {
        this.external_scripts.push('https://tags.tiqcdn.com/utag/' + this.account + '/' + this.profile + '/' + this.environment + '/utag.js');
        loader.urls(this.external_scripts).then(() => {
            this.loaded = true;
        }).catch((e) => {
            console.error('Tealium.class => Script loading error:', e);
        });
        return this.ready();
    }

    ready() {
        const is_ready = () => {
            return this.tealium_ready ? this.tealium_ready : (typeof (utag) !== 'undefined' && utag.hasOwnProperty('view') && utag.hasOwnProperty('link') && utag.hasOwnProperty('loader') && utag.loader.hasOwnProperty('ended'));
        };
        return new Promise((resolve, reject) => {
            if (is_ready()) { resolve(); }
            else {
                let cnt = 0;
                const utag_wait = setInterval(() => {
                    cnt++;
                    if (cnt <= 200) {
                        if (is_ready()) {
                            this.tealium_ready = true;
                            clearInterval(utag_wait);
                            resolve();
                        }
                    }
                    else {
                        clearInterval(utag_wait);
                        reject(new Error('Analytics: Waiting for utag timed out, aborting operations...'));
                    }
                }, 50);
            }
        });
    }

    set(obj) {
        if (typeof (obj) === 'object' && typeof (this.utag_data) === 'object') {
            this.log('Setting Data: ', obj);
            Object.assign(this.utag_data, obj);
            Object.assign(window.utag_data, this.utag_data);
        }
        return this.utag_data;
    }

    remove(key) {
        delete this.utag_data[key];
    }

    reset() {
        this.utag_data = {};
        this.log('Resetting data!', this.utag_data);
    }

    default() {
        const date = new Date();
        this.set({
            user_agent_string: utag_data.user_agent_string || navigator.userAgent,
            site_name: document.location.hostname,
            referring_url: document.referrer,
            hour_of_day: date.toLocaleString('en-us', { weekday: 'long' }) + '|' + date.toLocaleTimeString('en-us'),
            day_of_month: date.getDate(),
            timestamp: date.toString(),
            url: document.location.href,
        });
        return this.utag_data;
    }

    view(data = {}, callback = false) {
        this.default();
        this.set(data);
        utag.view(this.utag_data, () => {
            callback && callback(this.utag_data);
            this.log('View Finished:', this.utag_data);
            this.reset();
        });
    }

    link(data = {}, callback = false) {
        this.default();
        this.set({
            link_name: 'Tealium Link Event',
        });
        this.set(data);
        utag.link(this.utag_data, () => {
            callback && callback(this.utag_data);
            this.log('Link Finished:', this.utag_data);
            this.reset();
        });
    }
}

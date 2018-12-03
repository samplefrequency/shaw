import { Tealium } from './class/Tealium.class';
import { secure_data } from './utils/security';
import { geoip } from './utils/geoip';
import { device } from './utils/device';
import { checkout } from './utils/checkout';
import { getjson } from './utils/getjson';

export default class Shaw_Analytics extends Tealium {
    constructor(account, profile, environment) {
        super(account, profile, environment);

        //Tealium Overrides
        window.utag_data = window.utag_data || this.utag_data;
        window.utag_cfg_ovrd = { noview: true };
        setInterval(() => { window.clickTrackEvent = false; }, 100);

        //Define Defaults
        this.default_products = {
            product_id: [], //SKU or unique identifier
            product_quantity: [], //Quantity (Usually 1)
            product_sale_price: [], //Actual price item was sold for
            product_name: [], //Name of product
            product_type: [], //Programing, internet, tvservice etc...
            product_regular_price: [], //Regular price of the product before discounts
            product_offer_discount: [], //Discount Amount
            product_monthly_charge_less_discount: [], //Monthly Charges without discounts
            product_recurring_discount: [], //Monthly Discount
            equipment_purchase_type: [],
            product_contract: [], //Month to Month, 2YVP etc...
            product_credit: [], //Credit given on a product (ie: Gift cards)
            product_order_type: [], //CrossSell, UpSell, Aquisition
            product_upsell: [],
            product_xsell: [],
            product_rgu: [], //0,1
            product_category: [],
        };
        this.products = this.default_products;
        this.debug = (localStorage.getItem('shaw-debug') === 'true') || false;
        this.userinfo = this.client();
        this.checkout = this.page().is_checkout() ? checkout() : false;
        this.get_products = (url = this.checkout.product_json_url) => { return getjson(url); };

        //Click Tracking
        if (typeof (s) === 'object') { s.trackExternalLinks = false; } //Disable Adobe External Click Tracking
        document.onclick = (e) => {
                (e.target.dataset.event && e.target.dataset.value)
                && analytics.link({ [e.target.dataset.event]: e.target.dataset.value });
        };
    }

    default() {
        super.default();
        this.set({
            shaw_analytics: true,
            page_name: this.page().info.pagename,
            platform: this.client().device,
            isp: geoip('network'),
            isp_org: geoip('network'),
            geoip_city: geoip('city'),
            geoip_country: geoip('country_code'),
            geoip_region: geoip('region_code'),
            goeip_network: geoip('network'),
            goeip_continent: geoip('continent'),
        });
        this.optimizely();
    }

    secure(data) {
        return (typeof data === 'object' && Object.keys(data).length > 0) ? secure_data(data) : false;
    }

    set(data) {
        return (typeof data === 'object' && Object.keys(data).length > 0) ? super.set(this.secure(data)) : false;
    }

    add_product(obj) {
        if (typeof obj !== 'object' && Object.keys(data).length <= 0) { return false; }
        const seen = {};
        for (let [key, value] of Object.entries(obj)) {
            if (this.products.hasOwnProperty(key)) {
                seen[key] = true;
                this.products[key].push(value);
            }
        }
        for (let [k] of Object.entries(this.products)) {
            !seen[k] && this.products[k].push(false);
        }

        this.set(this.products);
        this.set({
            'event_name:scAddAction': true,
        });
        return this.products;
    }

    remove_product(product_id) {
        let index = this.products.product_id.indexOf(product_id);
        if (index > -1) {
            for (let [key] of Object.entries(this.products)) {
                this.products[key].splice(index, 1);
            }
        }
        this.set({
            'event_name:scRemoveAction': true,
        });
        this.set(this.products);
    }

    clear_products() {
        for (let [key] of Object.entries(this.products)) {
            delete this.utag_data[key];
        }
        delete this.utag_data['event_name:scRemoveAction'];
        delete this.utag_data['event_name:scAddAction'];
    }

    client() {
        return {
            geoip: geoip(),
            device: device().device,
            isMobile: device().isMobile,
            useragent: device().userAgent,
        };
    }

    page() {
        const url = new URL(window.location.href);
        const pathname = url.pathname.toLowerCase();
        const is_classic = (url.host === 'www.shaw.ca');
        const is_beta = (url.host === 'beta.shaw.ca');
        const is_local = (url.hostname === 'localhost');
        const page_name = document.body.dataset.pagename || false;
        const pagename = () => {
            return (this.utag_data.hasOwnProperty('page_name') && this.utag_data.page_name !== '') ? this.utag_data.page_name
                    : (page_name !== null) ? page_name
                    : pathname ? pathname.split('/').join('|')
                    : 'pagename-not-available';
        };

        return {
            info: {
                url: url.href,
                pathname: pathname,
                is_local: is_local,
                is_classic: is_classic,
                is_beta: is_beta,
                pagename: pagename(),
            },
            is_checkout: () => {
                return this.is_checkout || (is_classic && pathname.includes('/store/cart/')) || (is_beta && pathname.includes('/configure'));
            },
            is_conversion: () => {
                return pathname.includes('thank');
            },
        };
    }

    optimizely() {
        /*
        * Using the Optimizely API, fetch the active experiments and the project id
        * Assemble Project ID, Experiment ID and Variation ID into a string
        * Group strings and delimit groups with | to a maximum of 7 groups.
        */
        if (typeof (optimizely) !== 'undefined') {
            try {
                let exp = [],
                    optly = optimizely.get('state').getCampaignStates({ isActive: true }),
                    pid = optimizely.get('data').projectId;
                Object.keys(optly).forEach((i) => {
                    exp.push(pid + '.' + optly[i].experiment.id + '.' + optly[i].variation.id);
                });
                if (exp.length) {
                    this.set({ optimizely: exp.join('|') });
                }
            }
            catch (e) {
                this.log('Unable to use optimizely API: \n' + e);
            }
        }
    }
}

import * as json from '../checkout.json';

export const checkout = () => {
    const analytics = {
        checkout: {},
    };
    const get_url_param = (name) => {
        let match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return (match !== null) ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : false;
    };

    let eoId = get_url_param('eoId');
    let promoId = get_url_param('promoId');
    let body_eoId = document.body.dataset.pagename;

    const rplc = (str) => {
        return str.replace('{{body-eoId}}', body_eoId).replace('{{eoId}}', eoId).replace('{{promoId}}', promoId);
    };

    Object.keys(json).forEach((k) => {
        if (json[k].hasOwnProperty('form_steps')) {
            json[k].form_steps.forEach((value) => {
                if (value.hasOwnProperty('url')) {
                    let step = { url: [] };
                    if (typeof (value.url) === 'string') { step.url.push(value.url); } else { step.url = value.url; }
                    if (document.location.pathname.indexOf(step.url) > -1) {
                        analytics.checkout.checkout_type = k;
                        analytics.checkout.product_json_url = rplc(json[k].json);

                        analytics.checkout.is_checkout = true;
                        analytics.checkout.is_form_step = true;
                        analytics.checkout.lead_form_name = rplc(json[k].lead_form_name);
                        analytics.checkout.form_name = json[k].form_name;

                        if (value.hasOwnProperty('label')) {
                            step.label = value.label;
                            analytics.checkout.form_step = value.label;
                        }
                        if (value.hasOwnProperty('pagename')) {
                            analytics.checkout.pagename = value.pagename;
                        }
                        if (value.hasOwnProperty('wait')) {
                            analytics.checkout.wait = value.wait;
                        }
                        analytics.checkout.is_thanks = (value.hasOwnProperty('is_thanks') && value.is_thanks === true);
                        if (value.hasOwnProperty('events') && value.events.length) {
                            analytics.checkout.cart_events = value.events;
                        }
                        return analytics.checkout;
                    }
                }
                return analytics.checkout;
            });
        }
    });
    return analytics.checkout;
};

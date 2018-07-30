/**
 * @author Mike Barkemeyer, Csongor Szeles
 * @version 2.0.0
 * @requires jQuery
 * @namespace analytics
 * @extends SHAW
 *
 * Commonly used public properties & functions
 * Products:
 *       @property analytics.settings.has_products
 *       @returns {bool}
 *
 *       @property analytics.settings.product_string
 *       @returns {object}
 *
 * Checkout Pages:
 *       @property analytics.settings.is_checkout
 *       @returns {bool}
 *
 *       @property analytics.settings.checkout_type
 *       @returns {string} builder|bluesky|leadform|student
 *
 * Thankyou Pages:
 *       @property analytics.settings.is_thanks
 *       @returns {bool}
 *
 * Server Environment:
 *      @property analytics.settings.server_env
 *      @returns {string} atg|ektron|ion
 *
 *      @property analytics.settings.is_atg
 *      @returns {bool}
 *
 *      @property analytics.settings.is_ektron
 *      @returns {bool}
 *
 *      @property analytics.settings.is_ion
 *      @returns {bool}
 */

import * as config from './config/config';
import * as utils from './utils/utils';
import { sha256 } from 'js-sha256';

export const analytics = {
    settings: config.settings,
    log: function() {
        if (analytics.settings.debug && typeof(console) !== 'undefined') {
            console.log.apply(console, arguments);
        }
    },
    init: function() {
        analytics.log('Analytics: Initializing...', 'Executing init...');
        analytics.settings.pages = config.pages;
        //Define product string containers
        analytics.settings.product_string = analytics.settings.default_product_string;
        analytics.settings.server_env = utils.env().server_env;
        analytics.settings.env = utils.env().env;
        analytics.settings.path = utils.path().path;
        analytics.settings.depth = utils.path().depth;
        analytics.settings.tealium_profile = utils.get_profile();
        analytics.settings.user_location = utils.user_location();

        Object.keys(analytics.settings.pages).forEach(function(k,v){
            if (analytics.settings.pages[k].hasOwnProperty('form_steps')) {
                analytics.settings.pages[k].form_steps.forEach(function(value){
                    if (value.hasOwnProperty('url')) {
                        var step = { url: [] };
                        if (typeof(value.url) == 'string') { step.url.push(value.url); } else { step.url = value.url; }
                        if ($.inArray(document.location.pathname, step.url) > -1) {
                            analytics.settings.checkout_type = k;
                            analytics.settings.product_json_url = analytics.settings.pages[k].json;
                            analytics.settings.wait = false;
                            analytics.settings.is_checkout = true;
                            analytics.settings.is_form_step = true;
                            analytics.settings.lead_form_name = analytics.settings.pages[k].lead_form_name;
                            analytics.settings.form_name = analytics.settings.pages[k].form_name;

                            if (value.hasOwnProperty('label')) {
                                step.label = value.label;
                                analytics.settings.form_step = value.label;
                            }
                            if (value.hasOwnProperty('pagename')) {
                                analytics.settings.pagename = value.pagename;
                            }
                            if (value.hasOwnProperty('wait')) {
                                analytics.settings.wait = value.wait;
                            }
                            analytics.settings.is_thanks = (value.hasOwnProperty('is_thanks') && value.is_thanks == true);
                            if (value.hasOwnProperty('events') && value.events.length) {
                                analytics.settings.cart_events = value.events;
                            }
                            return;
                        }
                    }
                });
            }
        });
        analytics.tools.wait().then(function() {
            analytics.cart.fetch_products(function(products){
                $(document).trigger('Analytics.BeforeTealiumReady', analytics);
                if (typeof(utag) == 'undefined') {
                    analytics.tools.inject_script('//tags.tiqcdn.com/utag/shaw/'+analytics.settings.tealium_profile+'/' + analytics.settings.env + '/utag.js')
                     .done(function(script, textStatus) {
                        analytics.log('Analytics: Tealium injected. \n Profile: '+ analytics.settings.tealium_profile + '\n Environment: '+ analytics.settings.env);
                        analytics.settings.utag_view_prevented = true;
                        if (typeof(utag) !== 'undefined' && utag.hasOwnProperty('view')) {
                            analytics.tools.wait_for_tags().then(function(response) {
                                $(document).trigger('Analytics.tealiumReady', analytics);
                                if (!analytics.settings.manual_view) { analytics.tealium.view(utag_data); }
                            }, function(error) {
                                analytics.log('Analytics: Tealium tag loader timed out.');
                                $(document).trigger('Analytics.tealiumError', 'Tealium: Tealium tag loader timed out.');
                            });
                        }
                        else {
                            analytics.log('Analytics: Error loading utag object - Check tealium for code errors.');
                            $(document).trigger('Analytics.tealiumError', 'Tealium: Error loading utag object');
                            if (isNaN(analytics.settings.retry_count)) { analytics.settings.retry_count = 0; }

                            if (analytics.settings.retry_tealium_failure) {
                                analytics.settings.retry_count++;
                                if (analytics.settings.retry_count <= analytics.settings.retry_limit) {
                                    analytics.log('Analytics: Retrying init', analytics.settings.retry_count, 'of', analytics.settings.retry_limit);
                                    analytics.init();
                                }
                                else {
                                    analytics.log('Analytics: Goodbye...');
                                }
                            }
                        }
                    })
                    .fail(function(jqxhr, settings, exception) {
                        analytics.log(exception);
                        $(document).trigger('Analytics.tealiumError', exception);
                    });
                }
                else {
                    analytics.settings.utag_view_prevented = false;
                    analytics.log('Analytics: Tealium already loaded.. \n\nWarning: Possibly unable to modify utag_data object before utag.view() \nRemove other instances of tealium. \n');
                    analytics.tools.wait_for_tags().then(function(response) {
                        $(document).trigger('Analytics.tealiumReady', analytics);
                        if (!analytics.settings.manual_view) { analytics.tealium.view(utag_data); }
                    }, function(error) {
                        analytics.log('Analytics: Tealium tag loader timed out.');
                        $(document).trigger('Analytics.tealiumError', 'Tealium: Tealium tag loader timed out.');
                    });
                }
            });
        });
        //Initialize plugins
        analytics.plugins.init();

        //Return analytics
        return analytics;
    },
    click_init: function() {
        analytics.log('Analytics: Click tracking initialized!');
        var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (o.hasOwnProperty('event') && o.hasOwnProperty('element')) {
            var element = o.element,
            event = o.event;


            if ($(element).prop('nodeName') == 'BODY') { $(element).attr('data-trk', 'false'); throw ('Analytics: Ignoring body click event & preventing future body events.');  }
            if (!$(element).data('value') || !$(element).data('value').length) { throw ('Fatal Tracking Error: No data-value present or is empty.'); }
            if (!$(element).data('event').length) { throw ('Fatal Tracking Error: data-event is empty.'); }

            analytics.settings.e = event;
            analytics.settings.element = $(element);
            analytics.settings.type = $(analytics.settings.element).prop('nodeName').toLowerCase();
            analytics.settings.href = $(analytics.settings.element).attr('href');
            analytics.settings.target = $(analytics.settings.element).attr('target');
            analytics.settings.is_internal = /^#/.test(analytics.settings.href);
            analytics.settings.event = $(analytics.settings.element).data('event');
            analytics.settings.value = $(analytics.settings.element).data('value').replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/ig,'').replace(/[^\w\s!?|.,]/g,'').replace(/\s/g,'-');
            analytics.tools.remap_events();

            analytics.settings.form = $(analytics.settings.element).parents('form');
            analytics.settings.has_form = (typeof($(analytics.settings.form).get(0)) == 'undefined') ? false : true;
            analytics.settings.is_valid = (analytics.settings.has_form && $.isFunction($.fn.valid) && $(analytics.settings.form).valid()) ? true : false;
        }
    },
    tealium: {
        view: function(data) {
            /*
            View is now prevented on hook.
            if (!analytics.settings.utag_view_prevented && !analytics.settings.allow_double_fire) {
                analytics.log('Analytics: Possible duplicate utag.view() prevented.');
                analytics.settings.view_complete = false;
                return false;
            }*/
            analytics.tealium.set_default_data(data);
            Object.keys(data).forEach((key) => (data[key] == null || data[key] == '') && delete data[key]);
            data = analytics.tools.clean_object(data);

            $(document).trigger('Analytics.beforeView', data);
            utag.view(data, function() {
                analytics.settings.view_complete = true;
                $(document).trigger('Analytics.viewComplete', data);
            });
        },
        link: function() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            analytics.settings.tealium_data = {
                navigation_click: "true",
                navigationAction: analytics.settings.value,
                link_name: "analytics: click event",
                'event_name:linkEvent': 'trigger',
            };
            analytics.tealium.set_default_data(analytics.settings.tealium_data);

            if (typeof(analytics.settings.event) !== 'undefined' && analytics.settings.event.includes('Action')) {
                analytics.settings.tealium_data['event_name:'+analytics.settings.event] = analytics.settings.event;
                switch(analytics.settings.event) {
                    case 'chatAction':
                        analytics.settings.tealium_data.chat_id = $('body').attr('data-clickid') || analytics.settings.value;
                    break;
                    case 'quizAction':
                        analytics.settings.tealium_data.quizAction = utag_data.quizAction;
                        delete utag_data.quizAction; //Delete because its being set by something else.
                    break;
                    case 'builderAction':
                        analytics.settings.prevent_link = ($(analytics.settings.element).hasClass('btn') || $(analytics.settings.element).hasClass('button') && !$(analytics.settings.element).hasClass('checkout'));
                    break;
                }
            }
            Object.keys(data).forEach((key) => (data[key] == null || data[key] == '') && delete data[key]);
            data = analytics.tools.clean_object(data);
            $.extend(analytics.settings.tealium_data, data);
            if (!analytics.settings.prevent_link) {
                utag.link(analytics.settings.tealium_data, callback);
            }
        },
        manual_link: function() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            analytics.settings.tealium_data = {
                navigation_click: "true",
                navigationAction: analytics.settings.value,
                link_name: "analytics: click event",
                'event_name:linkEvent': 'trigger',
            };
            analytics.tealium.set_default_data(analytics.settings.tealium_data, true);

            Object.keys(data).forEach((key) => (data[key] == null || data[key] == '') && delete data[key]);
            data = analytics.tools.clean_object(data);
            $.extend(analytics.settings.tealium_data, data);

            utag.link(analytics.settings.tealium_data, callback);
        },
        set_default_data: function(object) {

            var ignore_cart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (typeof(object) !== 'object') { return false; }
            var date = new Date(),
                start_int = 2,
                data = {}; data = {
                user_agent_string: utag_data.user_agent_string || navigator.userAgent,
                site_name: utag_data.site_name || document.location.hostname,
                site_version: utag_data.site_version || '1.0',
                site_language: analytics.tools.get_language(),
                referring_url: utag_data.referring_url || document.referrer,
                page_name: utag_data.page_name || analytics.tools.get_pagename(),
                hour_of_day: utag_data.hour_of_day || date.toLocaleString('en-us', {weekday: 'long'}) + '|' + date.toLocaleTimeString('en-us'),
                day_of_month: utag_data.day_of_month || date.getDate(),
                timestamp: utag_data.timestamp || date.toString(),
                url: utag_data['dom.url'] || document.location.href,
                user_type: utag_data.user_type ||  analytics.tools.get_user_type() ||  'unknown',
                page_section: utag_data.page_section || ((analytics.settings.path.length == 1) && (analytics.settings.path[0] == 'store')) ? 'homepage' : analytics.settings.path[0],
                eoid: utag_data.eoid || analytics.tools.get_url_param('eoId'),
                taxonomy_level: utag_data.taxonomy_level || analytics.settings.depth.toString(),
                user_login_state: utag_data.user_login_state || analytics.tools.get_cookie("hasLoggedIn") || 'logged-out',
                home_postal_code: utag_data.home_postal_code || analytics.settings.user_info.postal_code || false,
                province: utag_data.province || analytics.settings.user_info.province || false,
                platform: utag_data.platform || analytics.tools.device().device,

                //Additional data
                visitor_postal_code: analytics.settings.user_info.postal_code || false,
                visitor_half_postal_code: analytics.settings.user_info.half_postal_code,
                visitor_city: analytics.settings.user_info.city,
                visitor_province: analytics.settings.user_info.province,
                visitor_address: analytics.settings.user_info.address,
                visitor_isp: analytics.settings.user_info.isp,
                visitor_ip: analytics.settings.user_info.ip,
            };
            $(analytics.settings.path.slice(1)).each(function(i,v) {
                data['page_section_l' + start_int] = analytics.settings.path[(i + 1)].replace('.jsp', '');
                start_int++;
            });
            if (!ignore_cart) {
                if (analytics.settings.is_checkout) {
                    data.lead_form_name = analytics.settings.lead_form_name || utag_data.lead_form_name;
                    data.form_name = analytics.settings.form_name || utag_data.form_name || analytics.settings.checkout_type;
                    data.page_section = 'cart';
                }

                if (analytics.settings.is_form_step) {
                    if (typeof(analytics.settings.cart_events) !== 'undefined' && analytics.settings.cart_events.length > 0) {
                        analytics.settings.cart_events.forEach(function(value) {
                            data['event_name:' +value] = 'trigger';
                        });
                    }
                    if ((/^cart start/i).test(analytics.settings.form_step)) {
                        data['event_name:scOpenAction'] = 'trigger';
                    }

                    data.form_step = analytics.settings.form_step;
                    data['event_name:form_step'] = 'trigger';
                    data.page_name = analytics.settings.pagename;
                }

                if (analytics.settings.has_products && analytics.settings.is_thanks) {
                    delete data['event_name:scOpenAction'];
                    delete data['event_name:scRemoveAction'];
                    delete data['event_name:scAddAction'];

                    data.form_name = analytics.settings.form_name;
                    data.form_step = analytics.settings.form_step || 'Thankyou';
                    data['event_name:lead submit'] = 'trigger';
                    data.order_currency = 'CAD';

                    var order_total = 0;
                    analytics.settings.product_string.product_sale_price.forEach(function(value){
                        if (value !== 'undefined') { order_total += Number(value); }
                    });
                    analytics.settings.order_total = order_total.toFixed(2);
                    data.order_total =  analytics.settings.order_total; //Doesnt appear to be in Tealium.

                    if (analytics.settings.checkout_type == 'builder' || analytics.settings.checkout_type == 'leadform' || analytics.settings.checkout_type == 'student') { data.order_id = $('body').data('ref').toString(); }
                    if (analytics.settings.checkout_type == 'bluesky') { data.order_id = analytics.tools.get_url_param('_requestid').toString(); }
                }
            }
            utils.set_utag(data);
        }
    },
    track: {
        form_error: function() {
            analytics.tools.set_form_errors();
            analytics.log('Analytics: Form Validation Failed: Halted tracking for event, tracking error instead.');
            analytics.tealium.link({
                    link_name: 'Form Validation Error',
                    'event_name:siteError': 'trigger',
                    site_error: analytics.settings.form_errors, //Global site error
            }, function() {
                $(document).trigger('Analytics.formError', analytics.settings.validator.errorList);
            });
        },
        complete: function() {
            $(document).trigger('Analytics.trackingComplete', analytics);
        },
        click: function() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            analytics.tealium.link(data, function() {
                analytics.track.complete();
            });
        }
    },
    plugins: {
        init: function() {
            //Call all plugin functions
            analytics.settings.active_plugins = [];
            Object.keys(analytics.plugins).forEach(function(k,v) {
                if (typeof(analytics.plugins[k]) == 'function' && k !== 'init' && k.substring(0,2) == '__') {
                    analytics.plugins[k].call();
                    analytics.settings.active_plugins.push(k);
                }
            });
        },
        __optimizely: function() {
            /*
            * Using the Optimizely API, fetch the active experiments and the project id
            * Assemble Project ID, Experiment ID and Variation ID into a string
            * Group strings and delimit groups with | to a maximum of 7 groups.
            */
            if (typeof(optimizely) !== 'undefined') {
                try {
                    var exp = [],
                        optly = optimizely.get('state').getCampaignStates({"isActive": true}),
                        pid = optimizely.get('data').projectId;
                    Object.keys(optly).forEach(function (i,v) {
                        exp.push(pid + '.' + optly[i].experiment.id + '.' + optly[i].variation.id);
                    });
                    utag_data.optimizely = exp.join('|');
                }
                catch(e) {
                    analytics.log('Analytics Plugin: Unable to use optimizely API: \n'+e);
                }
            }
        },
        /**
         * Set marketing cloud ID using the adobe API.
         */
        __marketing_cloud: function() {
            if (typeof(visitor) !== 'undefined') {
                try {
                    analytics.settings.marketing_cloud_id = visitor.getMarketingCloudVisitorID();
                    utag_data.marketing_cloud_id = analytics.settings.marketing_cloud_id;
                }
                catch(e) {
                    analytics.log('Analytics Plugin: Unable to set Marketing Cloud ID: \n'+e);
                }
            }
        }
    },
    tools: {
        before: function(object, method, fn) {
            var originalMethod = object[method];
            object[method] = function () {
                analytics.settings.before_arguments = arguments;
                fn.apply(object);
                originalMethod.apply(object, arguments);
            };
        },
        after: function(object, method, fn) {
            var originalMethod = object[method];
            object[method] = function () {
                analytics.settings.after_arguments = arguments;
                originalMethod.apply(object, arguments);
                fn.call(object);
            };
        },
        uniq: function(a) {
            var seen = {};
            return a.filter(function(item) {
                return seen.hasOwnProperty(item) ? false : (seen[item] = true);
            });
        },
        inject_script: function(src) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            $.script = function(src, options) {
                options = $.extend(options || {}, {
                    dataType: "script",
                    cache: false,
                    url: src
                });
                return $.ajax(options);
            };
            return $.script(src, options);
        },
        remap_events: function() {
            var joined, remapped_events = [];
            $(analytics.settings.event.split(' ')).each(function(i,v) {
                if (analytics.settings.event_remap.hasOwnProperty(v)) {
                    analytics.log('Original Event: ' + v + ' Remapped to: ' + analytics.settings.event_remap[v]);
                    remapped_events.push(analytics.settings.event_remap[v]);
                }
            });
            analytics.tools.uniq(remapped_events);
            joined = $.map(remapped_events, function(val){ return val; }).join(' ');
            if (joined.length > 0) { $(analytics.settings.element).data('event', joined); analytics.settings.event = joined; }
        },
        set_form_errors: function() {
        if (!$.isFunction($.fn.validate))  { return false; }
            analytics.settings.validator = (!analytics.settings.is_valid) ? $(analytics.settings.form).validate() : {};
            analytics.settings.form_errors = (!analytics.settings.is_valid) ? $.map(analytics.settings.validator.errorList, function(val){ return val.message; }).join('|') : '';
        },
        get_text: function(string) {
            var decoded_string = $("<div/>").html(string).text();
            return $("<div/>").html(decoded_string).text().replace(/[^-a-zA-Z0-9 "|+:_\.=,&%;?]/g, '');
        },
        clean_object: function(source) {
            function recursiveReplace (objSource) {
                if (typeof objSource === 'string') {
                    return $.trim(analytics.tools.get_text(objSource));
                }
                if (typeof objSource === 'object') {
                    if (objSource === null) { return null; }
                    Object.keys(objSource).forEach(function (property) {
                        objSource[property] = recursiveReplace(objSource[property]);
                        if (objSource[property] === undefined) { objSource[property] = false; }
                    });
                    return objSource;
                }
            }
            return recursiveReplace(source);
        },
        get_url_param: function(name) {
            var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
            if (match !== null) { return decodeURIComponent(match[1].replace(/\+/g, ' ')); }
            else { return false; }
        },
        get_cookie: function(name) {
            var match = document.cookie.match(new RegExp(name + '=([^;]+)'));
            if (match) { return match[1]; }
            else { return false; }
        },
        set_cookie: function(name, value) {
            document.cookie = name +'='+ value +';';
        },
        delete_cookie(name) {
            document.cookie = name +'=;Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        },
        get_storage(name) {
            return localStorage.getItem(name);
        },
        set_storage(name, value) {
            return localStorage.setItem(name, value);
        },
        delete_storage(name) {
            return localStorage.removeItem(name);
        },
        wait_until_exists: function(selector, callback) {
            if ($(selector).length) { callback(); }
            else {
                setTimeout(function() {
                    analytics.tools.wait_until_exists(selector, callback);
                }, 100);
            }
        },
        get_user_type: function() {
            try {
                var user_type = analytics.tools.get_storage('new_customer_type');
                if (!user_type && (document.cookie.indexOf('browser_profile=') > -1)) {
                    var user_cookie = analytics.tools.get_cookie('browser_profile').split("!"), profile = [];
                    user_cookie.forEach(function(e){
                        profile.push(e.replace(/^\{|\}$/g,""));
                    });
                    user_type = profile[0] || 'unknown';
                }
                else {
                    user_type = 'unknown';
                }
                analytics.settings.user_type = user_type;
                return user_type;
            }
            catch(e) {
                analytics.log('Analytics: Unable to set user type.', e);
            }
        },
        set_customer_cookie: function(type) {
            analytics.tools.set_storage("new_customer_type", type);
            utag_data.user_type = type;
            analytics.log('Analytics: Setting customer type: '+ type);
        },
        set_customer_type: function(selected){
            switch(selected) {
                case 'new': case 'notNewCustomer': case 'currentNoDrawer': case 'currentNo': case 'existingCust_no':
                case 'modal_currentNo': case 'drawer_currentNo':
                    analytics.tools.set_customer_cookie('new');
                    analytics.settings.user_type = 'new';
                break;
                case 'existing': case 'newCustomer': case 'currentYesDrawer': case 'currentYes': case 'existingCust_yes': case 'installDateTime': case 'noInstallDateTime':
                case 'modal_currentYes': case 'drawer_currentYes':
                    analytics.tools.set_customer_cookie('existing');
                    analytics.settings.user_type = 'existing';
                break;
            }
            return true;
        },
        get_location: function() {
            try {
               var location = [];
                if (document.cookie.indexOf('location=') > -1) {
                    var user_cookie = analytics.tools.get_cookie('location').split("!");
                    user_cookie.forEach(function(e){
                        location.push(e.replace(/^\{|\}$/g,""));
                    });
                    analytics.settings.user_location = location || [];
                }
                else {
                    analytics.settings.user_location = [];
                    location = [];
                }
                return location;
            }
            catch(e) {
                analytics.log('Analytics: Unable to determine location using cookies.', e);
                return false;
            }
        },
        get_language: function() {
            if (typeof(analytics.settings.path[0]) !== 'undefined') {
                return analytics.settings.path[0].includes('english') ? 'en' : analytics.settings.path[0].includes('francais') ? 'fr' : (navigator.language.substring(0,2) || navigator.userLanguage.substring(0,2));
            }
            else {
                return (navigator.language.substring(0,2) || navigator.userLanguage.substring(0,2))
            }
        },
        get_pagename: function pagename() {
            if (analytics.settings.pagename) { return analytics.settings.pagename; }

            if (utag_data.hasOwnProperty('page_name') && utag_data.page_name !== '') {
                if (utag_data.page_name.includes('|')) {
                    return utag_data.page_name.split('|').filter(String).join('|');
                }
                else {
                    return utag_data.page_name;
                }
            }
            else if ($('body').attr('data-pagename')) {
                var pagename = $('body').attr('data-pagename');
                if (pagename.includes('|')) {
                    return pagename.split('|').filter(String).join('|');
                }
                return pagename;
            }
            else if (analytics.settings.path) {
                return analytics.settings.path.join('|');
            }
            else {
                return 'pagename-not-set-in-content';
            }
        },
        secure_data: function() {
            if (typeof(utag_data) === 'object') {
                const secure_data = [
                    'home_postal_code',
                    'visitor_address',
                    'visitor_ip',
                    'account_id',
                    'visitor_isp'
                ];
                for (var key of secure_data) {
                    if (typeof(utag_data[key]) !== 'undefined' && utag_data[key].length <= 7 && utag_data[key] !== '') {
                        utag_data[key] = sha256(utag_data[key]);
                    }
                }
                return true;
            }
            return false;
        },
        count_object: function (store, level, obj) {
            if (typeof(obj) !== 'object') { return; }
            var keys = Object.keys(obj), count = keys.length;
            store[level] = (store[level] || 0) + count;
            for (var i = 0; i < count; i++) {
                var child_obj = obj[keys[i]];
                if (typeof child_obj === 'object') {
                    analytics.tools.count_object(store, level + 1, child_obj);
                }
            }
        },
        object_total: function(object) {
            if (typeof(object) !== 'object') { return; }
            var result = {}, count = 0;
            analytics.tools.count_object(result, 0, object);
            Object.keys(result).forEach(function(k,v) { count += result[k]; });
            return count;
        },
        wait: function() {
            return new Promise(function(resolve, reject) {
                if (analytics.settings.wait) {
                    analytics.log('Analytics: Waiting to load - ', analytics.settings.wait);
                    setTimeout(function() {
                        resolve();
                    },analytics.settings.wait);
                }
                else {
                    resolve();
                }
            });
        },
        wait_for_utag: function() {
            return new Promise(function(resolve, reject) {
                if (typeof(utag) !== 'undefined' && utag.hasOwnProperty('view') && utag.hasOwnProperty('link')) {
                    analytics.log('Analytics: Tealium function library ready!');
                    resolve();
                }
                else {
                    var cnt = 0, utag_wait = setInterval(function() {
                        cnt++;
                        if (cnt <= 2000) {
                            if (typeof(utag) !== 'undefined' && utag.hasOwnProperty('view') && utag.hasOwnProperty('link')) {
                                clearInterval(utag_wait);
                                analytics.log('Analytics: Tealium function library ready!');
                                resolve();
                            }
                        }
                        else {
                            clearInterval(utag_wait);
                            reject('Analytics: Waiting for utag timed out...');
                        }
                    },100);
                }
            });
        },
        wait_for_tags: function() {
            return new Promise(function(resolve, reject) {
                if (analytics.settings.wait_for_all_tags) {
                    analytics.log('Analytics: Waiting for tealium tag loader to finish...');
                    if (typeof(utag) !== 'undefined' && utag.hasOwnProperty('loader') && utag.loader.hasOwnProperty('ended')) {
                        analytics.log('Analytics: Tag loader finished, resolving promise.');
                        resolve();
                    }
                    else {
                        var cnt = 0,
                        tag_wait = setInterval(function() {
                            cnt++;
                            if (cnt <= 2000) {
                                if (typeof(utag) !== 'undefined' && utag.hasOwnProperty('loader') && utag.loader.hasOwnProperty('ended')) {
                                    if (utag.loader.ended == 1) {
                                        clearInterval(tag_wait);
                                        analytics.log('Analytics: Tag loader finished, resolving promise.');
                                        resolve();
                                    }
                                }
                            }
                            else {
                                clearInterval(tag_wait);
                                reject('Analytics: Waiting for tags timed out...');
                            }

                        },100);
                    }
                }
                else {
                    resolve();
                }
            });
        },
        device: function() {
            try {
                var ua = navigator.userAgent.toLowerCase(),
                detect = (function(s) {
                    if(s === undefined) { s = ua; } else { ua = s.toLowerCase(); }
                    if(/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) {
                        return 'tablet';
                    }
                    else {
                        if(/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(ua)) {
                            return 'phone';
                        }
                        else {
                            return 'desktop';
                        }
                    }
                });
                var r = {
                    device:detect(),
                    detect:detect,
                    isMobile: (detect() !== 'desktop'),
                    userAgent:ua
                };
                analytics.settings.device = r;
                return r;
            }
            catch (e) {
                analytics.log('Analytics: Unable to detect device platform. \n', e);
            }
        }
    },
    cart: {
        get_json: function(url) {
            return $.getJSON(url);
        },
        add_product: function(service) {
                if (typeof(service) !== 'object') { return false; }
                var is_themepack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false,
                    product_string = analytics.settings.default_product_string,
                    has_themepack = false,
                    o = { product_id: false, product_quantity: false, product_name: false, product_type: false, product_regular_price: false, product_monthly_charge_less_discount: false, product_recurring_discount: false, product_sale_price: false, product_offer_discount: false, product_order_type: false, product_rgu: false, product_contract: false, themepack: false };
                $(service).each(function(i,v) {
                    if (is_themepack) {
                        o.product_id = v.skuId, o.product_quantity = '1', o.product_name = v.name, o.product_type = 'Programming', o.product_sale_price = '0.00',  o.product_order_type = v.orderType;
                        switch(analytics.settings.checkout_type) {
                            case 'bluesky':
                                o.product_order_type = v.rguType, o.product_name = v.displayName, o.product_id = o.product_name;
                            break;
                            case 'leadform':
                            case 'student':
                                o.product_id = v.name;
                            break;
                        }
                    }
                    else {
                        switch(analytics.settings.checkout_type) {
                            case 'builder':
                                o.product_id = v.skuId, o.product_quantity = '1', o.product_name = v.name, o.product_type = v.type, o.product_regular_price = v['item.totalDisplayPrice'] !== 'undefined' ? v['item.totalDisplayPrice'] : '0.00', o.product_monthly_charge_less_discount = v.regularPriceLessRecurringDiscount, o.product_recurring_discount = v.recurringDiscount, o.product_sale_price = v.monthlyRecurringRevenue, o.product_offer_discount = v.offerDiscount, o.product_order_type = v.orderType, o.product_rgu = v.rguFlag.toString(), o.product_contract = v.contract, has_themepack = v.hasOwnProperty('tvThemePacksIncluded'), o.themepack = has_themepack ? v.tvThemePacksIncluded : false;
                            break;
                            case 'addonBuilder':
                                o.product_id = v.skuId, o.product_quantity = '1', o.product_name = v.name, o.product_type = v.type, o.product_regular_price = v['item.totalDisplayPrice'] !== 'undefined' ? v['item.totalDisplayPrice'] : '0.00', o.product_monthly_charge_less_discount = v.regularPriceLessRecurringDiscount, o.product_recurring_discount = v.recurringDiscount, o.product_sale_price = v.monthlyRecurringRevenue, o.product_offer_discount = v.offerDiscount, o.product_order_type = v.orderType, o.product_rgu = v.rguFlag.toString(), o.product_contract = v.contract, has_themepack = v.hasOwnProperty('tvThemePacksIncluded'), o.themepack = has_themepack ? v.tvThemePacksIncluded : false;
                            break;

                            case 'bluesky':
                                o.product_id = v.productId, o.product_quantity = v.quantity, o.product_name = v.analyticsItem.productName, o.product_type = v.analyticsItem.productType, o.product_regular_price = v.regularPrice, o.product_monthly_charge_less_discount = v.regularPriceLessRecurringDiscount, o.product_recurring_discount = v.recurringDiscount, o.product_sale_price = (o.product_type !== 'hardware') ? v.salePrice : v.price, o.product_offer_discount = v.offerDiscount, o.product_order_type = v.rguType, o.product_rgu = v.rguFlag.toString(), o.product_contract = v.contract, has_themepack = false;
                                if(v.hasOwnProperty('portal')) { o.product_name = v.portal; o.product_regular_price = v.portalPrice; o.product_sale_price = v.portalSalePrice; o.equipment_purchase_type = v.portalPaymentType || "recurring"; }
                            break;
                            case 'leadform':
                            case 'student':
                                o.product_id = v.offerId +'-'+ v.name, o.product_quantity = '1', o.product_name = v.name, o.product_type = v.product_type, o.product_regular_price = v.regularPrice, o.product_monthly_charge_less_discount = v.regularPriceLessRecurringDiscount, o.product_recurring_discount = v.recurringDiscount, o.product_sale_price = v.monthlyRecurringRevenue, o.product_offer_discount = v.offerDiscount, o.product_order_type = v.orderType, o.product_rgu = v.rguFlag.toString(), o.product_contract = v.contract, has_themepack = false;
                            break;

                        }
                    }
                    //A little extra cleanup on the values.
                    Object.keys(o).forEach(function(property) {
                        if (typeof(o[property]) == 'string') { o[property] = o[property].replace(/^-|\$/, ''); }
                        if (o[property] == null || o[property] === undefined) { o[property] = false; }
                        if (property == 'product_rgu' && o[property] == '0') { o[property] = false; }
                    });

                    analytics.settings.product_string.product_id.push(o.product_id);
                    analytics.settings.product_string.product_quantity.push(o.product_quantity);
                    analytics.settings.product_string.product_name.push(o.product_name);
                    analytics.settings.product_string.product_type.push(o.product_type);
                    analytics.settings.product_string.product_category.push(o.product_type);
                    analytics.settings.product_string.product_regular_price.push(o.product_regular_price);
                    analytics.settings.product_string.product_monthly_charge_less_discount.push(o.product_monthly_charge_less_discount);
                    analytics.settings.product_string.product_recurring_discount.push(o.product_recurring_discount);
                    analytics.settings.product_string.product_sale_price.push(o.product_sale_price);
                    analytics.settings.product_string.product_offer_discount.push(o.product_offer_discount);
                    analytics.settings.product_string.product_order_type.push(o.product_order_type);
                        if (o.product_order_type.includes('cross')) { analytics.settings.product_string.product_xsell.push(o.product_order_type); }
                        if (o.product_order_type.includes('upsell')) { analytics.settings.product_string.product_upsell.push(o.product_order_type); }

                    if (o.product_type == 'hardware' && o.product_sale_price >= 1) {
                        analytics.settings.product_string.equipment_purchase_type.push(o.product_name);
                    }
                    //Only new customers get an RGU.
                    /*
                    if (analytics.tools.get_storage("new_customer_type") !== 'existing') {
                        analytics.settings.product_string.product_rgu.push(o.product_rgu);
                    }*/
                    //Everyone gets an RGU on the front end.
                    analytics.settings.product_string.product_rgu.push(o.product_rgu);

                    analytics.settings.product_string.product_contract.push(o.product_contract);
                    (has_themepack) && analytics.cart.add_product(o.themepack, true);
                });
        },
        fetch_products: function(callback) {
            analytics.settings.stored_products = JSON.parse(sessionStorage.getItem('products')) || {};
            if (analytics.settings.is_thanks && Object.keys(analytics.settings.stored_products).length > 0) {
                analytics.settings.product_string = analytics.settings.stored_products;
                analytics.settings.has_products = (Object.keys(analytics.settings.stored_products).length > 0 || Object.keys(analytics.settings.product_string).length > 0);

                $.extend(utag_data, analytics.settings.stored_products);
                var billing_type = sessionStorage.getItem('billing_type');

                if (billing_type !== '') { utag_data.billing_type = billing_type; }

                callback(analytics.settings.stored_products);
                sessionStorage.removeItem('products');
                sessionStorage.removeItem('billing_type');
                return false;
            }
            else if (analytics.settings.is_checkout && !analytics.settings.is_thanks) {
                analytics.cart.get_json(analytics.settings.product_json_url).done(function(json) {
                    analytics.settings.cart = (analytics.settings.checkout_type == 'bluesky') ? json : (analytics.settings.checkout_type == 'leadform' || analytics.settings.checkout_type == 'student') ? json.lead : json.cart;
                    analytics.log(analytics.settings.cart);
                    $(analytics.settings.cart).each(function(i,o) {
                        if (o.hasOwnProperty('billMedium')) {
                            sessionStorage.setItem('billing_type', o.billMedium);
                            utag_data.billing_type = o.billMedium;
                        }

                        if (analytics.settings.checkout_type == 'bluesky') {
                            var item = o;
                            if (item.hasOwnProperty('product')) { analytics.cart.add_product(item.product); }
                            if (item.hasOwnProperty('hardware')) { analytics.cart.add_product(item.hardware); }
                            if (item.hasOwnProperty('themepacks')) { analytics.cart.add_product(item.themepacks, true); }
                            if (item.hasOwnProperty('addOns')) { analytics.cart.add_product(item.addOns); }

                            if (item.hasOwnProperty("portal")) { analytics.cart.add_product(item.portal); }
                        }
                        if (analytics.settings.checkout_type == 'builder') {
                            $(Object.keys(o)).each(function(k, v) {
                                var item = o[v];
                                if (typeof(item) == 'object') {
                                    if (item.hasOwnProperty('ordered') && item.ordered == true) {
                                        if (item.hasOwnProperty('service')) { analytics.cart.add_product(item.service); }
                                        if (item.hasOwnProperty('hardware')) { analytics.cart.add_product(item.hardware); }
                                        if (item.hasOwnProperty('streamingService')) { analytics.cart.add_product(item.streamingService); }
                                        if (item.hasOwnProperty('addons')) { analytics.cart.add_product(item.addons); }
                                    }
                                }
                            });
                        }
                        if (analytics.settings.checkout_type == 'addonBuilder') {
                            $(Object.keys(o)).each(function(k, v) {
                                var item = o[v];
                                if (typeof(item) == 'object') {
                                    if (item.hasOwnProperty('addons')) { analytics.cart.add_product(item.addons); }
                                }
                            });
                        }
                        if (analytics.settings.checkout_type == 'leadform' || analytics.settings.checkout_type == 'student') {
                            $(Object.keys(o)).each(function(k, v) {
                                    var item = o[v], ext = {
                                        product_type: v,
                                        offerId: o.offerId,
                                        formName: o.formName,
                                        formObjective: o.formObjective,
                                        formRevenue: o.formRevenue,
                                    };
                                    $.extend(item, ext);

                                    if (v.includes('Service')) { analytics.cart.add_product(item); }
                                    if (v == 'programming' || v == 'addons') { analytics.cart.add_product(item, true); }
                            });
                        }
                        sessionStorage.setItem('products', JSON.stringify(analytics.settings.product_string));
                        $.extend(utag_data, analytics.settings.product_string);
                        $.extend(utag_data, analytics.tools.clean_object(utag_data));
                    });
                }).fail(function(jqxhr, textStatus, error){
                    analytics.log('Analytics: Failed to fetch products in '+ analytics.settings.checkout_type + ' fetch_products');
                    analytics.log(analytics.settings.product_json_url);
                    analytics.log(error);
                }).always(function(){
                    analytics.settings.has_products = (Object.keys(analytics.settings.stored_products).length > 0 || Object.keys(analytics.settings.product_string).length > 0);
                    callback(analytics.settings.product_string || {});
                });
            }
            else {
                callback(false);
            }
        },
        clear_products: function(obj) {
            $(Object.keys(obj)).each(function(i, v) {
                if (v.includes('product_') && typeof(obj[v] == 'object'))  {
                    obj[v] = [];
                }
            });
            return obj;
        },
        clear_cart_events: function() {
            delete utag_data["event_name:scOpenAction"]; //Removce scOpen
            delete utag_data["event_name:lead form load"]; //Remove scCheckout
            delete utag_data["event_name:scAddAction"]; //Remove scAdd
            delete utag_data["event_name:scRemoveAction"]; //Remove scRemove
            delete utag_data["event_name:form_step"]; //Remove event26
            //delete utag_data.form_step; //Remove evar15
        },
        update_products: function(cart) {
            analytics.settings.cart = cart;
            analytics.settings.product_string = analytics.cart.clear_products(analytics.settings.product_string);
            utag_data = analytics.cart.clear_products(utag_data);

            $(cart).each(function(i,o) {
                if (analytics.settings.checkout_type == 'builder') {
                    $(Object.keys(o)).each(function(k, v) {
                        var item = o[v];
                        if (typeof(item) == 'object') {
                            if (item.hasOwnProperty('ordered') && item.ordered == true) {
                                if (item.hasOwnProperty('service')) { analytics.cart.add_product(item.service); }
                                if (item.hasOwnProperty('hardware')) { analytics.cart.add_product(item.hardware); }
                                if (item.hasOwnProperty('streamingService')) { analytics.cart.add_product(item.streamingService); }
                                if (item.hasOwnProperty('addons')) { analytics.cart.add_product(item.addons); }
                            }
                        }
                    });
                }
                if (analytics.settings.checkout_type == 'addonBuilder') {
                    $(Object.keys(o)).each(function(k, v) {
                        var item = o[v];
                        if (typeof(item) == 'object') {
                            if (item.hasOwnProperty('addons')) { analytics.cart.add_product(item.addons); }
                        }
                    });
                }
                if (analytics.settings.checkout_type == "bluesky") {
                    var item = o;
                    if (item.hasOwnProperty("product")) { analytics.cart.add_product(item.product); }
                    if (item.hasOwnProperty("hardware")) { analytics.cart.add_product(item.hardware); }
                    if (item.hasOwnProperty("themepacks")) { analytics.cart.add_product(item.themepacks, true); }
                    if (item.hasOwnProperty("addOns")) { analytics.cart.add_product(item.addOns); }
                    if (item.hasOwnProperty("portal")) { analytics.cart.add_product(item.portal); }
                }
            });

            analytics.settings.stored_products = analytics.settings.product_string;
            sessionStorage.setItem('products', JSON.stringify(analytics.settings.product_string));
            analytics.settings.has_products = (Object.keys(analytics.settings.stored_products).length > 0 || Object.keys(analytics.settings.product_string).length > 0);

            $.extend(utag_data, analytics.settings.product_string);
            $.extend(utag_data, analytics.tools.clean_object(utag_data));

            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            callback && callback();
        }
    }
};
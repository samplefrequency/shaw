/**
 * @author Mike Barkemeyer <mike.barkemeyer@sjrb.ca>
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


/* **************** TEALIUM OVERRIDES ************************* */
window.tracking_obj_ready = false;
setInterval(function(){window.clickTrackEvent = false;},100);

window.utag_cfg_ovrd = {noview:true};
/* **************** END TEALIUM OVERRIDES ************************* */


/* **************** SHA-256 Hashing Function ************************* */
/**
 * [js-sha256]{@link https://github.com/emn178/js-sha256}
 *
 * @version 0.6.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
!function(){"use strict";function t(t,i){i?(p[0]=p[16]=p[1]=p[2]=p[3]=p[4]=p[5]=p[6]=p[7]=p[8]=p[9]=p[10]=p[11]=p[12]=p[13]=p[14]=p[15]=0,this.blocks=p):this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],t?(this.h0=3238371032,this.h1=914150663,this.h2=812702999,this.h3=4144912697,this.h4=4290775857,this.h5=1750603025,this.h6=1694076839,this.h7=3204075428):(this.h0=1779033703,this.h1=3144134277,this.h2=1013904242,this.h3=2773480762,this.h4=1359893119,this.h5=2600822924,this.h6=528734635,this.h7=1541459225),this.block=this.start=this.bytes=0,this.finalized=this.hashed=!1,this.first=!0,this.is224=t}function i(i,r,e){var n="string"!=typeof i;if(n){if(null===i||void 0===i)throw h;i.constructor===s.ArrayBuffer&&(i=new Uint8Array(i))}var o=i.length;if(n){if("number"!=typeof o||!Array.isArray(i)&&(!a||!ArrayBuffer.isView(i)))throw h}else{for(var f,u=[],o=i.length,c=0,y=0;o>y;++y)f=i.charCodeAt(y),128>f?u[c++]=f:2048>f?(u[c++]=192|f>>6,u[c++]=128|63&f):55296>f||f>=57344?(u[c++]=224|f>>12,u[c++]=128|f>>6&63,u[c++]=128|63&f):(f=65536+((1023&f)<<10|1023&i.charCodeAt(++y)),u[c++]=240|f>>18,u[c++]=128|f>>12&63,u[c++]=128|f>>6&63,u[c++]=128|63&f);i=u}i.length>64&&(i=new t(r,!0).update(i).array());for(var p=[],l=[],y=0;64>y;++y){var d=i[y]||0;p[y]=92^d,l[y]=54^d}t.call(this,r,e),this.update(l),this.oKeyPad=p,this.inner=!0,this.sharedMemory=e}var h="input is invalid type",s="object"==typeof window?window:{},r=!s.JS_SHA256_NO_NODE_JS&&"object"==typeof process&&process.versions&&process.versions.node;r&&(s=global);var e=!s.JS_SHA256_NO_COMMON_JS&&"object"==typeof module&&module.exports,n="function"==typeof define&&define.amd,a="undefined"!=typeof ArrayBuffer,o="0123456789abcdef".split(""),f=[-2147483648,8388608,32768,128],u=[24,16,8,0],c=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],y=["hex","array","digest","arrayBuffer"],p=[];(s.JS_SHA256_NO_NODE_JS||!Array.isArray)&&(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)});var l=function(i,h){return function(s){return new t(h,!0).update(s)[i]()}},d=function(i){var h=l("hex",i);r&&(h=v(h,i)),h.create=function(){return new t(i)},h.update=function(t){return h.create().update(t)};for(var s=0;s<y.length;++s){var e=y[s];h[e]=l(e,i)}return h},v=function(t,i){var s=require("crypto"),r=require("buffer").Buffer,e=i?"sha224":"sha256",n=function(i){if("string"==typeof i)return s.createHash(e).update(i,"utf8").digest("hex");if(null===i||void 0===i)throw h;return i.constructor===ArrayBuffer&&(i=new Uint8Array(i)),Array.isArray(i)||ArrayBuffer.isView(i)||i.constructor===r?s.createHash(e).update(new r(i)).digest("hex"):t(i)};return n},A=function(t,h){return function(s,r){return new i(s,h,!0).update(r)[t]()}},w=function(t){var h=A("hex",t);h.create=function(h){return new i(h,t)},h.update=function(t,i){return h.create(t).update(i)};for(var s=0;s<y.length;++s){var r=y[s];h[r]=A(r,t)}return h};t.prototype.update=function(t){if(!this.finalized){var i="string"!=typeof t;if(i){if(null===t||void 0===t)throw h;t.constructor===s.ArrayBuffer&&(t=new Uint8Array(t))}var r=t.length;if(!(!i||"number"==typeof r&&(Array.isArray(t)||a&&ArrayBuffer.isView(t))))throw h;for(var e,n,o=0,f=this.blocks;r>o;){if(this.hashed&&(this.hashed=!1,f[0]=this.block,f[16]=f[1]=f[2]=f[3]=f[4]=f[5]=f[6]=f[7]=f[8]=f[9]=f[10]=f[11]=f[12]=f[13]=f[14]=f[15]=0),i)for(n=this.start;r>o&&64>n;++o)f[n>>2]|=t[o]<<u[3&n++];else for(n=this.start;r>o&&64>n;++o)e=t.charCodeAt(o),128>e?f[n>>2]|=e<<u[3&n++]:2048>e?(f[n>>2]|=(192|e>>6)<<u[3&n++],f[n>>2]|=(128|63&e)<<u[3&n++]):55296>e||e>=57344?(f[n>>2]|=(224|e>>12)<<u[3&n++],f[n>>2]|=(128|e>>6&63)<<u[3&n++],f[n>>2]|=(128|63&e)<<u[3&n++]):(e=65536+((1023&e)<<10|1023&t.charCodeAt(++o)),f[n>>2]|=(240|e>>18)<<u[3&n++],f[n>>2]|=(128|e>>12&63)<<u[3&n++],f[n>>2]|=(128|e>>6&63)<<u[3&n++],f[n>>2]|=(128|63&e)<<u[3&n++]);this.lastByteIndex=n,this.bytes+=n-this.start,n>=64?(this.block=f[16],this.start=n-64,this.hash(),this.hashed=!0):this.start=n}return this}},t.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var t=this.blocks,i=this.lastByteIndex;t[16]=this.block,t[i>>2]|=f[3&i],this.block=t[16],i>=56&&(this.hashed||this.hash(),t[0]=this.block,t[16]=t[1]=t[2]=t[3]=t[4]=t[5]=t[6]=t[7]=t[8]=t[9]=t[10]=t[11]=t[12]=t[13]=t[14]=t[15]=0),t[15]=this.bytes<<3,this.hash()}},t.prototype.hash=function(){var t,i,h,s,r,e,n,a,o,f,u,y=this.h0,p=this.h1,l=this.h2,d=this.h3,v=this.h4,A=this.h5,w=this.h6,b=this.h7,g=this.blocks;for(t=16;64>t;++t)r=g[t-15],i=(r>>>7|r<<25)^(r>>>18|r<<14)^r>>>3,r=g[t-2],h=(r>>>17|r<<15)^(r>>>19|r<<13)^r>>>10,g[t]=g[t-16]+i+g[t-7]+h<<0;for(u=p&l,t=0;64>t;t+=4)this.first?(this.is224?(a=300032,r=g[0]-1413257819,b=r-150054599<<0,d=r+24177077<<0):(a=704751109,r=g[0]-210244248,b=r-1521486534<<0,d=r+143694565<<0),this.first=!1):(i=(y>>>2|y<<30)^(y>>>13|y<<19)^(y>>>22|y<<10),h=(v>>>6|v<<26)^(v>>>11|v<<21)^(v>>>25|v<<7),a=y&p,s=a^y&l^u,n=v&A^~v&w,r=b+h+n+c[t]+g[t],e=i+s,b=d+r<<0,d=r+e<<0),i=(d>>>2|d<<30)^(d>>>13|d<<19)^(d>>>22|d<<10),h=(b>>>6|b<<26)^(b>>>11|b<<21)^(b>>>25|b<<7),o=d&y,s=o^d&p^a,n=b&v^~b&A,r=w+h+n+c[t+1]+g[t+1],e=i+s,w=l+r<<0,l=r+e<<0,i=(l>>>2|l<<30)^(l>>>13|l<<19)^(l>>>22|l<<10),h=(w>>>6|w<<26)^(w>>>11|w<<21)^(w>>>25|w<<7),f=l&d,s=f^l&y^o,n=w&b^~w&v,r=A+h+n+c[t+2]+g[t+2],e=i+s,A=p+r<<0,p=r+e<<0,i=(p>>>2|p<<30)^(p>>>13|p<<19)^(p>>>22|p<<10),h=(A>>>6|A<<26)^(A>>>11|A<<21)^(A>>>25|A<<7),u=p&l,s=u^p&d^f,n=A&w^~A&b,r=v+h+n+c[t+3]+g[t+3],e=i+s,v=y+r<<0,y=r+e<<0;this.h0=this.h0+y<<0,this.h1=this.h1+p<<0,this.h2=this.h2+l<<0,this.h3=this.h3+d<<0,this.h4=this.h4+v<<0,this.h5=this.h5+A<<0,this.h6=this.h6+w<<0,this.h7=this.h7+b<<0},t.prototype.hex=function(){this.finalize();var t=this.h0,i=this.h1,h=this.h2,s=this.h3,r=this.h4,e=this.h5,n=this.h6,a=this.h7,f=o[t>>28&15]+o[t>>24&15]+o[t>>20&15]+o[t>>16&15]+o[t>>12&15]+o[t>>8&15]+o[t>>4&15]+o[15&t]+o[i>>28&15]+o[i>>24&15]+o[i>>20&15]+o[i>>16&15]+o[i>>12&15]+o[i>>8&15]+o[i>>4&15]+o[15&i]+o[h>>28&15]+o[h>>24&15]+o[h>>20&15]+o[h>>16&15]+o[h>>12&15]+o[h>>8&15]+o[h>>4&15]+o[15&h]+o[s>>28&15]+o[s>>24&15]+o[s>>20&15]+o[s>>16&15]+o[s>>12&15]+o[s>>8&15]+o[s>>4&15]+o[15&s]+o[r>>28&15]+o[r>>24&15]+o[r>>20&15]+o[r>>16&15]+o[r>>12&15]+o[r>>8&15]+o[r>>4&15]+o[15&r]+o[e>>28&15]+o[e>>24&15]+o[e>>20&15]+o[e>>16&15]+o[e>>12&15]+o[e>>8&15]+o[e>>4&15]+o[15&e]+o[n>>28&15]+o[n>>24&15]+o[n>>20&15]+o[n>>16&15]+o[n>>12&15]+o[n>>8&15]+o[n>>4&15]+o[15&n];return this.is224||(f+=o[a>>28&15]+o[a>>24&15]+o[a>>20&15]+o[a>>16&15]+o[a>>12&15]+o[a>>8&15]+o[a>>4&15]+o[15&a]),f},t.prototype.toString=t.prototype.hex,t.prototype.digest=function(){this.finalize();var t=this.h0,i=this.h1,h=this.h2,s=this.h3,r=this.h4,e=this.h5,n=this.h6,a=this.h7,o=[t>>24&255,t>>16&255,t>>8&255,255&t,i>>24&255,i>>16&255,i>>8&255,255&i,h>>24&255,h>>16&255,h>>8&255,255&h,s>>24&255,s>>16&255,s>>8&255,255&s,r>>24&255,r>>16&255,r>>8&255,255&r,e>>24&255,e>>16&255,e>>8&255,255&e,n>>24&255,n>>16&255,n>>8&255,255&n];return this.is224||o.push(a>>24&255,a>>16&255,a>>8&255,255&a),o},t.prototype.array=t.prototype.digest,t.prototype.arrayBuffer=function(){this.finalize();var t=new ArrayBuffer(this.is224?28:32),i=new DataView(t);return i.setUint32(0,this.h0),i.setUint32(4,this.h1),i.setUint32(8,this.h2),i.setUint32(12,this.h3),i.setUint32(16,this.h4),i.setUint32(20,this.h5),i.setUint32(24,this.h6),this.is224||i.setUint32(28,this.h7),t},i.prototype=new t,i.prototype.finalize=function(){if(t.prototype.finalize.call(this),this.inner){this.inner=!1;var i=this.array();t.call(this,this.is224,this.sharedMemory),this.update(this.oKeyPad),this.update(i),t.prototype.finalize.call(this)}};var b=d();b.sha256=b,b.sha224=d(!0),b.sha256.hmac=w(),b.sha224.hmac=w(!0),e?module.exports=b:(s.sha256=b.sha256,s.sha224=b.sha224,n&&define(function(){return b}))}();
/* **************** END SHA-256 Hashing Function ************************* */

if (typeof(jQuery) == 'undefined') { throw new Error('Analytics Script & Tealium required jQuery.'); }
var SHAW = window.SHAW || {};

var default_utag_data = { page_name : "", page_section : "", referring_url : "", hour_of_day : "", site_name : "", user_agent_string : "", site_version : "", site_language : "", user_login_state : "", account_id : "", home_postal_code : "", platform : "", page_section_l2 : "", page_section_l3 : "", page_section_l4 : "", page_section_l5 : "", ab_testing_page_type : "", taxonomy_level : "", attribution_id : "", employee_id : "", content_template_name : "", user_type : "", purchase_id : "", equipment_purchase_type : "", account_info : "", account_products : "", serviceability_type : "", internal_search_type : "", error_code : "", ai_search_keyword : "", serviceability_details : "", number_search_results : "", lead_form_name : "", account_modified : "", shaw_id : "", cross_up_sell : "", shaw_id_category : "", install_method : "", request_id : "", survey_id : "", builder_type : "", site_error : "", upsell_revenue : "", xsell_revenue : "", rgus : "", one_time_charges : "", tv_channels : "", transaction_id : "", prod_view : "", email_optin : "", has_shaw_id : "", ad_complete : "", ad_start : "", buffer_complete : "", complete : "", video_load : "", link_name : "", navigation_click : "", navigationAction : "", page_load_flag : "", event_name : "", shaw_page_url : "", emailAction : "", socialAction : "", videoAction : "", addonAction : "", 'order_currency' : "", s_account : "", monthly_recurring_revenue : "", product_order_type : "", buffer_start : "", chapter_complete : "", chapter_start : "", video_pause : "", video_play : "", seek_complete : "", seek_start : "", video_unload : "", order_id : "", order_total : "", order_subtotal : "", order_shipping : "", order_tax : "", order_promo_code : "", customer_id : "", customer_city : "", customer_state : "", customer_zip : "", customer_country : "", product_id : "", product_name : "", product_brand : "", product_category : "", product_subcategory : "", product_quantity : "", product_regular_price : "", product_discount : "", marketing_cloud_id : "", eoid : "", serviceability_status : "", video_25 : "", video_50 : "", video_75 : "", file_downloads : "", o2_tag_sitename : "", o2_tag_page_value : "", product_type : "", product_offer_price : "", promo_flag : "", monthly_charge_regular_price : "", product_monthly_charge_less_discount : "", product_recurring_discount : "", offer_discount : "", service_lob : "", customer_type : "", lead_form_loads : "", install_method_revenue : "", twitter_event : "", twitter_value : "", timestamp : "", sc_events : "", internal_search_term : "", url : "", chat_id : "", internal_tracking_code : "", lead_form_action : "", product_offer_discount : "", content_engagement_type : "", video_view_segment : "", offer_position : "", genesis_clicktale : "", push_notification_status : "", service_agreement_flag : "", apple_pay_status : "", serviceability_postal_code : "", campaign_type : "", cid : "", lead_form_product_name : "", lead_form_product_type : "", province : "", rgus_event : "", product_rgu : "", product_upsell : "", product_xsell : "", partner_info : "", kenshoo_id : "", kenshoo_order_value : "", kenshoo_lob_count : "", product_sale_price : "", form_name : "", form_step : "", offer_id : "", product_contract : "", billing_postal_code : "", equipment_purchase_revenue : "", installation_charges : "", internal_promo_offer : "", internal_promo_position : "", internal_promo_impression : "", internal_promo_click : "", link_href : "", builderAction : "", seo_cities : "", seo_province : "", new_repeat : "", facebook_event_type : "", facebook_event_parameters_content_name : "", facebook_lead_event_parameter_name : "", facebook_registration_event_parameter_name : "", product_credit : "", equipment_regular_price : "", optimizely : "", 'dom.url': '', };
if (typeof(utag_data) !== 'undefined') {
    $.extend(default_utag_data, utag_data);
}

var utag_data = default_utag_data;
window.utag_data = default_utag_data;

(function($, SHAW) {
    $(document).ready(function() {
        var analytics = {
            settings: {
                debug: (localStorage.getItem('shaw-debug') === 'true') || false,
                manual_view: false,
                view_complete: false,
                allow_double_fire: false,
                bsps: 0,

                //Remap click events from legacy to UTS.
                event_remap: {
                    'navigation-element': 'navigationAction',
                    'left-navigation': 'navigationAction',
                    'link-event': 'navigationAction',
                    'link-action': 'navigationAction',
                    'download-app': 'navigationAction',
                    'download-document': 'navigationAction',
                    'builder-launch': 'builderAction',
                    'builder-click': 'builderAction',
                    'internal-search': 'resultAction'
                },

                //Associate Tealium profile to hostname for auto loading.
                profile_map: [
                    {
                        profile: 'uts-shaw-consumer',
                        hostname: [
                            'localhost', 'www.shaw.ca', 'shop.shaw.ca', 'shawca-dev.shaw.ca', 'shawca-tst1.shaw.ca', 'shawca-tst2.shaw.ca', 'shawca-tst3.shaw.ca', 'shawca-pre.shaw.ca', 'pre-web-shawca.shaw.ca', 'prd-web-shawca-05.dmz.ad', 'prd-web-shawca-06.dmz.ad', 'prd-web-shawca-07.dmz.ad', 'prd-web-shawca-08.dmz.ad'
                        ]
                    },
                    {
                        profile: 'uts-shaw-business',
                        hostname: [
                            'business.shaw.ca', 'shawbusiness.ca', 'shawbiz-ext.pre.dsl.aws.shaw.ca'
                        ]
                    },
                    {
                        profile: 'uts-shaw-direct',
                        hostname: [
                            'shawdirect.ca', 'www.shaw.ca', 'shop.shawdirect.ca'
                        ]
                    },
                    {
                        profile: 'uts-shaw-myaccount',
                        hostname: [
                            'my.shaw.ca', 'my.shawdirect.ca', 'myaccount.shaw.ca', 'register.shaw.ca'
                        ]
                    }
                ]
            },
            log: function() {
                if (analytics.settings.debug && typeof(console) !== 'undefined') {
                    console.log.apply(console, arguments);
                }
            },
            init: function() {
                analytics.log('Analytics: Initializing...', 'Executing init...');
                var eoId = analytics.tools.get_url_param('eoId') ? '?eoId=' + analytics.tools.get_url_param('eoId') : '';
                analytics.settings.pages = {
                    builder: {
                        checkout_pages: [
                            '/store/builder/builder.jsp',
                            '/store/builder/addOnsBuilder.jsp'
                        ],
                        thanks: [
                            '/store/checkout/thankYou.jsp'
                        ],
                        form_steps: {
                            '/store/builder/builder.jsp': 'Cart Start',
                            '/store/checkout/step1.jsp' : 'Cart Start',
                            '/store/checkout/step2.jsp' : 'Installation',
                            '/store/checkout/step3.jsp' : 'Review Submit',
                        },
                        json: '/store/planBuilder/cart/cart.jsp'
                    },

                    bluesky: {
                        checkout_pages: [
                            '/store/blueskytv/configurator.jsp', '/store/cart/orderLeadForm3.jsp'
                        ],
                        thanks: [
                            '/store/cart/orderLeadFormThankyou2.jsp'
                        ],
                        form_steps: {
                            '/store/blueskytv/configurator.jsp' : 'Cart Start',
                            '/store/cart/orderLeadForm3.jsp' : 'Contact Info',
                        },
                        lead_form_name: 'lead-form|bluesky',
                        json: '/store/xhr/data/blueskytv/getOrderSummaryJSON.jsp'
                    },
                    leadform: {
                        checkout_pages: [
                            '/store/cart/orderLeadForm2.jsp', '/store/cart/orderLeadForm-contactDetails.jsp', '/store/campaign/student-p2.jsp'
                        ],
                        thanks: [
                            '/store/cart/orderLeadFormThankyou.jsp', '/store/cart/orderLeadForm-thankYou.jsp'
                        ],
                        form_steps: {
                            '/store/cart/orderLeadForm2.jsp' : 'Cart Start',
                            '/store/cart/orderLeadForm-contactDetails.jsp' : 'Cart Start',
                            '/store/cart/orderLeadForm-serviceAddress.jsp' : 'Service Address',
                            '/store/cart/orderLeadForm-billingInfo.jsp' : 'Billing Info',
                            '/store/cart/orderLeadForm-reviewSubmit.jsp' : 'Review Submit',
                            '/store/cart/orderLeadForm-valuePlan.jsp' : 'Value Plan',
                        },
                        lead_form_name: "lead-form|"+(analytics.tools.get_url_param('eoId') || 'leadform'),
                        json: '/store/cart/leadTrackingJson.jsp' + eoId
                    },
                    student: {
                        checkout_pages: [
                            '/store/campaign/student-p2.jsp'
                        ],
                        thanks: [
                            '/store/campaign/student-thankyou.jsp'
                        ],
                        form_steps: {
                            '/store/campaign/student-p1.jsp' : 'Cart Start',
                            '/store/campaign/student-p2.jsp' : 'Contact Info',
                            '/store/campaign/student-thankyou.jsp' : 'Thankyou'
                        },
                        lead_form_name: "lead-form|"+($('body').data('eoid') || 'student'),
                        json: '/store/cart/leadTrackingJson.jsp?eoId='+$('body').data('eoid')
                    },
                };

                //Define product string containers
                analytics.settings.default_product_string = {
                    product_id: [], //SKU or unique identifier
                    product_quantity: [], //Quantity (Usually 1)
                    product_sale_price: [], //Actual price item was sold for
                    product_name: [], //Name of product
                    product_type: [],  //Programing, internet, tvservice etc...
                    product_regular_price: [], //Regular price of the product before discounts
                    product_offer_discount:[], //Discount Amount
                    product_monthly_charge_less_discount:[], //Monthly Charges without discounts
                    product_recurring_discount:[], //Monthly Discount
                    equipment_purchase_type: [],
                    product_contract: [], //Month to Month, 2YVP etc...
                    product_order_type: [], //CrossSell, UpSell, Aquisition
                    product_upsell: [],
                    product_xsell: [],
                    product_rgu: [], //0,1
                    product_category: [],
                };
                analytics.settings.product_string = analytics.settings.default_product_string;
                analytics.settings.server_env = analytics.tools.server_env();
                analytics.settings.env = analytics.tools.env();
                analytics.settings.path = document.location.pathname.split('/').filter(function(v){return v;});
                analytics.settings.depth = analytics.settings.path.length;
                analytics.settings.tealium_profile = analytics.tealium.get_profile();
                analytics.settings.is_checkout = false;
                analytics.settings.is_thanks = false;

                if (analytics.tools.get_location().length >= 13) {
                    analytics.settings.user_info = {
                        postal_code: sha256(analytics.settings.user_location[2]),
                        half_postal_code: analytics.settings.user_location[2].slice(0,3),
                        city: analytics.settings.user_location[3],
                        province: analytics.settings.user_location[4],
                        address: sha256(analytics.settings.user_location[5] + ' ' + analytics.settings.user_location[6]),
                        ip: sha256(analytics.settings.user_location[10]),
                        isp: analytics.settings.user_location[13]
                    };
                }


                Object.keys(analytics.settings.pages).forEach(function(k,v){
                    if ($.inArray(document.location.pathname, analytics.settings.pages[k].checkout_pages) > -1 || $.inArray(document.location.pathname, analytics.settings.pages[k].thanks) > -1) {
                        analytics.settings.checkout_type = k;
                        analytics.settings.product_json_url = analytics.settings.pages[k].json;
                    }
                    if ($.inArray(document.location.pathname, analytics.settings.pages[k].checkout_pages) > -1) { analytics.settings.is_checkout = true; }
                    if ($.inArray(document.location.pathname, analytics.settings.pages[k].thanks) > -1) { analytics.settings.is_thanks = true; }
                    if (analytics.settings.pages[k].hasOwnProperty('form_steps') && analytics.settings.pages[k].form_steps.hasOwnProperty(document.location.pathname)) {
                        analytics.settings.checkout_type = k;
                        analytics.settings.product_json_url = analytics.settings.pages[k].json;
                        analytics.settings.is_checkout = true;
                        analytics.settings.is_form_step = true;
                        analytics.settings.form_step = analytics.settings.pages[k].form_steps[document.location.pathname];
                        analytics.settings.lead_form_name = analytics.settings.pages[k].lead_form_name;
                    }
                });

                analytics.cart.fetch_products(function(products){
                    $(document).trigger('Analytics.BeforeTealiumReady', analytics);
                    if (typeof(utag) == 'undefined') {
                        analytics.tools.inject_script('//tags.tiqcdn.com/utag/shaw/'+analytics.settings.tealium_profile+'/' + analytics.settings.env + '/utag.js')
                        .done(function(script, textStatus) {
                            analytics.log('Analytics: Tealium injected. \n Profile: '+ analytics.settings.tealium_profile + '\n Environment: '+ analytics.settings.env);
                            analytics.settings.utag_view_prevented = true;
                            $(document).trigger('Analytics.tealiumReady', analytics);
                            if (!analytics.settings.manual_view) { analytics.tealium.view(utag_data); }
                        })
                        .fail(function(jqxhr, settings, exception) {
                            analytics.log(exception);
                            $(document).trigger('Analytics.tealiumError', exception);
                        });
                    }
                    else {
                        analytics.settings.utag_view_prevented = false;
                        analytics.log('Analytics: Tealium already loaded.. \n\nWarning: Possibly unable to modify utag_data object before utag.view() \nMove script up in document to execute before tealium \n');
                        $(document).trigger('Analytics.tealiumReady', analytics);
                    }
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
                    if (!analytics.settings.utag_view_prevented && !analytics.settings.allow_double_fire) {
                        analytics.log('Analytics: Possible duplicate utag.view() prevented.');
                        analytics.settings.view_complete = false;
                        return false;
                    }
                    analytics.tealium.set_default_data(data);
                    Object.keys(data).forEach((key) => (data[key] == null || data[key] == '') && delete data[key]);
                    data = analytics.tools.clean_object(data);

                    utag.view(data, function() {
                        analytics.log('Analytics: Tealium view complete!');
                        analytics.settings.view_complete = true;
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
                        user_type: utag_data.user_type ||  analytics.tools.get_cookie("new_customer_type") ||  'unknown',
                        page_section: utag_data.page_section || ((analytics.settings.path.length == 1) && (analytics.settings.path[0] == 'store')) ? 'homepage' : analytics.settings.path[0],
                        eoid: utag_data.eoid || analytics.tools.get_url_param('eoId'),
                        taxonomy_level: utag_data.taxonomy_level || analytics.settings.depth.toString(),
                        user_login_state: utag_data.user_login_state || analytics.tools.get_cookie("hasLoggedIn") || 'logged-out',
                        home_postal_code: utag_data.home_postal_code || analytics.settings.user_info.postal_code,
                        province: utag_data.province || analytics.settings.user_info.province,

                        //Additional data
                        visitor_postal_code: analytics.settings.user_info.postal_code,
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
                            data.form_name = utag_data.form_name || analytics.settings.checkout_type;
                            data.form_step = utag_data.form_step || 'cart start';
                            data['event_name:lead form load'] = 'trigger';
                        }

                        if (analytics.settings.is_form_step) {
                            if ((/^cart start/i).test(analytics.settings.form_step)) {
                                data['event_name:scOpenAction'] = 'trigger';

                                if (analytics.settings.has_products) {
                                    data['event_name:scAddAction'] = 'trigger';
                                }
                            }

                            data.form_step = utag_data.form_step || analytics.settings.form_step;
                            data['event_name:form_step'] = 'trigger';
                        }


                        if (analytics.settings.has_products && analytics.settings.is_thanks) {
                            delete data['event_name:scOpenAction'];
                            delete data['event_name:scRemoveAction'];
                            delete data['event_name:scAddAction'];

                            data.form_name = utag_data.form_name || analytics.settings.checkout_type;
                            data.form_step = utag_data.form_step || 'Thankyou';
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
                    analytics.tools.secure_data();
                    $.extend(object, data);
                },
                get_profile: function() {
                        $(analytics.settings.profile_map).each(function(i, v) {
                            if (($.inArray(document.location.hostname, v.hostname) > -1)) {
                                analytics.settings.tealium_profile =  v.profile;
                                return false;
                            }
                        });
                        //Helper for obscure profiles
                        if (document.location.hostname == 'shop.shaw.ca') {
                            if (document.location.pathname.includes('/business/')) {
                                analytics.settings.tealium_profile = 'uts-shaw-business';
                            }
                        }
                    return analytics.settings.tealium_profile;
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
                env: function() {
                    var h = document.location.hostname;
                    return (h.includes('dev') || h.includes('localhost') || h.includes('127.0.0.1')) ? 'dev' : (h.includes('pre') || h.includes('tst')) ? 'qa' : 'prod';
                },
                server_env: function() {
                    var comments = $('*:not("iframe")').contents().filter(function(){ return this.nodeType == 8;});
                    analytics.settings.is_ektron = false;

                    $(comments).each(function(i,v) {
                        if (v.textContent.trim() == 'build:template') { analytics.settings.is_ektron = true; return false; }
                    });
                    analytics.settings.is_ion = $('body').attr('id') == 'ball_page_body';
                    analytics.settings.is_atg = $('meta[name="atg-server"]').length;
                    analytics.settings.server_env = analytics.settings.is_ion ? 'ion' : analytics.settings.is_ektron ? 'ektron' : analytics.settings.is_atg ? 'atg' : 'unknown';
                    return analytics.settings.server_env;
                },
                uniq: function(a) {
                    var seen = {};
                    return a.filter(function(item) {
                        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
                    });
                },
                inject_script: function(src) {
                    return $.getScript(src);
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
                    match = document.cookie.match(new RegExp(name + '=([^;]+)'));
                    if (match) { return match[1]; }
                    else { return false; }
                },
                set_cookie: function(name, value) {
                    document.cookie = name +'='+ value +'; Path=/;';
                },
                delete_cookie(name) {
                    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                },
                wait_until_exists: function(selector, callback) {
                    if ($(selector).length) { callback(); }
                    else {
                    setTimeout(function() {
                        analytics.tools.wait_until_exists(selector, callback);
                    }, 100);
                    }
                },
                set_customer_cookie: function(type) {
                    analytics.tools.set_cookie("new_customer_type", type);
                    utag_data.user_type = type;
                    analytics.log('Analytics: Setting customer type: '+ type);
                },
                set_customer_type: function(selected){
                    switch(selected) {
                        case 'notNewCustomer': case 'currentNoDrawer': case 'currentNo': case 'existingCust_no':
                        case 'modal_currentNo': case 'drawer_currentNo':
                            analytics.tools.set_customer_cookie('new');
                            analytics.settings.user_type = 'new';
                        break;
                        case 'newCustomer': case 'currentYesDrawer': case 'currentYes': case 'existingCust_yes': case 'installDateTime': case 'noInstallDateTime':
                        case 'modal_currentYes': case 'drawer_currentYes':
                            analytics.tools.set_customer_cookie('existing');
                            analytics.settings.user_type = 'existing';
                        break;
                    }
                    return true;
                },
                get_location: function() {
                    var user_cookie = analytics.tools.get_cookie('location').split("!"), location = [];
                    user_cookie.forEach(function(e){
                        location.push(e.replace(/^\{|\}$/g,""));
                    });
                    analytics.settings.user_location = location;
                    return location;
                },
                get_language: function() {
                    return analytics.settings.path[0].includes('english') ? 'en' : analytics.settings.path[0].includes('francais') ? 'fr' : (navigator.language.substring(0,2) || navigator.userLanguage.substring(0,2));
                },
                get_pagename: function pagename() {
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
                        return pagename
                    }
                    else {
                        return 'pagename-not-set-in-content';
                    }
                },
                secure_data: function() {
                    delete utag_data['cp.location'];

                    if (typeof(utag_data.home_postal_code) !== 'undefined' && utag_data.home_postal_code.length <= 7) {
                        utag_data.home_postal_code = sha256(utag_data.home_postal_code);
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
                            if (analytics.tools.get_cookie("new_customer_type") == 'existing') { o.product_rgu = '0'; }
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
                        callback(analytics.settings.stored_products);
                        sessionStorage.removeItem('products');
                        return false;
                    }
                    else if (analytics.settings.is_checkout) {
                        analytics.cart.get_json(analytics.settings.product_json_url).done(function(json) {
                            analytics.settings.cart = (analytics.settings.checkout_type == 'bluesky') ? json : (analytics.settings.checkout_type == 'leadform' || analytics.settings.checkout_type == 'student') ? json.lead : json.cart;
                            analytics.log(analytics.settings.cart);
                            $(analytics.settings.cart).each(function(i,o) {
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
                                            if (v == 'programming') { analytics.cart.add_product(item, true); }
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
                    delete utag_data.form_step; //Remove evar15
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
        window.analytics = analytics;
        SHAW.Analytics = analytics;
        analytics.init();

        $(document).on('click', '*[data-event]:not([data-trk=false])', function(e){
            try {
                analytics.click_init({event: e, element: $(this)});
                if (analytics.settings.type) {
                    switch(analytics.settings.type) {
                        case 'a':
                            if (analytics.settings.is_internal && $(analytics.settings.element).hasClass('form-submit') && !analytics.settings.is_valid) {
                                analytics.track.form_error();
                                break;
                            }
                            analytics.track.click();
                        break;
                        case 'input':
                            if ($(analytics.settings.element).attr('type') == 'submit' && !analytics.settings.is_valid) {
                                analytics.track.form_error();
                                break;
                            }
                            analytics.track.click();
                        break;
                        default:
                            analytics.track.click();
                    }
                }
            }
            catch (e) {
                analytics.log(e);
            }
        });
        $(document).on('change ifChecked', 'input[type="radio"]', function(e) {
            analytics.tools.set_customer_type($(this).attr('id'));
        });


        //Shaw Callback functions
        window.shc = {
            cartEvent: function(namespace, data) {
                analytics.log('Analytics: SHC EVENT');
                delete utag_data["event_name:scOpenAction"];
                delete utag_data["event_name:scRemoveAction"];
                delete utag_data["event_name:scAddAction"];

                if (namespace.includes('select')) { utag_data["event_name:scAddAction"] = "trigger"; }
                if (namespace.includes('remove')) { utag_data["event_name:scRemoveAction"]  = "trigger"; }

                analytics.cart.update_products(data.cart);
                analytics.tealium.manual_link(utag_data);
            }
        };

        window.bSPS = function(){
            analytics.log('Analytics: bSPS EVENT');
            analytics.cart.clear_cart_events();

            function count_object(store, level, obj) {
                var keys = Object.keys(obj), count = keys.length;
                store[level] = (store[level] || 0) + count;
                for (var i = 0; i < count; i++) {
                    var child_obj = obj[keys[i]];
                    if (typeof child_obj === 'object') {
                        count_object(store, level + 1, child_obj);
                    }
                }
            }
            function object_total(object) {
                var result = {}, count = 0;
                count_object(result, 0, object);
                Object.keys(result).forEach(function(k,v) { count += result[k]; });
                return count;
            }
            var cart_count = object_total(analytics.settings.cart);
            if (analytics.settings.bsps > 0) {
                analytics.cart.get_json(analytics.settings.product_json_url).done(function(json) {
                    var json_count = object_total(json);
                    if (cart_count > json_count) {
                        utag_data["event_name:scRemoveAction"] = 'trigger';
                        analytics.log('Analytics: Item(s) Removed!');
                        analytics.cart.update_products(json, function() {
                            analytics.tealium.manual_link(utag_data);
                        });
                    }
                    else if (json_count > cart_count) {
                        utag_data["event_name:scAddAction"] = 'trigger';
                        analytics.log('Analytics: Item(s) Added!');
                        analytics.cart.update_products(json, function() {
                            analytics.tealium.manual_link(utag_data);
                        });
                    }
                    else {
                        var data = utag_data;
                        analytics.tealium.manual_link(analytics.cart.clear_products(data));
                    }
                });
            }
            analytics.settings.bsps++;
            analytics.settings.prevent_link = false;
        };
    });
})(jQuery, SHAW);


/**
 * User integration events
 */
$(document).on('Analytics.trackingComplete', function(event, results) {
    analytics.log('Tracking Complete for event: '+results.settings.event);
    analytics.log(results);
});
$(document).on('Analytics.formError', function(event, errors) {
    analytics.log('Form Error');
    analytics.log(errors);
});
$(document).on('Analytics.tealiumError', function(event, error) {
    analytics.log('Tealium Error');
    analytics.log(error);
});
$(document).on('Analytics.BeforeTealiumReady', function(event, analytics){
    analytics.log('Analytics: BEFORE Tealium event');
});
$(document).on('Analytics.tealiumReady', function(event, analytics) {
    analytics.log('Analytics: Tealium Ready!');
    /*
    *   You can modify the utag_data object here before executing the view.
    *    example: utag_data['page_name'] = 'new page name';
    *
    *   Need more time to execute?
    *   analytics.settings.manual_view = true;
    *   Then fire analytics.tealium.view(utag_data); when you're ready.
    */
});
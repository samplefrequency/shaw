import { profile_map } from './profile_map';
import { event_remap } from './event_remap';

export const settings = {
    debug: (localStorage.getItem('shaw-debug') === 'true') || false,
    //Toggles
    manual_view: false, //Diable auto firing of view call
    view_complete: false, //Bool controls double firing
    allow_double_fire: false, //Allow multiple views to fire
    bsps: 0, //Counter for bsps events
    wait_for_all_tags: true, //Wait for tealium tags to finish loading.
    retry_tealium_failure: false, //If tealium throws an error, retry.
    retry_limit: 1, //Number of times to retry on tealium failure.
    //End Toggles

    //Remap click events from legacy to UTS.
    event_remap: event_remap,
    //Associate Tealium profile to hostname for auto loading.
    profile_map: profile_map,

    default_product_string: {
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
    },
    user_info: {
        postal_code: false,
        half_postal_code: false,
        city: false,
        province: false,
        address: false,
        ip: false,
        isp: false
    },
    is_checkout: false,
    is_thanks: false,
};
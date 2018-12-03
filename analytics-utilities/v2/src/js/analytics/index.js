import Shaw_Analytics from './analytics';


const analytics = new Shaw_Analytics('shaw', 'uts-shaw-consumer', 'dev');
window.analytics = analytics;

//load the tealium library
analytics.load().then(() => {
    //Link Tracking
    if (analytics.page().is_checkout()) {
        analytics.get_products().then((products) => {
            analytics.log(products);
            analytics.add_product({
                product_id: 'test',
                product_quantity: '1',
                product_category: 'Test Products',
                product_sale_price: 5.00,
                product_name: 'Test Item 1',
                product_type: 'test-type',
                product_regular_price: 2.00,
                product_offer_discount: 0.00,
                product_monthly_charge_less_discount: 5.00,
                product_recurring_discount: 0.00,
                product_contract: '2yvp',
            });
            analytics.view();
        }).catch((e) => {
            analytics.log(e);
        });
    }
    else {
        analytics.view();
    }
}).catch((e) => {
    analytics.log(e);
    //No load event called back, is the network/resource available?
});

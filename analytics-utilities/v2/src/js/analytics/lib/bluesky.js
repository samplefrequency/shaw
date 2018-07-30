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
    if (analytics.settings.bsps > 0) {
        var cart_count = analytics.tools.object_total(analytics.settings.cart);
        analytics.cart.clear_cart_events();
        analytics.cart.get_json(analytics.settings.product_json_url).done(function(json) {
            var json_count = analytics.tools.object_total(json);
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
    else {
        analytics.log('Analytics: Ignoring first bsps event');
    }
    analytics.settings.bsps++;
    analytics.settings.prevent_link = false;
};
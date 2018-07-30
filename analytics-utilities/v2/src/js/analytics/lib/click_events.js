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
$(document).on('click', '.modal_check:not(".disabled"), .region_drawer_check:not(".disabled")', function(e) {
    var parent_form = $(this).closest('form');
    var form_data = $(parent_form).serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});
    var customer_type = form_data.current_customer;

    if (customer_type == 'new' || customer_type == 'existing') {
        analytics.tools.set_customer_type(customer_type);
    }
});
/**
 * User integration events
 */

$(document).on('Analytics.trackingComplete', function(event, results) {
    analytics.log('Tracking Complete for event: '+results.settings.event);
    //analytics.log(results);
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

$(document).on('Analytics.beforeView', function(event, data) {
    analytics.log('Analytics: Before Tealium View.');
});

$(document).on('Analytics.viewComplete', function(event, data) {
    analytics.log('Analytics: Tealium View Complete!');
});

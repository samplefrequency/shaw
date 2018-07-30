require('./lib/check_jquery');
const SHAW = window.SHAW || {};
require('./lib/tealium.config');
import { analytics } from './analytics';

(function($, SHAW) {
    $(document).ready(function() {
        try {
            window.analytics = analytics;
            SHAW.Analytics = analytics;
            analytics.init();
        }
        catch (e) {
            console.log(e);
        }
        require('./lib/bluesky');
        require('./lib/click_events');
        require('./lib/user_integration');
        require('./lib/qa_tools');
    });
})(jQuery, SHAW);



/* QA Tools */
//Prevent duplicate views on the utag.view function
analytics.tools.wait_for_utag().then(function() {
    analytics.tools.after(utag, 'view', function() {
        analytics.settings.view_complete = true;
        if (analytics.settings.debug && typeof(console) !== 'undefined') {
            console.groupCollapsed('Analytics: utag.view intercept - View Complete.');
                console.table(analytics.settings.after_arguments[0]);
            console.groupEnd();
        }
    });
    analytics.tools.before(utag, 'view', function() {
        if (analytics.settings.view_complete && !analytics.settings.allow_double_fire) {
            var e = 'Analytics: utag.view intercept - Preventing duplicate view!';
            analytics.log(e);
            analytics.log('%c################## WARNING ##################\n', 'background: #B22222; color: #fff', 'Duplicate views are depreciated - This will stop working soon!', '\n################## /WARNING ##################');
            //throw new Error(e);
        }
    });
});


$(document).on('Analytics.viewComplete', function(event, data) {
    if (analytics.settings.debug && typeof(console) !== 'undefined') {
        var badges = {
            '30': 'Fan',
            '12549': 'Bundle Fan',
            '21262': 'Double Player',
            '12535': 'Existing Customer',
            '14592': 'High Lead Score',
            '12547': 'Internet Fan',
            '12553': 'Phone Fan',
            '21260': 'Single Player',
            '66103': 'Switch Offer - No Holdback',
            '21264': 'Triple Player',
            '12551': 'TV Fan',
            '12537': 'Visitor - Desktop',
            '12557': 'Multiple Product Fan',
        },
        flags = {
            '27': 'Returning Visitor',
            '10736': 'Has Logged In',
            '12533': 'Is Shaw Customer',
            '12539': 'Is Internet Fan',
            '12541': 'Is Bundle Fan',
            '12543': 'Is TV Fan',
            '12545': 'Is Phone Fan',
            '64019': 'Is HLS Holdback',
            '64021': 'Is Switch Holdback',
            '64025': 'HLS Bundle - No Holdback',
            '64023': 'HLS Internet - No Holdback',
            '12555': 'Is Multiple Product Fan',
            '18354': 'Has Converted From Lead Form',
            '21254': 'Is Single Player',
            '21256': 'Is Double Player',
            '21258': 'Is Triple Player',
            '28969': 'Has Converted From Lead Form - TiQ'
        },
        active_badges = [], active_flags = [], active_audience = [];

        Object.keys(utag.data).forEach(function(key) {
            if (key.includes('va.badge')) {
                var badge_id = key.split('.').slice(-1)[0];
                if (badges.hasOwnProperty(badge_id) && utag_data[key] == 'true') {
                    var b = {
                        'badge_id': badge_id,
                        'name': badges[badge_id]
                    };
                    active_badges.push(b);
                }
                else if (utag_data[key] == 'true') {
                    var b = {
                        'badge_id': key,
                        'name': 'unknown'
                    };
                    active_badges.push(b);
                }
            }
            if (key.includes('va.audiences')) {
                active_audience.push(utag_data[key]);
            }
            if (key.includes('va.flags')) {
                var flag_id = key.split('.').slice(-1)[0];
                if (flags.hasOwnProperty(flag_id) && utag_data[key] == 'true') {
                    var f = {
                        'flag_id': flag_id,
                        'name': flags[flag_id]
                    };
                    active_flags.push(f);
                }
                else if (utag_data[key] == 'true') {
                    var f = {
                        'flag_id': key,
                        'name': 'unknown'
                    };
                    active_flags.push(f);
                }
            }
        });

        console.groupCollapsed('##################    Data Validation    ##################');

        console.groupCollapsed('Page Data:');
            console.log('page_name:', data.page_name);
            console.log('user_type:', data.user_type);
            if (data.hasOwnProperty('optimizely')) {
                console.groupCollapsed('optimizely:', data.optimizely)
                console.log(optimizely.get('state').getCampaignStates({"isActive": true}));
                console.groupEnd();
            }
            var section_group = {
                'page_section': data.page_section,
                'page_section_l2': data.page_section_l2,
                'page_section_l3': data.page_section_l3,
                'page_section_l4': data.page_section_l4,
                'page_section_l5': data.page_section_l5
            };
            console.group('Page Section:');
                console.table(section_group);
            console.groupEnd();
        console.groupEnd();

        console.groupCollapsed('Cookies:');
            var o = {
                'location': analytics.tools.get_cookie('location'),
                'bundle-offer': analytics.tools.get_cookie('bundle-offer'),
                'audience 1': analytics.tools.get_cookie('audience 1'),
                'do_hls_holdback': analytics.tools.get_cookie('do_hls_holdback'),
                'service': analytics.tools.get_cookie('service'),
                'new_customer_type': analytics.tools.get_cookie('new_customer_type'),
            };
            console.table(o);
        console.groupEnd();


        console.groupCollapsed('Audience Stream:');
            if (utag.data.hasOwnProperty('va.metrics.12565')) {
                console.log('lead_score:', utag_data['va.metrics.12565']);
            }
            if (active_badges.length > 0) {
                console.group('Badges:');
                    console.table(active_badges);
                console.groupEnd();
            }
            if (active_flags.length > 0) {
                console.group('Flags:');
                    console.table(active_flags);
                console.groupEnd();
            }
            if (Object.keys(active_audience).length > 0) {
                console.group('Audiences:');
                    console.table(active_audience);
                console.groupEnd();
            }
        console.groupEnd();

        if (analytics.settings.is_checkout) {
            console.groupCollapsed('Checkout Data:');
            console.log('form_name:', data.form_name);
            console.log('form_step:', data.form_step);
            console.log('lead_form_name:', data.lead_form_name);
            if (analytics.settings.has_products) {
                console.groupCollapsed('Products:');
                console.table(analytics.settings.product_string);
                console.groupEnd();
            }
            console.groupEnd();
        }
        console.groupEnd();
    }
});
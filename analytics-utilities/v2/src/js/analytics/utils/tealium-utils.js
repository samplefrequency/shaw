import { sha256 } from 'js-sha256';
import { profile_map } from '../config/profile_map';

export const secure_data = () => {
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
};

export const set_utag = (obj) => {
        if (typeof(obj) === 'object' && typeof(utag_data) === 'object') {
            Object.assign(utag_data, obj);
            secure_data();
            $(document).trigger('set_utag', obj);
            return utag_data;
        }
        return false;
};

export const get_profile = () => {
    var tealium_profile = false;
    $(profile_map).each(function(i, v) {
        if (($.inArray(document.location.hostname, v.hostname) > -1)) {
            tealium_profile =  v.profile;
            return false;
        }
    });
    //Helper for obscure profiles
    if (document.location.hostname == 'shop.shaw.ca') {
        if (document.location.pathname.includes('/business/')) {
            tealium_profile = 'uts-shaw-business';
        }
    }
    if (localStorage.getItem('tealium-profile')) { tealium_profile = localStorage.getItem('tealium-profile'); }
    return tealium_profile;
};

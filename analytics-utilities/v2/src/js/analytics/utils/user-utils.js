import { parseJSON } from './data-utils';
import { sha256 } from 'js-sha256';
import { cookie } from './browser-utils';

export const geoip = () => {
    const localGeoIP = localStorage.getItem('geoip');
    return (localGeoIP !== null) ? parseJSON(localGeoIP) : false;
};

export const get_location_cookie = () => {
    var location = [];
    if (document.cookie.indexOf('location=') > -1) {
        const location_cookie = cookie('get', 'location');
        const user_cookie = (location_cookie && location_cookie.indexOf('!') > -1) ? location_cookie.split('!') : [];
        user_cookie.forEach(function(e){
            location.push(e.replace(/^\{|\}$/g,""));
        });
    }
    return location;
};
export const user_location = () => {
    const g = geoip();
    var location = {};
    const location_cookie = get_location_cookie();

    if (typeof(g) === 'object' && Object.keys(g).length) {
       const geoip_info = {
            province: g.region_code || false,
            city: g.city || false,
            isp: g.network || false,
        };
        Object.assign(location, geoip_info);
    }
    if (location_cookie.length >= 10) {
            const cookie_location = {
                postal_code: location_cookie[2].length ? sha256(location_cookie[2]) : 'NAVAIL' || false,
                half_postal_code: location_cookie[2].length ? location_cookie[2].slice(0,3) : 'NAVAIL' || false,
                user_entered_city: location_cookie[3],
                user_entered_province: location_cookie[4],
                address: sha256(location_cookie[5] + ' ' + location_cookie[6]) || false,
                ip: sha256(location_cookie[10]) || false
            };
            Object.assign(location, cookie_location);
    }
    return location;
};


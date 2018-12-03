import { sha256 } from 'js-sha256';

export const secure_data = (utag_data) => {
    let data = utag_data;
    if (typeof (data) === 'object') {
        const sdata = [ //Keys to hash with SHA-256
            'home_postal_code',
            'visitor_address',
            'visitor_ip',
            'account_id',
            'visitor_isp',
        ];
        for (let key of sdata) {
            if (typeof (data[key]) !== 'undefined' && data[key] !== '') {
                data[key] = sha256(data[key]);
            }
        }
        return data;
    }
    return new Error('utils/security/secure_data => data must be an Object');
};

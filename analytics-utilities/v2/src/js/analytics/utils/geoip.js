export const geoip = (item = false) => {
    let obj = {};
    let g = (localStorage.getItem('geoip') !== null && typeof (localStorage.getItem('geoip')) !== 'undefined') ? JSON.parse(localStorage.getItem('geoip')) : false;
    if (g) { obj = g; }
    else {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://www.shaw.ca/store/data/requestHeaderData.jsp');
        xhr.onload = () => {
            if (xhr.status === 200) {
                try {
                    obj = JSON.parse(xhr.responseText).data.reduce((result, i) => {
                        let r = result;
                        let key = Object.keys(i)[0];
                        r[key] = i[key];
                        return r;
                    }, {});
                    localStorage.setItem('geoip', JSON.stringify(obj));
                }
                catch (e) { //Error
                }
            }
        };
        xhr.send();
    }
    if (item && obj.hasOwnProperty(item)) { return obj[item]; }
    return obj;
};

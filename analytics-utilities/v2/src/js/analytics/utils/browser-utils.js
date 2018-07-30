export const path = () => {
    const pathname = document.location.pathname;
    if (pathname) {
        const p = pathname.includes('/') ? pathname.split('/').filter(function(v){return v;}) : false;
        return {
            hostname: document.location.hostname,
            path: p,
            depth: p.length || 0,
            page_section: ((p.length == 1) && (p[0] === 'store')) ? 'homepage' : p[0]
        };
    }
    return false;
};
export const cookie = (method = false, name = false, value = false) => {
    switch(method) {
        case 'get':
            var match = document.cookie.match(new RegExp(name + '=([^;]+)'));
            return match ? match[1] : false;
        case 'set':
            (name.length && value.length) ? document.cookie = name +'='+ value +';' : null;
            return cookie('get', name) ? true : false;
        case 'delete':
            (name.length) ? document.cookie = name +'=;Expires=Thu, 01 Jan 1970 00:00:01 GMT;': null;
            return cookie('get', name) ? false : true;
        default:
            return false;
    }
};
export const getUrlParam = (name) => {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return (match !== null) ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : false;
};


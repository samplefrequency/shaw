export const env = () => {
    const o = {
        is_ektron: false,
        is_atg: false,
        is_ion: false,
        server_env: false,
        env: 'dev'
    };
    const h = document.location.hostname;
    const localenv = localStorage.getItem('tealium-env');
    var is_ektron, is_atg, is_ion;
    var comments = $('*:not("iframe")').contents().filter(function(){ return this.nodeType == 8;});
    $(comments).each(function(i,v) {
        if (v.textContent.trim() == 'build:template') { is_ektron = true; }
    });
    is_ion = $('body').attr('id') == 'ball_page_body';
    is_atg = $('meta[name="atg-server"]').length;
    o.server_env = is_ion ? 'ion' : is_ektron ? 'ektron' : is_atg ? 'atg' : 'unknown';
    o.env = (localenv) ? localenv : (h.includes('dev') || h.includes('localhost') || h.includes('127.0.0.1')) ? 'dev' : h.includes('playpen') || h.includes('nonprod') || (h.includes('pre') || h.includes('tst')) ? 'qa' : 'prod';
    return o;
};


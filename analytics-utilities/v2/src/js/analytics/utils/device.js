export const device = () => {
    let ua = navigator.userAgent.toLowerCase(),
    detect = ((s) => {
        let ss = s;
        (ss === undefined) ? ss = ua : ua = ss.toLowerCase();
        return (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(ua)) ? 'phone' : (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) ? 'tablet' : 'desktop';
    });
    return {
        device: detect(),
        detect: detect,
        isMobile: (detect() !== 'desktop'),
        userAgent: ua,
    };
};

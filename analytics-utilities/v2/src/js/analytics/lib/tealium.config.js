import { utag_data } from './default_utag_data';
/* **************** TEALIUM OVERRIDES ************************* */
window.utag_data = utag_data;
window.tracking_obj_ready = false;
setInterval(function(){window.clickTrackEvent = false;},100);
window.utag_cfg_ovrd = {noview:true};
/* **************** END TEALIUM OVERRIDES ************************* */
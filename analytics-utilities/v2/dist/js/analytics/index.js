/*
 * shaw-digital-experience-static 3.0.0
 * Shaw static assets
 *
 * Copyright 2018, Mike Barkemeyer, Csongor Széles
 * Released under the ISC license.
*/

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process,global){
!function(){"use strict";var ERROR="input is invalid type",WINDOW="object"==typeof window,root=WINDOW?window:{};root.JS_SHA256_NO_WINDOW&&(WINDOW=!1);var WEB_WORKER=!WINDOW&&"object"==typeof self,NODE_JS=!root.JS_SHA256_NO_NODE_JS&&"object"==typeof process&&process.versions&&process.versions.node;NODE_JS?root=global:WEB_WORKER&&(root=self);var COMMON_JS=!root.JS_SHA256_NO_COMMON_JS&&"object"==typeof module&&module.exports,AMD="function"==typeof define&&define.amd,ARRAY_BUFFER=!root.JS_SHA256_NO_ARRAY_BUFFER&&"undefined"!=typeof ArrayBuffer,HEX_CHARS="0123456789abcdef".split(""),EXTRA=[-2147483648,8388608,32768,128],SHIFT=[24,16,8,0],K=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],OUTPUT_TYPES=["hex","array","digest","arrayBuffer"],blocks=[];!root.JS_SHA256_NO_NODE_JS&&Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)}),!ARRAY_BUFFER||!root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW&&ArrayBuffer.isView||(ArrayBuffer.isView=function(t){return"object"==typeof t&&t.buffer&&t.buffer.constructor===ArrayBuffer});var createOutputMethod=function(t,h){return function(r){return new Sha256(h,!0).update(r)[t]()}},createMethod=function(t){var h=createOutputMethod("hex",t);NODE_JS&&(h=nodeWrap(h,t)),h.create=function(){return new Sha256(t)},h.update=function(t){return h.create().update(t)};for(var r=0;r<OUTPUT_TYPES.length;++r){var e=OUTPUT_TYPES[r];h[e]=createOutputMethod(e,t)}return h},nodeWrap=function(method,is224){var crypto=eval("require('crypto')"),Buffer=eval("require('buffer').Buffer"),algorithm=is224?"sha224":"sha256",nodeMethod=function(t){if("string"==typeof t)return crypto.createHash(algorithm).update(t,"utf8").digest("hex");if(null===t||void 0===t)throw new Error(ERROR);return t.constructor===ArrayBuffer&&(t=new Uint8Array(t)),Array.isArray(t)||ArrayBuffer.isView(t)||t.constructor===Buffer?crypto.createHash(algorithm).update(new Buffer(t)).digest("hex"):method(t)};return nodeMethod},createHmacOutputMethod=function(t,h){return function(r,e){return new HmacSha256(r,h,!0).update(e)[t]()}},createHmacMethod=function(t){var h=createHmacOutputMethod("hex",t);h.create=function(h){return new HmacSha256(h,t)},h.update=function(t,r){return h.create(t).update(r)};for(var r=0;r<OUTPUT_TYPES.length;++r){var e=OUTPUT_TYPES[r];h[e]=createHmacOutputMethod(e,t)}return h};function Sha256(t,h){h?(blocks[0]=blocks[16]=blocks[1]=blocks[2]=blocks[3]=blocks[4]=blocks[5]=blocks[6]=blocks[7]=blocks[8]=blocks[9]=blocks[10]=blocks[11]=blocks[12]=blocks[13]=blocks[14]=blocks[15]=0,this.blocks=blocks):this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],t?(this.h0=3238371032,this.h1=914150663,this.h2=812702999,this.h3=4144912697,this.h4=4290775857,this.h5=1750603025,this.h6=1694076839,this.h7=3204075428):(this.h0=1779033703,this.h1=3144134277,this.h2=1013904242,this.h3=2773480762,this.h4=1359893119,this.h5=2600822924,this.h6=528734635,this.h7=1541459225),this.block=this.start=this.bytes=this.hBytes=0,this.finalized=this.hashed=!1,this.first=!0,this.is224=t}function HmacSha256(t,h,r){var e,s=typeof t;if("string"===s){var i,o=[],a=t.length,H=0;for(e=0;e<a;++e)(i=t.charCodeAt(e))<128?o[H++]=i:i<2048?(o[H++]=192|i>>6,o[H++]=128|63&i):i<55296||i>=57344?(o[H++]=224|i>>12,o[H++]=128|i>>6&63,o[H++]=128|63&i):(i=65536+((1023&i)<<10|1023&t.charCodeAt(++e)),o[H++]=240|i>>18,o[H++]=128|i>>12&63,o[H++]=128|i>>6&63,o[H++]=128|63&i);t=o}else{if("object"!==s)throw new Error(ERROR);if(null===t)throw new Error(ERROR);if(ARRAY_BUFFER&&t.constructor===ArrayBuffer)t=new Uint8Array(t);else if(!(Array.isArray(t)||ARRAY_BUFFER&&ArrayBuffer.isView(t)))throw new Error(ERROR)}t.length>64&&(t=new Sha256(h,!0).update(t).array());var n=[],S=[];for(e=0;e<64;++e){var c=t[e]||0;n[e]=92^c,S[e]=54^c}Sha256.call(this,h,r),this.update(S),this.oKeyPad=n,this.inner=!0,this.sharedMemory=r}Sha256.prototype.update=function(t){if(!this.finalized){var h,r=typeof t;if("string"!==r){if("object"!==r)throw new Error(ERROR);if(null===t)throw new Error(ERROR);if(ARRAY_BUFFER&&t.constructor===ArrayBuffer)t=new Uint8Array(t);else if(!(Array.isArray(t)||ARRAY_BUFFER&&ArrayBuffer.isView(t)))throw new Error(ERROR);h=!0}for(var e,s,i=0,o=t.length,a=this.blocks;i<o;){if(this.hashed&&(this.hashed=!1,a[0]=this.block,a[16]=a[1]=a[2]=a[3]=a[4]=a[5]=a[6]=a[7]=a[8]=a[9]=a[10]=a[11]=a[12]=a[13]=a[14]=a[15]=0),h)for(s=this.start;i<o&&s<64;++i)a[s>>2]|=t[i]<<SHIFT[3&s++];else for(s=this.start;i<o&&s<64;++i)(e=t.charCodeAt(i))<128?a[s>>2]|=e<<SHIFT[3&s++]:e<2048?(a[s>>2]|=(192|e>>6)<<SHIFT[3&s++],a[s>>2]|=(128|63&e)<<SHIFT[3&s++]):e<55296||e>=57344?(a[s>>2]|=(224|e>>12)<<SHIFT[3&s++],a[s>>2]|=(128|e>>6&63)<<SHIFT[3&s++],a[s>>2]|=(128|63&e)<<SHIFT[3&s++]):(e=65536+((1023&e)<<10|1023&t.charCodeAt(++i)),a[s>>2]|=(240|e>>18)<<SHIFT[3&s++],a[s>>2]|=(128|e>>12&63)<<SHIFT[3&s++],a[s>>2]|=(128|e>>6&63)<<SHIFT[3&s++],a[s>>2]|=(128|63&e)<<SHIFT[3&s++]);this.lastByteIndex=s,this.bytes+=s-this.start,s>=64?(this.block=a[16],this.start=s-64,this.hash(),this.hashed=!0):this.start=s}return this.bytes>4294967295&&(this.hBytes+=this.bytes/4294967296<<0,this.bytes=this.bytes%4294967296),this}},Sha256.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var t=this.blocks,h=this.lastByteIndex;t[16]=this.block,t[h>>2]|=EXTRA[3&h],this.block=t[16],h>=56&&(this.hashed||this.hash(),t[0]=this.block,t[16]=t[1]=t[2]=t[3]=t[4]=t[5]=t[6]=t[7]=t[8]=t[9]=t[10]=t[11]=t[12]=t[13]=t[14]=t[15]=0),t[14]=this.hBytes<<3|this.bytes>>>29,t[15]=this.bytes<<3,this.hash()}},Sha256.prototype.hash=function(){var t,h,r,e,s,i,o,a,H,n=this.h0,S=this.h1,c=this.h2,f=this.h3,A=this.h4,R=this.h5,u=this.h6,_=this.h7,E=this.blocks;for(t=16;t<64;++t)h=((s=E[t-15])>>>7|s<<25)^(s>>>18|s<<14)^s>>>3,r=((s=E[t-2])>>>17|s<<15)^(s>>>19|s<<13)^s>>>10,E[t]=E[t-16]+h+E[t-7]+r<<0;for(H=S&c,t=0;t<64;t+=4)this.first?(this.is224?(i=300032,_=(s=E[0]-1413257819)-150054599<<0,f=s+24177077<<0):(i=704751109,_=(s=E[0]-210244248)-1521486534<<0,f=s+143694565<<0),this.first=!1):(h=(n>>>2|n<<30)^(n>>>13|n<<19)^(n>>>22|n<<10),e=(i=n&S)^n&c^H,_=f+(s=_+(r=(A>>>6|A<<26)^(A>>>11|A<<21)^(A>>>25|A<<7))+(A&R^~A&u)+K[t]+E[t])<<0,f=s+(h+e)<<0),h=(f>>>2|f<<30)^(f>>>13|f<<19)^(f>>>22|f<<10),e=(o=f&n)^f&S^i,u=c+(s=u+(r=(_>>>6|_<<26)^(_>>>11|_<<21)^(_>>>25|_<<7))+(_&A^~_&R)+K[t+1]+E[t+1])<<0,h=((c=s+(h+e)<<0)>>>2|c<<30)^(c>>>13|c<<19)^(c>>>22|c<<10),e=(a=c&f)^c&n^o,R=S+(s=R+(r=(u>>>6|u<<26)^(u>>>11|u<<21)^(u>>>25|u<<7))+(u&_^~u&A)+K[t+2]+E[t+2])<<0,h=((S=s+(h+e)<<0)>>>2|S<<30)^(S>>>13|S<<19)^(S>>>22|S<<10),e=(H=S&c)^S&f^a,A=n+(s=A+(r=(R>>>6|R<<26)^(R>>>11|R<<21)^(R>>>25|R<<7))+(R&u^~R&_)+K[t+3]+E[t+3])<<0,n=s+(h+e)<<0;this.h0=this.h0+n<<0,this.h1=this.h1+S<<0,this.h2=this.h2+c<<0,this.h3=this.h3+f<<0,this.h4=this.h4+A<<0,this.h5=this.h5+R<<0,this.h6=this.h6+u<<0,this.h7=this.h7+_<<0},Sha256.prototype.hex=function(){this.finalize();var t=this.h0,h=this.h1,r=this.h2,e=this.h3,s=this.h4,i=this.h5,o=this.h6,a=this.h7,H=HEX_CHARS[t>>28&15]+HEX_CHARS[t>>24&15]+HEX_CHARS[t>>20&15]+HEX_CHARS[t>>16&15]+HEX_CHARS[t>>12&15]+HEX_CHARS[t>>8&15]+HEX_CHARS[t>>4&15]+HEX_CHARS[15&t]+HEX_CHARS[h>>28&15]+HEX_CHARS[h>>24&15]+HEX_CHARS[h>>20&15]+HEX_CHARS[h>>16&15]+HEX_CHARS[h>>12&15]+HEX_CHARS[h>>8&15]+HEX_CHARS[h>>4&15]+HEX_CHARS[15&h]+HEX_CHARS[r>>28&15]+HEX_CHARS[r>>24&15]+HEX_CHARS[r>>20&15]+HEX_CHARS[r>>16&15]+HEX_CHARS[r>>12&15]+HEX_CHARS[r>>8&15]+HEX_CHARS[r>>4&15]+HEX_CHARS[15&r]+HEX_CHARS[e>>28&15]+HEX_CHARS[e>>24&15]+HEX_CHARS[e>>20&15]+HEX_CHARS[e>>16&15]+HEX_CHARS[e>>12&15]+HEX_CHARS[e>>8&15]+HEX_CHARS[e>>4&15]+HEX_CHARS[15&e]+HEX_CHARS[s>>28&15]+HEX_CHARS[s>>24&15]+HEX_CHARS[s>>20&15]+HEX_CHARS[s>>16&15]+HEX_CHARS[s>>12&15]+HEX_CHARS[s>>8&15]+HEX_CHARS[s>>4&15]+HEX_CHARS[15&s]+HEX_CHARS[i>>28&15]+HEX_CHARS[i>>24&15]+HEX_CHARS[i>>20&15]+HEX_CHARS[i>>16&15]+HEX_CHARS[i>>12&15]+HEX_CHARS[i>>8&15]+HEX_CHARS[i>>4&15]+HEX_CHARS[15&i]+HEX_CHARS[o>>28&15]+HEX_CHARS[o>>24&15]+HEX_CHARS[o>>20&15]+HEX_CHARS[o>>16&15]+HEX_CHARS[o>>12&15]+HEX_CHARS[o>>8&15]+HEX_CHARS[o>>4&15]+HEX_CHARS[15&o];return this.is224||(H+=HEX_CHARS[a>>28&15]+HEX_CHARS[a>>24&15]+HEX_CHARS[a>>20&15]+HEX_CHARS[a>>16&15]+HEX_CHARS[a>>12&15]+HEX_CHARS[a>>8&15]+HEX_CHARS[a>>4&15]+HEX_CHARS[15&a]),H},Sha256.prototype.toString=Sha256.prototype.hex,Sha256.prototype.digest=function(){this.finalize();var t=this.h0,h=this.h1,r=this.h2,e=this.h3,s=this.h4,i=this.h5,o=this.h6,a=this.h7,H=[t>>24&255,t>>16&255,t>>8&255,255&t,h>>24&255,h>>16&255,h>>8&255,255&h,r>>24&255,r>>16&255,r>>8&255,255&r,e>>24&255,e>>16&255,e>>8&255,255&e,s>>24&255,s>>16&255,s>>8&255,255&s,i>>24&255,i>>16&255,i>>8&255,255&i,o>>24&255,o>>16&255,o>>8&255,255&o];return this.is224||H.push(a>>24&255,a>>16&255,a>>8&255,255&a),H},Sha256.prototype.array=Sha256.prototype.digest,Sha256.prototype.arrayBuffer=function(){this.finalize();var t=new ArrayBuffer(this.is224?28:32),h=new DataView(t);return h.setUint32(0,this.h0),h.setUint32(4,this.h1),h.setUint32(8,this.h2),h.setUint32(12,this.h3),h.setUint32(16,this.h4),h.setUint32(20,this.h5),h.setUint32(24,this.h6),this.is224||h.setUint32(28,this.h7),t},HmacSha256.prototype=new Sha256,HmacSha256.prototype.finalize=function(){if(Sha256.prototype.finalize.call(this),this.inner){this.inner=!1;var t=this.array();Sha256.call(this,this.is224,this.sharedMemory),this.update(this.oKeyPad),this.update(t),Sha256.prototype.finalize.call(this)}};var exports=createMethod();exports.sha256=exports,exports.sha224=createMethod(!0),exports.sha256.hmac=createHmacMethod(),exports.sha224.hmac=createHmacMethod(!0),COMMON_JS?module.exports=exports:(root.sha256=exports.sha256,root.sha224=exports.sha224,AMD&&define(function(){return exports}))}();

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":2}],2:[function(require,module,exports){
var cachedSetTimeout,cachedClearTimeout,process=module.exports={};function defaultSetTimout(){throw new Error("setTimeout has not been defined")}function defaultClearTimeout(){throw new Error("clearTimeout has not been defined")}function runTimeout(e){if(cachedSetTimeout===setTimeout)return setTimeout(e,0);if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout)return cachedSetTimeout=setTimeout,setTimeout(e,0);try{return cachedSetTimeout(e,0)}catch(t){try{return cachedSetTimeout.call(null,e,0)}catch(t){return cachedSetTimeout.call(this,e,0)}}}function runClearTimeout(e){if(cachedClearTimeout===clearTimeout)return clearTimeout(e);if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout)return cachedClearTimeout=clearTimeout,clearTimeout(e);try{return cachedClearTimeout(e)}catch(t){try{return cachedClearTimeout.call(null,e)}catch(t){return cachedClearTimeout.call(this,e)}}}!function(){try{cachedSetTimeout="function"==typeof setTimeout?setTimeout:defaultSetTimout}catch(e){cachedSetTimeout=defaultSetTimout}try{cachedClearTimeout="function"==typeof clearTimeout?clearTimeout:defaultClearTimeout}catch(e){cachedClearTimeout=defaultClearTimeout}}();var currentQueue,queue=[],draining=!1,queueIndex=-1;function cleanUpNextTick(){draining&&currentQueue&&(draining=!1,currentQueue.length?queue=currentQueue.concat(queue):queueIndex=-1,queue.length&&drainQueue())}function drainQueue(){if(!draining){var e=runTimeout(cleanUpNextTick);draining=!0;for(var t=queue.length;t;){for(currentQueue=queue,queue=[];++queueIndex<t;)currentQueue&&currentQueue[queueIndex].run();queueIndex=-1,t=queue.length}currentQueue=null,draining=!1,runClearTimeout(e)}}function Item(e,t){this.fun=e,this.array=t}function noop(){}process.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];queue.push(new Item(e,t)),1!==queue.length||draining||runTimeout(drainQueue)},Item.prototype.run=function(){this.fun.apply(null,this.array)},process.title="browser",process.browser=!0,process.env={},process.argv=[],process.version="",process.versions={},process.on=noop,process.addListener=noop,process.once=noop,process.off=noop,process.removeListener=noop,process.removeAllListeners=noop,process.emit=noop,process.prependListener=noop,process.prependOnceListener=noop,process.listeners=function(e){return[]},process.binding=function(e){throw new Error("process.binding is not supported")},process.cwd=function(){return"/"},process.chdir=function(e){throw new Error("process.chdir is not supported")},process.umask=function(){return 0};

},{}],3:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _slicedToArray=function(){return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var r=[],o=!0,i=!1,n=void 0;try{for(var a,c=e[Symbol.iterator]();!(o=(a=c.next()).done)&&(r.push(a.value),!t||r.length!==t);o=!0);}catch(e){i=!0,n=e}finally{try{!o&&c.return&&c.return()}finally{if(i)throw n}}return r}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,r,o){return r&&e(t.prototype,r),o&&e(t,o),t}}(),_get=function e(t,r,o){null===t&&(t=Function.prototype);var i=Object.getOwnPropertyDescriptor(t,r);if(void 0===i){var n=Object.getPrototypeOf(t);return null===n?void 0:e(n,r,o)}if("value"in i)return i.value;var a=i.get;return void 0!==a?a.call(o):void 0},_Tealium2=require("./class/Tealium.class"),_security=require("./utils/security"),_geoip=require("./utils/geoip"),_device=require("./utils/device"),_checkout=require("./utils/checkout"),_getjson=require("./utils/getjson");function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var Shaw_Analytics=function(e){function t(e,r,o){_classCallCheck(this,t);var i=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,r,o));return window.utag_data=window.utag_data||i.utag_data,window.utag_cfg_ovrd={noview:!0},setInterval(function(){window.clickTrackEvent=!1},100),i.default_products={product_id:[],product_quantity:[],product_sale_price:[],product_name:[],product_type:[],product_regular_price:[],product_offer_discount:[],product_monthly_charge_less_discount:[],product_recurring_discount:[],equipment_purchase_type:[],product_contract:[],product_credit:[],product_order_type:[],product_upsell:[],product_xsell:[],product_rgu:[],product_category:[]},i.products=i.default_products,i.debug="true"===localStorage.getItem("shaw-debug")||!1,i.userinfo=i.client(),i.checkout=!!i.page().is_checkout()&&(0,_checkout.checkout)(),i.get_products=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:i.checkout.product_json_url;return(0,_getjson.getjson)(e)},"object"===("undefined"==typeof s?"undefined":_typeof(s))&&(s.trackExternalLinks=!1),document.onclick=function(e){e.target.dataset.event&&e.target.dataset.value&&analytics.link(_defineProperty({},e.target.dataset.event,e.target.dataset.value))},i}return _inherits(t,_Tealium2.Tealium),_createClass(t,[{key:"default",value:function(){_get(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"default",this).call(this),this.set({shaw_analytics:!0,page_name:this.page().info.pagename,platform:this.client().device,isp:(0,_geoip.geoip)("network"),isp_org:(0,_geoip.geoip)("network"),geoip_city:(0,_geoip.geoip)("city"),geoip_country:(0,_geoip.geoip)("country_code"),geoip_region:(0,_geoip.geoip)("region_code"),goeip_network:(0,_geoip.geoip)("network"),goeip_continent:(0,_geoip.geoip)("continent")}),this.optimizely()}},{key:"secure",value:function(e){return"object"===(void 0===e?"undefined":_typeof(e))&&Object.keys(e).length>0&&(0,_security.secure_data)(e)}},{key:"set",value:function(e){return"object"===(void 0===e?"undefined":_typeof(e))&&Object.keys(e).length>0&&_get(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"set",this).call(this,this.secure(e))}},{key:"add_product",value:function(e){if("object"!==(void 0===e?"undefined":_typeof(e))&&Object.keys(data).length<=0)return!1;var t={},r=!0,o=!1,i=void 0;try{for(var n,a=Object.entries(e)[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var c=_slicedToArray(n.value,2),u=c[0],s=c[1];this.products.hasOwnProperty(u)&&(t[u]=!0,this.products[u].push(s))}}catch(e){o=!0,i=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw i}}var l=!0,p=!1,d=void 0;try{for(var _,f=Object.entries(this.products)[Symbol.iterator]();!(l=(_=f.next()).done);l=!0){var y=_slicedToArray(_.value,1)[0];!t[y]&&this.products[y].push(!1)}}catch(e){p=!0,d=e}finally{try{!l&&f.return&&f.return()}finally{if(p)throw d}}return this.set(this.products),this.set({"event_name:scAddAction":!0}),this.products}},{key:"remove_product",value:function(e){var t=this.products.product_id.indexOf(e);if(t>-1){var r=!0,o=!1,i=void 0;try{for(var n,a=Object.entries(this.products)[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var c=_slicedToArray(n.value,1)[0];this.products[c].splice(t,1)}}catch(e){o=!0,i=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw i}}}this.set({"event_name:scRemoveAction":!0}),this.set(this.products)}},{key:"clear_products",value:function(){var e=!0,t=!1,r=void 0;try{for(var o,i=Object.entries(this.products)[Symbol.iterator]();!(e=(o=i.next()).done);e=!0){var n=_slicedToArray(o.value,1)[0];delete this.utag_data[n]}}catch(e){t=!0,r=e}finally{try{!e&&i.return&&i.return()}finally{if(t)throw r}}delete this.utag_data["event_name:scRemoveAction"],delete this.utag_data["event_name:scAddAction"]}},{key:"client",value:function(){return{geoip:(0,_geoip.geoip)(),device:(0,_device.device)().device,isMobile:(0,_device.device)().isMobile,useragent:(0,_device.device)().userAgent}}},{key:"page",value:function(){var e=this,t=new URL(window.location.href),r=t.pathname.toLowerCase(),o="www.shaw.ca"===t.host,i="beta.shaw.ca"===t.host,n="localhost"===t.hostname,a=document.body.dataset.pagename||!1;return{info:{url:t.href,pathname:r,is_local:n,is_classic:o,is_beta:i,pagename:e.utag_data.hasOwnProperty("page_name")&&""!==e.utag_data.page_name?e.utag_data.page_name:null!==a?a:r?r.split("/").join("|"):"pagename-not-available"},is_checkout:function(){return e.is_checkout||o&&r.includes("/store/cart/")||i&&r.includes("/configure")},is_conversion:function(){return r.includes("thank")}}}},{key:"optimizely",value:function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){if("undefined"!=typeof optimizely)try{var e=[],t=optimizely.get("state").getCampaignStates({isActive:!0}),r=optimizely.get("data").projectId;Object.keys(t).forEach(function(o){e.push(r+"."+t[o].experiment.id+"."+t[o].variation.id)}),e.length&&this.set({optimizely:e.join("|")})}catch(e){this.log("Unable to use optimizely API: \n"+e)}})}]),t}();exports.default=Shaw_Analytics;

},{"./class/Tealium.class":5,"./utils/checkout":7,"./utils/device":8,"./utils/geoip":10,"./utils/getjson":11,"./utils/security":12}],4:[function(require,module,exports){
module.exports={
    "builder":{
       "form_steps":[
          {
             "url":"/store/builder/builder.jsp",
             "label":"Cart Start",
             "events":[
                "scOpenAction"
             ],
             "pagename":"builder|cart-start"
          },
          {
             "url":"/store/checkout/step1.jsp",
             "label":"Contact Info",
             "events":[
                "lead form load"
             ],
             "pagename":"builder|contact-info|step-1"
          },
          {
             "url":"/store/checkout/step2.jsp",
             "label":"Installation",
             "events":[
                "lead form load"
             ],
             "pagename":"builder|installation|step-2"
          },
          {
             "url":"/store/checkout/step3.jsp",
             "label":"Review Submit",
             "events":[
                "lead form load"
             ],
             "pagename":"builder|review-submit|step-3"
          },
          {
             "url":"/store/checkout/thankYou.jsp",
             "label":"Thankyou",
             "pagename":"builder|thankyou",
             "is_thanks":true
          }
       ],
       "json":"/store/planBuilder/cart/cart.jsp",
       "form_name":"builder"
    },
    "addonBuilder":{
       "form_steps":[
          {
             "url":"/store/builder/addOnsBuilder.jsp",
             "label":"Cart Start",
             "events":[
                "scOpenAction"
             ],
             "pagename":"builder|cart-start"
          }
       ],
       "json":"/store/planBuilder/cart/cart.jsp",
       "form_name":"builder"
    },
    "bluesky":{
       "form_steps":[
          {
             "url":"/store/blueskytv/configurator.jsp",
             "label":"Cart Start",
             "events":[
                "scOpenAction"
             ],
             "pagename":"bluesky|cart-start",
             "wait":3000
          },
          {
             "url":"/store/cart/orderLeadForm3.jsp",
             "label":"Contact Info",
             "events":[
                "lead form load"
             ],
             "pagename":"bluesky|contact-info"
          },
          {
             "url":"/store/cart/orderLeadFormThankyou2.jsp",
             "label":"Thankyou",
             "pagename":"bluesky|thankyou",
             "is_thanks":true
          }
       ],
       "lead_form_name":"lead-form|bluesky",
       "json":"/store/xhr/data/blueskytv/getOrderSummaryJSON.jsp",
       "form_name":"bluesky"
    },
    "leadform":{
       "form_steps":[
          {
             "url":"/store/cart/orderLeadForm2.jsp",
             "label":"Contact Info",
             "events":[
                "scOpenAction"
             ],
             "pagename":"leadform|contact-info"
          },
          {
             "url":"/store/cart/orderLeadForm-contactDetails.jsp",
             "label":"Contact Info",
             "events":[
                "lead form load"
             ],
             "pagename":"leadform|contact-info|step-1"
          },
          {
             "url":"/store/cart/orderLeadForm-serviceAddress.jsp",
             "label":"Service Address",
             "events":[
                "lead form load"
             ],
             "pagename":"leadform|service-address|step-2"
          },
          {
             "url":"/store/cart/orderLeadForm-billingInfo.jsp",
             "label":"Billing Info",
             "events":[
                "lead form load"
             ],
             "pagename":"leadform|billing-info|step-3"
          },
          {
             "url":"/store/cart/orderLeadForm-reviewSubmit.jsp",
             "label":"Review Submit",
             "events":[
                "lead form load"
             ],
             "pagename":"leadform|review-submit|step-4"
          },
          {
             "url":"/store/cart/orderLeadForm-valuePlan.jsp",
             "label":"Value Plan",
             "events":[
                "lead form load"
             ],
             "pagename":"leadform|value-plan|step-5"
          },
          {
             "url":[
                "/store/cart/orderLeadFormThankyou.jsp",
                "/store/cart/orderLeadForm-thankYou.jsp"
             ],
             "label":"Thankyou",
             "pagename":"leadform|thankyou",
             "is_thanks":true
          }
       ],
       "lead_form_name":"lead-form|{{eoId}}|{{promoId}}",
       "form_name":"lead form",
       "json":"/store/cart/leadTrackingJson.jsp?eoId={{eoId}}&promoId={{promoId}}"
    },
    "student":{
       "form_steps":[
          {
             "url":"/store/campaign/student-p1.jsp",
             "label":"Cart Start",
             "events":[
                "scOpenAction"
             ],
             "pagename":"student-leadform|cart-start"
          },
          {
             "url":"/store/campaign/student-p2.jsp",
             "label":"Contact Info",
             "events":[
                "scOpenAction"
             ],
             "pagename":"student-leadform|contact-info"
          },
          {
             "url":"/store/campaign/student-thankyou.jsp",
             "label":"Thankyou",
             "pagename":"student-leadform|thankyou",
             "is_thanks":true
          }
       ],
       "lead_form_name":"lead-form|student|{{body-eoId}}",
       "form_name":"student",
       "json":"/store/cart/leadTrackingJson.jsp?eoId={{body-eoId}}&promoid={{promoId}}"
    },
    "ised":{
       "form_steps":[
          {
             "url":"/store/connecting-families/index.jsp",
             "label":"Cart Start",
             "events":[
                "scOpenAction"
             ],
             "pagename":"ised-leadform|cart-start"
          },
          {
             "url":"/store/connecting-families/thank-you.jsp",
             "label":"Thankyou",
             "pagename":"ised-leadform|thankyou",
             "is_thanks":true
          }
       ],
       "lead_form_name":"lead-form|ised|{{body-eoId}}",
       "form_name":"ised",
       "json":"/store/cart/leadTrackingJson.jsp?eoId={{body-eoId}}&promoId={{promoId}}"
    }
 }
},{}],5:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Tealium=void 0;var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},_createClass=function(){function t(t,e){for(var a=0;a<e.length;a++){var n=e[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,a,n){return a&&t(e.prototype,a),n&&t(e,n),e}}(),_externalLoader=require("../utils/externalLoader");function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var Tealium=exports.Tealium=function(){function t(e,a,n){_classCallCheck(this,t),this.account=e,this.profile=a,this.environment=n,this.utag_data={},this.external_scripts=[],this.loaded=!1,this.tealium_ready=!1,this.debug=!1}return _createClass(t,[{key:"log",value:function(){this.debug&&"undefined"!=typeof console&&console.log.apply(console,arguments)}},{key:"load",value:function(){var t=this;return this.external_scripts.push("https://tags.tiqcdn.com/utag/"+this.account+"/"+this.profile+"/"+this.environment+"/utag.js"),_externalLoader.loader.urls(this.external_scripts).then(function(){t.loaded=!0}).catch(function(t){console.error("Tealium.class => Script loading error:",t)}),this.ready()}},{key:"ready",value:function(){var t=this,e=function(){return t.tealium_ready?t.tealium_ready:"undefined"!=typeof utag&&utag.hasOwnProperty("view")&&utag.hasOwnProperty("link")&&utag.hasOwnProperty("loader")&&utag.loader.hasOwnProperty("ended")};return new Promise(function(a,n){if(e())a();else var i=0,o=setInterval(function(){++i<=200?e()&&(t.tealium_ready=!0,clearInterval(o),a()):(clearInterval(o),n(new Error("Analytics: Waiting for utag timed out, aborting operations...")))},50)})}},{key:"set",value:function(t){return"object"===(void 0===t?"undefined":_typeof(t))&&"object"===_typeof(this.utag_data)&&(this.log("Setting Data: ",t),Object.assign(this.utag_data,t),Object.assign(window.utag_data,this.utag_data)),this.utag_data}},{key:"remove",value:function(t){delete this.utag_data[t]}},{key:"reset",value:function(){this.utag_data={},this.log("Resetting data!",this.utag_data)}},{key:"default",value:function(){var t=new Date;return this.set({user_agent_string:utag_data.user_agent_string||navigator.userAgent,site_name:document.location.hostname,referring_url:document.referrer,hour_of_day:t.toLocaleString("en-us",{weekday:"long"})+"|"+t.toLocaleTimeString("en-us"),day_of_month:t.getDate(),timestamp:t.toString(),url:document.location.href}),this.utag_data}},{key:"view",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=arguments.length>1&&void 0!==arguments[1]&&arguments[1];this.default(),this.set(e),utag.view(this.utag_data,function(){a&&a(t.utag_data),t.log("View Finished:",t.utag_data),t.reset()})}},{key:"link",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=arguments.length>1&&void 0!==arguments[1]&&arguments[1];this.default(),this.set({link_name:"Tealium Link Event"}),this.set(e),utag.link(this.utag_data,function(){a&&a(t.utag_data),t.log("Link Finished:",t.utag_data),t.reset()})}}]),t}();

},{"../utils/externalLoader":9}],6:[function(require,module,exports){
"use strict";var _analytics=require("./analytics"),_analytics2=_interopRequireDefault(_analytics);function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}var analytics=new _analytics2.default("shaw","uts-shaw-consumer","dev");window.analytics=analytics,analytics.load().then(function(){analytics.page().is_checkout()?analytics.get_products().then(function(t){analytics.log(t),analytics.add_product({product_id:"test",product_quantity:"1",product_category:"Test Products",product_sale_price:5,product_name:"Test Item 1",product_type:"test-type",product_regular_price:2,product_offer_discount:0,product_monthly_charge_less_discount:5,product_recurring_discount:0,product_contract:"2yvp"}),analytics.view()}).catch(function(t){analytics.log(t)}):analytics.view()}).catch(function(t){analytics.log(t)});

},{"./analytics":3}],7:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.checkout=void 0;var _checkout=require("../checkout.json"),json=_interopRequireWildcard(_checkout);function _interopRequireWildcard(e){if(e&&e.__esModule)return e;var o={};if(null!=e)for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(o[t]=e[t]);return o.default=e,o}var checkout=exports.checkout=function(){var e={checkout:{}},o=function(e){var o=RegExp("[?&]"+e+"=([^&]*)").exec(window.location.search);return null!==o&&decodeURIComponent(o[1].replace(/\+/g," "))},t=o("eoId"),r=o("promoId"),c=document.body.dataset.pagename,n=function(e){return e.replace("{{body-eoId}}",c).replace("{{eoId}}",t).replace("{{promoId}}",r)};return Object.keys(json).forEach(function(o){json[o].hasOwnProperty("form_steps")&&json[o].form_steps.forEach(function(t){if(t.hasOwnProperty("url")){var r={url:[]};if("string"==typeof t.url?r.url.push(t.url):r.url=t.url,document.location.pathname.indexOf(r.url)>-1)return e.checkout.checkout_type=o,e.checkout.product_json_url=n(json[o].json),e.checkout.is_checkout=!0,e.checkout.is_form_step=!0,e.checkout.lead_form_name=n(json[o].lead_form_name),e.checkout.form_name=json[o].form_name,t.hasOwnProperty("label")&&(r.label=t.label,e.checkout.form_step=t.label),t.hasOwnProperty("pagename")&&(e.checkout.pagename=t.pagename),t.hasOwnProperty("wait")&&(e.checkout.wait=t.wait),e.checkout.is_thanks=t.hasOwnProperty("is_thanks")&&!0===t.is_thanks,t.hasOwnProperty("events")&&t.events.length&&(e.checkout.cart_events=t.events),e.checkout}return e.checkout})}),e.checkout};

},{"../checkout.json":4}],8:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var device=exports.device=function(){var e=navigator.userAgent.toLowerCase(),o=function(o){var t=o;return void 0===t?t=e:e=t.toLowerCase(),/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(e)?"phone":/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(e)?"tablet":"desktop"};return{device:o(),detect:o,isMobile:"desktop"!==o(),userAgent:e}};

},{}],9:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var loader={url:function(e){return new Promise(function(r,t){var n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=e,n.addEventListener("load",function(){return r(n)},!1),n.addEventListener("error",function(){return t(n)},!1),document.head.appendChild(n)})},urls:function(e){return Promise.all(e.map(loader.url))}};exports.loader=loader;

},{}],10:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var geoip=exports.geoip=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t={},o=null!==localStorage.getItem("geoip")&&void 0!==localStorage.getItem("geoip")&&JSON.parse(localStorage.getItem("geoip"));if(o)t=o;else{var a=new XMLHttpRequest;a.open("GET","https://www.shaw.ca/store/data/requestHeaderData.jsp"),a.onload=function(){if(200===a.status)try{t=JSON.parse(a.responseText).data.reduce(function(e,t){var o=e,a=Object.keys(t)[0];return o[a]=t[a],o},{}),localStorage.setItem("geoip",JSON.stringify(t))}catch(e){}},a.send()}return e&&t.hasOwnProperty(e)?t[e]:t};

},{}],11:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var getjson=exports.getjson=function(e){return new Promise(function(t,s){var n=new XMLHttpRequest;n.open("GET",e),n.onload=function(){200===n.status?t(JSON.parse(n.responseText)):s(n.status)},n.send()})};

},{}],12:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.secure_data=void 0;var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},_jsSha=require("js-sha256"),secure_data=exports.secure_data=function(t){var e=t;if("object"===(void 0===e?"undefined":_typeof(e))){var r=!0,o=!1,a=void 0;try{for(var i,s=["home_postal_code","visitor_address","visitor_ip","account_id","visitor_isp"][Symbol.iterator]();!(r=(i=s.next()).done);r=!0){var n=i.value;void 0!==e[n]&&""!==e[n]&&(e[n]=(0,_jsSha.sha256)(e[n]))}}catch(t){o=!0,a=t}finally{try{!r&&s.return&&s.return()}finally{if(o)throw a}}return e}return new Error("utils/security/secure_data => data must be an Object")};

},{"js-sha256":1}]},{},[6]);

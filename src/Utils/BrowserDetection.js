// Opera 8.0+
export var isOpera = !!window.opr || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
export var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]"
export var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Internet Explorer 6-11
export var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
export var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1+
export var isChrome = !!window.chrome && !!window.chrome.webstore;

// Blink engine detection
export var isBlink = (isChrome || isOpera) && !!window.CSS;


export function isMobileSafari() {
  return /iP(ad|hone|od).+Version\/[\d\.]+.*Safari/i.test(navigator.userAgent);
}

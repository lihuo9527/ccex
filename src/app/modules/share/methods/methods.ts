export function getUrlKey(name: string) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
}
export function getBrowserDevice() {
    let u = navigator.userAgent;
    return {
        isTrident: u.indexOf('Trident') > -1,
        isPresto: u.indexOf('Presto') > -1,
        isWebKit: u.indexOf('AppleWebKit') > -1,
        isGecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
        isMobile: !!u.match(/AppleWebKit.*Mobile.*/),
        isAndroid: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
        isIPhone: u.indexOf('iPhone') > -1,
        isIPad: u.indexOf('iPad') > -1,
        isWechat: u.indexOf('MicroMessenger') > -1,
    };
}
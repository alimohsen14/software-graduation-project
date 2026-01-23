export const isWebView = (): boolean => {
    if (typeof window === 'undefined') return false;

    const userAgent = window.navigator.userAgent.toLowerCase();

    // Check for common WebView indicators
    const isAndroidWebView = userAgent.includes('wv');
    const isGenericWebView = userAgent.includes('webview');

    // Check for React Native WebView injection
    // @ts-ignore
    const isRNWebView = !!window.ReactNativeWebView;

    return isAndroidWebView || isGenericWebView || isRNWebView;
};

# @ammarahmed/nativescript-webview

A NativeScript webview plugin that wraps the popular [react-native-webview](https://github.com/react-native-webview/react-native-webview) library using [Open Native](https://github.com/OpenNative). Seemlessly integrate web content into your NativeScript applications using the robust and feature rich WebView library.

<img src="https://github.com/ammarahm-ed/nativescript-plugins/blob/main/packages/nativescript-webview/screenshot.png" />

## Installation

```bash
npm install @open-native/core @ammarahmed/nativescript-webview react-native-webview
```
Make sure to set up `@open-native/core` in your project following the [Open Native Getting Started](https://open-native.org) guide.

## Usage

### Core

1. Register the plugin namespace with Page's `xmlns` attribute providing your prefix( `ui`, for example).

```xml
<Page xmlns:ui="@ammarahmed/nativescript-webview">
```

2. Access the `WebView` view through the prefix.

```xml
<Page xmlns="http://schemas.nativescript.org/tns.xsd" xmlns:ui="@ammarahmed/nativescript-webview">
    <ui:WebView source="{{ source }}"/>
</Page>
```
---

### Angular

1. Add `NativeScriptWebViewModule` to the module imports where you want to use the view.

```typescript
import { NativeScriptWebViewModule } from '@ammarahmed/nativescript-webview/angular';
imports: [NativeScriptWebViewModule];
```

2. Use the view in HTML.

```xml
<NSWebView [source]="source"></NSWebView>
```
---

### Vue

1. Register the view in the `app.ts` file. 
```ts
import { registerElement } from 'nativescript-vue';

registerElement("NSWebView", ()=> require("@ammarahmed/nativescript-webview").NSWebView)
```
2. Use the view in a `.vue` file.

```xml
<NSWebView :source="source" />
```
---

# Reference

This document lays out the current public properties and methods for the NativeScript WebView. This is mostly based on the original [react-native-webview API reference](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md) with some small differences.

### `source`

Loads static HTML or a URI (with optional headers) in the WebView. Note that static HTML will require setting [`originWhitelist`](README.md#originwhitelist) to `["*"]`.

The object passed to `source` can have either of the following shapes:

**Load uri**

- `uri` (string) - The URI to load in the `WebView`. Can be a local or remote file, and can be changed with React state or props to navigate to a new page.
- `method` (string) - The HTTP Method to use. Defaults to GET if not specified. On Android and Windows, the only supported methods are GET and POST.
- `headers` (object) - Additional HTTP headers to send with the request. On Android, this can only be used with GET requests. See the [Guide](Guide.md#setting-custom-headers) for more information on setting custom headers.
- `body` (string) - The HTTP body to send with the request. This must be a valid UTF-8 string, and will be sent exactly as specified, with no additional encoding (e.g. URL-escaping or base64) applied. On Android and Windows, this can only be used with POST requests.

**Local files**

Place the files you want to load in app's `assets` folder. Then pass in the path to your file as URI:

```js
// Android
`file:///android_asset/app/assets/path/to/your/html/file.html` // iOS
` app/assets/path/to/your/file.html`;
```

**Static HTML**

_Note that using static HTML requires the WebView property [originWhiteList](README.md#originWhiteList) to `['*']`. For some content, such as video embeds (e.g. Twitter or Facebook posts with video), the baseUrl needs to be set for the video playback to work_

- `html` (string) - A static HTML page to display in the WebView.
- `baseUrl` (string) - The base URL to be used for any relative links in the HTML. This is also used for the origin header with CORS requests made from the WebView. See [Android WebView Docs](https://developer.android.com/reference/android/webkit/WebView#loadDataWithBaseURL)

| Type   | Required |
| ------ | -------- |
| object | No       |

---

### `automaticallyAdjustContentInsets`

Controls whether to adjust the content inset for web views that are placed behind a navigation bar, tab bar, or toolbar. The default value is `true`.

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |

---

### `automaticallyAdjustsScrollIndicatorInsets`

Controls whether to adjust the scroll indicator inset for web views that are placed behind a navigation bar, tab bar, or toolbar. The default value `false`. (iOS 13+)

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS(13+) |

---

### `injectedJavaScript`

Set this to provide JavaScript that will be injected into the web page after the document finishes loading, but before other subresources finish loading.

Make sure the string evaluates to a valid type (`true` works) and doesn't otherwise throw an exception.

On iOS, see [`WKUserScriptInjectionTimeAtDocumentEnd`](https://developer.apple.com/documentation/webkit/wkuserscriptinjectiontime/wkuserscriptinjectiontimeatdocumentend?language=objc). Be sure
to set an [`onMessage`](README.md#onmessage) handler, even if it's a no-op, or the code will not be run.

| Type   | Required | Platform     |
| ------ | -------- | ------------ |
| string | No       | iOS, Android |

---

### `injectedJavaScriptBeforeContentLoaded`

Set this to provide JavaScript that will be injected into the web page after the document element is created, but before other subresources finish loading.

Make sure the string evaluates to a valid type (`true` works) and doesn't otherwise throw an exception.

On iOS, see [`WKUserScriptInjectionTimeAtDocumentStart`](https://developer.apple.com/documentation/webkit/wkuserscriptinjectiontime/wkuserscriptinjectiontimeatdocumentstart?language=objc)

> **Warning**
> On Android, this may work, but it is not 100% reliable (see [#1609](https://github.com/react-native-webview/react-native-webview/issues/1609) and [#1099](https://github.com/react-native-webview/react-native-webview/pull/1099)). Consider `injectedJavaScriptObject` instead.

| Type   | Required | Platform                           |
| ------ | -------- | ---------------------------------- |
| string | No       | iOS, Android (experimental) |

To learn more, read the [Communicating between JS and Native](Guide.md#communicating-between-js-and-native) guide.

---

### `injectedJavaScriptForMainFrameOnly`

If `true` (default; mandatory for Android), loads the `injectedJavaScript` only into the main frame.

If `false`, (only supported on iOS), loads it into all frames (e.g. iframes).

| Type | Required | Platform                                          |
| ---- | -------- | ------------------------------------------------- |
| bool | No       | iOS (only `true` supported for Android) |

---

### `injectedJavaScriptBeforeContentLoadedForMainFrameOnly`

If `true` (default; mandatory for Android), loads the `injectedJavaScriptBeforeContentLoaded` only into the main frame.

If `false`, (only supported on iOS), loads it into all frames (e.g. iframes).

| Type | Required | Platform                                          |
| ---- | -------- | ------------------------------------------------- |
| bool | No       | iOS (only `true` supported for Android) |

---

### `injectedJavaScriptObject`

Inject any JavaScript object into the webview so it is available to the JS running on the page.

| Type | Required | Platform     |
| ---- | -------- | ------------ |
| obj  | No       | Android only |

Example:

Set a value to be used in JavaScript.

Note: Any value in the object will be accessible to _all_ frames of the webpage. If sensitive values are present please ensure that you have a strict Content Security Policy set up to avoid data leaking.

You can access the object in the webview using `window.ReactNativeWebView.injectedObject`.

```js
window.ReactNativeWebView.injectedObjectJson();
```

---

### `mediaPlaybackRequiresUserAction`

Boolean that determines whether HTML5 audio and video requires the user to tap them before they start playing. The default value is `true`. (Android API minimum version 17).

NOTE: the default `true` value might cause some videos to hang loading on iOS. Setting it to `false` could fix this issue.

| Type | Required | Platform            |
| ---- | -------- | ------------------- |
| bool | No       | iOS, Android |

---

### `originWhitelist`

List of origin strings to allow being navigated to. The strings allow wildcards and get matched against _just_ the origin (not the full URL). If the user taps to navigate to a new page but the new page is not in this whitelist, the URL will be handled by the OS. The default whitelisted origins are "http://_" and "https://_".

| Type             | Required | Platform     |
| ---------------- | -------- | ------------ |
| array of strings | No       | iOS, Android |

---

### `scalesPageToFit`

Boolean that controls whether the web content is scaled to fit the view and enables the user to change the scale. The default value is `true`.

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | Android  |

---

### `decelerationRate`

A floating-point number that determines how quickly the scroll view decelerates after the user lifts their finger. You may also use the string shortcuts `"normal"` and `"fast"` which match the underlying iOS settings for `UIScrollViewDecelerationRateNormal` and `UIScrollViewDecelerationRateFast` respectively:

- normal: 0.998
- fast: 0.99 (the default for iOS web view)

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | iOS      |

---

### `domStorageEnabled`

Boolean value to control whether DOM Storage is enabled. Used only in Android.

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | Android  |

---

### `javaScriptEnabled`

Boolean value to enable JavaScript in the `WebView`. The default value is `true`.

| Type | Required |
| ---- | -------- |
| bool | No       |

---

### `javaScriptCanOpenWindowsAutomatically`

A Boolean value indicating whether JavaScript can open windows without user interaction. The default value is `false`.

| Type | Required |
| ---- | -------- |
| bool | No       |

---

### `androidLayerType`

Specifies the layer type.

Possible values for `androidLayerType` are:

- `none` (default) - The view does not have a layer.
- `software` - The view has a software layer. A software layer is backed by a bitmap and causes the view to be rendered using Android's software rendering pipeline, even if hardware acceleration is enabled.
- `hardware` - The view has a hardware layer. A hardware layer is backed by a hardware specific texture and causes the view to be rendered using Android's hardware rendering pipeline, but only if hardware acceleration is turned on for the view hierarchy.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| string | No       | Android  |

---

### `mixedContentMode`

Specifies the mixed content mode. i.e WebView will allow a secure origin to load content from any other origin.

Possible values for `mixedContentMode` are:

- `never` (default) - WebView will not allow a secure origin to load content from an insecure origin.
- `always` - WebView will allow a secure origin to load content from any other origin, even if that origin is insecure.
- `compatibility` - WebView will attempt to be compatible with the approach of a modern web browser with regard to mixed content.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| string | No       | Android  |

---

### `thirdPartyCookiesEnabled`

Boolean value to enable third party cookies in the `WebView`. Used on Android Lollipop and above only as third party cookies are enabled by default on Android Kitkat and below and on iOS. The default value is `true`. For more on cookies, read the [Guide](Guide.md#Managing-Cookies)

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | Android  |

---

### `userAgent`

Sets the user-agent for the `WebView`.

| Type   | Required | Platform     |
| ------ | -------- | ------------ |
| string | No       | iOS, Android |

---

### `applicationNameForUserAgent`

Append to the existing user-agent. Setting `userAgent` will override this.

| Type   | Required | Platform     |
| ------ | -------- | ------------ |
| string | No       | iOS, Android |

### `allowsFullscreenVideo`

Boolean that determines whether videos are allowed to be played in fullscreen. The default value is `false`.

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | Android  |

---

### `allowsInlineMediaPlayback`

Boolean that determines whether HTML5 videos play inline or use the native full-screen controller. The default value is `false`.

> **NOTE**
>
> In order for video to play inline, not only does this property need to be set to `true`, but the video element in the HTML document must also include the `webkit-playsinline` attribute.

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |

---

### `allowsAirPlayForMediaPlayback`

A Boolean value indicating whether AirPlay is allowed. The default value is `false`.

| Type    | Required | Platform      |
| ------- | -------- | ------------- |
| boolean | No       | iOS |

---

### `bounces`

Boolean value that determines whether the web view bounces when it reaches the edge of the content. The default value is `true`.

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |

---

### `overScrollMode`

Specifies the over scroll mode.

Possible values for `overScrollMode` are:

- `always` (default) - Always allow a user to over-scroll this view, provided it is a view that can scroll.
- `content` - Allow a user to over-scroll this view only if the content is large enough to meaningfully scroll, provided it is a view that can scroll.
- `never` - Never allow a user to over-scroll this view.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| string | No       | Android  |

---

### `contentInset`

The amount by which the web view content is inset from the edges of the scroll view. Defaults to {top: 0, left: 0, bottom: 0, right: 0}.

| Type                                                               | Required | Platform |
| ------------------------------------------------------------------ | -------- | -------- |
| object: {top: number, left: number, bottom: number, right: number} | No       | iOS      |

---

### `contentInsetAdjustmentBehavior`

This property specifies how the safe area insets are used to modify the content area of the scroll view. The default value of this property is "never". Available on iOS 11 and later. Defaults to `never`.

Possible values:

- `automatic`
- `scrollableAxes`
- `never`
- `always`

| Type   | Required | Platform |
| ------ | -------- | -------- |
| string | No       | iOS      |

---

### `contentMode`

Controls the type of content to load. Available on iOS 13 and later. Defaults to `recommended`, which loads mobile content on iPhone & iPad Mini but desktop content on larger iPads.

See [Introducing Desktop-class Browsing on iPad](https://developer.apple.com/videos/play/wwdc2019/203/) for more.

Possible values:

- `recommended`
- `mobile`
- `desktop`

| Type   | Required | Platform |
| ------ | -------- | -------- |
| string | No       | iOS      |

---

### `dataDetectorTypes`

Determines the types of data converted to clickable URLs in the web view's content. By default only phone numbers are detected.

You can provide one type or an array of many types.

Possible values for `dataDetectorTypes` are:

- `phoneNumber`
- `link`
- `address`
- `calendarEvent`
- `none`
- `all`
- `trackingNumber`
- `flightNumber`
- `lookupSuggestion`

| Type             | Required | Platform |
| ---------------- | -------- | -------- |
| string, or array | No       | iOS      |

---

### `scrollEnabled`

Boolean value that determines whether scrolling is enabled in the `WebView`. The default value is `true`. Setting this to `false` will prevent the webview from moving the document body when the keyboard appears over an input.

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |

---

### `nestedScrollEnabled`

Boolean value that determines whether scrolling is possible in the `WebView` when used inside a `ScrollView` on Android. The default value is `false`.

Setting this to `true` will prevent the `ScrollView` to scroll when scrolling from inside the `WebView`.

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | Android  |

---

### `setBuiltInZoomControls`

Sets whether the WebView should use its built-in zoom mechanisms. The default value is `true`. Setting this to `false` will prevent the use of a pinch gesture to control zooming.

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | Android  |

---

### `setDisplayZoomControls`

Sets whether the WebView should display on-screen zoom controls when using the built-in zoom mechanisms (see `setBuiltInZoomControls`). The default value is `false`.

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | Android  |

---

### `directionalLockEnabled`

A Boolean value that determines whether scrolling is disabled in a particular direction.
The default value is `true`.

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | iOS      |

---

### `showsHorizontalScrollIndicator`

Boolean value that determines whether a horizontal scroll indicator is shown in the `WebView`. The default value is `true`.

| Type | Required | Platform     |
| ---- | -------- | ------------ |
| bool | No       | iOS, Android |

---

### `showsVerticalScrollIndicator`

Boolean value that determines whether a vertical scroll indicator is shown in the `WebView`. The default value is `true`.

| Type | Required | Platform     |
| ---- | -------- | ------------ |
| bool | No       | iOS, Android |

---

### `geolocationEnabled`

Set whether Geolocation is enabled in the `WebView`. The default value is `false`. Used only in Android.

| Type | Required | Platform |
| ---- | -------- | -------- |
| bool | No       | Android  |

---

### `allowFileAccessFromFileURLs`

Boolean that sets whether JavaScript running in the context of a file scheme URL should be allowed to access content from other file scheme URLs. The default value is `false`.

| Type | Required | Platform     |
| ---- | -------- | ------------ |
| bool | No       | iOS, Android |

---

### `allowUniversalAccessFromFileURLs`

Boolean that sets whether JavaScript running in the context of a file scheme URL should be allowed to access content from any origin. Including accessing content from other file scheme URLs. The default value is `false`.

| Type | Required | Platform     |
| ---- | -------- | ------------ |
| bool | No       | iOS, Android |

---

### `allowingReadAccessToURL`

A String value that indicates which URLs the WebView's file can then reference in scripts, AJAX requests, and CSS imports. This is only used in for WebViews that are loaded with a `source.uri` set to a `'file://'` URL. If not provided, the default is to only allow read access to the URL provided in `source.uri` itself.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| string | No       | iOS      |

---

### `keyboardDisplayRequiresUserAction`

If `false`, web content can programmatically display the keyboard. The default value is `true`.

| Type    | Required | Platform |
| ------- | -------- | -------- |
| boolean | No       | iOS      |

---

### `hideKeyboardAccessoryView`

If `true`, this will hide the keyboard accessory view (< > and Done).

| Type    | Required | Platform |
| ------- | -------- | -------- |
| boolean | No       | iOS      |

---

### `allowsBackForwardNavigationGestures`

If `true`, this will be able horizontal swipe gestures. The default value is `false`.

| Type    | Required | Platform |
| ------- | -------- | -------- |
| boolean | No       | iOS      |

---

### `incognito`

Does not store any data within the lifetime of the WebView.

| Type    | Required | Platform            |
| ------- | -------- | ------------------- |
| boolean | No       | iOS, Android |

---

### `allowFileAccess`

If `true`, this will allow access to the file system via `file://` URI's. The default value is `false`.

| Type    | Required | Platform |
| ------- | -------- | -------- |
| boolean | No       | Android  |

---

### `saveFormDataDisabled`

Sets whether the WebView should disable saving form data. The default value is `false`. This function does not have any effect from Android API level 26 onwards as there is an Autofill feature which stores form data.

| Type    | Required | Platform |
| ------- | -------- | -------- |
| boolean | No       | Android  |

---

### `cacheEnabled`

Sets whether WebView should use browser caching.

| Type    | Required | Default | Platform     |
| ------- | -------- | ------- | ------------ |
| boolean | No       | true    | iOS, Android |

---

### `cacheMode`

Overrides the way the cache is used. The way the cache is used is based on the navigation type. For a normal page load, the cache is checked and content is re-validated as needed. When navigating back, content is not revalidated, instead the content is just retrieved from the cache. This property allows the client to override this behavior.

Possible values are:

- `LOAD_DEFAULT` - Default cache usage mode. If the navigation type doesn't impose any specific behavior, use cached resources when they are available and not expired, otherwise load resources from the network.
- `LOAD_CACHE_ELSE_NETWORK` - Use cached resources when they are available, even if they have expired. Otherwise load resources from the network.
- `LOAD_NO_CACHE` - Don't use the cache, load from the network.
- `LOAD_CACHE_ONLY` - Don't use the network, load from the cache.

| Type   | Required | Default      | Platform |
| ------ | -------- | ------------ | -------- |
| string | No       | LOAD_DEFAULT | Android  |

---

### `pagingEnabled`

If the value of this property is `true`, the scroll view stops on multiples of the scroll view’s bounds when the user scrolls. The default value is `false`.

| Type    | Required | Platform |
| ------- | -------- | -------- |
| boolean | No       | iOS      |

---

### `allowsLinkPreview`

A Boolean value that determines whether pressing on a link displays a preview of the destination for the link. In iOS this property is available on devices that support 3D Touch. In iOS 10 and later, the default value is `true`; before that, the default value is `false`.

| Type    | Required | Platform      |
| ------- | -------- | ------------- |
| boolean | No       | iOS |

---

### `sharedCookiesEnabled`

Set `true` if shared cookies from `[NSHTTPCookieStorage sharedHTTPCookieStorage]` should be used for every load request in the WebView. The default value is `false`. For more on cookies, read the [Guide](Guide.md#Managing-Cookies)

| Type    | Required | Platform      |
| ------- | -------- | ------------- |
| boolean | No       | iOS |

---

### `textZoom`

If the user has set a custom font size in the Android system, an undesirable scale of the site interface in WebView occurs.

When setting the standard textZoom (100) parameter size, this undesirable effect disappears.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | Android  |

---

### `pullToRefreshEnabled`

Boolean value that determines whether a pull to refresh gesture is available in the `WebView`. The default value is `false`. If `true`, sets `bounces` automatically to `true`.

| Type    | Required | Platform |
| ------- | -------- | -------- |
| boolean | No       | iOS      |

### `ignoreSilentHardwareSwitch`

(ios only)

When set to `true` the hardware silent switch is ignored. Default: `false`

| Type    | Required | Platform |
| ------- | -------- | -------- |
| boolean | No       | iOS      |

### `limitsNavigationsToAppBoundDomains`

If `true` indicates to WebKit that a WKWebView will only navigate to app-bound domains. Only applicable for iOS 14 or greater.

Once set, any attempt to navigate away from an app-bound domain will fail with the error “App-bound domain failure.”
Applications can specify up to 10 “app-bound” domains using a new Info.plist key `WKAppBoundDomains`. For more information see [App-Bound Domains](https://webkit.org/blog/10882/app-bound-domains/).

| Type    | Required | Platform |
| ------- | -------- | -------- |
| boolean | No       | iOS      |

---

### `textInteractionEnabled`

If false indicates to WebKit that a WKWebView will not interact with text, thus not showing a text selection loop. Only applicable for iOS 14.5 or greater.

Defaults to `true`.

| Type    | Required | Platform |
| ------- | -------- | -------- |
| boolean | No       | iOS      |

---

### `suppressMenuItems`

Allows to suppress menu item from the default context menu.

Possible values are:

- `cut`
- `copy`
- `paste`
- `delete`
- `select`
- `selectAll`
- `replace`
- `lookup`
- `translate`
- `bold`
- `italic`
- `underline`
- `share`

| Type             | Required | Default | Platform |
| ---------------- | -------- | ------- | -------- |
| array of strings | No       | []      | iOS      |

### `mediaCapturePermissionGrantType`

This property specifies how to handle media capture permission requests. Defaults to `prompt`, resulting in the user being prompted repeatedly. Available on iOS 15 and later.

Possible values:

- `grantIfSameHostElsePrompt`: If the security origin's host of the permission request equals the host of the WebView's current URL, the permission is granted if it has been granted before. Otherwise, the user gets prompted.
- `grantIfSameHostElseDeny`: If the security origin's host of the permission request equals the host of the WebView's current URL, the permission is granted if it has been granted before. Otherwise, it gets denied.
- `deny`
- `grant`: The permission is granted if it has been granted before.
- `prompt`

Note that a grant may still result in a prompt, for example if the user has never been prompted for the permission before.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| string | No       | iOS      |

---

### `autoManageStatusBarEnabled`

If set to `true`, the status bar will be automatically hidden/shown by WebView, specifically when full screen video is being watched. If `false`, WebView will not manage the status bar at all. The default value is `true`.

| Type    | Required | Platform |
| ------- | -------- | -------- |
| boolean | No       | iOS      |

### `setSupportMultipleWindows`

Sets whether the WebView supports multiple windows. See [Android documentation](<'https://developer.android.com/reference/android/webkit/WebSettings#setSupportMultipleWindows(boolean)'>) for more information.
Setting this to `false` can expose the application to this [vulnerability](https://alesandroortiz.com/articles/uxss-android-webview-cve-2020-6506/) allowing a malicious iframe to escape into the top layer DOM.

| Type    | Required | Default | Platform |
| ------- | -------- | ------- | -------- |
| boolean | No       | true    | Android  |

### `enableApplePay`

A Boolean value which, when set to `true`, WebView will be rendered with Apple Pay support. Once set, websites will be able to invoke Apple Pay from React Native Webview.
This comes with a cost features like [`injectJavaScript`](README.md#injectjavascriptstr), html5 History, [`sharedCookiesEnabled`](README.md#sharedCookiesEnabled), [`injectedJavaScript`](README.md#injectedjavascript), [`injectedJavaScriptBeforeContentLoaded`](README.md#injectedjavascriptbeforecontentloaded) will not work See [Apple Pay Release Note](https://developer.apple.com/documentation/safari-release-notes/safari-13-release-notes#Payment-Request-API).

If you are required to send message to App , webpage has to explicitly call webkit message handler and receive it on `onMessage` handler on react native side

```javascript
window.webkit.messageHandlers.ReactNativeWebView.postMessage('hello apple pay');
```

| Type    | Required | Default | Platform |
| ------- | -------- | ------- | -------- |
| boolean | No       | false   | iOS      |

### `forceDarkOn`

Configuring Dark Theme

_NOTE_ : The force dark setting is not persistent. You must call the static method every time your app process is started.

_NOTE_ : The change from day<->night mode is a configuration change so by default the activity will be restarted and pickup the new values to apply the theme. Take care when overriding this default behavior to ensure this method is still called when changes are made.

| Type    | Required | Platform |
| ------- | -------- | -------- |
| boolean | No       | Android  |

### `menuItems`

An array of custom menu item objects that will be shown when selecting text. An empty array will suppress the menu. Used in tandem with `onCustomMenuSelection`

| Type                                           | Required | Platform     |
| ---------------------------------------------- | -------- | ------------ |
| array of objects: {label: string, key: string} | No       | iOS, Android |

### `customMenuSelection`

Function called when a custom menu item is selected. It receives a Native event, which includes three custom keys: `label`, `key` and `selectedText`.

| Type     | Required | Platform     |
| -------- | -------- | ------------ |
| function | No       | iOS, Android |

### `basicAuthCredential`

An object that specifies the credentials of a user to be used for basic authentication.

- `username` (string) - A username used for basic authentication.
- `password` (string) - A password used for basic authentication.

| Type   | Required |
| ------ | -------- |
| object | No       |

### `minimumFontSize`

Android enforces a minimum font size based on this value. A non-negative integer between 1 and 72. Any number outside the specified range will be pinned. Default value is 8. If you are using smaller font sizes and are having trouble fitting the whole window onto one screen, try setting this to a smaller value.

| Type   | Required | Platform |
| ------ | -------- | -------- |
| number | No       | Android  |

Example:

```jsx
<WebView minimumFontSize={1} />
```

### `downloadingMessage`

This is the message that is shown in the Toast when downloading a file via WebView. Default message is "Downloading".

| Type   | Required | Platform |
| ------ | -------- | -------- |
| string | No       | Android  |

### `lackPermissionToDownloadMessage`

This is the message that is shown in the Toast when the webview is unable to download a file. Default message is "Cannot download files as permission was denied. Please provide permission to write to storage, in order to download files.".

| Type   | Required | Platform |
| ------ | -------- | -------- |
| string | No       | Android  |

### `allowsProtectedMedia`

Whether or not the Webview can play media protected by DRM. Default is `false`.
⚠️ Setting this to `false` won't revoke the permission already granted to the current webpage. In order to do so, you'd have to reload the page as well. ⚠️

| Type    | Required | Platform |
| ------- | -------- | -------- |
| boolean | No       | Android  |

### `fraudulentWebsiteWarningEnabled`

A Boolean value that indicates whether the web view shows warnings for suspected fraudulent content, such as malware or phishing attempts. The default value is `true`. (iOS 13+)

| Type    | Required | Default | Platform |
| ------- | -------- | ------- | -------- |
| boolean | No       | true    | iOS      |

### `webviewDebuggingEnabled`

Whether or not the webview can be debugged remotely using Safari / Chrome.
Default is `false`. Supported on iOS as of 16.4, previous versions always allow debugging by default.

| Type    | Required | Platform      |
| ------- | -------- | ------------- |
| boolean | No       | iOS & Android |

## Events

### `error`

Event that is invoked when the `WebView` load fails.

| Type  | Required |
| ----- | -------- |
| Event | No       |

The `error` event is called with a `event.nativeEvent` with these properties:

```
canGoBack
canGoForward
code
description
didFailProvisionalNavigation
domain
loading
target
title
url
```

---

### `load`

Event that is invoked when the `WebView` has finished loading.

| Type  | Required |
| ----- | -------- |
| Event | No       |

The `load` event is called with a `event.nativeEvent` with these properties:

```
canGoBack
canGoForward
loading
target
title
url
```

---

### `loadEnd`

Event that is invoked when the `WebView` load succeeds or fails.

| Type  | Required |
| ----- | -------- |
| Event | No       |

The `loadEnd` event is called with a `event.nativeEvent` with these properties:

```
canGoBack
canGoForward
loading
target
title
url
```

---

### `loadingStart`

Event that is invoked when the `WebView` starts loading.

| Type  | Required |
| ----- | -------- |
| Event | No       |

The `loadingStart` event is called with a `event.nativeEvent` with these properties:

```
canGoBack
canGoForward
loading
target
title
url
```

---

### `loadingProgress`

Event that is invoked when the `WebView` is loading.

| Type  | Required | Platform            |
| ----- | -------- | ------------------- |
| Event | No       | iOS, Android |

The `loadingProgress` event is called with a `event.nativeEvent` with these properties:

```
canGoBack
canGoForward
loading
progress
target
title
url
```

---

### `httpError`

Event that is invoked when the `WebView` receives an http error.

> **_Note_**
> Android API minimum level 23.

| Type  | Required |
| ----- | -------- |
| Event | No       |

The `httpError` event is called with a `event.nativeEvent` with these properties:

```
canGoBack
canGoForward
description
loading
statusCode
target
title
url
```

> **_Note_**
> Description is only used on Android

---

### `renderProcessGone`

Event that is invoked when the `WebView` process crashes or is killed by the OS on Android.

> **_Note_**
> Android API minimum level 26. Android Only

| Type  | Required |
| ----- | -------- |
| Event | No       |

The `renderProcressGone` event is called with a `event.nativeEvent` with these properties:

```
didCrash
```

---

### `message`

Function that is invoked when the webview calls `window.ReactNativeWebView.postMessage`. Setting this property will inject this global into your webview.

`window.ReactNativeWebView.postMessage` accepts one argument, `data`, which will be available on the event object, `event.nativeEvent.data`. `data` must be a string.

| Type  | Required |
| ----- | -------- |
| Event | No       |

---

### `navigationStateChange`

Event that is invoked when the `WebView` loading starts or ends.

| Type  | Required |
| ----- | -------- |
| Event | No       |

The `navigationStateChange` event is called with the following properties:

```
canGoBack
canGoForward
loading
navigationType (iOS only)
target
title
url
```

---

### `openWindow`<!-- Link generated with jump2header -->

Event that is invoked when the `WebView` should open a new window.

This happens when the JS calls `window.open('http://someurl', '_blank')` or when the user clicks on a `<a href="http://someurl" target="_blank">` link.

| Type  | Required |
| ----- | -------- |
| Event | No       |

The `openWindow` event is called with a `event.nativeEvent` with these properties:

```
targetUrl
```

---

### `contentProcessDidTerminate`

Event that is invoked when the `WebView` content process is terminated.

| Type  | Required | Platform                |
| ----- | -------- | ----------------------- |
| Event | No       | iOS |

iOS Web views use a separate process to render and manage web content. WebKit calls this method when the process for the specified web view terminates for any reason.
The reason is not necessarily a crash. For instance, since iOS WebViews are not included in the total RAM of the app, they can be terminated independently of the app to liberate memory for new apps the user is opening. It's not unexpected to have WebViews get terminated after a while in the background.

The `contentProcessDidTerminate` event is called with a `event.nativeEvent` with these properties:

```
canGoBack
canGoForward
loading
target
title
url
```

---

### `scroll`

Event that is invoked when the scroll event is fired in the `WebView`.

| Type  | Required | Platform     |
| ----- | -------- | ------------ |
| Event | No       | iOS, Android |

The `scroll` event is called with a `event.nativeEvent` with these properties:

```
contentInset
contentOffset
contentSize
layoutMeasurement
velocity
zoomScale
```

---

### `shouldStartLoad`

Event that allows custom handling of any web view requests. Set `event.nativeEvent.shouldStart = true` from the function to continue loading the request and `false` to stop loading.

On Android, is not called on the first load.

| Type     | Required | Platform            |
| -------- | -------- | ------------------- |
| Event | No       | iOS, Android |

The `event.nativeEvent` object includes these properties:

```
title
url
loading
target
canGoBack
canGoForward
lockIdentifier
mainDocumentURL (iOS only)
navigationType (iOS only)
isTopFrame (iOS only)
hasTargetFrame (iOS only)
shouldStart
```

The `hasTargetFrame` prop is a boolean that is `false` when the navigation targets a new window or tab, otherwise it should be `true` ([more info](https://developer.apple.com/documentation/webkit/wknavigationaction/1401918-targetframe)). Note that this prop should always be `true` when `onOpenWindow` event is registered on the WebView because the `false` case is intercepted by this event.

---

### `fileDownload`

This property is iOS-only.

Function that is invoked when the client needs to download a file.

iOS 13+ only: If the webview navigates to a URL that results in an HTTP
response with a Content-Disposition header 'attachment...', then
this will be called.

iOS 8+: If the MIME type indicates that the content is not renderable by the
webview, that will also cause this to be called. On iOS versions before 13,
this is the only condition that will cause this function to be called.

The application will need to provide its own code to actually download
the file.

If not provided, the default is to let the webview try to render the file.

| Type  | Required | Platform |
| ----- | -------- | -------- |
| Event | No       | iOS      |

---

## Methods

### `goForward()`

```javascript
goForward();
```

Go forward one page in the web view's history.

### `goBack()`

```javascript
goBack();
```

Go back one page in the web view's history.

### `reload()`

```javascript
reload();
```

Reloads the current page.

### `stopLoading()`

```javascript
stopLoading();
```

Stop loading the current page.

### `injectJavaScript(str)`

```javascript
injectJavaScript('... javascript string ...');
```

Executes the JavaScript string.

To learn more, read the [Communicating between JS and Native](Guide.md#communicating-between-js-and-native) guide.

### `requestFocus()`

```javascript
requestFocus();
```

Request the webView to ask for focus. (People working on TV apps might want having a look at this!)

### `postMessage(str)`

```javascript
postMessage('message');
```

Post a message to WebView, handled by [`onMessage`](README.md#onmessage).

### `clearFormData()`

(android only)

```javascript
clearFormData();
```

Removes the autocomplete popup from the currently focused form field, if present. [developer.android.com reference](<https://developer.android.com/reference/android/webkit/WebView.html#clearFormData()>)

### `clearCache(bool)`

```javascript
clearCache(true);
```

Clears the resource cache. Note that the cache is per-application, so this will clear the cache for all WebViews used. [developer.android.com reference](<https://developer.android.com/reference/android/webkit/WebView.html#clearCache(boolean)>)

In iOS, includeDiskFiles will also remove data from the web storages and databases.[developer.apple.com reference](https://developer.apple.com/documentation/webkit/wkwebsitedatastore/1532936-removedata)

### `clearHistory()`

(android only)

```javascript
clearHistory();
```

## License

Apache License Version 2.0

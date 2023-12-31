import { EventData, GestureTypes, ShownModallyData } from '@nativescript/core';
import { BatchedBridge, Linking, NativeModules } from '@open-native/core';
import { WebViewCustomMenuSelectionEvent, WebViewNativeEvent, WebViewNativeProgressEvent } from 'react-native-webview/lib/RNCWebViewNativeComponent';
import { DecelerationRateConstant, FileDownload, ShouldStartLoadRequest, WebViewError, WebViewHttpError, WebViewMessage, WebViewNavigation, WebViewOpenWindow, WebViewRenderProcessGoneDetail, WebViewSourceUri } from 'react-native-webview/lib/WebViewTypes';
import { NativeScriptWebViewCommon, WebViewNativeEvents } from './common';
import { compileWhitelist, defaultOriginWhitelist, passesWhitelist } from './utils';

export interface NativeScrollRectangle {
  left: number;
  top: number;
  bottom: number;
  right: number;
}

export interface NativeScrollPoint {
  x: number;
  y: number;
}

export interface NativeScrollVelocity {
  x: number;
  y: number;
}

export interface NativeScrollSize {
  height: number;
  width: number;
}

export interface NativeScrollEvent {
  contentInset: NativeScrollRectangle;
  contentOffset: NativeScrollPoint;
  contentSize: NativeScrollSize;
  layoutMeasurement: NativeScrollSize;
  velocity?: NativeScrollVelocity | undefined;
  zoomScale: number;
  /**
   * @platform ios
   */
  targetContentOffset?: NativeScrollPoint | undefined;
}

export interface NativeEventData<T = any> extends EventData {
  nativeEvent: T;
}

export type WebViewMessageEventData = NativeEventData<WebViewMessage>;
export type ShouldStartLoadRequestEventData = NativeEventData<ShouldStartLoadRequest>;
export type WebViewNavigationEventData = NativeEventData<WebViewNavigation>;
export type WebViewErrorEventData = NativeEventData<WebViewError>;
export type WebViewScrollEventData = NativeEventData<NativeScrollEvent>;
export type WebViewFileDownloadEventData = NativeEventData<FileDownload>;
export type WebViewNativeProgressEventData = NativeEventData<WebViewNativeProgressEvent>;
export type WebViewHttpErrorEventData = NativeEventData<WebViewHttpError>;
export type WebViewNativeEventData = NativeEventData<WebViewNativeEvent>;
export type WebViewOpenWindowEventData = NativeEventData<WebViewOpenWindow>;
export type WebViewCustomMenuSelectionEventData = NativeEventData<WebViewCustomMenuSelectionEvent>;
export type WebViewRenderProcessGoneEventData = NativeEventData<WebViewRenderProcessGoneDetail>;

let uniqueRef = 0;
export class WebView extends NativeScriptWebViewCommon {
  startUrl: string;
  lastErrorEvent: WebViewError;
  messagingModuleName: string;
  nativeProps: { [name: string]: any } = {};
  _viewTag: number;
  _viewManager: any;
  _originWhitelist: string[];

  public static navigationStateChangedEvent = 'navigationStateChange';
  public static shouldStartLoadEvent = 'shouldStartLoad';
  public static loadEvent = 'load';
  public static loadEndEvent = 'loadEnd';

  constructor() {
    super();

    this.cacheEnabled = true;
    this.javaScriptEnabled = true;
    //@ts-ignore
    this.originWhitelist = defaultOriginWhitelist;

    if (__IOS__) {
      this.useSharedProcessPool = true;
      this.textInteractionEnabled = true;
      this.injectedJavaScriptForMainFrameOnly = true;
      this.injectedJavaScriptBeforeContentLoadedForMainFrameOnly = true;

      this.on('shouldStartLoadWithRequest', this.onShouldStartLoadWithRequest);
    }

    if (__ANDROID__) {
      this.overScrollMode = 'always';
      this.thirdPartyCookiesEnabled = true;
      this.scalesPageToFit = true;
      this.allowsFullscreenVideo = false;
      this.allowFileAccess = false;
      this.saveFormDataDisabled = false;
      this.androidLayerType = 'none';
      this.setSupportMultipleWindows = true;
      this.setBuiltInZoomControls = true;
      this.setDisplayZoomControls = false;
      this.nestedScrollEnabled = false;
      this.messagingModuleName = `WebViewMessageHandler${(uniqueRef += 1)}`;

      BatchedBridge.registerCallableModule(this.messagingModuleName, {
        onMessage: (data: WebViewMessageEventData) => {
          this.notify({
            eventName: 'message',
            object: this,
            nativeEvent: data,
          });
        },
        onShouldStartLoadWithRequest: this.onShouldStartLoadWithRequest,
      });
    }

    this.on('loadingStart', (args: WebViewNavigationEventData) => {
      this.startUrl = args.nativeEvent.url;
      this.updateNavigationState(args);
    });

    this.on('loadingError', (args: WebViewErrorEventData) => {
      this.lastErrorEvent = args.nativeEvent;
      this.notify({
        eventName: 'loadEnd',
        object: this,
        nativeEvent: args.nativeEvent,
      });
    });

    this.on('loadingFinish', (args: WebViewNavigationEventData) => {
      this.notify({
        eventName: 'load',
        object: this,
        nativeEvent: args.nativeEvent,
      });
      this.notify({
        eventName: 'loadEnd',
        object: this,
        nativeEvent: args.nativeEvent,
      });
      this.updateNavigationState(args);
    });
  }

  set originWhitelist(value: string[]) {
    this._originWhitelist = value;
  }

  get originWhitelist(): string[] {
    return this._originWhitelist;
  }

  set decelerationRate(value: number | DecelerationRateConstant) {
    const prop = 'decelerationRate';
    let newDecelerationRate = value;
    if (newDecelerationRate === 'normal') {
      newDecelerationRate = 0.998;
    } else if (newDecelerationRate === 'fast') {
      newDecelerationRate = 0.99;
    }
    let newValue = newDecelerationRate;
    if (newValue === this.nativeProps[prop]) return;
    this.nativeProps[prop] = newValue;
    if (this.nativeViewProtected) {
      this._viewManager.setNativeProp(this.nativeViewProtected, prop, this.nativeProps[prop]);
    }
  }

  set injectedJavaScriptObject(value: object) {
    const prop = 'injectedJavaScriptObject';
    if (value === this.nativeProps[prop]) return;
    this.nativeProps[prop] = value;
    if (this.nativeViewProtected) {
      this._viewManager.setNativeProp(this.nativeViewProtected, prop, JSON.stringify(this.nativeProps[prop]));
    }
  }

  get injectedJavaScriptObject(): object {
    return this.nativeProps['injectedJavaScriptObject'];
  }

  onShouldStartLoadWithRequest = (data: ShouldStartLoadRequestEventData) => {
    let shouldStart = true;
    const eventObject: ShouldStartLoadRequest & {
      shouldStart?: boolean;
    } = data.nativeEvent;

    const { url, lockIdentifier } = eventObject;
    if (!passesWhitelist(compileWhitelist(this.originWhitelist), url)) {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(url);
          }
          console.warn(`Can't open url: ${url}`);
          return undefined;
        })
        .catch((e) => {
          console.warn('Error opening URL: ', e);
        });
      shouldStart = false;
    } else if (this.hasListeners(WebView.shouldStartLoadEvent)) {
      this.notify({
        eventName: WebView.shouldStartLoadEvent,
        object: this,
        nativeEvent: eventObject,
      });
      shouldStart = eventObject.shouldStart;
    }
    if (lockIdentifier) {
      NativeModules.RNCWebView.shouldStartLoadWithLockIdentifier(shouldStart, eventObject.lockIdentifier);
    } else if (eventObject.shouldStart && this.nativeViewProtected) {
      this.loadUrl(eventObject.url);
    }
  };

  updateNavigationState(event: WebViewNavigationEventData) {
    if (this.hasListeners(WebView.navigationStateChangedEvent)) {
      this.notify({
        eventName: WebView.navigationStateChangedEvent,
        object: this,
        nativeEvent: event.nativeEvent,
      });
    }
  }

  on(eventNames: string | GestureTypes, callback: (args: EventData) => void, thisArg?: any);
  on(event: 'loaded', callback: (args: EventData) => void, thisArg?: any);
  on(event: 'unloaded', callback: (args: EventData) => void, thisArg?: any);
  on(event: 'androidBackPressed', callback: (args: EventData) => void, thisArg?: any);
  on(event: 'showingModally', callback: (args: ShownModallyData) => void, thisArg?: any): void;
  on(event: 'shownModally', callback: (args: ShownModallyData) => void, thisArg?: any);
  on(event: 'message', callback: (args: WebViewMessageEventData) => void, thisArg?: any);
  on(event: 'scroll', callback: (args: WebViewScrollEventData) => void, thisArg?: any);
  on(event: 'fileDownload', callback: (args: WebViewFileDownloadEventData) => void, thisArg?: any);
  on(event: 'loadingStart', callback: (args: WebViewNavigationEventData) => void, thisArg?: any);
  on(event: 'loadingFinish', callback: (args: WebViewNavigationEventData) => void, thisArg?: any);
  on(event: 'loadingError', callback: (args: WebViewErrorEventData) => void, thisArg?: any);
  on(event: 'loadingProgress', callback: (args: WebViewNativeProgressEventData) => void, thisArg?: any);
  on(event: 'httpError', callback: (args: WebViewHttpErrorEventData) => void, thisArg?: any);
  on(event: 'contentProcessDidTerminate', callback: (args: WebViewNativeEventData) => void, thisArg?: any);
  on(event: 'openWindow', callback: (args: WebViewOpenWindowEventData) => void, thisArg?: any);
  on(event: 'customMenuSelection', callback: (args: WebViewCustomMenuSelectionEventData) => void, thisArg?: any);
  on(event: 'renderProcessGone', callback: (args: WebViewRenderProcessGoneEventData) => void, thisArg?: any);
  on(event: 'load', callback: (args: WebViewNavigationEventData) => void, thisArg?: any);
  on(event: 'loadEnd', callback: (args: WebViewNavigationEventData | WebViewErrorEventData) => void, thisArg?: any);
  on(event: 'shouldStartLoadWithRequest', callback: (args: ShouldStartLoadRequestEventData) => void, thisArg?: any);
  on(event: 'shouldStartLoadEvent', callback: (args: ShouldStartLoadRequestEventData) => void, thisArg?: any);
  on(event: 'navigationStateChange', callback: (args: WebViewNavigationEventData) => void, thisArg?: any);
  on(event: unknown, callback: unknown, thisArg?: unknown): any {
    super.on(event as any, callback as any, thisArg);
  }

  off(eventNames: string | GestureTypes | WebViewNativeEvents, callback?: (args: NativeEventData) => void, thisArg?: any) {
    super.off(eventNames, callback, thisArg);
  }

  addEventListener(arg: string | GestureTypes | WebViewNativeEvents, callback: (data: NativeEventData) => void, thisArg?: any): void {
    super.addEventListener(arg, callback, thisArg);
  }
  removeEventListener(arg: string | GestureTypes | WebViewNativeEvents, callback?: (data: NativeEventData) => void, thisArg?: any): void {
    super.removeEventListener(arg, callback, thisArg);
  }

  set src(value: string) {
    this.source = { uri: value };
  }

  get src(): string {
    return (this.source as WebViewSourceUri).uri;
  }

  goBack = () => {
    if (__IOS__) {
      this.commands.goBack(this._viewTag);
    } else {
      this.commands.goBack.call(this);
    }
  };

  goForward = () => {
    if (__IOS__) {
      this.commands.goForward(this._viewTag);
    } else {
      this.commands.goForward.call(this);
    }
  };

  reload = () => {
    if (__IOS__) {
      this.commands.reload(this._viewTag);
    } else {
      this.commands.reload.call(this);
    }
  };

  stopLoading = () => {
    if (__IOS__) {
      this.commands.stopLoading(this._viewTag);
    } else {
      this.commands.stopLoading.call(this);
    }
  };

  injectJavaScript = (script: string) => {
    if (__IOS__) {
      this.commands.injectJavaScript(this._viewTag, script);
    } else {
      this.commands.injectJavaScript.call(this, script);
    }
  };

  requestFocus = () => {
    if (__IOS__) {
      this.commands.requestFocus(this._viewTag);
    } else {
      this.commands.requestFocus.call(this);
    }
  };

  loadUrl = (url: string) => {
    if (__IOS__) {
    } else {
      this.commands.loadUrl.call(this, url);
    }
  };

  postMessage = (message: string) => {
    if (__IOS__) {
      this.commands.postMessage(this._viewTag, message);
    } else {
      this.commands.postMessage.call(this, message);
    }
  };

  clearFormData = () => {
    if (__IOS__) {
    } else {
      this.commands.clearFormData.call(this);
    }
  };

  clearCache = (clear: boolean) => {
    if (__IOS__) {
    } else {
      this.commands.clearCache.call(this, clear);
    }
  };

  clearHistory = () => {
    if (__IOS__) {
    } else {
      this.commands.clearHistory.call(this);
    }
  };
}

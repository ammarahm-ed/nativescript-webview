import { NgModule } from '@angular/core';
import { registerElement } from '@nativescript/angular';
import { WebView } from '@ammarahmed/nativescript-webview';

@NgModule()
export class NativeScriptWebViewModule {}

// Uncomment this line if the package provides a custom view component
registerElement('NSWebView', () => WebView);

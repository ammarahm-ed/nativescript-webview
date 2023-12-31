import { Component, NgZone } from '@angular/core';
import { DemoSharedNativescriptWebview } from '@demo/shared';

@Component({
  selector: 'demo-nativescript-webview',
  templateUrl: 'nativescript-webview.component.html',
})
export class NativescriptWebviewComponent {
  demoShared: DemoSharedNativescriptWebview;
  source: any = { uri: 'https://nativescript.org' };
  originWhitelist: string[] = ['*'];

  constructor(private _ngZone: NgZone) {}

  ngOnInit() {
    this.demoShared = new DemoSharedNativescriptWebview();
  }
}

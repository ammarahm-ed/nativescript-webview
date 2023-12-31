import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedNativescriptWebview } from '@demo/shared';
import {} from '@ammarahmed/nativescript-webview';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedNativescriptWebview {}

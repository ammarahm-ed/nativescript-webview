import { DemoSharedBase } from '../utils';

export class DemoSharedNativescriptWebview extends DemoSharedBase {
  // source = {uri: "file:///android_asset/app/assets/test.html"}
  source = { uri: 'app/assets/test.html' };
  origin = ['*'];
}

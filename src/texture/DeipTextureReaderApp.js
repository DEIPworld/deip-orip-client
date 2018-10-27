import { TextureWebApp } from '@deip/substance-texture'

export default class DeipTextureReaderApp extends TextureWebApp {

  constructor(...args) {
    super(...args);
  }

  _afterInit() {
    window.scrollTo(0, 0);
  }  
}
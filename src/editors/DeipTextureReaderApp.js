import { TextureWebApp } from '@deip/substance-texture'
import HttpStorageClient from '@deip/substance-texture/src/dar/HttpStorageClient.js'

export default class DeipTextureReaderApp extends TextureWebApp {

  constructor(...args) {
    super(...args);
  }

  _getStorage() {
    return new HttpStorageClient(this.props.storageUrl, this.props.headers)
  }

  _afterInit() {
    window.scrollTo(0, 0);
  }  
}
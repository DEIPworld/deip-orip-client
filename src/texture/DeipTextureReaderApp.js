import { TextureWebApp } from '@deip/substance-texture'
import { parseKeyEvent } from 'substance'

export default class DeipTextureReaderApp extends TextureWebApp {

  constructor(...args) {
    super(...args);
    this.initPromise = args[1].initPromise;
  }

  _afterInit() {
    const self = this;
    setTimeout(() => { // we have to add this wrapper as '_afterInit' executes before the state is set
      self.initPromise.resolve(self);
    }, 1000)
    window.scrollTo(0, 0);
  }

  _handleKeyDown(event) {
    let key = parseKeyEvent(event)
    // CommandOrControl+S
    if (key === 'META+83' || key === 'CTRL+83') {
      this._save()
      event.preventDefault()
    }
  }
  
}
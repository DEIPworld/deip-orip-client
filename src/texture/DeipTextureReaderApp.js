import { TextureWebApp, TextureReader, ReaderPackage } from '@deip/substance-texture'
import TextureArticleAPI from '@deip/substance-texture/src/article/TextureArticleAPI'
import { parseKeyEvent } from 'substance'

export default class DeipTextureReaderApp extends TextureWebApp {

  constructor(...args) {
    super(...args);
    this.initPromise = args[1].initPromise;
  }

  _afterInit() {
    const self = this;
    setTimeout(() => { // we have to add this wrapper as '_afterInit' executes before the state is set
      const manuscriptSession = self.state.archive.getEditorSession('manuscript');
      const pubMetaDbSession = self.state.archive.getEditorSession('pub-meta');
      const configurator = manuscriptSession.getConfigurator();
      self.api = new TextureArticleAPI(manuscriptSession, pubMetaDbSession, configurator, self.state.archive);
      self.archive = self.state.archive;
      self.initPromise.resolve(self);
    }, 1000)
    window.scrollTo(0, 0);
  }

  _getAppClass() {
    return TextureReader;
  }

  _getArticleConfig() {
    return ReaderPackage;
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
import { TextureWebApp, EditorPackage } from '@deip/substance-texture'
import { parseKeyEvent } from 'substance'
import TextureArticleAPI from '@deip/substance-texture/src/article/TextureArticleAPI'
import HttpStorageClient from '@deip/substance-texture/src/dar/HttpStorageClient.js'

export default class DeipTextureEditorApp extends TextureWebApp {

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
      self.initPromise.resolve(self);
    }, 1000)
    window.scrollTo(0, 0);
  }

  _getStorage() {
    return new HttpStorageClient(this.props.storageUrl, this.props.headers)
  }

  _getArticleConfig() {
    return EditorPackage;
  }

  _handleKeyDown(event) {
    let key = parseKeyEvent(event)
    // CommandOrControl+S
    if (key === 'META+83' || key === 'CTRL+83') {
      this._save()
      event.preventDefault()
    }
  }

  save() {
    return this._save();
  }

}
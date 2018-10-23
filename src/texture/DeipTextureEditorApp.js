import { TextureWebApp, TextureConfigurator, ArticleEditorSession , ArticleAPI, ArticlePackage } from '@deip/substance-texture'
import { parseKeyEvent } from 'substance'
import HttpStorageClient from '@deip/substance-texture/src/dar/HttpStorageClient.js'

export default class DeipTextureEditorApp extends TextureWebApp {

  constructor(...args) {
    super(...args);
    this.initPromise = args[1].initPromise;
  }

  _afterInit() {
    const self = this;
    setTimeout(() => { // temporal solution: we have to add this wrapper as '_afterInit' executes before the state is set
      const archive = self.state.archive;
      const configurator = new TextureConfigurator()
      configurator.import(ArticlePackage)
      const config = configurator.getConfiguration('article').getConfiguration('manuscript')
      const documentSession = archive.getEditorSession('manuscript')
      const contextProvider = {}
      const editorSession = new ArticleEditorSession(documentSession, config, contextProvider)
      self.api = new ArticleAPI(editorSession, config, archive);
      self.initPromise.resolve(self);
    }, 1000)
    window.scrollTo(0, 0);
  }

  _getStorage() {
    return new HttpStorageClient(this.props.storageUrl, this.props.headers)
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
    const self = this;
    const promise = new Promise((resolve, reject) => {
      self._save((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    })
    return promise;
  }

}
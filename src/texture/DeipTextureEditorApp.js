import { TextureWebApp, TextureConfigurator, ArticleEditorSession, ArticleAPI, ArticlePackage } from '@deip/substance-texture'
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
          resolve(self.retrieveDeipEntities());
        }
      });
    })
    return promise;
  }

  retrieveDeipEntities() {
    const refs = this.api.getReferenceManager().getBibliography();
    const webpageRefs = refs.filter(r => r.type === 'webpage-ref');
    const deipRefs = webpageRefs.map(wr => {
      const source = wr.uri || wr.containerTitle;
      try {
        const url = new URL(source);
        if (url.host === process.env.HOST) {
          const segments = url.hash.split('/');
          const researchGroupPermlink = segments[1];
          const researchPermlink = segments[3];
          const researchContentPermlink = segments[4];
          return { researchGroupPermlink, researchPermlink, researchContentPermlink }
        }
      } catch(err){}
        return null;
      }).filter(r => r != null);

      const authors = this.api.getAuthorsModel()['_node'].children;
      const authorsAliases = authors.map(a => a.alias).filter(a => a != null);

      const articleTitle = this.api.getArticleTitle()['_value'];

      return { deipRefs, authorsAliases, articleTitle };
  }
}
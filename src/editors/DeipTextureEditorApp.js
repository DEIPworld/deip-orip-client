import { TextureWebApp } from '@deip/substance-texture'
import { parseKeyEvent } from '@deip/substance-texture/node_modules/substance'
import HttpStorageClient from '@deip/substance-texture/src/dar/HttpStorageClient.js'

export default class DeipTextureEditorApp extends TextureWebApp {

  constructor(...args) {
    super(...args);
  }

  _afterInit() {
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

  api = ((self) => {
    return {

      getArticleTitle: () => {
        const archive = this.state.archive;
        if (!archive) return null;
        const articleSession = archive.getEditorSession('manuscript');
        const articleDocument = articleSession.getDocument();
        const titleNode = articleDocument.get('title')
        if (!titleNode || !titleNode.textContent) return null;
        return titleNode.textContent;
      },
    
      getReferences: () => {
        const archive = this.state.archive;
        if (!archive) return [];
        const articleSession = archive.getEditorSession('manuscript');
        const refs = articleSession.getReferenceManager().getBibliography();
        return refs;
      },
  
      getAuthors: () => {
        const archive = this.state.archive;
        if (!archive) return [];
        const articleSession = archive.getEditorSession('manuscript');
        const articleDocument = articleSession.getDocument();
        const authorsNode = articleDocument.get("authors");
        if (!authorsNode || !authorsNode.children) return [];
        return authorsNode.children;
      },

      getDeipReferences: () => {
        const refs = this.api.getReferences();
        const webpageRefs = refs.filter(r => r.type === 'webpage-ref');
        const deipRefs = webpageRefs
          .map(wr => {
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
            })
          .filter(r => r != null);
          return deipRefs;
      },

      addAuthor: (alias, surname, givenNames) => {
        if (!this.refs.texture) return;
        const collectionId = "authors";
        const person = { type: "person", alias, surname, givenNames };
        const editorSession = this.refs.texture.refs.resource.refs.content.editorSession;
        editorSession.transaction(tx => {
          const bio = tx.create({type: 'bio'}).append(
            tx.create({type: 'p'})
          )
          person.bio = bio.id
          const node = tx.create(person)
          tx.get(collectionId).appendChild(node)
        })
        // refresh view
        this.refs.texture.refs.resource.send('updateViewName', 'manuscript')
      },

      removeAuthor: (person) => {
        if (!this.refs.texture) return;
        const collectionId = "authors";
        const editorSession = this.refs.texture.refs.resource.refs.content.editorSession;
        editorSession.transaction(tx => {
          tx.get(collectionId).removeChild(tx.get(person.id))
          tx.delete(person.id)
        })
        // refresh view
        this.refs.texture.refs.resource.send('updateViewName', 'manuscript')
      }
    }
  })(this);


}
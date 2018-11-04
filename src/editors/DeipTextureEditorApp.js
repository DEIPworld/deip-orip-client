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
      },

      addReference: (uri, title, containerTitle) => {
        if (!this.refs.texture) return;
        const collectionId = "references";
        const ref = { type: "webpage-ref", uri, title, containerTitle };
        const editorSession = this.refs.texture.refs.resource.refs.content.editorSession;
        editorSession.transaction(tx => {
          let node = tx.create(ref)
          tx.get(collectionId).appendChild(node);
        })
        // refresh view
        this.refs.texture.refs.resource.send('updateViewName', 'manuscript')
      },

      removeReference: (reference) => {
        if (!this.refs.texture) return;
        const collectionId = "references";
        const editorSession = this.refs.texture.refs.resource.refs.content.editorSession;
        editorSession.transaction(tx => {
          tx.get(collectionId).removeChild(tx.get(reference.id))
          tx.delete(reference.id)
        })
        // refresh view
        this.refs.texture.refs.resource.send('updateViewName', 'manuscript')
      }
    }
  })(this);


}
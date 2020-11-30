import { TextureWebApp } from '@deip/substance-texture';
import { parseKeyEvent, documentHelpers, DefaultDOMElement } from '@deip/substance-texture/node_modules/substance';
import HttpStorageClient from '@deip/substance-texture/src/dar/HttpStorageClient.js';

export default class DeipTextureEditorApp extends TextureWebApp {
  constructor(...args) {
    super(...args);
  }

  _afterInit() {
    window.scrollTo(0, 0);
  }

  _getStorage() {
    return new HttpStorageClient(this.props.storageUrl, this.props.headers);
  }

  _handleKeyDown(event) {
    const key = parseKeyEvent(event);
    // CommandOrControl+S
    if (key === 'META+83' || key === 'CTRL+83') {
      this._save();
      event.preventDefault();
    }
  }

  save() {
    return new Promise((resolve, reject) => {
      this._save((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  api = ((self) => ({

    getArticleTitle: () => {
      const { archive } = this.state;
      if (!archive) return null;
      const internalArticleDocument = archive.getDocument('manuscript');
      const rootNode = internalArticleDocument.getRootNode();
      const { title } = rootNode;
      return title;
    },

    getContentHtml: (key = 'body') => {
      const { archive } = this.state;
      if (!archive) return null;
      return this.el.el.querySelector(`[data-id="${key}.content"]`).innerHTML;
    },

    getAuthors: () => {
      const { archive } = this.state;
      if (!archive) return null;
      const internalArticleDocument = archive.getDocument('manuscript');
      const metadata = internalArticleDocument.get('metadata');
      const authors = metadata.authors.map((a) => internalArticleDocument.get(a));
      return authors;
    },

    addAuthor: (alias, surname, givenNames) => {
      const textureRef = this.refs.texture;
      if (!textureRef) return;
      const { editorSession } = textureRef.refs.resource;
      const collectionPath = ['metadata', 'authors'];
      const person = {
        type: 'person', alias, surname, givenNames
      };
      editorSession.transaction((tx) => {
        const node = tx.create(person);
        documentHelpers.append(tx, collectionPath, node.id);
      });
    },

    removeAuthor: (person) => {
      const textureRef = this.refs.texture;
      if (!textureRef) return;
      const { editorSession } = textureRef.refs.resource;
      const collectionPath = ['metadata', 'authors'];
      editorSession.transaction((tx) => {
        documentHelpers.removeFromCollection(tx, collectionPath, person.id);
        documentHelpers.deepDeleteNode(tx, person.id);
      });
    },

    getReferences: () => {
      const { archive } = this.state;
      if (!archive) return null;
      const internalArticleDocument = archive.getDocument('manuscript');
      const rootNode = internalArticleDocument.getRootNode();
      const references = rootNode.references.map((a) => internalArticleDocument.get(a));
      return references;
    },

    addReference: (uri, title, containerTitle) => {
      const textureRef = this.refs.texture;
      if (!textureRef) return;
      const { editorSession } = textureRef.refs.resource;
      const collectionPath = ['article', 'references'];
      const ref = {
        type: 'webpage-ref', uri, title, containerTitle
      };
      editorSession.transaction((tx) => {
        const node = tx.create(ref);
        documentHelpers.append(tx, collectionPath, node.id);
      });
    },

    removeReference: (reference) => {
      const textureRef = this.refs.texture;
      if (!textureRef) return;
      const { editorSession } = textureRef.refs.resource;
      const collectionPath = ['article', 'references'];
      editorSession.transaction((tx) => {
        documentHelpers.removeFromCollection(tx, collectionPath, reference.id);
        documentHelpers.deepDeleteNode(tx, reference.id);
      });
    }
  }))(this);
}

  import { Texture, JATSImportDialog, TextureWebApp, TextureArchive, vfsSaveHook, EditorPackage } from 'substance-texture'
  
  // export default class DevWebApp extends TextureWebApp {

  //   // render ($$) {
  //   //   let el = $$('#my-test').addClass('sc-app')
  //   //   let { archive, error } = this.state
  //   //   if (archive) {
  //   //     const Texture = this._getAppClass()
  //   //     el.append(
  //   //       $$(Texture, { archive })
  //   //     )
  //   //   } else if (error) {
  //   //     if (error.type === 'jats-import-error') {
  //   //       el.append(
  //   //         $$(JATSImportDialog, { errors: error.detail })
  //   //       )
  //   //     } else {
  //   //       el.append('ERROR:', error.message)
  //   //     }
  //   //   } else {
  //   //     // LOADING...
  //   //   }
  //   //   return el
  //   // }

  //   _getStorage(storageType) {
  //     debugger
  //     let storage = super._getStorage(storageType)
  //     if (storageType === 'vfs') {
  //       vfsSaveHook(storage, TextureArchive)
  //     }
  //     return storage
  //   }
  
  //   _getArticleConfig() {
  //     return EditorPackage
  //   }

  // }

  class DevWebApp extends TextureWebApp {

    _getStorage(storageType) {
      debugger
      let storage = super._getStorage(storageType)
      if (storageType === 'vfs') {
        vfsSaveHook(storage, TextureArchive)
      }
      return storage
    }
  
    _getArticleConfig() {
      return EditorPackage
    }
  }

  export default new DevWebApp();

  
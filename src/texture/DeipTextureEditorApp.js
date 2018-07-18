import { TextureWebApp } from 'substance-texture'
import { parseKeyEvent } from 'substance'

export default class DeipTextureEditorApp extends TextureWebApp {

  _handleKeyDown(event) {
    debugger
    let key = parseKeyEvent(event)
    // CommandOrControl+S
    debugger
    if (key === 'META+83' || key === 'CTRL+83') {
      debugger
      this._save()
      event.preventDefault()
    }
  }

}
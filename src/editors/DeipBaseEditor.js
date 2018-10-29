
import { ProseEditor, ProseEditorConfigurator, 
    EditorSession, ProseEditorPackage, ImagePackage, PersistencePackage, HTMLImporter, HTMLExporter } from 'substance'
import Mock from './Mock'
import BodyPackage from './components/body/BodyPackage'

export default class DeipBaseEditor {

    constructor(containerEl) {
        const cfg = new ProseEditorConfigurator()
        cfg.import(ProseEditorPackage)
        cfg.import(ImagePackage)
        cfg.import(PersistencePackage)
        // Custom packages
        cfg.import(BodyPackage)

        cfg.setSaveHandlerClass(SaveHandler)
        cfg.addImporter('html', BaseHTMLImporter)
        cfg.addExporter('html', BaseHTMLExporter)

        let importer = cfg.createImporter('html')
        let doc = importer.importDocument(Mock)

        const editorSession = new EditorSession(doc, {
            configurator: cfg
        })
        ProseEditor.mount({
            editorSession: editorSession
        }, containerEl)
    }
}

class SaveHandler {
    /*
        Saving a document involves two steps.
        - syncing files (e.g. images) with a backend
        - storing a snapshot of the document's content (e.g. a XML serialization)
    */
    saveDocument(params) {
        console.info('Simulating save ...', params)
        return params.fileManager.sync()
             .then(() => {
                const { editorSession } = params;
                const { configurator, document } = editorSession;
                const exporter = configurator.createExporter('html')
                return exporter.exportDocument(document);
            }).then(html => {
                // Here you would run a converter (HTML/XML) usually
                // and send the result to a REST endpoint.
                console.info(html)
            });
    }
}


class BaseHTMLImporter extends HTMLImporter {
    convertDocument(htmlEl) {
      var bodyEl = htmlEl.find('body')
      this.convertElement(bodyEl)
    }
}

class BaseHTMLExporter extends HTMLExporter {
    convertDocument(doc, htmlEl) {
        const body = doc.get('body');
        const htmlPromise = this.convertNode(body);
        return htmlPromise;
      }
}
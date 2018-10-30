
import { ProseEditor, ProseEditorConfigurator, 
    EditorSession, ProseEditorPackage, ImagePackage, PersistencePackage, HTMLImporter, HTMLExporter } from 'substance'
import ReviewStarterFixture from './ReviewStarterFixture'
import BodyPackage from './components/body/BodyPackage'

export default class DeipBaseEditor {

    constructor(containerEl) {
        const cfg = new ProseEditorConfigurator()
        cfg.import(ProseEditorPackage)
        cfg.import(ImagePackage)
        // cfg.import(PersistencePackage)
        // Custom packages
        cfg.import(BodyPackage)

        cfg.setSaveHandlerClass(SaveHandler)
        cfg.addImporter('html', BaseHTMLImporter)
        cfg.addExporter('html', BaseHTMLExporter)

        const importer = cfg.createImporter('html')
        const doc = importer.importDocument(ReviewStarterFixture)
        this.doc = doc;

        const editorSession = new EditorSession(doc, {
            configurator: cfg
        })
        this.editorSession = editorSession;

        ProseEditor.mount({
            editorSession: editorSession
        }, containerEl)
    }

    save() {
        const saveParams = {
            editorSession: this.editorSession,
            fileManager: this.editorSession.fileManager
        };
        return this.editorSession.saveHandler.saveDocument(saveParams)
            .then((html) => {
                return html;
            })
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
                return html;
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
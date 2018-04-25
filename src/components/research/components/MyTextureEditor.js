const substanceTexture = texture;

export default class MyTextureEditor extends substance.Component {
    didMount() {
        this._init();
        substance.DefaultDOMElement.getBrowserWindow().on('keydown', this._keyDown, this);
    }

    dispose() {
        substance.DefaultDOMElement.getBrowserWindow().off(this);
    }

    getInitialState() {
        return {
            archive: undefined,
            error: undefined
        }
    }

    render($$) {
        let el = $$('div').addClass('sc-app');
        let archive = this.state.archive;
        let err = this.state.error;

        if (archive) {
            el.append(
                $$(substanceTexture.Texture, {archive})
            );
        } else if (err) {
            if (err.type === 'jats-import-error') {
                el.append(
                    $$(substanceTexture.JATSImportDialog, { errors: err.detail })
                );
            } else {
                el.append(
                    'ERROR:',
                    err.message
                );
            }
        } else {
            // LOADING...
        }
        return el
    }

    _init() {
        // let archiveId = substance.getQueryStringParam('archive') || 'kitchen-sink';
        let archiveId = substance.getQueryStringParam('archive') || 'elife-32671';
        let storageType = substance.getQueryStringParam('storage') || 'vfs';
        let storageUrl = substance.getQueryStringParam('storageUrl') || '/archives';
        let storage;

        if (storageType==='vfs') {
            storage = new substance.VfsStorageClient(window.vfs, './data/');
        } else {
            storage = new substance.HttpStorageClient(storageUrl);
        }

        console.log(substanceTexture);
        console.log(substanceTexture.TextureArchive);

        let buffer = new substance.InMemoryDarBuffer();
        let archive = new substanceTexture.TextureArchive(storage, buffer);

        let promise = archive.load(archiveId)
            .then(() => {
                setTimeout(() => {
                    this.setState({archive});
                }, 0);
            });

        if (!substance.platform.devtools) {
            promise.catch(error => {
                console.error(error);
                this.setState({error});
            });
        }
    }

    /*
        We may want an explicit save button, that can be configured on app level,
        but passed down to editor toolbars.
    */
    _save() {
        this.state.archive.save().then(() => {
            console.log(this);
            console.info('successfully saved');
        }).catch(err => {
            console.error(err);
        });
    }

    _keyDown(event) {
        if ( event.key === 'Dead' ) return
        // Handle custom keyboard shortcuts globally
        let archive = this.state.archive;
        if (archive) {
            let manuscriptSession = archive.getEditorSession('manuscript');
            let handled = manuscriptSession.keyboardManager.onKeydown(event);

            if (!handled) {
                let key = substance.parseKeyEvent(event);
                // CommandOrControl+S
                if (key === 'META+83' || key === 'CTRL+83') {
                    this._save();
                    event.preventDefault();
                }
            }
        }
    }
}
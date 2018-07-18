<template>

    <div ref='deip-texture-container' class="deip-texture-container">
      <!--  <div id="my-test" class="sc-app"></div> -->
    </div>

</template>

<script>    

    import axios from 'axios'
    import deipRpc from '@deip/deip-rpc';
    import DeipTextureEditorApp from './../texture/DeipTextureEditorApp'
    import {getQueryStringParam, substanceGlobals, platform } from 'substance'
    import { Texture, JATSImportDialog, TextureWebApp, TextureArchive, vfsSaveHook, 
        EditorPackage, TextureArticleAPI, ReferenceManager, TextureReader, ReaderPackage } 
        from 'substance-texture'

    
    let editor;

    export default {
        name: "AdminPage",
        data () {
            return {}
        },
        methods: {

        },
        computed: {

        },
        mounted () {
            
        console.log(this.$refs['deip-texture-container'])
        // window.addEventListener('load', () => {
    debugger
    substanceGlobals.DEBUG_RENDERING = platform.devtools


debugger

editor = DeipTextureEditorApp.mount({
    //   archiveId: getQueryStringParam('archive') || 'kitchen-sink',
    //   storageType: getQueryStringParam('storage') || 'vfs',
    //   storageUrl: getQueryStringParam('storageUrl') || '/archives'

    //   archiveId: 'default',
      archiveId: 'elife-32671',
      storageType: 'fs',
      storageUrl: 'http://localhost:8282/dar'
      // storageUrl: 'http://localhost:5000'

    }, this.$refs['deip-texture-container'] /* window.document.body */)

    debugger

  
      setTimeout(() => {
         debugger

            const editorSession = editor.state.archive.getEditorSession('manuscript')
            const pubMetaDbSession = editor.state.archive.getEditorSession('pub-meta')
            const configurator = editorSession.getConfigurator()

            const referenceManager = new ReferenceManager({
                labelGenerator: configurator.getLabelGenerator('references'),
                editorSession,
                pubMetaDbSession
            })

            const bibliography = referenceManager.getBibliography()
            const references = referenceManager.getReferenceIds()

            console.log(references);
            console.log(bibliography);

            debugger;
        }, 5000)
      }
    };

</script>


<style>

      @import 'substance-texture/dist/texture.css';
      @import 'substance-texture/dist/texture-reset.css';
      @import 'substance-texture/dist/texture-pagestyle.css';
      @import 'substance-texture/dist/katex/katex.min.css';
      @import 'substance-texture/dist/font-awesome/css/font-awesome.min.css';
      @import 'substance/dist/substance.css';

      .deip-texture-container {
        height: 1500px;
      }
      .sc-app {
        height: 100%;
      }

</style>
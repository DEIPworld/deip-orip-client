<template>

    <div ref='deip-texture-container' style="height: 100%;">
      <!--  <div id="my-test" class="sc-app"></div> -->
        <div></div>
    </div>

</template>

<script>    

    import axios from 'axios'
    import deipRpc from '@deip/deip-rpc';
    import DevWebApp  from './../texture/DevWebApp'
    import {getQueryStringParam, substanceGlobals, platform } from 'substance'

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
    let app = DevWebApp.mount({
      archiveId: getQueryStringParam('archive') || 'kitchen-sink',
      storageType: getQueryStringParam('storage') || 'vfs',
      storageUrl: getQueryStringParam('storageUrl') || '/archives'
    },  this.$refs['deip-texture-container'] /* window.document.body */)
  
    // put the archive and some more things into global scope, for debugging
    // setTimeout(() => {
    //   window.app = app
    // }, 500)
//   })
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

      .sc-app {
        height: 100%;
      }

</style>
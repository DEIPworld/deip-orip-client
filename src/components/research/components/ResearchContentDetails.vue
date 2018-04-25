<template>
    <v-container fluid fill-height class="pa-0" style="text-align: center;">
       <div v-if="false && content && content.content">{{content.content}}"</div>

       <div v-if="true" class="full-height full-width">
           <div id="substance-texture" class="full-height"></div>
       </div>
    </v-container>   
</template>

<script>
    import MyTextureEditor from './MyTextureEditor';

    export default {
        name: "ResearchContentDetails",
        data() { 
            return {
                content: {}
            } 
        },

        methods: {
            getContnet() {
                deipRpc.api.getResearchContentByIdAsync(this.$route.params.content_id)
                    .then((data) => {
                        this.content = data;
                })
            }
        },
        created() {
        },
        mounted(){
            this.getContnet();

            // window.addEventListener('load', () => {
                substance.substanceGlobals.DEBUG_RENDERING = substance.platform.devtools;
                let textureEditor = MyTextureEditor.mount(
                    {},
                    document.getElementById('substance-texture')
                );

                console.log('textureEditor', textureEditor);
            // });            
        }
    };
</script>

<style lang="less">
    .sc-app {
        height: 100%;
      }
</style>

<template>
    <div>
        <div>
            <v-btn color="success">Success</v-btn>
            <v-btn color="primary" dark>Accept
                <v-icon dark right>close</v-icon>
            </v-btn>

            <div id="texture_editor" v-bind:class="{ 'read-only': isReadOnly }" style="height: 550px; width: 100%; border-bottom: 1px solid #E0E4E4;"></div>
            <!-- <div id="texture_editor"></div> -->
        </div>
    </div>
</template>

<script>
    // import * as fromTexture from 'substance-texture/dist/texture.js';
    // import * as fromSubstance from 'substance/dist/substance.js';
    // import * as vfs from './vfs.js';

    // import * as fromSubstance from 'E:/deip/texture/texture/dist/substance/dist/substance.js';
    // import * as fromTexture from 'E:/deip/texture/texture/dist/texture.js';
    // import MyTextureEditor from './MyTextureEditor.js';

    export default {
        name: "ResearchItemLayout",
        data() {
            return {
                isReadOnly: false
            };
        },
        methods: {},
        mounted() {
        }
    };
</script>

<style lang="less" scoped>
</style>

<template>
    <div>
    <div class="row p-6 bg-gray">
        <div class="col-9 col-offset-3">

            <!-- research item layout -->
            <div>
                <div class="body row">

                    <div class="row col-6">
                        <div class="row-nowrap p-5 m-auto">
                            <img class="research-avatar" src="../assets/nuclearman.jpg" >
                        </div>
                        <div class="col">
                            <div class="title pt-4">
                                Nuclear power is the use of nuclear reactions
                            </div>
                            <div class="pv-4">
                                This article is about nuclear fission and fusion power sources primarily. 
                                For commercial quantities of heat derived from naturally occurring nuclear decay.
                            </div>
                            <div class="row pb-2">
                                <div class="dark-gray">Stage: Milestone 4</div>
                                <div class="col ph-4 row-nowrap">
                                    <div class="stage-indicator mv-auto">
                                        <div style="width: 80%;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row col-6">
                        <div class="col">
                            <div class="pt-4 mh-auto researchers">
                                <div class="pl-2">Researchers</div>
                                <div class="pos-relative height-3 pt-4">
                                    <img class="user-avatar pos-absolute" style="left: 0rem;" src="../assets/nuclearman.jpg" >
                                    <img class="user-avatar pos-absolute" style="left: 2rem;" src="../assets/brain.jpg" >
                                    <img class="user-avatar pos-absolute" style="left: 4rem;" src="../assets/charmander.jpg" >
                                    <img class="user-avatar pos-absolute" style="left: 6rem;" src="../assets/joker.jpg" >
                                    <img class="user-avatar pos-absolute" style="left: 8rem;" src="../assets/nuclearman.jpg" >
                                    <div class="more-users pos-absolute row-nowrap" style="left: 10rem;">
                                        <span class="m-auto">+41</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="column pt-8 ph-5">
                            <!-- "btns" should be remade -->
                            <div class="btn ph-5 pv-2 text-align-center mh-auto">View Details</div>
                            <div class="pv-4 mh-auto" style="color: #1155dd;">Add to Bookmarks</div>
                        </div>
                    </div>

                </div>

                <div class="footer row align-items-center justify-between p-2">
                    <div class="row-nowrap pl-3">
                        <span class="sphere-badge mr-2" style="background-color: #3333dd;">Computer-science</span>
                        <span class="sphere-badge mr-2" style="background-color: #ff9933;">Psyhology</span>
                    </div>
                    <div>
                        <span class="dark-gray"> <b>㋡</b> 71</span>
                        <span class="dark-gray ph-5">Last Update: 01/28/2018</span>
                    </div>
                </div>

            </div>

        </div>
        <div class="col-12">
            
        </div>
    </div>

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
            // "substance-texture": "^1.0.0-alpha.3"

            let substance = fromSubstance;
            let substanceTexture = fromTexture;

            /*
            window.addEventListener('load', () => {
                window.textureApp = substanceTexture.Texture.mount({
                        documentId: 'kitchen-sink/manuscript2.xml',
                        readXML: function(documentId, cb) {
                            console.log('vfs', window.vfs);
                            let xmlStr = window.vfs.readFileSync(documentId);
                            cb(null, xmlStr);
                            // fetch an XML string to be read by the editor
                        },
                        writeXML: function(documentId, xml, cb) {
                            // write the XML string to a store
                            console.log('writeXML needs to be implemented for saving.')
                            console.log('XML', xml)
                            cb(null)
                        }
                    }, 
                    document.getElementById('texture_editor')
                );
            });
            //*/

            

            // (function (global, factory) {
            //     factory(substance, substanceTexture);
            // }(window, (function (substance,substanceTexture) { 'use strict';

                /*
                window.addEventListener('load', () => {
                    substance.substanceGlobals.DEBUG_RENDERING = substance.platform.devtools;
                    MyTextureEditor.mount({}, document.getElementById('texture_editor'));
                });
                */

            // })));
            //# sourceMappingURL=./editor.js.map




        }
    };
</script>

<style lang="less"> // make scoped

    .sc-app {
        height: 100%;
    }

    .bg-gray {
        background-color: #bbbbbb;
    }

    .body {
        border-top-left-radius: .5rem;
        border-top-right-radius: .5rem;
        background-color: #ffffff;

        .research-avatar {
            width: 5rem;
            height: 5rem;
            border-radius: 50%;
        }
        .researchers {
            width: 15rem;
        }
        .title {
            font-size: 1.2rem;
        }
        .user-avatar {
            border-radius: 50%;
            height: 3rem;
            width: 3rem;
        }
        .more-users {
            .user-avatar();
            background-color: #1155dd;
            color: #ffffff;

            span {
                transform: translateX(-0.1rem);
            }
        }
    }
    .footer {
        border-bottom-left-radius: .5rem;
        border-bottom-right-radius: .5rem;
        background-color: #eeeeee;
    }
    .sphere-badge {
        font-size: .75rem;
        border-radius: 2rem;
        color: #ffffff;
        padding: .2rem .6rem;
    }
    .dark-gray {
        color: #777777;
    }
    .stage-indicator {
        background-color: #dddddd;
        height: .25rem;
        width: 100%;
        border-radius: .25rem;

        div {
            background-color: #42b983;
            border-radius: .2rem;
            height: 100%;
        }
    }

    .btn {
        background-color: #1155dd;
        border-radius: .25rem;
        color: #ffffff;
    }
</style>
